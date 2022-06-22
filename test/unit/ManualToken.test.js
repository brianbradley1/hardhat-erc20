const { assert, expect } = require("chai");
const { getNamedAccounts, deployments, ethers } = require("hardhat");
const { INITIAL_SUPPLY } = require("../../helper-hardhat-config");

describe("ManualToken Unit Test", function () {
  let manualToken, deployer, user1, user2;
  beforeEach(async function () {
    const { deploy } = deployments;
    const accounts = await getNamedAccounts();
    deployer = accounts.deployer;
    user1 = accounts.user1;
    user2 = accounts.user2;

    await deployments.fixture("all");
    manualToken = await ethers.getContract("ManualToken", deployer);
  });

  it("Should have correct INITIAL_SUPPLY of token ", async function () {
    const totalSupply = await manualToken.totalSupply();
    assert.equal(totalSupply.toString(), INITIAL_SUPPLY.toString());
  });

  it("Should be able to transfer funds from one account to another", async function () {
    const tokensToSend = ethers.utils.parseEther("10");
    await manualToken.transfer(user1, tokensToSend);
    expect(await manualToken.balanceOf(user1)).to.equal(tokensToSend);
  });

  it("Should be able to approve spend for another account", async function () {
    const tokensToSpend = ethers.utils.parseEther("100");
    await manualToken.approve(user1, tokensToSpend);
    const manualToken1 = await ethers.getContract("ManualToken", user1);
    // user1 sending 100 tokens to user2 on behalf of from deployer account
    await manualToken1.transferFrom(deployer, user2, tokensToSpend);
    expect(await manualToken1.balanceOf(user2)).to.equal(tokensToSpend);
  });

  it("Should be able to burn tokens", async function () {
    const tokensToBurn = ethers.utils.parseEther("100");

    const previousBalance = await manualToken.balanceOf(deployer);
    //console.log("previous balance of sender = " + previousBalance.toString());

    await manualToken.burn(tokensToBurn);

    const newBalance = await manualToken.balanceOf(deployer);
    //console.log("new balance of sender = " + newBalance.toString());

    expect(previousBalance).to.not.equal(newBalance);
  });
});
