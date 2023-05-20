export const ORDER_BOOK_BTCUSDT = {
    binance: {
        name: 'binance',
        api_path: 'https://api.binance.com/api/v3/depth?symbol=BTCUSDT'
    },
    coinbase: {
        name: 'coinbase',
        api_path: 'https://api.exchange.coinbase.com/products/BTC-USDT/book?level=2'
    },
    crypto: {
        name: 'crypto.com',
        api_path: 'https://api.crypto.com/v2/public/get-book?instrument_name=BTC_USDT&depth=150'
    }
}

export const NOT_ENOUGH_ORDER_BOOKS = -1