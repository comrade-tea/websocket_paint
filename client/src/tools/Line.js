import {Tool} from "./Tool.js";
import {toolState} from "../store/toolState.js"

export class Line extends Tool {
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

        /* send  */
        this.socket.send(JSON.stringify({
            method: "draw",
            id: this.id,
            figure: {
                type: "line",
                startPoint: this.startPoint,
                x: e.pageX - e.target.offsetLeft,
                y: e.pageY - e.target.offsetTop,
                strokeStyle: this.ctx.strokeStyle,
                lineWidth: this.ctx.lineWidth
            },
        }))
        
        // test code below ↓
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
        this.startPoint = {x: e.pageX - e.target.offsetLeft, y: e.pageY - e.target.offsetTop}

        this.saved = this.canvas.toDataURL() /* save state before update */
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            this.draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
        }
    }

    /* local drawing (re-render saved state with drawn line) */
    draw(x, y) {
        const img = new Image()
        img.src = this.saved

        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height) // clear canvas
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height) // return "saved" canvass

            this.ctx.beginPath()
            this.ctx.moveTo(this.startPoint.x, this.startPoint.y)
            this.ctx.lineTo(x, y)
            this.ctx.stroke()
        }
    }
    
    /* drawing from server's response */
    static staticDraw({ctx, startPoint, x, y, strokeStyle, lineWidth}) {
        /* set from remote user color and width */
        ctx.strokeStyle = strokeStyle
        ctx.lineWidth = lineWidth
        
        /* draw */
        ctx.beginPath()
        ctx.moveTo(startPoint.x, startPoint.y)
        ctx.lineTo(x, y)
        ctx.stroke()

        /* return client's color and width (that was set in toolbar ) */
        console.log("----", toolState.strokeStyle, toolState.lineWidth)
        ctx.strokeStyle = toolState.strokeStyle
        ctx.lineWidth = toolState.lineWidth
    }
}
