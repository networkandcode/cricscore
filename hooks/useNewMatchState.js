import { appwrite, server } from '../utils/appwrite'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'

const newMatchContext = createContext({})
export const useNewMatch = () => useContext(newMatchContext)
const { Provider } = newMatchContext

export const NewMatchProvider = ({ children }) => {
    const newMatch = useNewMatchProvider()
    return <Provider value={newMatch}> {children} </Provider>
}

const useNewMatchProvider = () => {
    
    const router = useRouter()
    
    const [ newMatch, setNewMatch ] = useState({
        matchName: '',
        matchNoOfPlayers: 4,
        matchNoOfOvers: 4,
        matchPlace: 'Thengapattanam',
        matchStatus: 'Started',
        teamAName: 'World Rockers',
        teamAPlayers: [  'Alan Donald', 'Brian Lara', 'Sachin Tendulkar', 'Shahid Afridi' ],
        teamBName: 'Universal Stars',
        teamBPlayers: [ 'Courtney Walsh', 'Mohamed Azarudeen', 'Vivian Richards', 'Adam Gilchrist' ],
        tossWinner: '',
        tossWinnerChoice: '',
        userID: '',
        winner: ''
    })
    
    const [ formNumber, setFormNumber ] = useState(1)
    
    
    const [ matches, setMatches ] = useState([])
    const [ status, setStatus ] = useState({})
    
    const addMatch = async(userID) => {
        
        await appwrite.database.createDocument(server.matchesCollectionID, 'unique()', { ...newMatch, userID }).then(
            res => {
                // setNewMatch(res)
                setNewMatch({ ...res })
                const temp = [ ...matches, res ]
                setMatches([ ...temp ])
                setStatus({ res: 'New match added' , err: '' })
                router.push('/')
            },
            err => {
                setStatus({ res: '', err: 'New match not added' })
                console.log(err.message)
            }
        )
    }
    
    const addTeamPlayer = (player, suffix) => {
        
        if(suffix === 'A') {
            let { teamAPlayers } = newMatch
            teamAPlayers = [ ...teamAPlayers, player ]
            setNewMatch({ ...newMatch, teamAPlayers })
        } else if (suffix === 'B') {
            let { teamBPlayers } = newMatch
            teamBPlayers = [ ...teamBPlayers, player ]
            setNewMatch({ ...newMatch, teamBPlayers })
        }
        
    }
    
    const getMatches = async() => {
        await appwrite.database.listDocuments(server.matchesCollectionID).then(
            res => {
                setMatches(res.documents)
            },
            err => {
                console.log(err)
            }
        )
    }
    
    const incFormNumber = () => {
        setFormNumber(formNumber + 1)
    }
    
    const onChange = e => {
        const { name, value } = e.target
        if (name === 'matchName'){
            // newMatchName is unique
            if(!matches.some( i => i.newMatchName === value)){
                setNewMatch({ ...newMatch, [name]: value })   
            }
        } else {
            setNewMatch({ ...newMatch, [name]: value })
        }
    }
    
    const redFormNumber = e => {
        setFormNumber(formNumber - 1) 
    }
    
    const rmnewMatch = async(i) => {
        const newMatchID = i.$id
        await appwrite.database.deleteDocument(server.newMatchesCollectionID, newMatchID).then(
            res => {
                let temp = matches
                temp.forEach( (i, idx) => {
                    if(i.$id === newMatchID) {
                        temp.splice(idx, 1)
                        setMatches([...temp])
                    }
                })
            },
            err => {
                console.log(err.message)
            }
        )
    }
    
    const rmTeamPlayer = (p, suffix) => {
        if(suffix === 'A') {
            let { teamAPlayers } = newMatch
            const idx = teamAPlayers.indexOf(p)
            teamAPlayers.splice(idx, 1)
            setNewMatch({ ...newMatch, teamAPlayers })
        } else if (suffix === 'B') {
            let { teamBPlayers } = newMatch
            const idx = teamBPlayers.indexOf(p)
            teamBPlayers.splice(idx, 1)
            setNewMatch({ ...newMatch, teamBPlayers })
        }
    }
    
    useEffect(() => {
        getMatches()       
    }, [])
    
    return {
        addMatch,
        addTeamPlayer,
        formNumber,
        incFormNumber,
        matches,
        newMatch,
        onChange,
        redFormNumber,
        rmnewMatch,
        rmTeamPlayer,
        status,
    }
}