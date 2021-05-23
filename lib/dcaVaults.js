"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DCA_STRAT_ABI = exports.DCA_VAULT_ABI = void 0;
var MyieldDCAVault_json_1 = __importDefault(require("./deployments/MyieldDCAVault.json"));
var AAVEUSDCRewards_json_1 = __importDefault(require("./deployments/AAVEUSDCRewards.json"));
var dcaVaults = [
    {
        name: "Myield USDC Vault with DCA to wBTC",
        symbol: "MyYieldUSDC2WBTC",
        address: "0xD0E05D1C314Cbd51e0e76A71Dc7A0CcdDAcbCCe1",
        logoURI: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389",
        decimals: 6,
        rewardsStrat: "0xEed13F8A0Ad6A8cac6d54D1C89c180eBe4E95153",
        want: {
            name: "USD Coin",
            symbol: "USDC",
            address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
            logoURI: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389",
            decimals: 6,
        },
        need: {
            address: "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
            name: "Wrapped Bitcoin",
            symbol: "WBTC",
            decimals: 8,
            logoURI: "https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png?1548822744",
        },
    },
];
exports.DCA_VAULT_ABI = MyieldDCAVault_json_1.default.abi;
exports.DCA_STRAT_ABI = AAVEUSDCRewards_json_1.default.abi;
exports.default = dcaVaults;
