const socket = new WebSocket("ws://localhost:5000/") /* коннект к сокету*/

const btn = document.getElementById("btn")

socket.onopen = () => {
    socket.send(JSON.stringify({
        message: "hello",
        method: "connection",
        id: 555,
        username: "basil",
    }))
}

// subscribe to the ws event
socket.onmessage = (e) => {
    console.log(`"client message": ${e.data}`)
}

btn.onclick = () => {
    // post
    socket.send(JSON.stringify({
        message: "hello",
        method: "message",
        id: 555,
        username: "basil",
    }))
}
