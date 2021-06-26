class SocketManager {
    constructor() {
        this.sockets = []
    }

    static init() {
        return new SocketManager()
    }

    newSocket(socket) {
        console.log('New client connected');

        socket.on('register', this.register(socket))
        socket.on('changeCalendar', this.changeCalendar(socket))
        socket.on('disconnect', this.onDisconnect(socket));
    }

    register(socket) {
        return (data) => {
            socket.calendarId = data.calendarId
            socket.user = data.user
            this.sockets.push(socket)
        }
    }

    changeCalendar(socket) {
        return (data) => {
            socket.calendarId = data
        }
    }

    toNewItem(calendarId, userId, item) {
        this.sockets.forEach(socket => {
            if (socket.calendarId === calendarId && socket.user.id !== userId) {
                socket.emit('fromNewItem', item)
            }
        });
    }

    toUpdateItem(calendarId, userId, item) {
        this.sockets.forEach(socket => {
            if (socket.calendarId === calendarId && socket.user.id !== userId) {
                socket.emit('fromUpdateItem', item)
            }
        })
    }

    toDeleteItem(calendarId, userId, item) {
        this.sockets.forEach(socket => {
            if (socket.calendarId === calendarId && socket.user.id !== userId) {
                socket.emit('fromDeleteItem', item)
            }
        })
    }

    toNewBudget(calendarId, userId, budget) {
        this.sockets.forEach(socket => {
            if (socket.calendarId === calendarId && socket.user.id !== userId) {
                socket.emit('fromNewBudget', budget)
            }
        });
    }

    toUpdateBudget(calendarId, userId, budget) {
        this.sockets.forEach(socket => {
            if (socket.calendarId === calendarId && socket.user.id !== userId) {
                socket.emit('fromUpdateBudget', budget)
            }
        });
    }

    toDeleteBudget(calendarId, userId, budget) {
        this.sockets.forEach(socket => {
            if (socket.calendarId === calendarId && socket.user.id !== userId) {
                socket.emit('fromDeleteBudget', budget)
            }
        });
    }

    toNewInvite(invite) {
        const socket = this.sockets.find(socket => socket.user.id === invite.inviteeId)
        if (socket)
            socket.emit('fromNewInvite', invite)
    }

    toAcceptInvite(inviterId, participant) {
        const socket = this.sockets.find(socket => socket.user.id === inviterId)
        if (socket)
            socket.emit('fromAcceptInvite', participant)
    }

    toChangeRole(calendarId, participant) {
        this.sockets.forEach(socket => {
            if (socket.calendarId === calendarId)
                socket.emit('fromChangeRole', participant)
        })
    }

    toKickParticipant(calendarId, participant) {
        const socket = this.sockets.find(socket => socket.user.id === participant.id)
        if (socket)
            socket.emit('fromKickedOut', calendarId)
    }

    toParticipantLeft(calendarId, userId, participant) {
        this.sockets.forEach(socket => {
            if (socket.calendarId === calendarId && socket.user.id !== userId)
                socket.emit('fromParticipantLeft', participant)
        })
    }

    toCalendarDeleted(calendarId, participants) {
        const users = participants.map(participant => participant.id)

        this.sockets.forEach(socket => {
            if (socket.calendarId === calendarId && users.includes(socket.user.id))
                socket.emit('fromCalendarDeleted', calendarId)
        })
    }

    toDeleteInvite(inviteeId, inviteId) {
        const socket = this.sockets.find(socket => socket.user.id === inviteeId)
        if(socket)
            socket.emit('fromDeleteInvite', inviteId)
    }

    toDeclineInvite(inviterId, inviteId) {
        const socket = this.sockets.find(socket => socket.user.id === inviterId)
        if(socket)
            socket.emit('fromDeclineInvite', inviteId)
    }

    onDisconnect(socket) {
        return () => {
            console.log('Client disconnected');
            this.sockets = this.sockets.filter(s => s !== socket)
        }
    }
}

module.exports = SocketManager