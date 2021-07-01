import {blue, green, red, yellow} from '@material-ui/core/colors';
import Container from '@material-ui/core/Container'
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import moment from 'moment'
import React from 'react'
import {Calendar, momentLocalizer} from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import FloatingActionButton from '../components/FloatingActionButton'
import CreateItemFormDialog from '../components/forms/CreateItemFormDialog'
import ViewItemFormDialog from '../components/forms/ViewItemFormDialog'
import {CalendarContext} from '../context/default/CalendarContext'

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
        this.context.offsetCalendarDate(1)
    }

    handleRecedeMonth = (event) => {
        this.context.offsetCalendarDate(-1)
    }

    handleDateChange = (event) => {
        this.context.setCalendarDate(event)
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

    handleNewItem = (item) => {
        return axios.post(`/calendar/${this.context.calendarId}/item/${item.recurrency}`, item)
            .then(res => {
                this.context.handleNewItem(res.data.body)
                this.props.sendSuccessSnack(`Created item '${res.data.body.title}'!`)
            })
            .catch(err => {
                this.props.sendErrorSnack('Failed to create item!', err)
                console.debug(err.stack)
            })
    }

    handleUpdateItem = (itemId, recurrency, item) => {
        return axios.put(`/calendar/${this.context.calendarId}/item/${recurrency}/${itemId}`, item)
            .then(res => {
                this.context.handleUpdateItem(res.data.body)
                this.props.sendSuccessSnack(`Updated item '${res.data.body.title}'!`)
            })
            .catch(err => {
                this.props.sendErrorSnack('Failed to update item!', err)
                console.debug(err.stack)
            })

    }

    handleDeleteItem = (itemId, recurrency) => {
        axios.delete(`/calendar/${this.context.calendarId}/item/${recurrency}/${itemId}`)
            .then(res => {
                this.context.handleDeleteItem(itemId)  //TODO Change to response from id
                this.props.sendSuccessSnack(`Deleted item!`)
            })
            .catch(err => {
                this.props.sendErrorSnack('Failed to delete item!', err)
                console.debug(err.stack)
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
                                    {event.event.displayValue}
                                </span>
                            </div>
                        ),
                        month: {
                            dateHeader: (event) => (<div>{event.label}</div>)
                        }
                    }}
                    views={['month', 'day']}
                    endAccessor='end'
                    onSelectEvent={this.onClickItem}
                    eventPropGetter={this.eventStyleGetter}
                    toolbar={false}
                    onNavigate={() => {
                    }}
                />
                <FloatingActionButton date={this.context.calendarDate}
                                      canEdit={this.context.canEdit()}
                                      handleOnClickFAB={this.handleClickOpen}
                                      handleDateChange={this.handleDateChange}
                                      handleAdvanceMonth={this.handleAdvanceMonth}
                                      handleRecedeMonth={this.handleRecedeMonth}
                                      handleCurrencyChange={() => {
                                      }}/>
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