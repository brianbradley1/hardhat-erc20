const { network } = require("hardhat");
const {
  developmentChains,
  INITIAL_SUPPLY,
} = require("../helper-hardhat-config");
require("dotenv").config();
//const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const manualToken = await deploy("ManualToken", {
    from: deployer,
    args: [INITIAL_SUPPLY, process.env.TOKEN_NAME, process.env.TOKEN_SYMBOL],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  log(`manualToken deployed at ${manualToken.address}`);

  //   if (
  //     !developmentChains.includes(network.name) &&
  //     process.env.ETHERSCAN_API_KEY
  //   ) {
  //     await verify(ourToken.address, [INITIAL_SUPPLY]);
  //   }
};

module.exports.tags = ["all", "token"];
