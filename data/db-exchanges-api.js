const fs = require('fs').promises
const axios = require('axios')

const currencies = ['USD', 'EUR', 'GBP']

class DataBaseExchangesApi {
    constructor() {
        axios.get(`https://openexchangerates.org/api/latest.json?app_id=${process.env.OER_ID}`)
            .then(res => {
                res = res.data
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
        return new DataBaseExchangesApi()
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

module.exports = DataBaseExchangesApi