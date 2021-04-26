import React, {Component} from "react";
import {Calendar, momentLocalizer} from 'react-big-calendar'
import moment from "moment";
// import events from "../mock/events";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Container from '@material-ui/core/Container';
import FloatingActionButton from './FloatingActionButton'
import NewExpenseFormDialog from './NewExpenseFormDialog'
import axios from "axios";

moment.locale("en");
const localizer = momentLocalizer(moment)

export default function MyCalendar() {

    const [open, setOpen] = React.useState(false);

    const [events, setEvents] = React.useState([]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleNewItem = (item) => {
        events.push(item)
    }

    React.useEffect(() => {
        axios.get('/calendar/01')
            .then(res => {
                const calendar = res.data
                setEvents(calendar.items)
            })
    }, [])

    return (
        <Container style={{height: 800}}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
            />
            <FloatingActionButton handleClickOpen={handleClickOpen}/>
            <NewExpenseFormDialog open={open} setOpen={setOpen} newItem={handleNewItem}/>
        </Container>
    );
}