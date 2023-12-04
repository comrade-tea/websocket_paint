import {createContext, useContext, useState} from "react"


const AppContext = createContext({
    enterToasts: [],
    leaveToasts: [],
    addEnterToast(userInfo) {
    },
    addLeaveToast(userInfo) {
    },
})

export const useAppContext = () => useContext(AppContext)
export const AppContextProvider = props => {
    const [enterToasts, setEnterToasts] = useState([])
    const [leaveToasts, setLeaveToasts] = useState([])
    
    const addEnterToast = (userInfo) => {
        setEnterToasts(prev => ([...prev, userInfo]))

        setTimeout(() => {
            setEnterToasts(enterToasts.filter((toast) => toast.id !== userInfo.id))
        }, 2000)
    }

    const addLeaveToast = (userInfo) => {
        setLeaveToasts(prev => ([...prev, userInfo]))
 
        setTimeout(() => {
            setLeaveToasts(enterToasts.filter((toast) => toast.id !== userInfo.id))
        }, 2000)
    }
    
    return (
        <AppContext.Provider value={{enterToasts, leaveToasts, addEnterToast, addLeaveToast}}>
            {props.children}
        </AppContext.Provider>
    )
}
