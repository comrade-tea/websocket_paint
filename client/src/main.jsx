import React from 'react'
import ReactDOM from 'react-dom/client'
import Room from './Room.jsx'
import './styles/canvas.scss'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom"
import {Home} from "./Home.jsx"
import {AppContextProvider} from "./contexts/AppContext.jsx"

const router = createBrowserRouter(
    createRoutesFromElements(
        [
            <Route path="/" element={<Home/>}/>,
            <Route path=":id" element={<Room/>}/>,
        ],
    ),
);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AppContextProvider>
            <RouterProvider router={router}/>
        </AppContextProvider>
    </React.StrictMode>,
)
