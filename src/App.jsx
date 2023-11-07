import './styles/app.scss'

import {SettingBar} from "./components/SettingBar.jsx";
import {Toolbar} from "./components/Toolbar.jsx";
import {Canvas} from "./components/Canvas.jsx";

const App = () => {

    return (
        <div className="app">
            <SettingBar/>
            <Toolbar/>
            <Canvas/>
        </div>
    )
}

export default App
