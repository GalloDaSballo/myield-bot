import cron from "node-cron";
import { Contract, providers, utils, Wallet } from "ethers";
import dotenv from "dotenv";

import ContactV1 from "./deployments/Myield.json";
import ContractV2 from "./deployments/MyieldWMatic.json";

dotenv.config();

const WALLET_PK = process.env.PK;
const { BLOCKVIGIL_KEY } = process.env;

/** Once every 15 mins */
cron.schedule("*/15 * * * *", async () => {
  console.log("Every 15 minutes");
  const wallet = new Wallet(
    WALLET_PK,
    new providers.JsonRpcProvider(BLOCKVIGIL_KEY)
  );
  const v1 = new Contract(ContactV1.address, ContactV1.abi, wallet);

  console.log("V1");
  /** Reinvest Rewards */
  try {
    // Check rewards balance
    const balance = await v1.getRewardsBalance();
    console.log("balance", balance.toString());

    if (balance.gt(utils.parseUnits("0.5", "ether"))) {
      console.log("Reinvesting");
      const reinvest = await (
        await v1.reinvestRewards({ gasLimit: 600000 })
      ).wait();

      console.log("reinvest tx", reinvest.transactionHash);
    } else {
      console.log("Not enough to warrant reinvesting");
    }
  } catch (err) {
    console.log("Exception in reinvestRewards", err);
  }

  /** Rebalance TODO: Calculate actual APR to decide if it's worth investing or not */
  try {
    const canBorrow = await v1.canBorrow();
    console.log("canBorrow", canBorrow.toString());

    if (canBorrow.gt(utils.parseUnits("5", "ether"))) {
      console.log("Worth rebalancing");
      const rebalance = await (
        await v1.rebalance({ gasLimit: 6000000 })
      ).wait();

      console.log("rebalance tx", rebalance.transactionHash);
    } else {
      console.log("Already properly leveraged");
    }
  } catch (err) {
    console.log("Exception in rebalance", err);
  }
});

/** Once every 2 mins */
cron.schedule("*/2 * * * *", async () => {
  console.log("Every 2 minutes");
  const wallet = new Wallet(
    WALLET_PK,
    new providers.JsonRpcProvider(BLOCKVIGIL_KEY)
  );
  const v2 = new Contract(ContractV2.address, ContractV2.abi, wallet);

  console.log("V2");
  /** Reinvest Rewards */
  try {
    // Check rewards balance
    const balance = await v2.getRewardsBalance();
    console.log("balance", balance.toString());

    if (balance.gt(utils.parseUnits("0.5", "ether"))) {
      console.log("Reinvesting");
      const reinvest = await (
        await v2.reinvestRewards({ gasLimit: 600000 })
      ).wait();

      console.log("reinvest tx", reinvest.transactionHash);
    } else {
      console.log("Not enough to warrant reinvesting");
    }
  } catch (err) {
    console.log("Exception in reinvestRewards", err);
  }

  /** Rebalance TODO: Calculate actual APR to decide if it's worth investing or not */
  try {
    const canBorrow = await v2.canBorrow();
    console.log("canBorrow", canBorrow.toString());

    if (canBorrow.gt(utils.parseUnits("5", "ether"))) {
      console.log("Worth rebalancing");
      const rebalance = await (
        await v2.rebalance({ gasLimit: 6000000 })
      ).wait();

      console.log("rebalance tx", rebalance.transactionHash);
    } else {
      console.log("Already properly leveraged");
    }
  } catch (err) {
    console.log("Exception in rebalance", err);
  }
});
