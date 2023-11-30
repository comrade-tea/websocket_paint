import './styles/app.scss'
import {useNavigate} from "react-router-dom";
import {Footer} from "./components/Footer.jsx"
import {axiosInstance} from "./utils/utils.js"
import {useCallback, useState} from "react"


export const Home = () => {
    const navigate = useNavigate()
    const [connectionInput, setConnectionInput] = useState("")
    const [invalidRoom, setInvalidRoom] = useState(null)

    const onConnectionInputChange = useCallback((e) => {
        setInvalidRoom(false)
        setConnectionInput(e.target.value)
    }, [])

    
    const handleConnecting = (e) => {
        e.preventDefault()

        axiosInstance.get(`/image?id=${connectionInput}`)
            .then(response => {
                navigate(connectionInput)
            })
            .catch(function (error) {
                setInvalidRoom(true)

                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
            });
    }

    const handleCreating = () => navigate(`f${(+new Date).toString(16)}`)

    return (
        <div className="app">
            <div className="container-sm my-auto">
                <div style={{maxWidth: 640}}>
                    <h1 className="h2 mb-4">CanvasCraft: unleash your creativity online!</h1>
                    
                    <p>This project is an online paint application using WebSocket technology. The app includes the
                        ability to save the drawing state and an online chat feature.</p>
                    <p>For the client-side, the following were used: React, Websocket, React-bootstrap</p>
                    <p>The server-side is built with Node.js using Express.</p>

                    <button className="btn btn-primary w-50" type="button" onClick={handleCreating}>
                        Create new room
                    </button>

                    <div className="my-3"><em>or enter id of existing room</em></div>
                    
                    <form onSubmit={handleConnecting}>
                        <div className="row gx-2">
                            <div className="col-md-5">
                                <input className={`form-control ${invalidRoom ? "is-invalid" : ""}`}
                                       onChange={onConnectionInputChange} value={connectionInput} type="text"/>
                                <div className="invalid-feedback">There is no room with such id</div>
                            </div>
                            <div className="col-md-4">
                                <button className="btn btn-outline-primary">connect</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            
            <Footer/>
            <div className="todo">
                
            </div>
        </div>
    )
}
