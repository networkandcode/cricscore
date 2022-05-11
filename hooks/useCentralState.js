// hooks/useCentralState.js

import { appwrite, server } from '../utils/appwrite'
import { createContext, useContext, useEffect, useState } from 'react'

const centralStateContext = createContext({})
const { Provider } = centralStateContext 

export const CentralStateProvider = ({ children }) => {
    const centralState = useCentralStateProvider()
    return <Provider value={centralState}> { children } </Provider>
}

export const useCentralState = () => useContext(centralStateContext)

export const useCentralStateProvider = () => {
    
    const [ players, setPlayers ] = useState([])
    const [ status, setStatus ] = useState({ res: '', err: '', progress: '' })
    const [ user, setUser ] = useState(null)
    
    const addPlayer = async(player) => {
        const temp = [ ...players, player ]
        await updateDocument(temp)
    }
    
    const clearStatus = () => {
        setStatus({ res: '', err: '', progress: '' })
    }
    
    const createDocument = async() => {
        if(user?.email) {
            await appwrite.database.createDocument(server.collectionID, user.$id, { username: user.email, players: [] }).then(
                res => {
                    setPlayers(res.players)
                }
            )
        }
    }
    
    const getUser = async() => {
        await appwrite.account.get().then(
            res => {
                setUser(res),
                setStatus({ res: 'Authenticated successfully', err: '', progress: '' })
            },
            err => {
                setUser({ $id: '' })
                setStatus({ res: '', err: 'Redirecting to authenticate', progress: '' })
            },
            progress => {
                setStatus({ res: '', err: '', progress: 'Retreiving account details' })
            }
        )
    }
    
    const getPlayers = async() => {
        await appwrite.database.getDocument(server.collectionID, user.$id).then(
            res => {
                if(res) {
                    setPlayers(res.players)
                }
            },
            err => {
                createDocument()
            }
        )
    }
    
    const rmPlayer = async(player) => {
        let temp = [...players]
        const idx = temp.indexOf(player)
        
        if(idx !== -1){
            temp.splice(idx, 1)
            updateDocument(temp)
        }
    }
    
    const updateDocument = async(temp) => {
        await appwrite.database.updateDocument(server.collectionID, user.$id, { username: user.email, players: temp }).then(
            res => {
                if(res) {
                    setPlayers(res.players)
                    setStatus({ res: 'Update successful', err: '', progress: '' })               
                }
            },
            err => {
                setStatus({ res: '', err: 'Update unsuccessful', progress: '' })
            },
            progress => {
                setStatus({ res: '', err: '', progress: 'Update in progress' })
            }
        )
    }
 
    const userLogin = async(username, password) => {
        await appwrite.account.createSession(username, password).then(
            res => {
                if(res){
                    setStatus({ res: 'Login successful', err: '', progress: '' })
                    getUser()
                }
            },
            err => {
                setStatus({ res: '', err: 'Login unsuccessful', progress: '' })
                console.log(err.message)
            },
            progress => {
                setStatus({ res: '', err: '', progress: 'Login in progress' })
            }
        )
    }
    
    const userLogout = async() => {
        return await appwrite.account.deleteSession('current').then(
            res => {
                setUser({})
                setStatus({ res: 'Logout successful', err: '', progress: '' })
            },
            err => {
                setStatus({ res: '', err: 'Logout unsuccessful', progress: '' })
            },
            progress => {
                setStatus({ res: '', err: '', progress: 'Logout in progress' })
            }
        )
    }
    
    const userSignup = async(username, password, name) => {
        await appwrite.account.create('unique()', username, password, name).then(
            res => {
                if(res){
                    setStatus({ res: 'Signup successful', err: '', progress: '' })
                    userLogin(username, password)
                }
            },
            err => {
                setStatus({ res: '', err: 'Signup unsuccessful', progress: '' })
            },
            progress => {
                setStatus({ res: 'Signup in progress', err: '', progress: '' })
            }
        )
    }
    
    useEffect(() => {
        getUser()
    }, [])
    
    useEffect(() => {
        if(status?.res || status?.err || status?.progress) {
            setTimeout(() => {
                        clearStatus()
            }, 3000)
        }
    }, [ status ])
    
    useEffect(() => {
        if(user?.$id) {
            getPlayers()
        }
    }, [ user ])
    
    return {
        addPlayer,
        clearStatus,
        getUser,
        players,
        rmPlayer,
        status,
        user,
        userLogin,
        userLogout,
        userSignup
    }
}