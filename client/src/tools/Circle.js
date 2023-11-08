import {Tool} from "./Tool.js";

export class Circle extends Tool {
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
            
            const maxSize = Math.max(Math.abs(width), Math.abs(height)) 

            this.draw(this.startX, this.startY, maxSize)
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
            this.ctx.fill() // залить
            this.ctx.stroke() // обвести
        }
    }
}
