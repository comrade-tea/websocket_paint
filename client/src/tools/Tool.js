export class Tool {
    constructor(canvas, socket, id) {
        this.canvas = canvas 
        this.socket = socket
        this.id = id
        this.ctx = canvas.getContext("2d") // context - object for manipulations
        this.destroyEvents()
    }
    
    /* 
    * set - делает метод свойством, не вызов функции а присваивание
    * */
    set fillColor(color) {
        this.ctx.fillStyle = color
    }
    
    set strokeColor(color) {
        this.ctx.strokeStyle = color
    }

    set lineWidth(width) {
        this.ctx.lineWidth = width
    }

    /* clear old listeners on tool change */
    destroyEvents() {
        this.canvas.onmousemove = null
        this.canvas.onmousedown = null  
        this.canvas.onmouseup = null
    }
}
