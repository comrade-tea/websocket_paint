import "../styles/toolbar.scss"
import {toolState} from "../store/toolState.js"

export const SettingBar = () => {
    return (
        <div className="settingbar px-4">
            <div className="d-flex gap-3 align-items-baseline">
                <div>
                    <label className="me-2" htmlFor="line-width">Line width:</label>
                    <input id="line-width"
                           onChange={e => toolState.setStrokeWidth(e.target.value)}
                           type="number" min={1} max={50} defaultValue={1}/>
                </div>

                <div className="d-flex align-items-center">
                    <label className="me-2" htmlFor="stroke-color">Stroke color:</label>
                    <input id="stroke-color"
                           onChange={e => toolState.setStrokeColor(e.target.value)}
                           type="color"/>
                </div>
            </div>
        </div>
    )
}
