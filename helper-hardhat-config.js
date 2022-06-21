const networkConfig = {
  31337: {
    name: "localhost",
  },
  // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
  // 4: {
  //   name: "rinkeby",
  //   ethUsdPriceFeed: "0x8a753747a1fa494ec906ce90e9f37563a8af630e",
  // },
};
const INITIAL_SUPPLY = "1000000000000000000000000";

const developmentChains = ["hardhat", "localhost"];

module.exports = {
  networkConfig,
  developmentChains,
  INITIAL_SUPPLY,
};
