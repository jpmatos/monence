import React from 'react'
import moment from 'moment'
import axios from 'axios'

import Container from '@material-ui/core/Container'

import {Calendar} from 'react-big-calendar'
import {momentLocalizer} from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import {red} from '@material-ui/core/colors';
import {green} from '@material-ui/core/colors';
import {yellow} from '@material-ui/core/colors';
import {blue} from '@material-ui/core/colors';

import FloatingActionButton from '../FloatingActionButton'
import CreateItemFormDialog from '../forms/CreateItemFormDialog'
import UpdateItemFormDialog from '../forms/UpdateItemFormDialog'

moment.locale('en')
const localizer = momentLocalizer(moment)

export default class MyCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isNewItemFDOpen: false,
            isItemFDOpen: false,
            items: [],
            currentlyOpenItem: {}
        }
    }

    handleClickOpen = () => {
        this.setState({isNewItemFDOpen: true})
    }
    handleNewItem = (item) => {
        if (item.recurrency === 'single') {
            item.allDay = true
            item.end = item.start
            this.state.items.push(item)
        }
        if (item.recurrency === 'recurrent') {
            let period = 'month'
            switch (item.recurrencyPeriod){
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
            do{
                item.start = newDate.clone().toDate()
                item.end = newDate.clone().toDate()
                newItems.push(Object.assign({}, item))
                newDate = newDate.add(1, period)
            } while (newDate.isBefore(endDate.add(1, 'day')))
            this.state.items = this.state.items.concat(newItems)
        }
    }
    handleDeleteItem = (id) => {
        const itemIdx = this.state.items.findIndex(i => i.id === id)
        if (itemIdx !== -1)
            this.state.items.splice(itemIdx, 1)
    }
    handleUpdateItem = (item) => {
        const itemIdx = this.state.items.findIndex(i => i.id === item.id)
        if (itemIdx !== -1)
            this.state.items[itemIdx] = item
    }

    onClickItem = (item) => {
        this.setState({
            currentlyOpenItem: item,
            isItemFDOpen: true
        })
    }

    setNewItemFD = (event) => {
        this.setState({isNewItemFDOpen: event})
    }

    setItemFD = (event) => {
        this.setState({isItemFDOpen: event})
    }

    componentDidMount() {
        //Disable calendar
        axios.get('/calendar/01')
            .then(res => {
                const calendar = res.data
                let items = calendar.expenses.concat(calendar.gains)
                items.forEach(item => {
                    item.allDay = true
                    item.end = item.start
                })
                calendar.recurrentExpenses.concat(calendar.recurrentGains).forEach((item) => {
                    let period = 'month'
                    switch (item.recurrencyPeriod){
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
                    do{
                        item.start = newDate.clone().toDate()
                        item.end = newDate.clone().toDate()
                        items.push(Object.assign({}, item))
                        newDate = newDate.add(1, period)
                    } while (newDate.isBefore(endDate.add(1, 'day')))
                })

                this.setState({items: items})       //TODO make this global
                //Enable
            })
            .catch(err => {
                //Inform user server did not respond
            })
    }

    eventStyleGetter(event, start, end, isSelected) {
        let backgroundColor = '#' + event.hexColor;
        switch (event.type + ' ' + event.recurrency) {
            case 'expense single':
                backgroundColor = red[500]
                break
            case 'gain single':
                backgroundColor = green[500]
                break
            case 'expense recurrent':
                backgroundColor = yellow[700]
                break
            case 'gain recurrent':
                backgroundColor = blue[700]
                break
        }
        return {
            style: {
                backgroundColor: backgroundColor,
                borderRadius: '0px',
                opacity: 0.8,
                border: '0px',
                display: 'block'
            }
        };
    }

    render() {
        return (
            <Container style={{height: 800}}>
                <Calendar
                    localizer={localizer}
                    events={this.state.items}
                    startAccessor='start'
                    endAccessor='end'
                    onSelectEvent={this.onClickItem}
                    eventPropGetter={this.eventStyleGetter}
                />
                <FloatingActionButton handleOnClickFAB={this.handleClickOpen}/>
                <CreateItemFormDialog isOpen={this.state.isNewItemFDOpen} setOpen={this.setNewItemFD}
                                      handleNewItem={this.handleNewItem}/>
                <UpdateItemFormDialog isOpen={this.state.isItemFDOpen} setOpen={this.setItemFD}
                                      currentlyOpenItem={this.state.currentlyOpenItem}
                                      handleDeleteItem={this.handleDeleteItem}
                                      handleUpdateItem={this.handleUpdateItem}/>
            </Container>
        )
    }
}