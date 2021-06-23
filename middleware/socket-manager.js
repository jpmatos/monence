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

    onDisconnect(socket) {
        return () => {
            console.log('Client disconnected');
            this.sockets = this.sockets.filter(s => s !== socket)
        }
    }
}

module.exports = SocketManager