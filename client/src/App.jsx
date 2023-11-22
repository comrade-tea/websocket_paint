import './styles/app.scss'

import {SettingBar} from "./components/SettingBar.jsx";
import {Toolbar} from "./components/Toolbar.jsx";
import {Canvas} from "./components/Canvas.jsx";
import {Chat} from "./components/Chat/Chat.jsx"

const App = () => {
    return (
        <div className="app">
            <SettingBar/>
            <Toolbar/>
            <Canvas/>
            
            {/*<Chat/>*/}
        </div>
    )
}

export default App
