
function buildCurrencyDisplay(value, currency) {
    switch (currency) {
        case 'EUR':
            return `${value.toFixed(2)}€`
        case 'USD':
            return `$${value.toFixed(2)}`
        case 'GBP':
            return `£${value.toFixed(2)}`
        case 'JPY':
            return `JP¥${value.toFixed(0)}`
        default:
            return `${value}`
    }
}

export default buildCurrencyDisplay