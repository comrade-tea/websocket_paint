import "../styles/toolbar.scss"
import {observer} from "mobx-react-lite";
import {useEffect, useRef, useState} from "react";
import {canvasState} from "../store/canvasState.js";
import {toolState} from "../store/toolState.js"
import {Brush} from "../tools/Brush.js"
import {Button, Modal} from "react-bootstrap"
import {useParams} from "react-router-dom"
import {Rect} from "../tools/Rect.js"
import axios from "axios"
import {Eraser} from "../tools/Eraser.js"
import {Line} from "../tools/Line.js"
import {Circle} from "../tools/Circle.js"

/* observer - mobx обертка, при изменении в стейтах mobx(вроде всех)
* */
export const Canvas = observer(() => {
    const canvasRef = useRef(null);
    const usernameRef = useRef(null);
    const [modal, setModal] = useState(true);
    const params = useParams()

    useEffect(() => {
        canvasState.setCanvas(canvasRef.current)
        // toolState.setTool(new Brush(canvasRef.current)) /* move tool state to websocket declaration  => */

        axios.get(`http://localhost:5000/image?id=${params.id}`)
            .then(response => {
                const img = new Image()
                img.src = response.data
                img.onload = () => {
                    // console.log("----", this)
                    const ctx = canvasRef.current.getContext("2d")
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height) // clear canvas
                    ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height) // return "saved" canvass
                }
            })
    }, []);

    useEffect(() => {
        /* after assigning a username, establish a connection */
        if (canvasState.username) {
            const socket = new WebSocket("ws://localhost:5000/")

            canvasState.setSocket(socket)
            canvasState.setSessionId(params.id)
            toolState.setTool(new Brush(canvasRef.current, canvasState.socket, canvasState.sessionId))

            /* send data  when socket is open */
            socket.onopen = () => {
                socket.send(JSON.stringify({
                    id: params.id,
                    username: canvasState.username,
                    method: "connection",
                }))
            }

            /* response from server */
            socket.onmessage = (e) => {
                const msg = JSON.parse(e.data)
                // console.log("--wtf?--", msg)

                switch (msg.method) {
                    case "connection": {
                        console.log(`user ${msg.username} was connected`)
                        break
                    }
                    case "draw": {
                        drawHandler(msg)
                        break
                    }
                }
            }
        }
    }, [canvasState.username])

    const drawHandler = (msg) => {
        const figure = msg.figure
        const ctx = canvasRef.current.getContext("2d")

        switch (figure.type) {
            case "brush": {
                const {x, y, strokeStyle, lineWidth} = figure
                Brush.draw({ctx, x, y, strokeStyle, lineWidth})
                break
            }

            case "rect": {
                const {x, y, width, height, fillStyle, lineWidth, strokeStyle} = figure
                Rect.staticDraw({ctx, x, y, width, height, fillStyle, lineWidth, strokeStyle})
                break
            }
                
            case "circle": {
                const {x, y, size, fillStyle, lineWidth, strokeStyle} = figure
                Circle.staticDraw({ctx, x, y, size, fillStyle, lineWidth, strokeStyle})
                break
            }
            
            case "eraser": {
                Eraser.draw(ctx, figure.x, figure.y, figure.color)
                break
            }
            
            case "line": {
                const {startPoint, x, y, strokeStyle, lineWidth} = figure
                Line.staticDraw({ctx, startPoint, x, y, strokeStyle, lineWidth})
                break
            }

            case "finish": {
                ctx.beginPath() /* прервать рисовалку, начинать новый путь */
                break
            }
        }
    }


    const mouseDownHandler = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL()) /* save canvas state for undo history */
        axios.post(`http://localhost:5000/image?id=${params.id}`,
            {img: canvasRef.current.toDataURL()})
            .then(response => console.log(response.data))
    }

    const connectHandler = () => {
        // есть доступ напрямую к данным
        canvasState.setUsername(usernameRef.current.value)
        setModal(false)
    }

    return (
        <>
            <div className="canvas-wrap">
                <canvas ref={canvasRef}
                        onMouseDown={() => mouseDownHandler()}
                        width={600} height={400}
                />
            </div>

            <Modal show={modal} onHide={() => {
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Enter your name</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input className="form-control" ref={usernameRef} type="text"/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={connectHandler}>Sign in</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
})
