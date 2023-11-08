const express = require("express")
const app = express()
const WSserver = require("express-ws")(app)
const aWss = WSserver.getWss() /* объект для бродкаста (широковещательной рассылки)*/
const PORT = process.env.PORT || 5000

// обработка http запроса "/"
app.ws("/", (ws, req) => {
    // console.log("----", "connection initiated")
    // ws.send("hello from socket")
    ws.on("message", (msg) => {
        msg = JSON.parse(msg)
        console.log("----", msg.username)

        switch (msg.method) {
            case "connection":
                connectionHandler(ws, msg)
                break;
            case "draw":
                break;
        }
    })
})

const connectionHandler = (ws, msg) => {
    ws.id = msg.id /* чтобы отделять сессии - присвоим id сокетам */

    BroadcastConnection(ws, msg)
}

/* "широковещательная рассылка". пользователь подключился - нужно уведомить остальных юзеров */
const BroadcastConnection = (ws, msg) => {
    /* aWss.clients - содержит все открытые вебсокеты */
    aWss.clients.forEach(client => {
        if (client.id === msg.id) {
            client.send(`user ${msg.username} was connected, id is: ${msg.id}`)
        }
    })
}

// приложение слушает портуху, если запустилось - колбэк
app.listen(PORT, () => console.log("----", `server started on port ${PORT}`))


