// HTTP Server:
const WssManager = require("./models/WssManager")
const User = require("./models/User")

const {v4: uuidv4} = require('uuid')
const express = require("express")
const WebSocket = require("ws")
const cors = require("cors")
const PORT = 5000

/* for creating files required packages fs(filesystem) and path(for path handling) */
const fs = require("fs") 
const path = require("path")

const app = express()

app.use(cors())
app.use(express.json())

// This will serve the static files in the /public folder on our server
app.use(express.static("public"))
app.use(express.static("files"))

const server = app.listen(PORT, function () {
    console.log("Your app is listening on port " + server.address().port)
})

const wss = new WebSocket.Server({server}) // Connect our Websocket server to our server variable to serve requests on the same port:

const wssManager = new WssManager(wss)

app.get("/image", (req, res) => {
    try {
        const file = fs.readFileSync(path.resolve(__dirname, "files", `${req.query.id}.jpg`))
        const data = `data:image/png;base64,` + file.toString("base64")
        res.json(data)
    } catch (error) {
        // console.log("--something went wrong with img loading--", error)
        return res.status(500).json("--something went wrong with img loading--")
    }
})

app.post("/image", (req, res) => {
    // console.log("----", "post from client") 
    try {
        const data = req.body.img.replace("data:image/png;base64,", "")

        /* writeFileSync - в синхронном режиме позволяет сохранить файл  
        * path.resolve - построить путь "кусками" - __dirname - путь к текущей директории, 'files' - название папки, 3ий параметр - название файла 
        * data - данные изображения */
        fs.writeFileSync(path.resolve(__dirname, "files", `${req.query.id}.jpg`), data, "base64")
        return res.status(200).json({message: "Loaded"})
    } catch (error) {
        // console.log("--problem with sending canvas image--", error)
        return res.status(500).json("error")
    }
})


/* This outer function will run each time the Websocket server connects to a new client: */
wss.on("connection", ws => {
    // This function will run every time the server receives a message with that client.
    ws.on("message", msg => {
        // Broadcast the received message back to all clients.
        msg = JSON.parse(msg)
        // console.log("on message- ws:", ws.id)
        // console.log("on message- msg:", msg)

        switch (msg.method) {
            case "connection":
                const roomId = msg.id
                const userId = uuidv4()

                ws.id = roomId /* session id.. */
                ws.userId = userId

                wssManager.addUser(new User(userId, msg.username), roomId)
                break
            case "chat":
                wssManager.sendMessage(msg)
                break
            case "draw":
                wssManager.BroadcastConnection(msg)
                break
        }
    })

    /* send a message to other clients that this client has disconnected */
    ws.on("close", () => {
        if (ws.userId && ws.id) {
            wssManager.removeUser(ws.userId, ws.id)
        } else {
            console.warn("ws onClose: ", "no ws data")
        }
    })
})


/* glitch integration */
// app.get("/", (req, res) => {
//     res.sendFile(__dirname + "/public/index.html")
// })
/* glitch integration */
