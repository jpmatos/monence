import React, {useContext, useState} from 'react'
import socketIOClient from 'socket.io-client'
import App from '../content/App'
import {CalendarContext} from './default/CalendarContext'
import {InviteContext} from './default/InviteContext'
import {UserContext} from './default/UserContext'

const SocketBinder = (props) => {

    const calendarContext = useContext(CalendarContext)
    const userContext = useContext(UserContext)
    const inviteContext = useContext(InviteContext)

    const [socket, setSocket] = useState(null)

    function changeCalendar(calendarId, soc = socket) {
        soc.emit('changeCalendar', calendarId)
    }

    function fromActiveUsers(data) {
        calendarContext.setActiveUsers(data)
    }

    function fromUserLeft(data) {
        calendarContext.handleUserLeft(data)
    }

    function fromNewUser(data) {
        calendarContext.handleNewUser(data)
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

    function fromNewInvite(data) {
        inviteContext.handleNewPending(data)
    }

    function fromAcceptInvite(data) {
        inviteContext.handleNewParticipant(data)
        calendarContext.handleNewParticipant(data)
    }

    function fromChangeRole(data) {
        calendarContext.handleChangeRole(data)
    }

    function fromKickedOut(socket, data) {
        userContext.handleLeaveCalendar(data)
        const calendarId = calendarContext.handleLeaveCalendar()
        changeCalendar(calendarId, socket)
    }

    function fromParticipantLeft(data) {
        calendarContext.handleRemoveParticipant(data.id)
    }

    function toCalendarDeleted(data) {
        userContext.handleLeaveCalendar(data)
        calendarContext.handleLeaveCalendar()
    }

    //NOTE: Yes, toDelete calls handleDecline and toDecline calls handleDelete. It's intentional
    function toDeleteInvite(data) {
        inviteContext.handleDeclineInvite(data)
    }

    function toDeclineInvite(data) {
        inviteContext.handleDeleteInvite(data)
    }

    React.useEffect(() => {
        const socket = socketIOClient()
        setSocket(socket)

        const register = {
            'calendarId': calendarContext.calendarId,
            'user': userContext.user
        }

        socket.emit('register', register)
        socket.on('fromActiveUsers', fromActiveUsers)
        socket.on('fromUserLeft', fromUserLeft)
        socket.on('fromNewUser', fromNewUser)
        socket.on('fromNewItem', fromNewItem)
        socket.on('fromUpdateItem', fromUpdateItem)
        socket.on('fromDeleteItem', fromDeleteItem)
        socket.on('fromNewBudget', fromNewBudget)
        socket.on('fromUpdateBudget', fromUpdateBudget)
        socket.on('fromDeleteBudget', fromDeleteBudget)
        socket.on('fromNewInvite', fromNewInvite)
        socket.on('fromAcceptInvite', fromAcceptInvite)
        socket.on('fromChangeRole', fromChangeRole)
        socket.on('fromKickedOut', fromKickedOut.bind(this, socket))
        socket.on('fromParticipantLeft', fromParticipantLeft)
        socket.on('fromCalendarDeleted', toCalendarDeleted)
        socket.on('fromDeleteInvite', toDeleteInvite)
        socket.on('fromDeclineInvite', toDeclineInvite)
    }, [])

    return (
        <App socket={{
            'changeCalendar': changeCalendar
        }}/>
    )
}

export default SocketBinder