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
        socket.on('toNewItem', this.toNewItem(socket))
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

    toNewItem(socket) {
        return (data) => {
            // console.log(data)
            this.sockets.forEach(s => {
                if (s !== socket && s.calendarId === socket.calendarId) {
                    s.emit('fromNewItem', data)
                }
            })
        }
    }

    onDisconnect(socket) {
        return () => {
            console.log('Client disconnected');
            this.sockets = this.sockets.filter(s => s !== socket)
        }
    }
}

module.exports = SocketManager