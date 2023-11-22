import "../styles/toolbar.scss"
import {toolState} from "../store/toolState.js"
import {useCallback, useEffect, useState} from "react"
import {Eraser} from "../tools/Eraser.js"
import {observer} from "mobx-react-lite"

export const SettingBar = observer(() => {
    const onFillChange = useCallback((e) => {
        toolState.setStrokeColor(e.target.value)
        toolState.setFillColor(e.target.value)
    }, [])


    const strokeWidthHandle = (e) => {
        const width = +e.target.value

        if (width > 50 || width < 1) {
            return
        }

        toolState.setStrokeWidth(width)
    }
    
    const colorsAreChangable = toolState?.tool?.constructor?.name !== Eraser?.name

    return (
        <div className="settingbar px-4">
            <div className="d-flex gap-3 align-items-baseline w-100">
                <div>
                    <label className="me-2" htmlFor="line-width">Stroke width:</label>
                    <input id="line-width"
                           onChange={strokeWidthHandle}
                           type="number" min={1} max={50} value={toolState.lineWidth}/>
                </div>

                {colorsAreChangable && (
                    <div className="d-flex align-items-center">
                        <label className="me-2" htmlFor="stroke-color">Stroke color:</label>
                        <input id="stroke-color"
                               onChange={e => toolState.setStrokeColor(e.target.value)}
                               type="color"/>
                    </div>
                )}

                {colorsAreChangable && (
                    <div className="d-flex align-items-center">
                        <label className="me-2" htmlFor="fill-color">Fill color:</label>
                        <input id="fill-color" onChange={onFillChange} type="color"/>
                    </div>
                )}

                {/*<div className="ms-auto">*/}
                {/*    <button onClick={testFunc} type="button">checker</button>*/}
                {/*</div>*/}
            </div>
        </div>
    )
})
