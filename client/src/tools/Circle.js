import {Tool} from "./Tool.js";
import {toolState} from "../store/toolState.js"

export class Circle extends Tool {
    circleSize = 0
    constructor(canvas, socket, sessionId) {
        super(canvas, socket, sessionId);
        this.listen() 
    }

    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
    }

    mouseUpHandler(e) {
        this.mouseDown = false

        /* отправляем данные только в момент отпускания
        * this.ctx генерируется в Tool если чо    
        *  */
        this.socket.send(JSON.stringify({
            method: "draw",
            id: this.id,
            figure: {
                type: "circle",
                x: this.startX,
                y: this.startY,
                size: this.circleSize,
                fillStyle: this.ctx.fillStyle,
                strokeStyle: this.ctx.strokeStyle,
                lineWidth: this.ctx.lineWidth,
            },
        }))
    }

    mouseDownHandler(e) {
        this.mouseDown = true
        this.ctx.beginPath() /* начали рисование*/

        this.startX = e.pageX - e.target.offsetLeft
        this.startY = e.pageY - e.target.offsetTop
        this.saved = this.canvas.toDataURL()
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            const currentX = e.pageX - e.target.offsetLeft
            const currentY = e.pageY - e.target.offsetTop
            const width = currentX - this.startX
            const height = currentY - this.startY

            const maxSize = Math.max(
                Math.abs(width),
                Math.abs(height),
            )
            
            this.circleSize = maxSize
            
            const drawX = width > 0 ? this.startX : currentX
            const drawY = height > 0 ? this.startY : currentY
            this.draw(drawX, drawY, maxSize)
        }
    }

    draw(x, y, size) {
        const img = new Image()
        img.src = this.saved
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height) // clear canvas
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height) // return "saved" canvass
            this.ctx.beginPath()

            this.ctx.roundRect(x, y, size, size, 1000)
            this.ctx.fill()
            this.ctx.stroke()
        }
    }

    static staticDraw({ctx, x, y, size, fillStyle, lineWidth, strokeStyle}) {
        console.table(x, y, size, fillStyle, lineWidth, strokeStyle)

        ctx.strokeStyle = strokeStyle
        ctx.lineWidth = lineWidth
        ctx.fillStyle = fillStyle

        ctx.beginPath()
        ctx.roundRect(x, y, size, size, 1000)
        ctx.fill()
        ctx.stroke()

        /* return client's tool ctx values */
        ctx.strokeStyle = toolState.strokeStyle
        ctx.lineWidth = toolState.lineWidth
        ctx.fillStyle = toolState.fillStyle
    }

}
