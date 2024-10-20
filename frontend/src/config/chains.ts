import { JsonRpcProvider } from "ethers";
import { morphHolesky, hardhat } from "viem/chains";

export enum ChainId {
  Morph = 2810,
  Hardhat = 31337,
}

type ValidChainID = ChainId.Morph | ChainId.Hardhat;

export type ChainIDUrl = {
  [T in ValidChainID]: string;
};

export const readOnlyUrls: ChainIDUrl = {
  [ChainId.Morph]:
    morphHolesky.rpcUrls.default.http[0] ||
    "https://rpc-quicknode-holesky.morphl2.io",
  [ChainId.Hardhat]: hardhat.rpcUrls.default.http[0] ?? `http://localhost:8545`,
};

export const blockExplorers: ChainIDUrl = {
  [ChainId.Morph]:
    morphHolesky.blockExplorers.default.url ??
    `https://explorer-holesky.morphl2.io/`,
  [ChainId.Hardhat]: `https://localhost:8545`,
};

export const TARGET_CHAIN = (parseInt(
  import.meta.env.VITE_TARGET_CHAIN_ID as string
) || ChainId.Hardhat) as ValidChainID;

export const isValidChain = (chainId: ChainId) => {
  return chainId == TARGET_CHAIN;
};

export const chainReadProvider = new JsonRpcProvider(
  readOnlyUrls[TARGET_CHAIN]
);
