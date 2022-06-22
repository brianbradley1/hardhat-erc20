const { assert, expect } = require("chai");
const { getNamedAccounts, deployments, ethers } = require("hardhat");
const { INITIAL_SUPPLY } = require("../../helper-hardhat-config");

describe("ManualToken Unit Test", function () {
  let manualTokenDeployer, manualTokenUser1, deployer, user1, user2;
  beforeEach(async function () {
    const { deploy } = deployments;
    const accounts = await getNamedAccounts();
    deployer = accounts.deployer;
    user1 = accounts.user1;
    user2 = accounts.user2;

    await deployments.fixture("all");
    manualTokenDeployer = await ethers.getContract("ManualToken", deployer);
    manualTokenUser1 = await ethers.getContract("ManualToken", user1);
  });

  it("Should have correct INITIAL_SUPPLY of token ", async function () {
    const totalSupply = await manualTokenDeployer.totalSupply();
    assert.equal(totalSupply.toString(), INITIAL_SUPPLY.toString());
  });

  describe("transfer", function () {
    it("reverts when you dont pay enough", async () => {
      // need to transfer 100 tokens to user1 first as deployer balance too high to test condition below
      const tokensToSend = ethers.utils.parseEther("100");
      await manualTokenDeployer.transfer(user1, tokensToSend);
      await expect(
        manualTokenUser1.transfer(deployer, ethers.utils.parseEther("10000"))
      ).to.be.reverted;
    });

    it("reverts when you transfer to incorrect address", async () => {
      const tokensToSend = ethers.utils.parseEther("100");
      await expect(manualTokenDeployer.transfer("0x0", tokensToSend)).to.be
        .reverted;
    });

    it("Should be able to transfer funds from one account to another", async function () {
      const tokensToSend = ethers.utils.parseEther("10");
      await manualTokenDeployer.transfer(user1, tokensToSend);
      expect(await manualTokenDeployer.balanceOf(user1)).to.equal(tokensToSend);
    });

    it("emits event on transfer", async () => {
      const tokensToSend = ethers.utils.parseEther("10");
      await expect(manualTokenDeployer.transfer(user1, tokensToSend)).to.emit(
        manualTokenDeployer,
        "Transfer"
      );
    });
  });

  describe("transferFrom", function () {
    let allowance, tokensAllowedToSpend;
    // added approval in forEach so doesn't need to be done for each transferFrom test
    beforeEach(async function () {
      tokensAllowedToSpend = ethers.utils.parseEther("1000");
      await manualTokenDeployer.approve(user1, tokensAllowedToSpend);
      allowance = await manualTokenDeployer.allowance(deployer, user1);
    });

    it("revert when you run transferFrom with value greater than allowance", async function () {
      const tokensOverAllowance = ethers.utils.parseEther("2000");
      await expect(
        manualTokenUser1.transferFrom(deployer, user1, tokensOverAllowance)
      ).to.be.reverted;
    });

    it("Should be able to run transferFrom function", async function () {
      await manualTokenUser1.transferFrom(
        deployer,
        user1,
        tokensAllowedToSpend
      );
      expect(await manualTokenDeployer.balanceOf(user1)).to.equal(
        tokensAllowedToSpend
      );
    });
  });

  describe("approve", function () {
    it("Should be able to approve spend for another account", async function () {
      const tokensToSpend = ethers.utils.parseEther("100.0");
      await manualTokenDeployer.approve(user1, tokensToSpend);
      const allowance = await manualTokenDeployer.allowance(deployer, user1);
      expect(allowance.toString()).to.equal(tokensToSpend);
    });

    it("emits event on approval", async () => {
      const tokensToSend = ethers.utils.parseEther("10");
      await expect(
        await manualTokenDeployer.approve(user1, tokensToSend)
      ).to.emit(manualTokenDeployer, "Approval");
    });
  });

  describe("burn", function () {
    it("Should be able to burn tokens", async function () {
      const tokensToBurn = ethers.utils.parseEther("100");

      const previousBalance = await manualTokenDeployer.balanceOf(deployer);
      //console.log("previous balance of sender = " + previousBalance.toString());

      await manualTokenDeployer.burn(tokensToBurn);

      const newBalance = await manualTokenDeployer.balanceOf(deployer);
      //console.log("new balance of sender = " + newBalance.toString());

      expect(previousBalance).to.not.equal(newBalance);
    });

    it("emits event on burn", async () => {
      const tokensToBurn = ethers.utils.parseEther("10");
      await expect(await manualTokenDeployer.burn(tokensToBurn)).to.emit(
        manualTokenDeployer,
        "Burn"
      );
    });
  });
});
