import React, {Component} from "react";
import {Calendar, momentLocalizer} from 'react-big-calendar'
import moment from "moment";
// import events from "../mock/events";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Container from '@material-ui/core/Container';
import FloatingActionButton from './FloatingActionButton'
import NewExpenseFormDialog from './NewExpenseFormDialog'
import EventFormDialog from './EventFormDialog'
import axios from "axios";

moment.locale("en");
const localizer = momentLocalizer(moment)

export default function MyCalendar() {

    const [isNewEventFDOpen, setNewExpenseFD] = React.useState(false);
    const [isEventFDOpen, setEventFD] = React.useState(false)
    const [events, setEvents] = React.useState([]);
    const [currentlyOpenEvent, setCurrentlyOpenEvent] = React.useState({})

    const handleClickOpen = () => {
        setNewExpenseFD(true);
    };

    const handleNewEvent = (item) => {
        events.push(item)
    }

    const onClickEvent = (event, e) => {
        console.log(event)
        setCurrentlyOpenEvent(event)
        setEventFD(true)
    }

    React.useEffect(() => {
        //Disable calendar
        axios.get('/calendar/01')
            .then(res => {
                const calendar = res.data
                setEvents(calendar.items)
                //Enable
            })
            .catch(err => {
                //Inform user server did not respond
            })
    }, [])

    return (
        <Container style={{height: 800}}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                onSelectEvent={onClickEvent}
            />
            <FloatingActionButton handleOnClickFAB={handleClickOpen}/>
            <NewExpenseFormDialog isOpen={isNewEventFDOpen} setOpen={setNewExpenseFD} handleNewEvent={handleNewEvent}/>
            <EventFormDialog isOpen={isEventFDOpen} setOpen={setEventFD} currentlyOpenEvent={currentlyOpenEvent} />
        </Container>
    );
}