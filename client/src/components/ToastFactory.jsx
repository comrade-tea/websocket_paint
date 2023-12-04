import React, {useState} from 'react'
import {Toast, ToastContainer} from "react-bootstrap"

export const ToastFactory = ({type, username, message, onClose}) => {
    
    const renderToast = () => {
        switch (type) {
            case "enter":
                return (
                    <Toast show={true} bg="success" autohide={true} delay={3000} onClose={onClose}>
                        <Toast.Header closeButton={true}>
                            <strong className="me-auto">User {username} enters the room!</strong>
                        </Toast.Header>
                        {/*<Toast.Body><span className="text-white">{message}</span></Toast.Body>*/}
                    </Toast>
                )
            case "leave":
                return (
                    <Toast show={true} bg="warning" autohide={true} delay={3000} onClose={onClose}>
                        <Toast.Header closeButton={true}>
                            <strong className="me-auto">User {username} leaves the room</strong>
                        </Toast.Header>
                        {/*<Toast.Body><span className="text-white">{message}</span></Toast.Body>*/}
                    </Toast>
                )
        }
    }

    return renderToast()
}
