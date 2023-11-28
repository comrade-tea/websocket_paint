const express = require("express")
const app = express()
const WSserver = require("express-ws")(app)
const aWss = WSserver.getWss() /* объект для бродкаста (широковещательной рассылки)*/
const cors = require("cors") /* middleware для отправки запросов (ээ, с браузера ?) */

const PORT = process.env.PORT || 5000
const fs = require("fs") /* шоб создать файл из кода изображения понадобятся модули fs(filesystem) и path(для работы с путями) */
const path = require("path")


app.use(cors()) // используем cors, для коонекта на сервер, который лежит отдельно от локалхоста клиента 
app.use(express.json()) // для парсинга json формата оо...

// /* glitch integration */
// app.use("/assets", express.static(path.join(__dirname, "assets")));
//
// // app.get("/", (req, res) => {
// //     res.sendFile(path.join(__dirname, "index.html"));
// // })
// app.get(/^\/(?!api).*/, (req, res) => {
//     res.sendFile(path.join(__dirname, "index.html"));
// });
// /* glitch integration */

// обработка http запроса "/"
app.ws("/", (ws, req) => {
    console.log("----", "connection initiated")
    ws.send("hello from socket")
    ws.on("message", (msg) => {
        msg = JSON.parse(msg)
        console.log("----", msg)

        switch (msg.method) {
            case "connection":
                connectionHandler(ws, msg)
                break;
            case "draw":
                BroadcastConnection(ws, msg)
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
            client.send(JSON.stringify(msg))
        }
    })
}

/* тут реализуем "сохранение" на сервере ↓ */
app.post("/image", (req, res) => {
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
app.get("/image", (req, res) => {
    try {
        const file = fs.readFileSync(path.resolve(__dirname, "files", `${req.query.id}.jpg`))
        const data = `data:image/png;base64, ` + file.toString("base64")
        res.json(data)
    } catch (error) {
        console.log("--something went wrong with img loading--", error)
        return res.status(500).json("error")
    }
})
/* тут реализуем "сохранение" на сервере ↑ */

/* glitch integration */
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})
/* glitch integration */



// приложение слушает портуху, если запустилось - колбэк
app.listen(PORT, () => console.log("----", `server started on port ${PORT}`))

