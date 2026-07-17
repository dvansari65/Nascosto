import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      evmVersion: "cancun",
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    fuji: {
      url: vars.get("FUJI_RPC_URL", "https://api.avax-test.network/ext/bc/C/rpc"),
      accounts: vars.has("PRIVATE_KEY") ? [vars.get("PRIVATE_KEY")] : [],
    },
    avalancheLocal: {
      url: "http://127.0.0.1:9650/ext/bc/C/rpc",
      chainId: 1337,
      accounts: ["0x56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027"],
    },
  },
};

export default config;