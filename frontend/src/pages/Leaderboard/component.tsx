import clsx from "clsx";
import { BITContract } from "config/contracts";
import { formatEther } from "ethers";
import React, { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";

import { VerticalNavigationTemplate } from "components";

const leaderboard = [
  {
    id: 1,
    name: "zara.eth",
    address: "0x314234234234234",
    score: 134000,
  },
  {
    id: 2,
    name: "vitalik.eth",
    address: "0x314234234234234",
    score: 32344,
  },
  {
    id: 3,
    name: "sassal.eth",
    address: "0x314234234234234",
    score: 13443,
  },
  {
    id: 4,
    name: "saketkmr.eth",
    address: "0x314234234234234",
    score: 1443,
  },
  {
    id: 5,
    name: "sebaudet.eth",
    address: "0x314234234234234",
    score: 1324,
  },
];

const users = [
  {
    name: "alibek.eth",
    avatar: "/av1.png",
  },
  {
    name: "rauan.eth",
    avatar: "/av2.png",
  },
  {
    name: "ulan.eth",
    avatar: "/av3.png",
  },
  {
    name: "sanzhar.eth",
    avatar: "/av4.png",
  },
  {
    name: "temirzhan.eth",
    avatar: "/av5.png",
  },
  {
    name: "akezhan.eth",
    avatar: "/av6.png",
  },
  {
    name: "khafiz.eth",
    avatar: "/av7.png",
  },
  {
    name: "daulet.eth",
    avatar: "/av8.png",
  },
  {
    name: "khafiz.eth",
    avatar: "/av7.png",
  },
  {
    name: "daulet.eth",
    avatar: "/av8.png",
  },
];

const UserRow: React.FC<any> = ({
  name,
  address,
  score,
  avatar,
  className,
  index,
}: any) => {
  const { address: account } = useAccount();

  const default_avatar =
    "https://pwco.com.sg/wp-content/uploads/2020/05/Generic-Profile-Placeholder-v3.png";

  return (
    <div className={clsx(["flex py-3 mx-2 justify-between mb-2", className])}>
      <div className="flex flex-col items-start justify-center">
        <div className="flex items-center">
          <div>
            <p className="flex flex-col w-6 text-white truncate align-middle text-md font-regular">
              {index}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center ml-5 col-span-2">
            <div
              className="w-10 h-10 bg-gray-300 rounded-full"
              style={{
                backgroundImage:
                  "url(" + (avatar ? avatar : default_avatar) + ")",
                backgroundSize: "cover",
              }}
            />
          </div>
          <div className="ml-6 w-36">
            <p className="flex flex-col hidden text-xl text-white truncate align-middle font-regular">
              {name}
            </p>
            <a
              className="flex flex-col text-gray-400 truncate align-middle text-md font-regular min-w-[200px]"
              href={`${import.meta.env.VITE_ETHERSCAN}/${address}`}
              target="_blank"
              rel="noreferrer"
            >
              {address.substr(0, 10).concat("...")}
              {address === account ? " (you)" : ""}
            </a>
          </div>
          <p
            style={{ borderColor: "#784FFE", color: "#E7DFFF" }}
            className="flex items-center justify-center w-32 h-6 py-1 py-4 ml-24 text-xs font-bold border-2 rounded-md"
          >
            {score}
          </p>
        </div>
      </div>
    </div>
  );
};

export const LeaderboardPage = () => {
  const [participants, setParticipants] = useState<any>([]);
  const {
    data: usersData,
    error,
    isPending,
  } = useReadContract({
    ...BITContract,
    functionName: "getUsers",
  });

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const sortData =
        usersData?.map((x) => ({
          addr: x.addr,
          balance: parseInt(formatEther(x.balance), 10),
        })) ?? [];
      sortData.sort((x, y) => y.balance - x.balance);

      setParticipants(
        sortData.slice(0, 10).map((x) => ({
          address: x.addr,
          score: x.balance,
        }))
      );
    };
    fetchLeaderboard();
  }, [usersData]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{String(error)}</div>;
  }

  return (
    <VerticalNavigationTemplate>
      <div className="mt-8 ml-4">
        {leaderboard && (
          <div>
            <div className="flex items-center mb-10">
              <img alt="icon" src="/cup.svg" />

              <div className="ml-4">
                <p className="text-3xl font-bold text-white">Leaderboard</p>
                <p className="text-lg text-white opacity-80">
                  TOP 10 participants sorted by on-chain BIT tokens
                </p>
              </div>
            </div>

            {participants.length > 0 && (
              <div className="animate-smooth-appear">
                {participants.map((user: any, index: any) => (
                  <UserRow
                    key={user.id ?? index}
                    name={users[index].name}
                    avatar={users[index].avatar}
                    score={user.score}
                    address={user.address}
                    index={index + 1}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </VerticalNavigationTemplate>
  );
};
