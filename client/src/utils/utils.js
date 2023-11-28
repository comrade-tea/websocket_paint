import axios from "axios"

const PORT = 5000
const devURL = `localhost:${PORT}`
const productionURL = "lean-alive-hour.glitch.me"

let baseURL = null
let socketURL = null

// const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
// const socketURL = `${wsProtocol}://${window.location.hostname}:${window.location.port}`
// console.log("----", socketURL)


if (process.env.NODE_ENV === 'development') {
    // Local development
    baseURL = `http://${devURL}`
    socketURL = `ws://${devURL}`
} else {
    // Production or any other environment
    baseURL = `https://${productionURL}`
    socketURL = `wss://${productionURL}`
}

// console.info(`process.env.NODE_ENV`, process.env.NODE_ENV, socketURL, baseURL)

const axiosInstance = axios.create({baseURL,})
// const getWsInstance = () => new WebSocket(socketURL)

export {axiosInstance, socketURL}
