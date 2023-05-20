import https from 'https'
import { Asks, responseFromApiCrypto } from '../../types'
import { ORDER_BOOK_BTCUSDT } from '../../utils/constants'

/**
 * Get the asks order book from API
 * @return {Promise} - The Ask type
 */
export const getAllAsksCrypto = async (): Promise<Asks> => {
    return await getAllCryptoOrderBooks().then(mapFromApiToAsks)
}

/**
 * Get all the order books from API
 * @return {Promise} - The entire data from the API
 */
export const getAllCryptoOrderBooks = async (): Promise<responseFromApiCrypto> => {
    return new Promise((resolve, reject) => {
        let data = ''
        const options = {
            headers: {
                'User-Agent': 'User agent',
            }
        }
        https.get(ORDER_BOOK_BTCUSDT.crypto.api_path, options, (resp) => {
            
            resp.on('data', (chunk) => {
                data += chunk
            })
    
            resp.on('end', () => {
                const listOfPrices:responseFromApiCrypto = JSON.parse(data)
                resolve(listOfPrices)
            })

        }).on('error', (err) => {
            reject(err.message)
        })
    })
}

/**
 * Transform responseFromApi to Asks type
 * @param {responseFromApiCrypto} apiResponse - The entire order books from the API call
 * @return {Asks} - Return Asks type
 */
 const mapFromApiToAsks = (apiResponse: responseFromApiCrypto): Asks => {
    const { asks } = apiResponse.result.data[0]
    const temp: Asks = {
        exchange: ORDER_BOOK_BTCUSDT.crypto.name,
        asks: asks.map(ask => ask.map(price => parseFloat(price)))
    }
    return temp
}