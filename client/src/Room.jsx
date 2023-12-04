import './styles/app.scss'

import {SettingBar} from "./components/SettingBar.jsx"
import {Toolbar} from "./components/Toolbar.jsx"
import {Canvas} from "./components/Canvas.jsx"
import {Chat} from "./components/Chat/Chat.jsx"
import {Footer} from "./components/Footer.jsx"
import {ToastContainer} from "react-bootstrap"
import React, {useState} from "react"
import {ToastFactory} from "./components/ToastFactory.jsx"
import {useAppContext} from "./contexts/AppContext.jsx"
import toast from "bootstrap/js/src/toast.js"

const Room = () => {
    const {enterToasts, leaveToasts} = useAppContext()

    return (
        <div className="app">
            <div className="app__inner">
                <Toolbar/>
                <SettingBar/>
                <Canvas/>
            </div>

            <Chat/>

            <ToastContainer className="p-3 position-fixed" style={{zIndex: 1, bottom: 40, left: 0}}>
                {enterToasts.length > 0 && (
                    enterToasts.map((toast) => (
                        <ToastFactory key={toast.id} type="enter" username={toast.username} message="User entered the application."/>
                    ))
                )}
                {leaveToasts.length > 0 && (
                    leaveToasts.map((toast) => (
                        <ToastFactory key={toast.id} type="leave" username={toast.username} message="User left the application."/>
                    ))
                )}
            </ToastContainer>

            <Footer/>
        </div>
    )
}

export default Room
