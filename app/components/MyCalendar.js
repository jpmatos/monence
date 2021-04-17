import React, { Component } from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from "moment";
import events from "../mock/events";
import "react-big-calendar/lib/css/react-big-calendar.css";

moment.locale("en");
const localizer = momentLocalizer(moment)

class MyCalendar extends Component {
    render() {
        return (
            <div className="w-100 h-100">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                />
            </div>
        );
    }
}

export default MyCalendar