import "../styles/toolbar.scss"
import {observer} from "mobx-react-lite";
import {useCallback, useEffect, useRef, useState} from "react";
import {canvasState} from "../store/canvasState.js";
import {toolState} from "../store/toolState.js"
import {Brush} from "../tools/Brush.js"
import {Button, Modal} from "react-bootstrap"
import {useParams} from "react-router-dom"
import {Rect} from "../tools/Rect.js"
import {Eraser} from "../tools/Eraser.js"
import {Line} from "../tools/Line.js"
import {Circle} from "../tools/Circle.js"
import {axiosInstance, socketURL} from "../utils/utils.js"
import {socketState} from "../store/socketState.js"

/* observer - mobx обертка, при изменении в стейтах mobx(вроде всех)
* */
export const Canvas = observer(() => {
    const canvasRef = useRef(null);
    const [nickname, setNickname] = useState("")

    const [modal, setModal] = useState(true);
    const [invalidNickname, setInvalidNickname] = useState(null)

    const params = useParams()

    useEffect(() => {
        canvasState.setCanvas(canvasRef.current)

        axiosInstance.get(`/image?id=${params.id}`)
            .then(response => {
                const img = new Image()
                img.src = response.data
                img.onload = () => {
                    const ctx = canvasRef.current.getContext("2d")
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height) // clear canvas
                    ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height) // return "saved" canvass
                }
            })
    }, []);

    useEffect(() => {
        /* after assigning a nickname, establish a connection */
        if (canvasState.username) {
            canvasState.setSocket(socketState.socket)
            canvasState.setSessionId(params.id)
            toolState.setTool(new Brush(canvasRef.current, canvasState.socket, canvasState.sessionId))

            if (socketState.socket.readyState === socketState.socket.OPEN) {
                socketState.socket.send(
                    JSON.stringify({
                        method: "connection",
                        id: params.id,
                        username: canvasState.username,
                    }))
            } else {
                socketState.addOnOpenHandler(() => {
                    // socketState.socket.send(
                    //     JSON.stringify({
                    //         method: "connection",
                    //         id: params.id,
                    //         nickname: canvasState.nickname,
                    //     }))
                })

            }

            /* response from server */
            socketState.addOnMessageHandler((e) => {
                    const msg = JSON.parse(e.data)

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
                },
            )
        }
    }, [canvasState.username])

    useEffect(() => {
        if (nickname.length > 1) {
            setInvalidNickname(false)
        }
    }, [nickname]);

    const onNameChange = useCallback((event) => {
        setNickname(event.target.value)
    }, [])


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
        axiosInstance
            .post(`/image?id=${params.id}`, {img: canvasRef.current.toDataURL()})
            // .then(response => console.log(response.data))
    }

    const connectHandler = (e) => {
        e.preventDefault()
        
        if (nickname.length > 1) {
            canvasState.setUsername(nickname)
            setModal(false)
        } else {
            setInvalidNickname(true)
        }
    }

    return (
        <>
            <div className="canvas-wrap">
                <canvas ref={canvasRef}
                        onMouseDown={() => mouseDownHandler()}
                        width={600} height={400}
                />
            </div>

            <Modal show={modal}>
                <Modal.Header>
                    <Modal.Title>Enter your nickname</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="input-group" onSubmit={connectHandler}>
                        <input className={`form-control ${invalidNickname ? "is-invalid" : ""}`}
                               type="text"
                               placeholder="At least 2 symbols"
                               onChange={onNameChange}
                               value={nickname}
                        />
                        <Button variant="primary" type="submit">Sign in</Button>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    )
})
