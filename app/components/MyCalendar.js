import React, { Component } from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from "moment";
import events from "../mock/events";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Container from "react-bootstrap/Container";

moment.locale("en");
const localizer = momentLocalizer(moment)

class MyCalendar extends Component {
    render() {
        return (
            <Container style={{ height: 800 }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                />
            </Container>
        );
    }
}

export default MyCalendar