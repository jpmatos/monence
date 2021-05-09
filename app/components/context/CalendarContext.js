import React from 'react';
import axios from "axios";
import moment from "moment";

const CalendarContext = React.createContext(undefined);

let calendar = null;
let calendarId = null;
let items = null;       //This will be referenced in events prop of ReactBigCalendar

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
    //TODO add item to calendar

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
    //TODO add item to calendar

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

function handleDeleteItem(id) {
    //TODO delete item from calendar

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
    handleDeleteItem: handleDeleteItem
}

export default CalendarContext;
