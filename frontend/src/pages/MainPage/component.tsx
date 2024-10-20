import clsx from "clsx";
import { useCoinsContext } from "config/context";
import { BITContract, NFTContract } from "config/contracts";
import { SyncIcon } from "core";
import { formatEther, parseEther } from "viem";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import { NFTCard, VerticalNavigationTemplate } from "components";

import blod_id_info from "../../assets/info_blob_id.json";

const default_avatar =
  "https://pwco.com.sg/wp-content/uploads/2020/05/Generic-Profile-Placeholder-v3.png";

const BRONZE_THRESHOLD = 50;
const SILVER_THRESHOLD = 300;
const GOLD_THRESHOLD = 500;

const baseAggregatorUrl = "https://aggregator.walrus-testnet.walrus.space";

export const MainPage = () => {
  const { address: account } = useAccount();
  const {
    // data: BITContractTxResult,
    status: BITContractTxStatus,
    writeContract: writeContractBITToken,
  } = useWriteContract();
  const {
    // data: BITContractTxResult,
    error: BrainNFTContractError,
    status: BrainNFTContractTxStatus,
    writeContract: writeContractBrainNFT,
  } = useWriteContract();
  const { coins, setCoins } = useCoinsContext();
  const [synced, setSynced] = useState(0);

  const [bronzeNFT, setBronzeNFT] = useState([]);
  const [silverNFT, setSilverNFT] = useState([]);
  const [goldNFT, setGoldNFT] = useState([]);

  useEffect(() => {
    const blobUrl = `${baseAggregatorUrl}/v1/${blod_id_info["blob_id"]}`;

    fetch(blobUrl, {
      method: "GET",
    })
      .then((res) => {
        res.json().then((data) => {
          console.log(data);
          setBronzeNFT(data.bronzeNFT);
          setSilverNFT(data.silverNFT);
          setGoldNFT(data.goldNFT);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const claimCoins = useCallback(async () => {
    writeContractBITToken({
      ...BITContract,
      functionName: "claimTokens",
      args: [parseEther(coins.toString())],
    } as any);
  }, [coins, writeContractBITToken]);

  const claimCard = useCallback(
    async (nftIndex: number) => {
      writeContractBrainNFT({
        ...NFTContract,
        functionName: "claimNFT",
        args: [nftIndex],
        sender: "",
      } as any);
    },
    [writeContractBrainNFT]
  );

  const { data: ownershipData, refetch: refetchOwnershipData } =
    useReadContract({
      ...NFTContract,
      functionName: "getOwnershipCount",
      args: [account],
    } as any);

  const ownershipCount = useMemo(() => {
    return ownershipData?.map((o) => Number(String(o).substring(0, 1))) ?? [];
  }, [ownershipData]);

  const {
    data: balanceData,
    isSuccess: isBalanceReadSuccess,
    isFetching,
    refetch: refetchBalance,
  } = useReadContract({
    ...BITContract,
    functionName: "balanceOf",
    args: [account],
  } as any);

  useEffect(() => {
    if (BITContractTxStatus === "success") {
      setCoins(0);
      localStorage.setItem("coins", "0");
      refetchBalance();
    }
  }, [refetchBalance, setCoins, BITContractTxStatus]);

  useEffect(() => {
    if (isBalanceReadSuccess && !isFetching) {
      setSynced(Number(formatEther(balanceData as bigint)));
    }
  }, [balanceData, isBalanceReadSuccess, isFetching, setCoins]);

  useEffect(() => {
    if (BITContractTxStatus === "pending") {
      toast("Mining your transaction..");
    } else if (BITContractTxStatus === "success") {
      toast.success("Successfully synced your tokens");

      setCoins(0);
      localStorage.setItem("coins", "0");
    } else if (BITContractTxStatus === "error") {
      toast.error("Failed to sync tokens. Something went wrong.");
    }
  }, [setCoins, setSynced, BITContractTxStatus]);

  useEffect(() => {
    if (BrainNFTContractTxStatus === "pending") {
      toast("Mining your transaction..");
    } else if (BrainNFTContractTxStatus === "success") {
      toast.success("Successfully minted NFT for you");

      refetchOwnershipData();
    } else if (BrainNFTContractTxStatus === "error") {
      toast.error("Failed to mint NFT");
    }
  }, [refetchOwnershipData, setSynced, BrainNFTContractTxStatus]);

  return (
    <VerticalNavigationTemplate>
      <div className="py-4 mx-auto mt-4 ml-4">
        <div>
          <div className="flex items-center mb-5">
            <img alt="icon" src="/reward.svg" />
            <div className="ml-4">
              <p className="text-3xl font-bold text-white">Rewards</p>
              <p className="text-lg text-white opacity-80">
                Play games and claim exclusive NFTs!
              </p>
            </div>
          </div>
          <div className="flex animate-smooth-appear">
            <div className="px-4 py-3 bg-gray-750 rounded-2xl">
              <p className="text-sm text-gray-300 bg-gray-750">
                Synced on-chain
              </p>
              <div className="flex items-center">
                <p className="mr-2 text-xl font-bold text-white">{synced}</p>
                <div
                  className="hidden w-4 h-4 rounded-full"
                  style={{
                    backgroundImage: "url(" + default_avatar + ")",
                    backgroundSize: "cover",
                  }}
                />
              </div>
            </div>
            <div className="ml-4">
              <div className="flex items-center px-4 py-3 bg-gray-750 rounded-2xl">
                <div>
                  <p className="text-sm text-gray-300">Pending</p>
                  <div className="flex items-center">
                    <p className="mr-2 text-xl font-bold text-white">{coins}</p>
                    <div
                      className="hidden w-4 h-4 rounded-full"
                      style={{
                        backgroundImage: "url(" + default_avatar + ")",
                        backgroundSize: "cover",
                      }}
                    />
                  </div>
                </div>
                <button
                  className={clsx(
                    "px-3 py-2 mt-2 ml-5 font-bold text-white bg-purple-950 ring-purple-920 rounded focus:outline-none transition-all",
                    coins === 0 && "cursor-not-allowed ring-0 opacity-50",
                    coins > 0 && "hover:ring-2"
                  )}
                  onClick={claimCoins}
                  disabled={coins === 0}
                >
                  <SyncIcon className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          </div>

          <div className="animate-smooth-appear">
            <p className="inline-block px-4 py-2 mt-8 text-xl text-white rounded-md bg-gray-750">
              Regular
            </p>
            <div className="mt-4 grid grid-cols-12 gap-4">
              {bronzeNFT.map((n, i) => (
                <div key={n.image} className="col-span-6">
                  <NFTCard
                    imageUrl={n.image}
                    name={n.name}
                    desc={n.requiredScore}
                    contentLeft={n.gen}
                    contentRight={n.supply}
                    contentMain={n.description}
                    handleClick={() => claimCard(i + 1)}
                    insufficient={synced < BRONZE_THRESHOLD}
                    owned={!!ownershipCount?.[i + 1]}
                    baseAggregatorUrl={baseAggregatorUrl}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="animate-smooth-appear">
            {/* <p className="mt-8 text-2xl font-bold text-gray-300">Silver NFTs</p> */}
            <p className="inline-block px-4 py-2 mt-8 text-xl text-white rounded-md bg-gray-750 silver">
              Silver
            </p>
            <div className="mt-4 grid grid-cols-12 gap-x-4 gap-y-8 animate-smooth-appear">
              {silverNFT.map((n, i) => (
                <div key={n.image} className="col-span-6">
                  <NFTCard
                    imageUrl={n.image}
                    name={n.name}
                    desc={n.requiredScore}
                    contentLeft={n.gen}
                    contentRight={n.supply}
                    contentMain={n.description}
                    handleClick={() => claimCard(i + 3)}
                    insufficient={synced < SILVER_THRESHOLD}
                    owned={!!ownershipCount[i + 3]}
                    baseAggregatorUrl={baseAggregatorUrl}
                  />
                </div>
              ))}
            </div>
          </div>

          <p className="inline-block px-4 py-2 mt-8 text-xl text-white rounded-md bg-gray-750 gold">
            Gold
          </p>
          <div className="mt-4 grid grid-cols-12 gap-4 animate-smooth-appear">
            {goldNFT.map((n, i) => (
              <div key={n.image} className="col-span-6">
                <NFTCard
                  imageUrl={n.image}
                  name={n.name}
                  desc={n.requiredScore}
                  contentLeft={n.gen}
                  contentRight={n.supply}
                  contentMain={n.description}
                  handleClick={() => claimCard(i + 8)}
                  insufficient={synced < GOLD_THRESHOLD}
                  owned={!!ownershipCount[i + 8]}
                  baseAggregatorUrl={baseAggregatorUrl}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </VerticalNavigationTemplate>
  );
};
