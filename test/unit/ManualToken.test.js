const { assert, expect } = require("chai");
const { getNamedAccounts, deployments, ethers } = require("hardhat");
const { INITIAL_SUPPLY } = require("../../helper-hardhat-config");

describe("OurToken Unit Test", function () {
  let manualToken, deployer, user1;
  beforeEach(async function () {
    const { deploy } = deployments;
    const accounts = await getNamedAccounts();
    deployer = accounts.deployer;
    user1 = accounts.user1;

    await deployments.fixture("all");
    manualToken = await ethers.getContract("ManualToken", deployer);
  });

  it("Should have correct INITIAL_SUPPLY of token ", async function () {
    const totalSupply = await manualToken.totalSupply();
    assert.equal(totalSupply.toString(), INITIAL_SUPPLY.toString());
  });
});
