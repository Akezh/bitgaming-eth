import { HardhatUserConfig } from "hardhat/config";

import "dotenv/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.26",
  networks: {
    morph: {
      url: process.env.MORPH_URL || "",
      chainId: 2810,
    },
  },
};

export default config;
