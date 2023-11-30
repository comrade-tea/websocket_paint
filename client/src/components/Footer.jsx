import React from 'react'
import {FaGithub} from "react-icons/fa"

export const Footer = () => {
    return (
        <footer className="footer px-4 fs-6 base d-flex align-items-center">
            <a className="footer-link"
               href="https://github.com/comrade-tea/websocket_paint" target="_blank">
                <FaGithub className="fs-5 align-baseline"/> github sources
            </a>
            
            <div className="ms-auto">made by <a className="footer-link" href="https://comrade-tea-projects.netlify.app" target="_blank">
                comrade-tea</a>
            </div>
        </footer>
    )
}
