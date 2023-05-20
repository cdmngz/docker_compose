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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCryptoOrderBooks = exports.getAllAsksCrypto = void 0;
const https_1 = __importDefault(require("https"));
const constants_1 = require("../../utils/constants");
/**
 * Get the asks order book from API
 * @return {Promise} - The Ask type
 */
const getAllAsksCrypto = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, exports.getAllCryptoOrderBooks)().then(mapFromApiToAsks);
});
exports.getAllAsksCrypto = getAllAsksCrypto;
/**
 * Get all the order books from API
 * @return {Promise} - The entire data from the API
 */
const getAllCryptoOrderBooks = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        let data = '';
        const options = {
            headers: {
                'User-Agent': 'User agent',
            }
        };
        https_1.default.get(constants_1.ORDER_BOOK_BTCUSDT.crypto.api_path, options, (resp) => {
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                const listOfPrices = JSON.parse(data);
                resolve(listOfPrices);
            });
        }).on('error', (err) => {
            reject(err.message);
        });
    });
});
exports.getAllCryptoOrderBooks = getAllCryptoOrderBooks;
/**
 * Transform responseFromApi to Asks type
 * @param {responseFromApiCrypto} apiResponse - The entire order books from the API call
 * @return {Asks} - Return Asks type
 */
const mapFromApiToAsks = (apiResponse) => {
    const { asks } = apiResponse.result.data[0];
    const temp = {
        exchange: constants_1.ORDER_BOOK_BTCUSDT.crypto.name,
        asks: asks.map(ask => ask.map(price => parseFloat(price)))
    };
    return temp;
};
