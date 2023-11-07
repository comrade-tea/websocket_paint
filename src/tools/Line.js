import {Tool} from "./Tool.js";

export class Line extends Tool {
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

        this.startPoint = {x: e.pageX - e.target.offsetLeft, y: e.pageY - e.target.offsetTop}
        this.saved = this.canvas.toDataURL()
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            this.draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
        }
    }

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
}
