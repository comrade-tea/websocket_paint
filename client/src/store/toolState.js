import {makeAutoObservable} from "mobx";

class ToolState {
    tool = null
    fillStyle = "#000"
    strokeStyle = "#000"
    lineWidth = 1
    

    constructor() {
        makeAutoObservable(this)
    }

    get fillStyle() {
        return this.fillStyle
    }
    get strokeStyle() {
        return this.strokeStyle
    }
    get lineWidth() {
        return this.lineWidth
    }
    
    setTool(tool) {
        this.tool = tool
    }

    setFillColor(color) {
        this.fillStyle = color
        this.tool.fillColor = color 
    }
    setStrokeColor(color) {
        this.strokeStyle = color
        this.tool.strokeColor = color
    }
    setStrokeWidth(width) {
        this.lineWidth = width
        this.tool.lineWidth = width
    }
}

export const toolState = new ToolState();
