import './styles/app.scss'

import {SettingBar} from "./components/SettingBar.jsx";
import {Toolbar} from "./components/Toolbar.jsx";
import {Canvas} from "./components/Canvas.jsx";
import {Chat} from "./components/Chat/Chat.jsx"
import {Footer} from "./components/Footer.jsx"

const App = () => {
    return (
        <div className="app">
            <div className="app__inner">
                <Toolbar/>
                <SettingBar/>
                <Canvas/>
            </div>

            <Chat/>
            <Footer/>
        </div>
    )
}

export default App
