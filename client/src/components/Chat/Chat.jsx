import React, {useCallback, useEffect, useRef, useState} from 'react'
import $ from "./chat.module.scss"
import {socketState} from "../../store/socketState.js"
import {canvasState} from "../../store/canvasState.js"
import {observer} from "mobx-react-lite"
import {v4 as uuidv4} from 'uuid';
import {FaChevronUp, FaCross} from "react-icons/fa"
import {FaX} from "react-icons/fa6"

export const Chat = observer(() => {
    const messagesContainerRef = useRef(null)
    
    const [chatIsActive, setChatIsActive] = useState(true)
    const [users, setUsers] = useState([])
    const [messages, setMessages] = useState([])
    const [messagesMask, setMessagesMask] = useState(0)
    
    // const notifications = messages.length - messagesMask
    const notifications = 10
    
    useEffect(() => {
        /* scroll-down on new message/toggle */
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight 
        
        if (chatIsActive) {
            setMessagesMask(0)
            return
        }
        
        if (messagesMask === 0) {
            setMessagesMask(messages.length)
        }
    }, [messages, chatIsActive]);


    useEffect(() => {
        /* after assigning a username, create a connection */
        if (socketState.socket) {
            socketState.addOnMessageHandler((e) => {
                const msg = JSON.parse(e.data)
                console.log("----", msg)
                
                switch (msg.method) {
                    case "connection": {
                        console.log("----", msg)
                        setUsers(msg.users)
                        setMessages(msg.messages)
                        break
                    }
                    case "chat": {
                        setMessages(msg.messages)
                        break
                    }
                    case "userHasLeft": {
                        console.log("----", "user has left", msg.users)
                        setUsers(msg.users)
                        break
                    }
                }
            })
        }
    }, [socketState.socket])
    

    const onFormSubmit = (e) => {
        e.preventDefault()

        if (e.target.text.value.length === 0) {
            return
        }

        socketState.sendMessage(JSON.stringify({
            method: "chat",
            message: {
                id: canvasState.sessionId,
                key: uuidv4(),
                username: canvasState.username,
                text: e.target.text.value,
            },
        }))
        e.target.reset()
    }

    const handleChatToggle = () => {
        setChatIsActive(!chatIsActive)
    }
    
    return (
        <div className={$.chat}>
            <div className={$.head}>
                <div className="fs-5 fw-bold">Chat</div>
                {messagesMask > 0 && notifications > 0 && <span className="badge rounded-pill text-bg-danger ms-3">{notifications}</span>}
                
                <button className="btn btn-light btn-sm lh-1 ms-auto" type="button" title="toggle"
                        onClick={handleChatToggle}>
                    {chatIsActive ? <FaX/> : <FaChevronUp/>}
                </button>
            </div>
            
            <div className={`${$.body} ${!chatIsActive ? "d-none" : ""}`}>
                <div className="row gx-0 flex-grow-1">
                    <div className="col-8">
                        <div className="p-2 pe-0 d-flex flex-column">
                            <h5 className="pb-2 mb-0 border-bottom">Messages:</h5>
                            <ul ref={messagesContainerRef} className="list-unstyled overflow-auto flex-1 d-flex flex-column gap-1 mb-0 pe-2" style={{height: 300}}>
                                {messages.length > 0
                                    ?
                                    messages.map(({key, username, text}) => (
                                        <li className="d-flex align-items-baseline text-break" key={key}>
                                            <mark style={{flex: "0 0 80px"}} className="d-inline-block text-end text-truncate me-2" title={username}>
                                                {username}:
                                            </mark> 
                                            <span>{text}</span>
                                        </li>
                                    ))
                                    : <em>The chat is empty</em>
                                }
                            </ul>
                        </div>
                    </div>
                    
                    <div className="col-4 border-start border-4 py-2 ps-3">
                        <h5 className="mb-2">Users:</h5>
                        
                        <ul className="pe-1" style={{fontSize: 12}}>
                            {users.length > 0
                                ? users.map(user => (<li className="text-truncate" key={user.id}>{user.username}</li>))
                                : <em>Nobody's here</em>
                            }
                        </ul>
                    </div>
                </div>

                <form className="input-group input-group" onSubmit={onFormSubmit}>
                    <input className="form-control rounded-0 shadow-none" name="text" id="text" type="text" placeholder="your message"/>
                    <button className="btn btn-outline-primary rounded-0 shadow-none" type="submit">send</button>
                </form>
            </div>
        </div>
    )
})
