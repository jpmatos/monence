import React from 'react';
import axios from "axios";
import moment from "moment";

const CalendarContext = React.createContext(undefined);

let calendar = null;
let calendarId = null;
let items = null;       //This will be referenced in events prop of ReactBigCalendar
let calendarDate = null;

function getCalendar() {
    if (calendar === null)
        return axios.get(`/calendar/${calendarId}`)
            .then(res => {
                return calendar = res.data
            })
            .catch()    //TODO
    else
        return Promise.resolve(calendar)
}

function setCalendar(id) {
    calendarId = id
}

function getRecurrentDates(id) {
    const res = calendar.recurrent.find(item => item.id === id)
    return {start: res.start, end: res.end}
}

function getItems() {
    if (items !== null)
        return items

    items = calendar.single.slice()
    items.forEach(item => {
        item.allDay = true
        item.end = item.start
    })

    let period = 'month'
    calendar.recurrent.forEach((it) => {
        let item = Object.assign({}, it)
        switch (item.recurrencyPeriod) {
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

        item.allDay = true
        let newDate = moment(item.start)
        const endDate = moment(item.end)
        do {
            item.start = newDate.clone().toDate()
            item.end = newDate.clone().toDate()
            items.push(Object.assign({}, item))
            newDate = newDate.add(1, period)
        } while (newDate.isBefore(endDate.add(1, 'day')))
    })
    return items
}

function renderItems() {
}

function handleNewItem(item) {
    calendar[item.recurrency].push(Object.assign({}, item))

    if (item.recurrency === 'single') {
        item.allDay = true
        item.end = item.start
        items.push(item)
    }
    if (item.recurrency === 'recurrent') {
        let period = 'month'
        switch (item.recurrencyPeriod) {
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

        item.allDay = true
        let newItems = []
        let newDate = moment(item.start)
        const endDate = moment(item.end)
        do {
            item.start = newDate.clone().toDate()
            item.end = newDate.clone().toDate()
            newItems.push(Object.assign({}, item))
            newDate = newDate.add(1, period)
        } while (newDate.isBefore(endDate.add(1, 'day')))
        items = items.concat(newItems)
    }
}

function handleUpdateItem(item) {
    calendar[item.recurrency] = calendar[item.recurrency].filter(it => it.id !== item.id)
    calendar[item.recurrency].push(Object.assign({}, item))

    if (item.recurrency === 'recurrent') {
        let period = 'month'
        switch (item.recurrencyPeriod) {
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

        item.allDay = true
        let newItems = []
        let newDate = moment(item.start)
        const endDate = moment(item.end)
        do {
            item.start = newDate.clone().toDate()
            item.end = newDate.clone().toDate()
            newItems.push(Object.assign({}, item))
            newDate = newDate.add(1, period)
        } while (newDate.isBefore(endDate.add(1, 'day')))

        items = items.filter(i => i.id !== item.id).concat(newItems)
    } else {
        const itemIdx = items.findIndex(i => i.id === item.id)
        if (itemIdx !== -1) {
            item.allDay = true
            item.end = item.start
            items[itemIdx] = item
        }
    }
}

function getCalendarDate(){
    if (calendarDate !== null)
        return calendarDate
    return calendarDate = moment(moment.now()).toDate()
}

function setCalendarDateMonth(offset){
    calendarDate = moment(calendarDate).add(offset, 'month').toDate()
}

function setCalendarDate(date){
    calendarDate = date
}

function handleDeleteItem(id) {
    calendar.single = calendar.single.filter(it => it.id !== id)
    calendar.recurrent = calendar.recurrent.filter(it => it.id !== id)

    const itemIdx = items.findIndex(i => i.id === id)
    if (itemIdx !== -1)
        items.splice(itemIdx, 1)
}

export const value = {
    setCalendar: setCalendar,
    getCalendar: getCalendar,
    renderItems: renderItems,
    getItems: getItems,
    getRecurrentDates: getRecurrentDates,
    handleNewItem: handleNewItem,
    handleUpdateItem: handleUpdateItem,
    handleDeleteItem: handleDeleteItem,
    setCalendarDate: setCalendarDate,
    getCalendarDate: getCalendarDate,
    setCalendarDateMonth: setCalendarDateMonth
}

export default CalendarContext;
