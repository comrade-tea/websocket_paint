import './styles/app.scss'
import {useNavigate} from "react-router-dom";


export const Home = () => {
    const navigate = useNavigate()

    const onClick = () => navigate(`f${(+new Date).toString(16)}`)
    
    return (
        <div className="app">
            <button type="button" onClick={onClick}>create room</button>
        </div>
    )
}
