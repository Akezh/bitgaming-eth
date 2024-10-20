// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const BrainNFTModule = buildModule("BrainNFTModule", (m) => {
  const contract_address = "0xA9B981fd48b2A9Dd9075B088d05393d80479b2b0";

  const BrainNFT = m.contract("BrainNFT", [contract_address, ""]);

  return { BrainNFT };
});

export default BrainNFTModule;
