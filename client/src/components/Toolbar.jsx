import "../styles/toolbar.scss"

import {FaEraser, FaRedo, FaSave, FaSquare, FaUndo} from "react-icons/fa";
import {HiOutlineMinus, HiOutlinePencil} from "react-icons/hi"
import {GiCircle} from "react-icons/gi";

import {Button, ButtonGroup} from "react-bootstrap";

import {toolState} from "../store/toolState.js"
import {Brush} from "../tools/Brush.js"
import {canvasState} from "../store/canvasState.js"
import {Rect} from "../tools/Rect.js"
import {Circle} from "../tools/Circle.js"
import {Eraser} from "../tools/Eraser.js"
import {Line} from "../tools/Line.js"
import {useCallback} from "react"


export const Toolbar = () => {
    const onInputChange = useCallback((e) => {
        toolState.setStrokeColor(e.target.value)
        toolState.setFillColor(e.target.value)
    }, [])

    return (
        <div className="toolbar px-4">
            <div className="d-flex align-items-center">
                <ButtonGroup>
                    <Button onClick={() => toolState.setTool(new Brush(canvasState.canvas, canvasState.socket, canvasState.sessionId))}
                            variant="light"><HiOutlinePencil size={24}/>
                    </Button>
                    <Button onClick={() => toolState.setTool(new Rect(canvasState.canvas, canvasState.socket, canvasState.sessionId))}
                            variant="light"><FaSquare size={24}/>
                    </Button>
                    <Button onClick={() => toolState.setTool(new Circle(canvasState.canvas, canvasState.socket, canvasState.sessionId))} variant="light">
                        <GiCircle size={24}/>
                    </Button>
                    <Button onClick={() => toolState.setTool(new Eraser(canvasState.canvas, canvasState.socket, canvasState.sessionId))} variant="light">
                        <FaEraser size={24}/>
                    </Button>
                    <Button onClick={() => toolState.setTool(new Line(canvasState.canvas, canvasState.socket, canvasState.sessionId))} variant="light">
                        <HiOutlineMinus size={24}/>
                    </Button>
                </ButtonGroup>

                <input onChange={onInputChange} className="ms-4" type="color"/>
            </div>


            <ButtonGroup className="ms-auto">
                <Button onClick={() => canvasState.undo()} type="button" variant="light"><FaUndo size={24}/></Button>
                <Button onClick={() => canvasState.redo()} variant="light"><FaRedo size={24}/></Button>
                <Button variant="light"><FaSave size={24}/></Button>
            </ButtonGroup>
        </div>
    )
}
