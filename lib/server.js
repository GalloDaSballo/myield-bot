"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_cron_1 = __importDefault(require("node-cron"));
var ethers_1 = require("ethers");
var dotenv_1 = __importDefault(require("dotenv"));
var Myield_json_1 = __importDefault(require("./deployments/Myield.json"));
var MyieldWMatic_json_1 = __importDefault(require("./deployments/MyieldWMatic.json"));
dotenv_1.default.config();
var WALLET_PK = process.env.PK;
var BLOCKVIGIL_KEY = process.env.BLOCKVIGIL_KEY;
/** Once every 15 mins */
node_cron_1.default.schedule("*/15 * * * *", function () { return __awaiter(void 0, void 0, void 0, function () {
    var wallet, v1, balance, reinvest, err_1, canBorrow, rebalance, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Every 15 minutes");
                wallet = new ethers_1.Wallet(WALLET_PK, new ethers_1.providers.JsonRpcProvider(BLOCKVIGIL_KEY));
                v1 = new ethers_1.Contract(Myield_json_1.default.address, Myield_json_1.default.abi, wallet);
                console.log("V1");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
                return [4 /*yield*/, v1.getRewardsBalance()];
            case 2:
                balance = _a.sent();
                console.log("balance", balance.toString());
                if (!balance.gt(ethers_1.utils.parseUnits("0.5", "ether"))) return [3 /*break*/, 5];
                console.log("Reinvesting");
                return [4 /*yield*/, v1.reinvestRewards({ gasLimit: 600000 })];
            case 3: return [4 /*yield*/, (_a.sent()).wait()];
            case 4:
                reinvest = _a.sent();
                console.log("reinvest tx", reinvest.transactionHash);
                return [3 /*break*/, 6];
            case 5:
                console.log("Not enough to warrant reinvesting");
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                err_1 = _a.sent();
                console.log("Exception in reinvestRewards", err_1);
                return [3 /*break*/, 8];
            case 8:
                _a.trys.push([8, 14, , 15]);
                return [4 /*yield*/, v1.canBorrow()];
            case 9:
                canBorrow = _a.sent();
                console.log("canBorrow", canBorrow.toString());
                if (!canBorrow.gt(ethers_1.utils.parseUnits("5", "ether"))) return [3 /*break*/, 12];
                console.log("Worth rebalancing");
                return [4 /*yield*/, v1.rebalance({ gasLimit: 6000000 })];
            case 10: return [4 /*yield*/, (_a.sent()).wait()];
            case 11:
                rebalance = _a.sent();
                console.log("rebalance tx", rebalance.transactionHash);
                return [3 /*break*/, 13];
            case 12:
                console.log("Already properly leveraged");
                _a.label = 13;
            case 13: return [3 /*break*/, 15];
            case 14:
                err_2 = _a.sent();
                console.log("Exception in rebalance", err_2);
                return [3 /*break*/, 15];
            case 15: return [2 /*return*/];
        }
    });
}); });
/** Once every 15 mins */
node_cron_1.default.schedule("*/1 * * * *", function () { return __awaiter(void 0, void 0, void 0, function () {
    var wallet, v2, balance, reinvest, err_3, canBorrow, rebalance, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Every 15 minutes");
                wallet = new ethers_1.Wallet(WALLET_PK, new ethers_1.providers.JsonRpcProvider(BLOCKVIGIL_KEY));
                v2 = new ethers_1.Contract(MyieldWMatic_json_1.default.address, MyieldWMatic_json_1.default.abi, wallet);
                console.log("V2");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
                return [4 /*yield*/, v2.getRewardsBalance()];
            case 2:
                balance = _a.sent();
                console.log("balance", balance.toString());
                if (!balance.gt(ethers_1.utils.parseUnits("0.5", "ether"))) return [3 /*break*/, 5];
                console.log("Reinvesting");
                return [4 /*yield*/, v2.reinvestRewards({ gasLimit: 600000 })];
            case 3: return [4 /*yield*/, (_a.sent()).wait()];
            case 4:
                reinvest = _a.sent();
                console.log("reinvest tx", reinvest.transactionHash);
                return [3 /*break*/, 6];
            case 5:
                console.log("Not enough to warrant reinvesting");
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                err_3 = _a.sent();
                console.log("Exception in reinvestRewards", err_3);
                return [3 /*break*/, 8];
            case 8:
                _a.trys.push([8, 14, , 15]);
                return [4 /*yield*/, v2.canBorrow()];
            case 9:
                canBorrow = _a.sent();
                console.log("canBorrow", canBorrow.toString());
                if (!true) return [3 /*break*/, 12];
                console.log("Worth rebalancing");
                return [4 /*yield*/, v2.rebalance({ gasLimit: 6000000 })];
            case 10: return [4 /*yield*/, (_a.sent()).wait()];
            case 11:
                rebalance = _a.sent();
                console.log("rebalance tx", rebalance.transactionHash);
                return [3 /*break*/, 13];
            case 12:
                console.log("Already properly leveraged");
                _a.label = 13;
            case 13: return [3 /*break*/, 15];
            case 14:
                err_4 = _a.sent();
                console.log("Exception in rebalance", err_4);
                return [3 /*break*/, 15];
            case 15: return [2 /*return*/];
        }
    });
}); });
