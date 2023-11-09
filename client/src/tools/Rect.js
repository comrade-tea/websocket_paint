import {Tool} from "./Tool.js";

export class Rect extends Tool {
    constructor(canvas, socket, id) {
        super(canvas, socket, id);
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
                type: "rect",
                x: this.startX,
                y: this.startY,
                width: this.width,
                height: this.height,
                color: this.ctx.fillStyle
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
            this.width = currentX - this.startX
            this.height = currentY - this.startY

            this.draw(this.startX, this.startY, this.width, this.height)
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

    static staticDraw(ctx, x, y, w, h, color) {
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.rect(x, y, w, h)
        ctx.fill() // залить
        ctx.stroke() // обвести
    }
}
