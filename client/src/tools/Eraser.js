import {Brush} from "./Brush.js"
import {toolState} from "../store/toolState.js"

export class Eraser extends Brush {
    constructor(canvas, socket, id) {
        super(canvas, socket, id)
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            this.socket.send(JSON.stringify({
                method: "draw",
                id: this.id,
                figure: {
                    type: "eraser",
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                    color: this.ctx.strokeStyle, /* ctx color, to replace white after stroke */
                },
            }))
        }
    }

    static draw(ctx, x, y, color) {
        ctx.strokeStyle = "#fff" /* eraser always white */
        ctx.lineTo(x, y)
        ctx.stroke()
        ctx.strokeStyle = color
    }

}


