const Room = require("./Room")
const Message = require("./Message")

module.exports = class WssManager {
    constructor(wss) {
        this.wss = wss
        this.rooms = {}
    }

    getUsers(roomId) {
        return this.rooms[roomId].users
    }

    addUser(user, roomId) {
        if (this.rooms[roomId]) {
            this.rooms[roomId].users.push(user)
        } else {
            this.rooms[roomId] = new Room(user)
        }

        const payload = {
            method: "connection",
            id: roomId,
            users: this.getUsers(roomId),
            messages: this.getMessages(roomId),
        }

        this.BroadcastConnection(payload)
    }

    removeUser(userId, roomId) {
        this.rooms[roomId].users = this.rooms[roomId].users.filter(user => user.id !== userId)
        
        const payload = {
            method: "userHasLeft",
            id: roomId,
            userId, 
            users: this.rooms[roomId].users,
        }

        this.BroadcastConnection(payload)
    }

    getMessages(roomId) {
        return this.rooms[roomId].messages
    }

    sendMessage({method, message}) {
        console.log("--add message--", message)
        const roomId = message.id
        this.rooms[roomId].messages.push(new Message(message))

        const payload = {
            id: roomId,
            method,
            messages: this.getMessages(roomId),
        }

        this.BroadcastConnection(payload)
    }

    /* send message to all connected clients */
    BroadcastConnection(payload) {
        /* wss - "websocket server"; wss.clients - contains all opened sockets */
        this.wss.clients.forEach((client) => {
            /* client - ws connection with patched id? */
            if (client.id === payload.id) {
                // console.log("broadcast:", client.id, payload)
                client.send(JSON.stringify(payload))
            }
        })
    }
}
