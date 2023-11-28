import './styles/app.scss'
import {useNavigate} from "react-router-dom";


export const Home = () => {
    const navigate = useNavigate()

    const onClick = () => navigate(`f${(+new Date).toString(16)}`)
    
    return (
        <div className="app">
            <div className="container-sm my-auto">
                <div style={{maxWidth: 640}}>
                    <h1 className="h2 mb-4">CanvasCraft: unleash your creativity online!</h1>
                    
                    <p>This project is an online paint application using WebSocket technology. The app includes the
                        ability to save the drawing state and an online chat feature.</p>
                    <p>The server-side is built with Node.js using Express.</p>
                    
                    <button className="btn btn-primary w-50" type="button" onClick={onClick}>create room</button>
                </div>
            </div>
        </div>
    )
}
