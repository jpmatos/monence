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
import UpdateItemFormDialog from '../forms/UpdateItemFormDialog'
import CalendarContext from '../context/CalendarContext'
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

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
        this.context.setCalendarDateMonth(1)
        this.forceUpdate()
    }

    handleRecedeMonth = (event) => {
        event.stopPropagation()
        this.context.setCalendarDateMonth(-1)
        this.forceUpdate()
    }

    handleDateChange = (event) => {
        this.context.setCalendarDate(event)
        this.forceUpdate()
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
                <Typography variant='h4' align='center'>
                    {moment(this.context.getCalendarDate()).format("MMMM YYYY")}
                </Typography>
                <Calendar
                    localizer={localizer}
                    date={this.context.getCalendarDate()}
                    events={this.context.getItems()}
                    startAccessor='start'
                    endAccessor='end'
                    onSelectEvent={this.onClickItem}
                    eventPropGetter={this.eventStyleGetter}
                    toolbar={false}
                    onNavigate={() => {
                    }}
                />
                <FloatingActionButton date={this.context.getCalendarDate()}
                                      handleOnClickFAB={this.handleClickOpen}
                                      handleDateChange={this.handleDateChange}
                                      handleAdvanceMonth={this.handleAdvanceMonth}
                                      handleRecedeMonth={this.handleRecedeMonth}/>
                <CreateItemFormDialog isOpen={this.state.isNewItemFDOpen} setOpen={this.setNewItemFD}/>
                <UpdateItemFormDialog isOpen={this.state.isItemFDOpen} setOpen={this.setItemFD}
                                      currentlyOpenItem={this.state.currentlyOpenItem}/>
            </Container>
        )
    }
}

MyCalendar.contextType = CalendarContext

export default MyCalendar