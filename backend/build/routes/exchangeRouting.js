"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const binance_1 = require("../services/binance");
const coinbase_1 = require("../services/coinbase");
const crypto_com_1 = require("../services/crypto.com");
const utils_1 = require("../utils");
const constants_1 = require("../utils/constants");
const router = express_1.default.Router();
router.get('/', (req, res) => {
    let btcAmount = 0;
    let queryAmount = String(req.query.amount);
    // Check is the BTC amount is valid
    if ((0, utils_1.validatedAmountBTC)(queryAmount)) {
        btcAmount = parseFloat(queryAmount);
    }
    else {
        res.status(500).send('Error BTC amount format');
    }
    // Get all the Order Books from APIS
    Promise.all([(0, binance_1.getAllAsksBinance)(), (0, coinbase_1.getAllAsksCoinbase)(), (0, crypto_com_1.getAllAsksCrypto)()])
        .then(exchangesOrderBooks => {
        // Get an array with the exchanges/usdAmount
        const prepareResponse = exchangesOrderBooks
            .map(Asks => (0, utils_1.getPriceFromOrderBooks)(Asks, btcAmount))
            .filter(Asks => Asks.usdAmount !== constants_1.NOT_ENOUGH_ORDER_BOOKS);
        // Response the best execution price
        res.send((0, utils_1.fromPrepareToResponse)(prepareResponse, btcAmount));
    }).catch(error => {
        res.status(500).send(`Something goes wrong ${error.message}`);
    });
});
exports.default = router;
