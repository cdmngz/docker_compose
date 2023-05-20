import { Asks, prepareResponseAPI, responseAPI } from "../types"
import { NOT_ENOUGH_ORDER_BOOKS } from "./constants"

/**
 * Check if BTC amount is greater than a satoshi and lower than max-supply
 * @param {string} queryAmount - BTC amount
 * @return {boolean} - valid/not valid
 */
export const validatedAmountBTC = (queryAmount: string): boolean => {
    if (queryAmount) {
        const queryAmountDecimals: number = queryAmount.includes('.') ? queryAmount.split('.')[1].length : 0
        const btcAmount = parseFloat(queryAmount)    
    
        if (btcAmount < 0.00000001 || btcAmount > 21000000 || queryAmountDecimals > 8 || Number.isNaN(btcAmount)) {
            return false
        } else {
            return true
        }
    } else {
        return false
    }
}

/**
 * Get an array with all the asks from the API order books
 * @param {Asks} Asks - Asks from API order books
 * @param {number} btcAmount - BTC amount
 * @return {prepareResponseAPI} - Type with the name of the exchange and the total usdAmount to buy the BTC
 */
export const getPriceFromOrderBooks = (Asks: Asks, btcAmount: number): prepareResponseAPI => {
    let [acumPrice, acumBTC, index] = [0, 0, 0]

    while(acumBTC < btcAmount && Asks.asks.length > index) {
        const [price, quant, rows=1] = Asks.asks[index]
    
        if (acumBTC + quant*rows === btcAmount) {
            acumPrice += price*quant*rows
            acumBTC = btcAmount
        } else if (acumBTC + quant*rows < btcAmount) {
            acumPrice += price*quant*rows
            acumBTC += quant*rows
        } else if (acumBTC + quant*rows > btcAmount) {
            acumPrice += price*(btcAmount-acumBTC)
            acumBTC = btcAmount
        }
        index++
    }
    
    return {
        exchange: Asks.exchange,
        usdAmount: acumBTC === btcAmount ? acumPrice : NOT_ENOUGH_ORDER_BOOKS
    }
}

/**
 * Prepare the response to send to the client
 * @param {Array} prepareResponse - Array with the exchanges and usdAmount to buy the BTC
 * @param {number} btcAmount - BTC amount
 * @return {responseAPI} - Type with the response to the client
 */
export const fromPrepareToResponse = (prepareResponse: prepareResponseAPI[], btcAmount:number): responseAPI => {
    if (prepareResponse.length) {
        const response: prepareResponseAPI = prepareResponse.reduce((a, b) => a.usdAmount < b.usdAmount ? a : b)
        return {
            btcAmount: String(btcAmount),
            usdAmount: response.usdAmount.toFixed(2),
            exchange: response.exchange
        }
    } else {
        return {
            btcAmount: String(btcAmount),
            usdAmount: "Not enough order books",
            exchange: ""
        }
    }

}