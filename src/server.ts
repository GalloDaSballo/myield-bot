import cron from "node-cron";
import { BigNumber, Contract, providers, Wallet } from "ethers";
import dotenv from "dotenv";

import vaults, { VAULT_ABI, STRAT_ABI } from "./vaults";
import { MyieldVault } from "./MyieldVault";
import { AAVEUSDCRewards } from "./AAVEUSDCRewards";
import { Vault } from "./types";

const MIN_MATIC_USD = "873508868000000000";
const MIN_MATIC_BTC = "38530670500000000000000";

const MIN_PRICE = {
  USDC: MIN_MATIC_USD,
  WBTC: MIN_MATIC_BTC,
};

dotenv.config();

const WALLET_PK = process.env.PK;
const { BLOCKVIGIL_KEY } = process.env;

// 0.025 // With 3500$ this should happens over 40 times a day
const MIN_REWARDS = BigNumber.from("25000000000000000");
const wallet = new Wallet(
  WALLET_PK,
  new providers.JsonRpcProvider(BLOCKVIGIL_KEY)
);

const checkVault = async (vault: Vault) => {
  const vaultContract = new Contract(
    vault.address,
    VAULT_ABI,
    wallet
  ) as MyieldVault;
  const stratContract = new Contract(
    vault.rewardsStrat,
    STRAT_ABI,
    wallet
  ) as AAVEUSDCRewards;
  console.log("Vault", vault.name);
  console.log("/** CHECK DEPOSITS **/");
  try {
    const balanceInContract = await vaultContract.balanceOfWant();
    console.log("balanceInContract", balanceInContract.toString());
    if (balanceInContract.gt(0)) {
      // Deposit in Strat
      const depositTx = await (
        await stratContract.deposit(balanceInContract, {
          gasLimit: 5000000,
        })
      ).wait();
      console.log("depositTx", depositTx.transactionHash);
    }
  } catch (err) {
    console.log("Exception in check deposits", err);
  }

  console.log("/** CHECK HARVEST **/");
  try {
    const currentRewards = await stratContract.getRewardsAmount();
    console.log("currentRewards", currentRewards.toString());
    if (currentRewards.gt(MIN_REWARDS)) {
      console.log("Will harvest");
      // Get price quote

      // Ask for harvest
      const harvestTx = await (
        await stratContract.harvest(MIN_PRICE[vault.want.symbol], {
          gasLimit: 5000000,
        })
      ).wait();
      console.log("harvestTx", harvestTx.transactionHash);
    }
  } catch (err) {
    console.log("Exception in harvest", err);
  }

  console.log("/** CHECK REBALANCE **/");
  try {
    const shouldInvest = await stratContract.shouldInvest();
    console.log("shouldInvest", shouldInvest);
    if (shouldInvest) {
      const investTx = await (
        await stratContract.invest({
          gasLimit: 5000000,
        })
      ).wait();
      console.log("investTx", investTx.transactionHash);
    }
  } catch (err) {
    console.log("Exception in rebalance", err);
  }
};

/** Once every 5 mins */
cron.schedule("*/5 * * * *", async () => {
  console.log("Every 5 minutes");

  const vaultsToLoop = [...vaults];
  while (vaultsToLoop.length) {
    // eslint-disable-next-line no-await-in-loop
    await checkVault(vaultsToLoop.shift());
  }
});
