import React from 'react'

class CurrencyOptions extends React.Component {
    render() {
        return (
            <React.Fragment>
                {process.env.REACT_APP_CURRENCIES.split(',').map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                ))}
            </React.Fragment>
        );
    }
}

export default CurrencyOptions