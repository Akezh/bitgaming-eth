// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const BITTokenModule = buildModule("BITTokenModule", (m) => {
  const initSupply = m.getParameter("initSupply", 10000000000);

  const BITToken = m.contract("BITToken", [initSupply]);

  return { BITToken };
});

export default BITTokenModule;
