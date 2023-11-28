// HTTP Server:
const { v4: uuidv4 } = require('uuid')
const express = require("express")
const WebSocket = require("ws")
const cors = require("cors")
// const PORT = process.env.PORT || 5000
const PORT = 5000
const fs = require("fs") /* шоб создать файл из кода изображения понадобятся модули fs(filesystem) и path(для работы с путями) */
const path = require("path")

const app = express()

app.use(cors())
app.use(express.json())
// This will serve the static files in the /public folder on our server
app.use(express.static("public"))
app.use(express.static("files"))

let users = []
const chatMessages = []

const server = app.listen(PORT, function () {
    console.log("Your app is listening on port " + server.address().port)
})

// Connect our Websocket server to our server variable to serve requests on the same port:
const wss = new WebSocket.Server({server})

app.get("/image", (req, res) => {
    try {
        const file = fs.readFileSync(path.resolve(__dirname, "files", `${req.query.id}.jpg`))
        const data = `data:image/png;base64,` + file.toString("base64")
        res.json(data)
    } catch (error) {
        console.log("--something went wrong with img loading--", error)
        return res.status(500).json("--something went wrong with img loading--")
    }
})

app.post("/image", (req, res) => {
    console.log("----", "post from client") 
    try {
        const data = req.body.img.replace("data:image/png;base64,", "")

        /* writeFileSync - в синхронном режиме позволяет сохранить файл  
        * path.resolve - построить путь "кусками" - __dirname - путь к текущей директории, 'files' - название папки, 3ий параметр - название файла 
        * data - данные изображения */
        fs.writeFileSync(path.resolve(__dirname, "files", `${req.query.id}.jpg`), data, "base64")
        return res.status(200).json({message: "Loaded"})
    } catch (error) {
        console.log("--problem with sending canvas image--", error)
        return res.status(500).json("error")
    }
})



// This function will send a message to all clients connected to the websocket:
const connectionHandler = (ws, msg) => {
    const key = uuidv4() /* unique thing for remove from list on disconnect*/
    users.push({key, username: msg.username}) /* add new user*/
    
    ws.key = key
    ws.id = msg.id /* session id.. */
    msg.users = users /* add array of all users for chat */
    msg.messages = chatMessages

    BroadcastConnection(ws, msg)
}

const chatHandler = (ws, msg) => {
    console.log("----", msg.message)
    chatMessages.push(msg.message)
    ws.id = msg.id /* session id.. */
    msg.messages = chatMessages

    BroadcastConnection(ws, msg)
}

const userLeaveHandler = (ws) => {
    users = users.filter(user => user.key !== ws.key)
    const msg = {users, id: ws.id, method: "userHasLeft"}
    
    BroadcastConnection(ws, msg)
}

/* "широковещательная рассылка". пользователь подключился - нужно уведомить остальных юзеров */
const BroadcastConnection = (ws, msg) => {
    /* aWss.clients - содержит все открытые вебсокеты */
    wss.clients.forEach((client) => {
        if (client.id === msg.id) {
            client.send(JSON.stringify(msg))
        }
    })
}

// This outer function will run each time the Websocket
// server connects to a new client:
wss.on("connection", ws => {
    // We will store the id for this connection in the id property.
    // ws.id = "k"

    // This function will run every time the server recieves a message with that client.
    ws.on("message", msg => {
        // Broadcast the received message back to all clients.
        msg = JSON.parse(msg)
        console.log("ws on message:", msg)

        switch (msg.method) {
            case "connection":
                connectionHandler(ws, msg)
                break
            case "draw":
                BroadcastConnection(ws, msg)
                break
            case "chat":
                chatHandler(ws, msg)
                break
        }
    })

    ws.on("close", () => {
        // Here you could send a message to other clients that
        // this client has disconnected.
        userLeaveHandler(ws)
    })
})



/* тут реализуем "сохранение" на сервере ↑ */

/* glitch integration */
// app.get("/", (req, res) => {
//     res.sendFile(__dirname + "/public/index.html")
// })
/* glitch integration */
