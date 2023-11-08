import "../styles/toolbar.scss"
import {observer} from "mobx-react-lite";
import {useEffect, useRef} from "react";
import {canvasState} from "../store/canvasState.js";
import {toolState} from "../store/toolState.js"
import {Brush} from "../tools/Brush.js"

/* observer - mobx обертка, при изменении в стейтах mobx(вроде всех)
*  триггерит перерисовку внутренностей
* */
export const Canvas = observer(() => {
    const canvasRef = useRef(null);

    useEffect(() => {
        canvasState.setCanvas(canvasRef.current)
        toolState.setTool(new Brush(canvasRef.current))
    }, []);

    const mouseDownHandler = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL()) /* save canvas state for undo history */
    }
    
    return (
        <div className="canvas-wrap">
            <canvas ref={canvasRef}
                    onMouseDown={() => mouseDownHandler()}
                    width={600} height={400}
            />
        </div>
    )
})
