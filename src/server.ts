import cron from "node-cron";
import { BigNumber, Contract, providers, Wallet } from "ethers";
import dotenv from "dotenv";
import dcaVaults, { DCA_VAULT_ABI, DCA_STRAT_ABI } from "./dcaVaults";

import { AAVEUSDCRewards } from "./AAVEUSDCRewards";
import { DCAVault } from "./types";
import { MyieldDCAVault } from "./MyieldDCAVault";

const MIN_MATIC_USD = "1515151520000000000"; // Higher = Matic goes down
const MIN_MATIC_BTC = "4057270000000000000000000";

const MIN_TO_SWAP = "1000"; // 0.1 USDC
const MIN_TO_REDISTRIBUTE = "1000"; // 100 sats, about 30 cents

const MIN_PRICE = {
  USDC: MIN_MATIC_USD,
  WBTC: MIN_MATIC_BTC,
};

dotenv.config();

const WALLET_PK = process.env.PK;
const { BLOCKVIGIL_KEY } = process.env;

// 0.10 // With 3500$ this should happens over 20 times a day

// 0.001 which should happen 10 times per hjour
const MIN_DCA_REWARDS = BigNumber.from("1000000000000000");

const wallet = new Wallet(
  WALLET_PK,
  new providers.JsonRpcProvider(BLOCKVIGIL_KEY)
);
console.log("wallet", wallet.address);

const checkDCAVault = async (vault: DCAVault) => {
  const vaultContract = new Contract(
    vault.address,
    DCA_VAULT_ABI,
    wallet
  ) as MyieldDCAVault;

  const stratContract = new Contract(
    vault.rewardsStrat,
    DCA_STRAT_ABI,
    wallet
  ) as AAVEUSDCRewards;

  console.log("Vault", vault.name);

  console.log("/** CHECK SwapToNeed **/");
  try {
    const toSwap = await vaultContract.toSwap();
    console.log("toSwap", toSwap.toString());
    if (toSwap.gt(MIN_TO_SWAP)) {
      const price = MIN_PRICE[vault.need.symbol];
      console.log("swap price", price);

      const swapTx = await (
        await vaultContract.swapToNeed(MIN_PRICE[vault.need.symbol])
      ).wait();
      console.log("swapTx", swapTx.transactionHash);
    }
  } catch (err) {
    console.log("Exception in SwapToNeed", err);
  }

  console.log("/** CHECK DEPOSITS **/");
  try {
    const toSwap = await vaultContract.toSwap();
    console.log("depositToSwap", toSwap.toString());
    const balanceInContract = await vaultContract.balanceOfWant();
    console.log("balanceInContract", balanceInContract.toString());
    if (balanceInContract.sub(toSwap).gt(0)) {
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
    const expectedHarvest = await stratContract.getMinOutputAmount(
      currentRewards,
      MIN_PRICE[vault.want.symbol]
    );
    console.log("expectedHarvest", expectedHarvest.toString());

    if (currentRewards.gt(MIN_DCA_REWARDS)) {
      console.log("Will harvest");
      // Get price quote
      const price = MIN_PRICE[vault.want.symbol];
      console.log("price", price);

      // Ask for harvest
      const harvestTx = await (
        await stratContract.harvest(price, {
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

  console.log("/** CHECK REDISTRIBUTE **/");
  try {
    const balanceOfNeed = await vaultContract.balanceOfNeed();
    console.log("balanceOfNeed", balanceOfNeed.toString());
    if (balanceOfNeed.gt(MIN_TO_REDISTRIBUTE)) {
      const distributionTx = await (
        await vaultContract.distributeNeed({ gasLimit: 10000000 })
      ).wait();
      console.log("distributionTx", distributionTx.transactionHash);
    }
  } catch (err) {
    console.log("Exception in distributeNeed", err);
  }
};

/** Once every 2 mins */
cron.schedule("*/1 * * * *", async () => {
  console.log("Every 1 minutes, for dcaVaults");

  const dcaVaultsToLoop = [...dcaVaults];
  while (dcaVaultsToLoop.length) {
    /*  eslint-disable no-await-in-loop */
    await checkDCAVault(dcaVaultsToLoop.shift());
  }
});
