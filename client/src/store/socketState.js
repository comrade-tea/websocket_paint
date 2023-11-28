import {makeAutoObservable} from "mobx";
import {socketURL} from "../utils/utils.js"

class SocketState {
    socket
    onOpenHandlers = []
    onMessageHandlers = []
    
    constructor(socketURL) {
        makeAutoObservable(this)

        this.socket = new WebSocket(socketURL);
        this.socket.onopen = () => {
            this.onOpenHandlers.forEach(handler => {
                console.log("----", handler)
                handler()
            })
        }
        this.socket.onmessage = (e) => {
            this.onMessageHandlers.forEach(handler => {
                handler(e)
            })
        }

    }

    addOnOpenHandler(handler) {
        this.onOpenHandlers.push(() => this.socket.send(handler))
    }

    addOnMessageHandler(handler) {
        this.onMessageHandlers.push(handler)
    }

    sendMessage(data) {
        this.socket.send(data)
    }

}

export const socketState = new SocketState(socketURL)
