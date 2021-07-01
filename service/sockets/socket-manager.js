const chalk = require('chalk')

class SocketManager {
    constructor() {
        this.sockets = []
    }

    static init() {
        return new SocketManager()
    }

    newSocket(socket) {
        console.log(`${chalk.blue('Socket On')} - New Connection - From ${socket.id}`);
        socket.on('register', this.register(socket))
        socket.on('changeCalendar', this.changeCalendar(socket))
        socket.on('disconnect', this.onDisconnect(socket));
    }

    register(socket) {
        console.log(`${chalk.blue('Socket On')} - Register - From ${socket.id}`);
        return (data) => {
            socket.calendarId = data.calendarId
            socket.user = data.user
            this.sockets.push(socket)
        }
    }

    changeCalendar(socket) {
        console.log(`${chalk.blue('Socket On')} - Change Calendar - From ${socket.id}`);
        return (data) => {
            socket.calendarId = data
        }
    }

    toNewItem(calendarId, userId, item) {
        this.sockets.forEach(socket => {
            if (socket.calendarId === calendarId && socket.user.id !== userId) {
                console.log(`${chalk.yellow('Socket Emit')} - New Item - To ${socket.id}`);
                socket.emit('fromNewItem', item)
            }
        });
    }

    toUpdateItem(calendarId, userId, item) {
        this.sockets.forEach(socket => {
            if (socket.calendarId === calendarId && socket.user.id !== userId) {
                console.log(`${chalk.yellow('Socket Emit')} - Update Item - To ${socket.id}`);
                socket.emit('fromUpdateItem', item)
            }
        })
    }

    toDeleteItem(calendarId, userId, item) {
        this.sockets.forEach(socket => {
            if (socket.calendarId === calendarId && socket.user.id !== userId) {
                console.log(`${chalk.yellow('Socket Emit')} - Delete Item - To ${socket.id}`);
                socket.emit('fromDeleteItem', item)
            }
        })
    }

    toNewBudget(calendarId, userId, budget) {
        this.sockets.forEach(socket => {
            if (socket.calendarId === calendarId && socket.user.id !== userId) {
                console.log(`${chalk.yellow('Socket Emit')} - New Budget - To ${socket.id}`);
                socket.emit('fromNewBudget', budget)
            }
        });
    }

    toUpdateBudget(calendarId, userId, budget) {
        this.sockets.forEach(socket => {
            if (socket.calendarId === calendarId && socket.user.id !== userId) {
                console.log(`${chalk.yellow('Socket Emit')} - Update Budget - To ${socket.id}`);
                socket.emit('fromUpdateBudget', budget)
            }
        });
    }

    toDeleteBudget(calendarId, userId, budget) {
        this.sockets.forEach(socket => {
            if (socket.calendarId === calendarId && socket.user.id !== userId) {
                console.log(`${chalk.yellow('Socket Emit')} - Delete Budget - To ${socket.id}`);
                socket.emit('fromDeleteBudget', budget)
            }
        });
    }

    toNewInvite(invite) {
        const socket = this.sockets.find(socket => socket.user.id === invite.inviteeId)
        if (socket) {
            console.log(`${chalk.yellow('Socket Emit')} - New Invite - To ${socket.id}`);
            socket.emit('fromNewInvite', invite)
        }
    }

    toAcceptInvite(inviterId, participant) {
        const socket = this.sockets.find(socket => socket.user.id === inviterId)
        if (socket) {
            console.log(`${chalk.yellow('Socket Emit')} - Accept Invite - To ${socket.id}`);
            socket.emit('fromAcceptInvite', participant)
        }
    }

    toChangeRole(calendarId, participant) {
        this.sockets.forEach(socket => {
            if (socket.calendarId === calendarId) {
                console.log(`${chalk.yellow('Socket Emit')} - Change Role - To ${socket.id}`);
                socket.emit('fromChangeRole', participant)
            }
        })
    }

    toKickParticipant(calendarId, participant) {
        const socket = this.sockets.find(socket => socket.user.id === participant.id)
        if (socket) {
            console.log(`${chalk.yellow('Socket Emit')} - Kick Out - To ${socket.id}`);
            socket.emit('fromKickedOut', calendarId)
        }
    }

    toParticipantLeft(calendarId, userId, participant) {
        this.sockets.forEach(socket => {
            if (socket.calendarId === calendarId && socket.user.id !== userId) {
                console.log(`${chalk.yellow('Socket Emit')} - Participant Left - To ${socket.id}`);
                socket.emit('fromParticipantLeft', participant)
            }
        })
    }

    toCalendarDeleted(calendarId, participants) {
        const users = participants.map(participant => participant.id)

        this.sockets.forEach(socket => {
            if (socket.calendarId === calendarId && users.includes(socket.user.id)) {
                console.log(`${chalk.yellow('Socket Emit')} - Calendar Deleted - To ${socket.id}`);
                socket.emit('fromCalendarDeleted', calendarId)
            }
        })
    }

    toDeleteInvite(inviteeId, inviteId) {
        const socket = this.sockets.find(socket => socket.user.id === inviteeId)
        if (socket) {
            console.log(`${chalk.yellow('Socket Emit')} - Delete Invite - To ${socket.id}`);
            socket.emit('fromDeleteInvite', inviteId)
        }
    }

    toDeclineInvite(inviterId, inviteId) {
        const socket = this.sockets.find(socket => socket.user.id === inviterId)
        if (socket) {
            console.log(`${chalk.yellow('Socket Emit')} - Decline Invite - To ${socket.id}`);
            socket.emit('fromDeclineInvite', inviteId)
        }
    }

    onDisconnect(socket) {
        return () => {
            console.log(`${chalk.blue('Socket On')} - Client Disconnected - From ${socket.id}`)
            this.sockets = this.sockets.filter(s => s !== socket)
        }
    }
}

module.exports = SocketManager