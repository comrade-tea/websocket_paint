import "../styles/toolbar.scss"
import {toolState} from "../store/toolState.js"
import {useCallback, useEffect, useState} from "react"
import {Eraser} from "../tools/Eraser.js"
import {observer} from "mobx-react-lite"
import {FaLink} from "react-icons/fa"
import {Link, useParams} from "react-router-dom"
import {Toast, ToastContainer} from "react-bootstrap"

export const SettingBar = observer(() => {
    const params = useParams()
    const [showCopyToast, setShowCopyToast] = useState(false)
    
    const onFillChange = useCallback((e) => {
        toolState.setStrokeColor(e.target.value)
        toolState.setFillColor(e.target.value)
    }, [])

    const addToClipboard = useCallback(() => {
        navigator.clipboard.writeText(params.id)
        setShowCopyToast(true)
    }, [params.id])

    const strokeWidthHandle = (e) => {
        const width = +e.target.value

        if (width > 50 || width < 1) {
            return
        }

        toolState.setStrokeWidth(width)
    }

    const colorsAreChangable = toolState?.tool?.constructor?.name !== Eraser?.name

    return (
        <>
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

                    <div className="ms-auto">
                        <Link className="btn btn-warning me-3" to={"/"}>
                            Return to main page
                        </Link>
                        <button className="btn btn-success" onClick={addToClipboard} type="button">
                            <FaLink className="me-2"/> Copy room id
                        </button>
                    </div>
                </div>
            </div>

            <ToastContainer className="p-3 position-fixed" style={{zIndex: 1, top: 100, right: 0}}>
                <Toast show={showCopyToast} bg={"success"} autohide={true} delay={3000} onClose={() => setShowCopyToast(false)}>
                    <Toast.Header closeButton={true}>
                        <strong className="me-auto">Room ID copied!</strong>
                    </Toast.Header>
                    <Toast.Body><span className="text-white">Share this ID with a friend and have them enter it on the main page!</span></Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    )
})
