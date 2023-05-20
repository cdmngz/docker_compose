import express from 'express'
import { getAllAsksBinance } from '../services/binance'
import { getAllAsksCoinbase } from '../services/coinbase'
import { getAllAsksCrypto } from '../services/crypto.com'
import { prepareResponseAPI } from '../types'
import { fromPrepareToResponse, getPriceFromOrderBooks, validatedAmountBTC } from '../utils'
import { NOT_ENOUGH_ORDER_BOOKS } from '../utils/constants'

const router = express.Router()

router.get('/', (req, res) => {

    let btcAmount: number = 0
    let queryAmount = String(req.query.amount)

    // Check is the BTC amount is valid
    if(validatedAmountBTC(queryAmount)) {
        btcAmount = parseFloat(queryAmount)
    } else {
        res.status(500).send('Error BTC amount format');
    }
    
    // Get all the Order Books from APIS
    Promise.all([getAllAsksBinance(), getAllAsksCoinbase(), getAllAsksCrypto()])
        .then(exchangesOrderBooks => {

            // Get an array with the exchanges/usdAmount
            const prepareResponse: prepareResponseAPI[] = exchangesOrderBooks
                .map(Asks => getPriceFromOrderBooks(Asks, btcAmount))
                .filter(Asks => Asks.usdAmount !== NOT_ENOUGH_ORDER_BOOKS)
            
            // Response the best execution price
            res.send(fromPrepareToResponse(prepareResponse, btcAmount))
            
        }).catch(error => {
            res.status(500).send(`Something goes wrong ${error.message}`)
        })
})

export default router