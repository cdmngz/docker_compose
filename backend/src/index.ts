import express from 'express'
import exchangeRouting from './routes/exchangeRouting'

const app = express()
const PORT = 4000

app.use(express.json())

app.use('/exchange-routing', exchangeRouting)

app.listen(PORT, () => {
    console.log(`server running on port ${PORT} at time ${new Date()}`);
})