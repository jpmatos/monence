import React from 'react'
import moment from 'moment'
import axios from 'axios'

import Container from '@material-ui/core/Container'

import {Calendar} from 'react-big-calendar'
import {momentLocalizer} from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import FloatingActionButton from '../FloatingActionButton'
import CreateEventFormDialog from '../forms/CreateEventFormDialog'
import UpdateEventFormDialog from '../forms/UpdateEventFormDialog'

moment.locale('en')
const localizer = momentLocalizer(moment)

export default class MyCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isNewEventFDOpen: false,
            isEventFDOpen: false,
            events: [],
            currentlyOpenEvent: {}
        }
    }


    // const [isNewEventFDOpen, setNewExpenseFD] = React.useState(false)
    // const [isEventFDOpen, setEventFD] = React.useState(false)
    // const [events, setEvents] = React.useState([])
    // const [currentlyOpenEvent, setCurrentlyOpenEvent] = React.useState({})

    handleClickOpen = () => {
        this.setState({isNewEventFDOpen: true})
    }

    handleNewEvent = (item) => {
        this.state.events.push(item)
    }

    onClickEvent = (event) => {
        this.setState({
            currentlyOpenEvent: event,
            isEventFDOpen: true
        })
    }

    setNewExpenseFD = (event) => {
        this.setState({isNewEventFDOpen: event})
    }

    setEventFD = (event) => {
        this.setState({isEventFDOpen: event})
    }

    componentDidMount() {
        //Disable calendar
        axios.get('/calendar/01')
            .then(res => {
                const calendar = res.data
                this.setState({events: calendar.items})
                //Enable
            })
            .catch(err => {
                //Inform user server did not respond
            })
    }

    // React.useEffect(() => {
    //     //Disable calendar
    //     axios.get('/calendar/01')
    //         .then(res => {
    //             const calendar = res.data
    //             setEvents(calendar.items)
    //             //Enable
    //         })
    //         .catch(err => {
    //             //Inform user server did not respond
    //         })
    // }, [])

    render() {
        return (
            <Container style={{height: 800}}>
                <Calendar
                    localizer={localizer}
                    events={this.state.events}
                    startAccessor='start'
                    endAccessor='end'
                    onSelectEvent={this.onClickEvent}
                />
                <FloatingActionButton handleOnClickFAB={this.handleClickOpen}/>
                <CreateEventFormDialog isOpen={this.state.isNewEventFDOpen} setOpen={this.setNewExpenseFD}
                                       handleNewEvent={this.handleNewEvent}/>
                <UpdateEventFormDialog isOpen={this.state.isEventFDOpen} setOpen={this.setEventFD}
                                       currentlyOpenEvent={this.state.currentlyOpenEvent}/>
            </Container>
        )
    }
}