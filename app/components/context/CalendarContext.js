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

    calendar.recurrent.forEach((item) => {
        items = items.concat(buildRecurrentItem(item))
    })
    return items
}

function handleNewItem(item) {
    calendar[item.recurrency].push(Object.assign({}, item))

    if (item.recurrency === 'recurrent') {
        items = items.concat(buildRecurrentItem(item))
    } else {
        item.allDay = true
        item.end = item.start
        items.push(item)
    }
}

function handleUpdateItem(item) {
    calendar[item.recurrency] = calendar[item.recurrency].filter(it => it.id !== item.id)
    calendar[item.recurrency].push(Object.assign({}, item))

    if (item.recurrency === 'recurrent') {
        const newItems = buildRecurrentItem(item)
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

function handleDeleteItem(id) {
    calendar.single = calendar.single.filter(it => it.id !== id)
    calendar.recurrent = calendar.recurrent.filter(it => it.id !== id)

    const itemIdx = items.findIndex(i => i.id === id)
    if (itemIdx !== -1)
        items.splice(itemIdx, 1)
}

function buildRecurrentItem(item) {
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
    let newDate = moment(current.start).clone()
    const endDate = moment(current.end).clone().add(1, 'day')
    do {
        current.start = newDate.clone().toDate()
        current.end = newDate.clone().toDate()
        res.push(Object.assign({}, current))
        newDate = newDate.add(1, period)
    } while (newDate.isBefore(endDate))
    return res
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

export const value = {
    setCalendar: setCalendar,
    getCalendar: getCalendar,
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
