import React from 'react'
import {FaGithub} from "react-icons/fa"

export const Footer = () => {
    return (
        <footer className="footer px-4 fs-5 base d-flex align-items-center">
            <a className="link-light" href="https://github.com/comrade-tea/websocket_paint"
               target="_blank"><FaGithub className="fs-4 align-baseline"/> sources</a>
            <div className="ms-auto">made by <a className="link-light"
                                                href="https://comrade-tea-projects.netlify.app">comrade-tea</a></div>
        </footer>
    )
}
