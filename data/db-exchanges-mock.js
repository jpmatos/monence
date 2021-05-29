const fs = require('fs').promises
const path = require('path')

const currencies = ['USD', 'EUR', 'GBP']

class DataBaseExchangesMock {
    constructor() {
        this.readFile(path.join(__dirname, '/mock-data/exchanges.json'))
            .then(res => {
                Object.keys(res.rates).forEach((key) => currencies.includes(key) || delete res.rates[key]);
                this.exchanges = []
                this.exchanges.push({base: res.base, rates: res.rates})
                Object.keys(res.rates).forEach((currency) => {
                    if (currency === res.base)
                        return
                    const aux = 1 / res.rates[currency]
                    const rates = {}
                    Object.keys(res.rates).forEach((curr) => {
                        rates[curr] = Math.round((aux * res.rates[curr]) * 1e6) / 1e6
                    })
                    this.exchanges.push({base: currency, rates: rates})
                });
            })
    }

    static init(){
        return new DataBaseExchangesMock()
    }

    getExchanges() {
        return Promise.resolve(this.exchanges)
    }

    readFile(filePath) {
        return fs
            .readFile(filePath)
            .then(rawData => {
                return JSON.parse(rawData)
            })
            .catch(err => {
                return {
                    'message': `Could not find mock file in path ${filePath}`,
                    'status': 404,
                    'err': err
                }
            })
    }
}

module.exports = DataBaseExchangesMock