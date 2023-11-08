import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/canvas.scss'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom"
import {Home} from "./Home.jsx"

const router = createBrowserRouter(
    createRoutesFromElements(
        [
            <Route path="/" element={<Home/>}/>,
            <Route path=":id" element={<App/>}/>,
        ],
    ),
);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
)
