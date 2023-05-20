export interface Asks {
    exchange: string
    asks: number[][]
}

export interface responseFromApiBinance {
    lastUpdateId: number
    bids: [][]
    asks: [][]
}

export interface responseFromApiCoinbase {
    lastUpdateId: number
    bids: [][]
    asks: [][]
    auction_mode: boolean
    auction: string
}

export interface responseFromApiCrypto {
    code: number
    method: string
    result: {
        instrument_name: string
        depth: number
        data: [
            {
                bids: [][]
                asks: [][]
                t: number
                s: number
            }
        ]
    }
}

export interface prepareResponseAPI {
    usdAmount: number
    exchange: string
}

export interface responseAPI {
    btcAmount: string
    usdAmount: string
    exchange: string
}