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
import {observer} from "mobx-react-lite"


export const Toolbar = observer(() => {
    const {canvas, socket, sessionId} = canvasState
    
    const download = () => {
        const dataUrl = canvasState.canvas.toDataURL()
        const a = document.createElement("a")
        a.href = dataUrl
        a.download = canvasState.sessionid + ".jpg"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    const getButtonTheme = (classToCompare) => {
        return toolState?.tool?.constructor?.name === classToCompare?.name ? "info" : "light"
    }
    
    return (
        <div className="toolbar px-4">
            <div className="d-flex align-items-center">
                <div className="fw-semibold me-2">Instruments:</div>
                <ButtonGroup>
                    <Button variant={getButtonTheme(Brush)}
                            onClick={() => toolState.setTool(new Brush(canvas, socket, sessionId))} title="Brush"
                    ><HiOutlinePencil size={24}/>
                    </Button>
                    <Button
                        onClick={() => toolState.setTool(new Rect(canvas, socket, sessionId))} title="Rect"
                        variant={getButtonTheme(Rect)}><FaSquare size={24}/>
                    </Button>
                    <Button
                        onClick={() => toolState.setTool(new Circle(canvas, socket, sessionId))} title="Circle"
                        variant={getButtonTheme(Circle)}>
                        <GiCircle size={24}/>
                    </Button>
                    <Button
                        onClick={() => toolState.setTool(new Line(canvas, socket, sessionId))} title="Line"
                        variant={getButtonTheme(Line)}>
                        <HiOutlineMinus size={24}/>
                    </Button>
                    <Button
                        onClick={() => toolState.setTool(new Eraser(canvas, socket, sessionId))} title="Eraser"
                        variant={getButtonTheme(Eraser)}>
                        <FaEraser size={24}/>
                    </Button>
                </ButtonGroup>

                
            </div>
            

            <ButtonGroup className="ms-auto">
                <Button onClick={() => canvasState.undo()} type="button" variant="light"><FaUndo size={24}/></Button>
                <Button onClick={() => canvasState.redo()} variant="light"><FaRedo size={24}/></Button>
                <Button onClick={() => download()} variant="light"><FaSave size={24}/></Button>
            </ButtonGroup>
        </div>
    )
})
