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
            setCalendarDate: this.setCalendarDate,
            offsetCalendarDate: this.offsetCalendarDate,
            handleNewItem: this.handleNewItem,
            handleUpdateItem: this.handleUpdateItem,
            handleDeleteItem: this.handleDeleteItem,
            handleNewBudget: this.handleNewBudget,
            handleUpdateBudget: this.handleUpdateBudget,
            handleDeleteBudget: this.handleDeleteBudget
        }
    }

    offsetCalendarDate = (offset) => {
        const calendarDate = moment(this.state.calendarDate).add(offset, 'month')
        this.setState({calendarDate: calendarDate})
        return calendarDate
    }

    setCalendarDate = (date) => {
        this.setState({calendarDate: moment(date)})
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

        let items = this.state.items
        const itemIdx = items.findIndex(i => i.id === id)
        if (itemIdx !== -1) {
            items.splice(itemIdx, 1)
            this.setState({items: items})
        }
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

    buildSingleItem(item) {
        let current = Object.assign({}, item)
        current.allDay = true
        current.start = moment(item.start)
        current.end = moment(item.start)
        return current
    }

    buildRecurrentItem(item) {
        let res = []
        let current = Object.assign({}, item)
        let period = 'month'
        switch (current.recurrencyPeriod) {
            case 'weekly':
                period = 'week'
                break
            case 'monthly':
                period = 'month'
                break
            case 'yearly':
                period = 'year'
                break
        }

        current.allDay = true
        let newDate = moment(current.start)
        const endDate = moment(current.end).add(1, 'day')
        do {
            current.start = newDate.clone()
            current.end = newDate.clone()
            res.push(Object.assign({}, current))
            newDate = newDate.add(1, period)
        } while (newDate.isBefore(endDate))
        return res
    }

    componentDidMount() {
        //Read id from query string
        let calendarId = new URL(`https://1.com?${window.location.href.split("?")[1]}`).searchParams.get("c")

        //If one wasn't specified, read first calendar in calendars array
        if(calendarId === undefined || calendarId === null){
            calendarId = this.context.calendars[0].id
            // const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?c=${calendarId}`;
            // window.history.replaceState({path: newUrl}, '', newUrl)
        }

        if (this.state.calendar === null)       //TODO or if Ids don't match
            axios.get(`/calendar/${calendarId}`)
                .then(res => {
                    const calendar = res.data

                    let items = calendar.single.slice().map(item => {
                        return this.buildSingleItem(item)
                    })

                    calendar.recurrent.forEach((item) => {
                        items = items.concat(this.buildRecurrentItem(item))
                    })

                    this.setState({
                        calendarId: calendarId,
                        calendar: calendar,
                        items: items
                    })
                })
                .catch()    //TODO
        if (this.state.calendarDate === null)
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
