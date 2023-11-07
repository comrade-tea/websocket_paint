import {Tool} from "./Tool.js";

export class Rect extends Tool {
    constructor(canvas) {
        super(canvas);
        this.listen()
    }

    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
    }

    mouseUpHandler(e) {
        this.mouseDown = false
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

            this.draw(this.startX, this.startY, width, height)
        }
    }

    draw(x, y, w, h) {
        const img = new Image()
        img.src = this.saved
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height) // clear canvas
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height) // return "saved" canvass
            this.ctx.beginPath()

            this.ctx.rect(x, y, w, h)
            this.ctx.fill() // залить
            this.ctx.stroke() // обвести
        }
    }
}
