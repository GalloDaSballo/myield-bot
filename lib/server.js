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
var vaults_1 = __importStar(require("./vaults"));
var MIN_MATIC_USD = "873508868000000000";
var MIN_MATIC_BTC = "38530670500000000000000";
var MIN_PRICE = {
    USDC: MIN_MATIC_USD,
    WBTC: MIN_MATIC_BTC,
};
dotenv_1.default.config();
var WALLET_PK = process.env.PK;
var BLOCKVIGIL_KEY = process.env.BLOCKVIGIL_KEY;
// 0.0025 // With 100$ this should happens at least 20 times a day
var MIN_REWARDS = ethers_1.BigNumber.from("2500000000000000");
var wallet = new ethers_1.Wallet(WALLET_PK, new ethers_1.providers.JsonRpcProvider(BLOCKVIGIL_KEY));
var checkVault = function (vault) { return __awaiter(void 0, void 0, void 0, function () {
    var vaultContract, stratContract, balanceInContract, depositTx, err_1, currentRewards, harvestTx, err_2, shouldInvest, investTx, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                vaultContract = new ethers_1.Contract(vault.address, vaults_1.VAULT_ABI, wallet);
                stratContract = new ethers_1.Contract(vault.rewardsStrat, vaults_1.STRAT_ABI, wallet);
                console.log("Vault", vault.name);
                console.log("/** CHECK DEPOSITS **/");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, vaultContract.balanceOfWant()];
            case 2:
                balanceInContract = _a.sent();
                console.log("balanceInContract", balanceInContract.toString());
                if (!balanceInContract.gt(0)) return [3 /*break*/, 5];
                return [4 /*yield*/, stratContract.deposit(balanceInContract, {
                        gasLimit: 5000000,
                    })];
            case 3: return [4 /*yield*/, (_a.sent()).wait()];
            case 4:
                depositTx = _a.sent();
                console.log("depositTx", depositTx.transactionHash);
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                err_1 = _a.sent();
                console.log("Exception in check deposits", err_1);
                return [3 /*break*/, 7];
            case 7:
                console.log("/** CHECK HARVEST **/");
                _a.label = 8;
            case 8:
                _a.trys.push([8, 13, , 14]);
                return [4 /*yield*/, stratContract.getRewardsAmount()];
            case 9:
                currentRewards = _a.sent();
                console.log("currentRewards", currentRewards.toString());
                if (!currentRewards.gt(MIN_REWARDS)) return [3 /*break*/, 12];
                console.log("Will harvest");
                return [4 /*yield*/, stratContract.harvest(MIN_PRICE[vault.want.symbol], {
                        gasLimit: 5000000,
                    })];
            case 10: return [4 /*yield*/, (_a.sent()).wait()];
            case 11:
                harvestTx = _a.sent();
                console.log("harvestTx", harvestTx.transactionHash);
                _a.label = 12;
            case 12: return [3 /*break*/, 14];
            case 13:
                err_2 = _a.sent();
                console.log("Exception in harvest", err_2);
                return [3 /*break*/, 14];
            case 14:
                console.log("/** CHECK REBALANCE **/");
                _a.label = 15;
            case 15:
                _a.trys.push([15, 20, , 21]);
                return [4 /*yield*/, stratContract.shouldInvest()];
            case 16:
                shouldInvest = _a.sent();
                console.log("shouldInvest", shouldInvest);
                if (!shouldInvest) return [3 /*break*/, 19];
                return [4 /*yield*/, stratContract.invest({
                        gasLimit: 5000000,
                    })];
            case 17: return [4 /*yield*/, (_a.sent()).wait()];
            case 18:
                investTx = _a.sent();
                console.log("investTx", investTx.transactionHash);
                _a.label = 19;
            case 19: return [3 /*break*/, 21];
            case 20:
                err_3 = _a.sent();
                console.log("Exception in rebalance", err_3);
                return [3 /*break*/, 21];
            case 21: return [2 /*return*/];
        }
    });
}); };
/** Once every 5 mins */
node_cron_1.default.schedule("*/1 * * * *", function () { return __awaiter(void 0, void 0, void 0, function () {
    var vaultsToLoop;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Every 5 minutes");
                vaultsToLoop = __spreadArrays(vaults_1.default);
                _a.label = 1;
            case 1:
                if (!vaultsToLoop.length) return [3 /*break*/, 3];
                // eslint-disable-next-line no-await-in-loop
                return [4 /*yield*/, checkVault(vaultsToLoop.shift())];
            case 2:
                // eslint-disable-next-line no-await-in-loop
                _a.sent();
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/];
        }
    });
}); });
