import {Brush} from "./Brush.js"

export class Eraser extends Brush {
    constructor(canvas) {
        super(canvas);
    }

    draw(x, y) {
        this.ctx.strokeStyle = "white" // ластик всегда белый 
        this.ctx.lineTo(x, y)
        this.ctx.stroke() // обвести
    }
}


