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

    function fromNewItem(data) {
        calendarContext.handleNewItem(data)
    }

    function fromUpdateItem(data) {
        calendarContext.handleUpdateItem(data)
    }

    function fromDeleteItem(data) {
        calendarContext.handleDeleteItem(data.id)
    }

    function fromNewBudget(data) {
        calendarContext.handleNewBudget(data)
    }

    function fromUpdateBudget(data) {
        calendarContext.handleUpdateBudget(data)
    }

    function fromDeleteBudget(data) {
        calendarContext.handleDeleteBudget(data.id)
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
        socket.on("fromUpdateItem", fromUpdateItem)
        socket.on("fromDeleteItem", fromDeleteItem)
        socket.on("fromNewBudget", fromNewBudget)
        socket.on("fromUpdateBudget", fromUpdateBudget)
        socket.on("fromDeleteBudget", fromDeleteBudget)
    }, [])

    return (
        <App socket={{
            'changeCalendar': changeCalendar
        }}/>
    )
}

export default SocketBinder