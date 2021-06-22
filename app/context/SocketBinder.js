import React, {useContext, useState} from 'react'
import App from "../content/App";

import socketIOClient from "socket.io-client";
import {UserContext} from "./default/UserContext";
import {CalendarContext} from "./default/CalendarContext";
import {InviteContext} from "./default/InviteContext";

const ENDPOINT = "localhost:3000";

const SocketBinder = (props) => {

    const calendarContext = useContext(CalendarContext);
    const userContext = useContext(UserContext);
    const inviteContext = useContext(InviteContext);

    const [socket, setSocket] = useState(null)

    function changeCalendar(calendarId) {
        socket.emit('changeCalendar', calendarId)
    }

    function toNewItem(item) {
        socket.emit('toNewItem', item)
    }

    function fromNewItem(data) {
        // console.log(calendarContext.calendar.owner.name)
        // console.log(userContext.user.id)

        calendarContext.handleNewItem(data)
    }

    React.useEffect(() => {
        const socket = socketIOClient(ENDPOINT)
        setSocket(socket);

        const register = {
            'calendarId': calendarContext.calendarId,
            'user': userContext.user
        }

        socket.emit('register', register)
        socket.on("fromNewItem", fromNewItem)
    }, [])

    return (
        <App socket={{
            'toNewItem': toNewItem,
            'changeCalendar': changeCalendar
        }}/>
    )
}

export default SocketBinder