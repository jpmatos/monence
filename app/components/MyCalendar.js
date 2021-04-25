import React, {Component} from "react";
import {Calendar, momentLocalizer} from 'react-big-calendar'
import moment from "moment";
import events from "../mock/events";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Container from '@material-ui/core/Container';
import FloatingActionButton from './FloatingActionButton'
import NewExpenseFormDialog from './NewExpenseFormDialog'

moment.locale("en");
const localizer = momentLocalizer(moment)

export default function MyCalendar() {

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    return (
        <Container style={{height: 800}}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
            />
            <FloatingActionButton handleClickOpen={handleClickOpen}/>
            <NewExpenseFormDialog open={open} setOpen={setOpen}/>
        </Container>
    );
}