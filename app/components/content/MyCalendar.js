import React from 'react'
import moment from 'moment'

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
import ViewItemFormDialog from '../forms/ViewItemFormDialog'
import {CalendarContext} from '../context/CalendarContext'
import Typography from "@material-ui/core/Typography";
import axios from "axios";

moment.locale('en')
const localizer = momentLocalizer(moment)

class MyCalendar extends React.Component {
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

    handleAdvanceMonth = (event) => {
        event.stopPropagation()
        this.context.offsetCalendarDate(1)
        this.forceUpdate()
    }

    handleRecedeMonth = (event) => {
        event.stopPropagation()
        this.context.offsetCalendarDate(-1)
        // this.forceUpdate()
    }

    handleDateChange = (event) => {
        this.context.setCalendarDate(event)
        // this.forceUpdate()
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

    getRecurrentDates = (itemId) => {
        const res = this.context.calendar.recurrent.find(item => item.id === itemId)
        return {start: res.start, end: res.end}
    }

    handleNewItem = (item, cb) => {
        axios.post(`/calendar/${this.context.calendarId}/item/${item.recurrency}`, item)
            .then(resp => {
                this.context.handleNewItem(resp.data)
                cb()
            })
            .catch(err => {
                cb()
            })
    }

    handleUpdateItem = (itemId, recurrency, item, cb) => {
        axios.put(`/calendar/${this.context.calendarId}/item/${recurrency}/${itemId}`, item)
            .then(resp => {
                this.context.handleUpdateItem(resp.data)
                cb()
            })
            .catch(err => {
                cb()
            })

    }

    handleDeleteItem = (itemId, recurrency, cb) => {
        axios.delete(`/calendar/${this.context.calendarId}/item/${recurrency}/${itemId}`)
            .then(resp => {
                this.context.handleDeleteItem(itemId)  //TODO Change to response from id
                cb()
            })
            .catch(err => {
                cb()
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
                display: 'block',
            }
        };
    }

    render() {
        return (
            <Container style={{height: 800}}>
                <Typography variant='h4' align='center'>
                    {moment(this.context.calendarDate).format("MMMM YYYY")}
                </Typography>
                <Calendar
                    localizer={localizer}
                    date={moment(this.context.calendarDate).toDate()}
                    events={this.context.items}
                    startAccessor='start'
                    components={{
                        event: (event) => (
                            <div>
                                <strong>{event.event.title}</strong>
                                <span style={{
                                    float: 'right'
                                }}>
                                    {event.event.value}€
                                </span>
                            </div>
                        )
                    }}
                    views={['month']}
                    endAccessor='end'
                    onSelectEvent={this.onClickItem}
                    eventPropGetter={this.eventStyleGetter}
                    toolbar={false}
                    onNavigate={() => {
                    }}
                />
                <FloatingActionButton date={this.context.calendarDate}
                                      handleOnClickFAB={this.handleClickOpen}
                                      handleDateChange={this.handleDateChange}
                                      handleAdvanceMonth={this.handleAdvanceMonth}
                                      handleRecedeMonth={this.handleRecedeMonth}/>
                <CreateItemFormDialog isOpen={this.state.isNewItemFDOpen} setOpen={this.setNewItemFD}
                                      handleNewItem={this.handleNewItem}/>
                <ViewItemFormDialog isOpen={this.state.isItemFDOpen} setOpen={this.setItemFD}
                                    currentlyOpenItem={this.state.currentlyOpenItem}
                                    getRecurrentDates={this.getRecurrentDates}
                                    handleUpdateItem={this.handleUpdateItem}
                                    handleDeleteItem={this.handleDeleteItem}/>
            </Container>
        )
    }
}

MyCalendar.contextType = CalendarContext

export default MyCalendar