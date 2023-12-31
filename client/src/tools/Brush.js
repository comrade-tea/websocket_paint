import {Tool} from "./Tool.js"
import {toolState} from "../store/toolState.js"

export class Brush extends Tool {
    constructor(canvas, socket, id) {
        super(canvas, socket, id)
        this.listen()
    }

    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
    }

    mouseUpHandler(e) {
        this.mouseDown = false
        
        this.socket.send(JSON.stringify({
            method: "draw",
            id: this.id,
            figure: {
                type: "finish",
            },
        }))
    }

    mouseDownHandler(e) {
        this.mouseDown = true
        this.ctx.beginPath() /* начали рисование*/

        /* перемещение курсора, вычисление координат на канвасе:
        * (mouseX - canvasLeftOffset) = canvas true coordinates */
        this.ctx.moveTo(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            // this.draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
            
            this.socket.send(JSON.stringify({
                method: "draw",
                id: this.id,
                figure: {
                    type: "brush",
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                    strokeStyle: this.ctx.strokeStyle,
                    lineWidth: this.ctx.lineWidth,
                },
            }))
        }
    }

    static draw({ctx, x, y, strokeStyle, lineWidth}) {
        ctx.strokeStyle = strokeStyle
        ctx.lineWidth = lineWidth
        
        ctx.lineTo(x, y)
        ctx.stroke()
        
        ctx.strokeStyle = toolState.strokeStyle
        ctx.lineWidth = toolState.lineWidth
    }
}
