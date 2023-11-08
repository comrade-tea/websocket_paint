import "../styles/toolbar.scss"
import {observer} from "mobx-react-lite";
import {useEffect, useRef, useState} from "react";
import {canvasState} from "../store/canvasState.js";
import {toolState} from "../store/toolState.js"
import {Brush} from "../tools/Brush.js"
import {Button, Modal} from "react-bootstrap"
import {useParams} from "react-router-dom"

/* observer - mobx обертка, при изменении в стейтах mobx(вроде всех)
*  триггерит перерисовку внутренностей
* */
export const Canvas = observer(() => {
    const canvasRef = useRef(null);
    const usernameRef = useRef(null);
    const [modal, setModal] = useState(true);
    const params = useParams()

    useEffect(() => {
        canvasState.setCanvas(canvasRef.current)
        toolState.setTool(new Brush(canvasRef.current))
    }, []);

    useEffect(() => {
        /* after assigning a username, establish a connection */
        if (canvasState.username) {
            const socket = new WebSocket("ws://localhost:5000/")
            socket.onopen = () => {
                // console.log("----", "connection established")
                socket.send(JSON.stringify({
                    id: params.id,
                    username: canvasState.username,
                    method: "connection",
                }))
            }

            socket.onmessage = (e) => {
                console.log(`server response: ${e.data}`)
            }
        }
    }, [canvasState.username]);

    const mouseDownHandler = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL()) /* save canvas state for undo history */
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
