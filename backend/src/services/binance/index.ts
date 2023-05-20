import https from 'https'
import { Asks, responseFromApiBinance } from '../../types'
import { ORDER_BOOK_BTCUSDT } from '../../utils/constants'

/**
 * Get the asks order book from API
 * @return {Promise} - The Ask type
 */
export const getAllAsksBinance = async (): Promise<Asks> => {
    return await getAllBinanceOrderBooks().then(mapFromApiToAsks)
}

/**
 * Get all the order books from API
 * @return {Promise} - The entire data from the API
 */
export const getAllBinanceOrderBooks = async (): Promise<responseFromApiBinance> => {
    return new Promise((resolve, reject) => {
        let data = ''
        const options = {
            headers: {
                'User-Agent': 'User agent',
            }
        }
        https.get(ORDER_BOOK_BTCUSDT.binance.api_path, options, (resp) => {
            
            resp.on('data', (chunk) => {
                data += chunk
            })
    
            resp.on('end', () => {
                const listOfPrices:responseFromApiBinance = JSON.parse(data)
                resolve(listOfPrices)
            })

        }).on('error', (err) => {
            reject(err.message)
        })
    })
}

/**
 * Transform responseFromApi to Asks type
 * @param {responseFromApiBinance} apiResponse - The entire order books from the API call
 * @return {Asks} - Return Asks type
 */
const mapFromApiToAsks = (apiResponse: responseFromApiBinance): Asks => {
    const { asks } = apiResponse
    const temp: Asks = {
        exchange: ORDER_BOOK_BTCUSDT.binance.name,
        asks: asks.map(ask => ask.map(price => parseFloat(price)))
    }
    return temp
}