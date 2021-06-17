"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_cron_1 = __importDefault(require("node-cron"));
var ethers_1 = require("ethers");
var dotenv_1 = __importDefault(require("dotenv"));
var dcaVaults_1 = __importStar(require("./dcaVaults"));
var MIN_MATIC_USD = "1515151520000000000"; // Higher = Matic goes down
var MIN_MATIC_BTC = "457270000000000000000000";
var MIN_TO_SWAP = "1000"; // 0.1 USDC
var MIN_TO_REDISTRIBUTE = "1000"; // 100 sats, about 30 cents
var MIN_PRICE = {
    USDC: MIN_MATIC_USD,
    WBTC: MIN_MATIC_BTC,
};
dotenv_1.default.config();
var WALLET_PK = process.env.PK;
var BLOCKVIGIL_KEY = process.env.BLOCKVIGIL_KEY;
// 0.10 // With 3500$ this should happens over 20 times a day
// 0.001 which should happen 10 times per hjour
var MIN_DCA_REWARDS = ethers_1.BigNumber.from("1000000000000000");
var wallet = new ethers_1.Wallet(WALLET_PK, new ethers_1.providers.JsonRpcProvider(BLOCKVIGIL_KEY));
console.log("wallet", wallet.address);
var checkDCAVault = function (vault) { return __awaiter(void 0, void 0, void 0, function () {
    var vaultContract, stratContract, toSwap, price, expectedBTCFromUSDC, swapTx, err_1, toSwap, balanceInContract, depositTx, err_2, currentRewards, expectedHarvest, price, harvestTx, err_3, shouldInvest, investTx, err_4, balanceOfNeed, distributionTx, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                vaultContract = new ethers_1.Contract(vault.address, dcaVaults_1.DCA_VAULT_ABI, wallet);
                stratContract = new ethers_1.Contract(vault.rewardsStrat, dcaVaults_1.DCA_STRAT_ABI, wallet);
                console.log("Vault", vault.name);
                console.log("/** CHECK SwapToNeed **/");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
                return [4 /*yield*/, vaultContract.toSwap()];
            case 2:
                toSwap = _a.sent();
                console.log("toSwap", toSwap.toString());
                if (!toSwap.gt(MIN_TO_SWAP)) return [3 /*break*/, 6];
                price = MIN_PRICE[vault.need.symbol];
                console.log("swap price", price);
                return [4 /*yield*/, stratContract.getMinOutputAmount(toSwap, price)];
            case 3:
                expectedBTCFromUSDC = _a.sent();
                console.log("expectedBTCFromUSDC", expectedBTCFromUSDC.toString());
                return [4 /*yield*/, vaultContract.swapToNeed(price)];
            case 4: return [4 /*yield*/, (_a.sent()).wait()];
            case 5:
                swapTx = _a.sent();
                console.log("swapTx", swapTx.transactionHash);
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                err_1 = _a.sent();
                console.log("Exception in SwapToNeed", err_1);
                return [3 /*break*/, 8];
            case 8:
                console.log("/** CHECK DEPOSITS **/");
                _a.label = 9;
            case 9:
                _a.trys.push([9, 15, , 16]);
                return [4 /*yield*/, vaultContract.toSwap()];
            case 10:
                toSwap = _a.sent();
                console.log("depositToSwap", toSwap.toString());
                return [4 /*yield*/, vaultContract.balanceOfWant()];
            case 11:
                balanceInContract = _a.sent();
                console.log("balanceInContract", balanceInContract.toString());
                if (!balanceInContract.sub(toSwap).gt(0)) return [3 /*break*/, 14];
                return [4 /*yield*/, stratContract.deposit(balanceInContract, {
                        gasLimit: 5000000,
                    })];
            case 12: return [4 /*yield*/, (_a.sent()).wait()];
            case 13:
                depositTx = _a.sent();
                console.log("depositTx", depositTx.transactionHash);
                _a.label = 14;
            case 14: return [3 /*break*/, 16];
            case 15:
                err_2 = _a.sent();
                console.log("Exception in check deposits", err_2);
                return [3 /*break*/, 16];
            case 16:
                console.log("/** CHECK HARVEST **/");
                _a.label = 17;
            case 17:
                _a.trys.push([17, 23, , 24]);
                return [4 /*yield*/, stratContract.getRewardsAmount()];
            case 18:
                currentRewards = _a.sent();
                console.log("currentRewards", currentRewards.toString());
                return [4 /*yield*/, stratContract.getMinOutputAmount(currentRewards, MIN_PRICE[vault.want.symbol])];
            case 19:
                expectedHarvest = _a.sent();
                console.log("expectedHarvest", expectedHarvest.toString());
                if (!currentRewards.gt(MIN_DCA_REWARDS)) return [3 /*break*/, 22];
                console.log("Will harvest");
                price = MIN_PRICE[vault.want.symbol];
                console.log("price", price);
                return [4 /*yield*/, stratContract.harvest(price, {
                        gasLimit: 5000000,
                    })];
            case 20: return [4 /*yield*/, (_a.sent()).wait()];
            case 21:
                harvestTx = _a.sent();
                console.log("harvestTx", harvestTx.transactionHash);
                _a.label = 22;
            case 22: return [3 /*break*/, 24];
            case 23:
                err_3 = _a.sent();
                console.log("Exception in harvest", err_3);
                return [3 /*break*/, 24];
            case 24:
                console.log("/** CHECK REBALANCE **/");
                _a.label = 25;
            case 25:
                _a.trys.push([25, 30, , 31]);
                return [4 /*yield*/, stratContract.shouldInvest()];
            case 26:
                shouldInvest = _a.sent();
                console.log("shouldInvest", shouldInvest);
                if (!shouldInvest) return [3 /*break*/, 29];
                return [4 /*yield*/, stratContract.invest({
                        gasLimit: 5000000,
                    })];
            case 27: return [4 /*yield*/, (_a.sent()).wait()];
            case 28:
                investTx = _a.sent();
                console.log("investTx", investTx.transactionHash);
                _a.label = 29;
            case 29: return [3 /*break*/, 31];
            case 30:
                err_4 = _a.sent();
                console.log("Exception in rebalance", err_4);
                return [3 /*break*/, 31];
            case 31:
                console.log("/** CHECK REDISTRIBUTE **/");
                _a.label = 32;
            case 32:
                _a.trys.push([32, 37, , 38]);
                return [4 /*yield*/, vaultContract.balanceOfNeed()];
            case 33:
                balanceOfNeed = _a.sent();
                console.log("balanceOfNeed", balanceOfNeed.toString());
                if (!balanceOfNeed.gt(MIN_TO_REDISTRIBUTE)) return [3 /*break*/, 36];
                return [4 /*yield*/, vaultContract.distributeNeed({ gasLimit: 10000000 })];
            case 34: return [4 /*yield*/, (_a.sent()).wait()];
            case 35:
                distributionTx = _a.sent();
                console.log("distributionTx", distributionTx.transactionHash);
                _a.label = 36;
            case 36: return [3 /*break*/, 38];
            case 37:
                err_5 = _a.sent();
                console.log("Exception in distributeNeed", err_5);
                return [3 /*break*/, 38];
            case 38: return [2 /*return*/];
        }
    });
}); };
/** Once every 2 mins */
// 15 sec
node_cron_1.default.schedule("*/15 * * * * *", function () { return __awaiter(void 0, void 0, void 0, function () {
    var dcaVaultsToLoop;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Every 1 minutes, for dcaVaults");
                dcaVaultsToLoop = __spreadArrays(dcaVaults_1.default);
                _a.label = 1;
            case 1:
                if (!dcaVaultsToLoop.length) return [3 /*break*/, 3];
                /*  eslint-disable no-await-in-loop */
                return [4 /*yield*/, checkDCAVault(dcaVaultsToLoop.shift())];
            case 2:
                /*  eslint-disable no-await-in-loop */
                _a.sent();
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/];
        }
    });
}); });
