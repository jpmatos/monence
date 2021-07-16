import axios from "axios";
import moment from "moment";
import React from "react";
import LoadingScreen from "../components/LoadingScreen";
import buildCurrencyDisplay from "../util/currency";
import {CalendarContext} from "./default/CalendarContext";
import {UserContext} from "./default/UserContext";
import SocketBinder from "./SocketBinder";

class CalendarContextBinder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            calendarId: null,
            calendar: null,
            calendarDate: null,
            items: null,
            currency: null,
            activeUsers: [],
            isOwner: this.isOwner,
            canEdit: this.canEdit,
            setCalendarId: this.setCalendarId,
            setCalendarDate: this.setCalendarDate,
            setCurrency: this.setCurrency,
            setActiveUsers: this.setActiveUsers,
            handleUserLeft: this.handleUserLeft,
            handleNewUser: this.handleNewUser,
            offsetCalendarDate: this.offsetCalendarDate,
            handleNewItem: this.handleNewItem,
            handleUpdateItem: this.handleUpdateItem,
            handleDeleteItem: this.handleDeleteItem,
            handleNewBudget: this.handleNewBudget,
            handleUpdateBudget: this.handleUpdateBudget,
            handleDeleteBudget: this.handleDeleteBudget,
            buildDisplayValue: this.buildDisplayValue,
            setCalendarShare: this.setCalendarShare,
            setCalendarUnshare: this.setCalendarUnshare,
            handleRemoveParticipant: this.handleRemoveParticipant,
            handleRefreshParticipants: this.handleRefreshParticipants,
            handleNewParticipant: this.handleNewParticipant,
            handleChangeRole: this.handleChangeRole,
            handleLeaveCalendar: this.handleLeaveCalendar,
            handleDeleteCalendar: this.handleDeleteCalendar
        }
    }

    setCalendarId = (id) => {
        this.setState({
            calendarId: id
        })
    }

    isOwner = (calendar) => {
        if (calendar)
            return this.context.user.id === calendar.owner.ownerId
        else
            return this.context.user.id === this.state.calendar.owner.ownerId
    }

    isShared = (calendar) => {
        if (calendar)
            return calendar.share === 'Shared'
        else
            return this.state.calendar.share === 'Shared'
    }

    canEdit = () => {
        if (this.context.user.id === this.state.calendar.owner.ownerId)
            return true

        const idx = this.state.calendar.participants.findIndex(par => par.id === this.context.user.id)
        if (idx !== -1)
            return this.state.calendar.participants[idx].role === 'Editor'

        return false
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

    setCalendarShare = () => {
        return axios.put(`/calendar/${this.state.calendarId}/share`)
            .then(res => {
                const calendar = this.state.calendar
                calendar.share = 'Shared'
                calendar.participants = []
                this.setState({
                    calendar: calendar
                })
            })
    }

    setCalendarUnshare = () => {
        return axios.put(`/calendar/${this.state.calendarId}/unshare`)
            .then(res => {
                const calendar = this.state.calendar
                calendar.share = 'Personal'
                calendar.participants = []
                this.setState({
                    calendar: calendar
                })
            })
    }

    setActiveUsers = (users) => {
        this.setState({
            activeUsers: users
        })
    }

    handleUserLeft = (userId) => {
        const activeUsers = this.state.activeUsers.filter(user => user.id !== userId)
        this.setState({
            activeUsers: activeUsers
        })
    }

    handleNewUser = (user) => {
        const activeUsers = this.state.activeUsers
        activeUsers.push(user)
        this.setState({
            activeUsers: activeUsers
        })
    }

    handleRemoveParticipant = (participantId) => {
        const calendar = this.state.calendar
        calendar.participants = calendar.participants.filter(participant => participant.id !== participantId)
        this.setState({
            calendar: calendar
        })
    }

    handleRefreshParticipants = () => {
        return axios.get(`/calendar/${this.state.calendarId}/participants`)
            .then(res => {
                const participants = res.data.body

                const calendar = this.state.calendar
                calendar.participants = participants
                this.setState({
                    calendar: calendar
                })
            })
    }

    handleNewParticipant = (participant) => {
        const calendar = this.state.calendar
        calendar.participants.push(participant)
        this.setState({
            calendar: calendar
        })
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
        calendar.budget.push(budget)
        this.setState({
            calendar: calendar
        })
    }

    handleUpdateBudget = (budget) => {
        let calendar = this.state.calendar
        const idx = calendar.budget.findIndex(i => i.id === budget.id)
        calendar.budget[idx] = budget
        this.setState({
            calendar: calendar
        })
    }

    handleDeleteBudget = (id) => {
        let calendar = this.state.calendar
        const idx = calendar.budget.findIndex(i => i.id === id)
        calendar.budget.splice(idx, 1)
        this.setState({
            calendar: calendar
        })
    }

    handleChangeRole = participant => {
        const calendar = this.state.calendar
        calendar.participants = calendar.participants.filter(par => par.id !== participant.id)
        calendar.participants.push(participant)
        this.setState({
            calendar: calendar
        })
    }

    handleLeaveCalendar = () => {
        const oldCalendarId = this.state.calendarId
        this.context.handleLeaveCalendar(oldCalendarId)

        const calendarId = this.context.user.calendars[0].id;
        this.setState({
            calendarId: calendarId
        })

        return calendarId
    }

    handleDeleteCalendar = () => {
        return axios.delete(`/calendar/${this.state.calendarId}`)
            .then(res => {
                const oldCalendarId = this.state.calendarId
                const newCalendarId = this.context.handleDeleteCalendar(oldCalendarId)

                this.setState({
                    calendarId: newCalendarId
                })
            })
    }

    buildSingleItem(item, currency, ignoreExchange) {
        currency = currency ?? this.state.currency
        let current = Object.assign({}, item)
        current.allDay = true
        current.start = moment(item.start)
        current.end = moment(item.start)
        current.displayValue = this.buildDisplayValue(current.value, currency, ignoreExchange)
        return current
    }

    buildRecurrentItem(item, currency, ignoreExchange) {
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
            current.displayValue = this.buildDisplayValue(current.value, currency, ignoreExchange)
            res.push(Object.assign({}, current))
            newDate = newDate.add(1, period)
        } while (newDate.isBefore(endDate))
        return res
    }

    buildDisplayValue = (value, currency = this.state.currency, ignoreExchange = false) => {

        if (this.state.calendar !== null && currency !== this.state.calendar.currency && !ignoreExchange) {
            const rate = this.state.calendar.exchanges.find(exc => exc.base === this.state.calendar.currency).rates[currency]
            value = value * rate
        }

        return buildCurrencyDisplay(value, currency)
    }

    getCalendar(calendarId, ignoreExchange) {
        return axios.get(`/calendar/${calendarId}`)
            .then(res => {
                const calendar = res.data.body

                let items = calendar.single.slice().map(item => {
                    return this.buildSingleItem(item, calendar.currency, ignoreExchange)
                })

                calendar.recurrent.forEach((item) => {
                    items = items.concat(this.buildRecurrentItem(item, calendar.currency, ignoreExchange))
                })

                this.setState({
                    calendarId: calendarId,
                    calendar: calendar,
                    items: items,
                    currency: calendar.currency
                })

                return calendar
            })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.calendarId !== this.state.calendarId && prevState.calendarId !== null) {
            this.getCalendar(this.state.calendarId, true)
                .then(calendar => {
                    const calendarId = calendar.id
                    window.history.replaceState(null, '', window.location.href.split('?')[0] + '?c=' + calendarId)
                    if (this.isOwner(calendar) && this.isShared(calendar))
                        return this.props.handleRefreshSentInvites(calendarId)
                    else
                        this.props.clearSentInvites()
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    componentDidMount() {
        //Read id from query string
        let calendarId = new URL(`https://1.com?${window.location.href.split("?")[1]}`).searchParams.get("c")

        //If one wasn't specified, read first calendar in calendars array
        if (calendarId === undefined || calendarId === null) {
            calendarId = this.context.user.calendars[0].id
        }

        this.setState({
            calendarDate: moment.now()
        })

        this.getCalendar(calendarId, false)
            .catch(err => {
                if (err.response.status === 404) {
                    const calendarId = this.context.user.calendars[0].id
                    return this.getCalendar(calendarId, true)

                } else {
                    console.log(err)
                }
            })
            .then(calendar => {
                const calendarId = calendar.id
                if (calendarId) {
                    window.history.replaceState(null, '', window.location.href.split('?')[0] + '?c=' + calendarId)
                    if (this.isOwner(calendar) && this.isShared(calendar))
                        return this.props.handleRefreshSentInvites(calendarId)
                    else
                        this.props.clearSentInvites()
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {
        return (
            <CalendarContext.Provider value={this.state}>
                {this.state.calendar !== null ?
                    <SocketBinder/> :
                    <LoadingScreen/>}
            </CalendarContext.Provider>
        )
    };
}

CalendarContextBinder.contextType = UserContext

export default CalendarContextBinder;
