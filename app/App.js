import React from "react";
import MyNavbar from './components/content/MyNavbar'
import {CalendarContext} from "./components/context/CalendarContext";
import './App.css'
import axios from "axios";
import moment from "moment";
import {UserContext} from "./components/context/UserContext";
import * as qs from "qs";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            calendar: null,
            calendarId: null,
            calendarDate: null,
            items: null,
            currency: null,
            setCalendarId: this.setCalendarId,
            setCalendarDate: this.setCalendarDate,
            setCurrency: this.setCurrency,
            offsetCalendarDate: this.offsetCalendarDate,
            handleNewItem: this.handleNewItem,
            handleUpdateItem: this.handleUpdateItem,
            handleDeleteItem: this.handleDeleteItem,
            handleNewBudget: this.handleNewBudget,
            handleUpdateBudget: this.handleUpdateBudget,
            handleDeleteBudget: this.handleDeleteBudget,
            buildDisplayValue: this.buildDisplayValue
        }
    }

    setCalendarId = (id) => {
        this.setState({
            calendarId: id
        })
    }

    setCurrency = (currency) => {
        const items = this.state.items.map(item => {
            item.displayValue = this.buildDisplayValue(item.value, currency)
            return item
        })
        this.setState({
            items: items,
            currency: currency
        })
    }

    offsetCalendarDate = (offset) => {
        const calendarDate = moment(this.state.calendarDate).add(offset, 'month')
        this.setState({calendarDate: calendarDate})
        return calendarDate
    }

    setCalendarDate = (date) => {
        const calendarDate = moment(date)
        this.setState({calendarDate: calendarDate})
        return calendarDate
    }

    handleNewItem = (item) => {
        const calendar = this.state.calendar
        calendar[item.recurrency].push(Object.assign({}, item))
        this.setState({
            calendar: calendar
        })

        if (item.recurrency === 'recurrent') {
            let items = this.state.items.concat(this.buildRecurrentItem(item))
            this.setState({items: items})
        } else {
            let items = this.state.items
            items.push(this.buildSingleItem(item))
            this.setState({items: items})
        }
    }

    handleUpdateItem = (item) => {
        const calendar = this.state.calendar
        calendar[item.recurrency] = calendar[item.recurrency].filter(it => it.id !== item.id)
        calendar[item.recurrency].push(Object.assign({}, item))
        this.setState({
            calendar: calendar
        })

        if (item.recurrency === 'recurrent') {
            const newItems = this.buildRecurrentItem(item)
            let items = this.state.items.filter(i => i.id !== item.id).concat(newItems)
            this.setState({items: items})
        } else {
            let items = this.state.items
            const itemIdx = items.findIndex(i => i.id === item.id)
            if (itemIdx !== -1) {
                items[itemIdx] = this.buildSingleItem(item)
            }
            this.setState({items: items})
        }
    }

    handleDeleteItem = (id) => {
        let calendar = this.state.calendar
        calendar.single = calendar.single.filter(it => it.id !== id)
        calendar.recurrent = calendar.recurrent.filter(it => it.id !== id)
        this.setState({
            calendar: calendar
        })

        let items = this.state.items.filter(it => it.id !== id)
        this.setState({items: items})
    }

    handleNewBudget = (budget) => {
        let calendar = this.state.calendar
        calendar.budget[budget.period].push(budget)
        this.setState({
            calendar: calendar
        })
    }

    handleUpdateBudget = (budget) => {
        let calendar = this.state.calendar
        const idx = calendar.budget[budget.period].findIndex(i => i.id === budget.id)
        calendar.budget[budget.period][idx] = budget
        this.setState({
            calendar: calendar
        })
    }

    handleDeleteBudget = (id, period) => {
        let calendar = this.state.calendar
        const idx = calendar.budget[period].findIndex(i => i.id === id)
        calendar.budget[period].splice(idx, 1)
        this.setState({
            calendar: calendar
        })
    }

    buildSingleItem(item, currency) {
        currency = currency ?? this.state.currency
        let current = Object.assign({}, item)
        current.allDay = true
        current.start = moment(item.start)
        current.end = moment(item.start)
        current.displayValue = this.buildDisplayValue(current.value, currency)
        return current
    }

    buildRecurrentItem(item, currency) {
        currency = currency ?? this.state.currency
        let res = []
        let current = Object.assign({}, item)
        let period = current.recurrencyPeriod

        current.allDay = true
        let newDate = moment(current.start)
        const endDate = moment(current.end).add(1, 'day')
        do {
            current.start = newDate.clone()
            current.end = newDate.clone()
            current.displayValue = this.buildDisplayValue(current.value, currency)
            res.push(Object.assign({}, current))
            newDate = newDate.add(1, period)
        } while (newDate.isBefore(endDate))
        return res
    }

    buildDisplayValue = (value, currency) => {
        currency = currency ?? this.state.currency

        if(this.state.calendar !== null && currency !== this.state.calendar.currency){
            const rate = this.state.calendar.exchanges.find(exc => exc.base === this.state.calendar.currency).rates[currency]
            value = value * rate
        }

        switch (currency) {
            case 'EUR':
                return `${value.toFixed(2)}€`
            case 'USD':
                return `$${value.toFixed(2)}`
            default:
                return `${value}`
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.calendarId !== this.state.calendarId && prevState.calendarId !== null) {
            axios.get(`/calendar/${this.state.calendarId}`)
                .then(res => {
                    const calendar = res.data

                    let items = calendar.single.slice().map(item => {
                        return this.buildSingleItem(item, calendar.currency)
                    })

                    calendar.recurrent.forEach((item) => {
                        items = items.concat(this.buildRecurrentItem(item, calendar.currency))
                    })

                    this.setState({
                        calendarId: this.state.calendarId,
                        calendar: calendar,
                        items: items,
                        currency: calendar.currency
                    })
                })
                .catch()    //TODO
        }
    }

    componentDidMount() {
        //Read id from query string
        let calendarId = new URL(`https://1.com?${window.location.href.split("?")[1]}`).searchParams.get("c")

        //If one wasn't specified, read first calendar in calendars array
        if (calendarId === undefined || calendarId === null) {
            calendarId = this.context.calendars[0].id
        }
        axios.get(`/calendar/${calendarId}`)
            .then(res => {
                const calendar = res.data

                let items = calendar.single.slice().map(item => {
                    return this.buildSingleItem(item, calendar.currency)
                })

                calendar.recurrent.forEach((item) => {
                    items = items.concat(this.buildRecurrentItem(item, calendar.currency))
                })

                this.setState({
                    calendarId: calendarId,
                    calendar: calendar,
                    items: items,
                    currency: calendar.currency
                })
            })
            .catch()    //TODO
        this.setState({
            calendarDate: moment.now()
        })
    }


    ///TODO Show a loading screen instead of null
    render() {
        return (
            <CalendarContext.Provider value={this.state}>
                {this.state.calendar !== null ? <MyNavbar/> : null}
            </CalendarContext.Provider>
        )
    };
}

App.contextType = UserContext

export default App;
