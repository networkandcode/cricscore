import { appwrite, server } from '../utils/appwrite'
import { Query } from 'appwrite'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'

const matchStateContext = createContext({})
export const useMatchState = () => useContext(matchStateContext)
const { Provider } = matchStateContext

export const MatchStateProvider = ({ children }) => {
    const matchState = useMatchStateProvider()
    return <Provider value={matchState}> {children} </Provider>
}

const useMatchStateProvider = () => {
    
    const router = useRouter()
    
    const [ matchState, setMatchState ] = useState({ })
    
    const [ formNumber, setFormNumber ] = useState(1)
    
    const [ firstInningBatsmen, setFirstInningBatsmen ] = useState([])
    const [ firstBattingTeam, setFirstBattingTeam ] = useState('')
    
    
    const [ secondInningBatsmen, setSecondInningBatsmen ] = useState([])
    const [ secondBattingTeam, setSecondBattingTeam ] = useState('')
    
    const [ batsmen, setBatsmen ] = useState([])
    const [ matches, setMatches ] = useState([])
    const [ status, setStatus ] = useState({})
    
    
    
    
    
    const getMatches = async() => {
        console.log('get matches from backend')
        await appwrite.database.listDocuments(server.matchesCollectionID).then(
            res => {
                setMatches([ ...res.documents ])
            },
            err => {
                console.log(err)
            }
        )
    }
    
    const incFormNumber = () => {
        setFormNumber(formNumber + 1)
    }
    
    const redFormNumber = e => {
        setFormNumber(formNumber - 1) 
    }
    
    const rmMatch = async(i) => {
        const matchID = i.$id
        await appwrite.database.deleteDocument(server.matchesCollectionID, matchID).then(
            res => {
                let temp = matches
                temp.forEach( (i, idx) => {
                    if(i.$id === matchID) {
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
    
    const updateMatchState = (matchID) => {
        matches.forEach( i => {
            if ( i.$id === matchID ) {
                setMatchState({...i})
            }
        })
    }
    
    const updateMatchStatus = async ( data ) => {
        let promise = appwrite.database.updateDocument(server.matchesCollectionID, matchState.$id, { ...matchState,  ...data })
        
        await promise.then(
            res => {
                setMatchState({ ...matchState, ...data })
                setStatus({ res: 'Update successful' , err: '' })
            },
            err => {
                setStatus({ res: '', err: 'Update unsuccessful' })
                console.log(err.message)
            }
        )
    }
    
    useEffect(() => {
        console.log('get matches')
        getMatches()
    }, [])
    
    useEffect(() => {
        if(router.route.includes('/match') && matches.length > 0){
            console.log('update match state')
            const { matchID } = router.query
            updateMatchState(matchID)
        }
    }, [ matches, router ])
    
    useEffect(() => {
        if(matchState.tossWinner === matchState.teamAName) {
            if(matchState.tossWinnerChoice === 'Bat first') {
                setFirstBattingTeam(matchState.teamAName)
                setFirstInningBatsmen(matchState.teamAPlayers)
                
                setSecondBattingTeam(matchState.teamBName)
                setSecondInningBatsmen(matchState.teamBPlayers)
            } else {
                setFirstBattingTeam(matchState.teamBName)
                setFirstInningBatsmen(matchState.teamBPlayers)
                
                setSecondBattingTeam(matchState.teamAName)
                setSecondInningBatsmen(matchState.teamAPlayers)
            }
        } else {
            if(matchState.tossWinnerChoice === 'Bat first') {
                setFirstBattingTeam(matchState.teamBName)
                setFirstInningBatsmen(matchState.teamBPlayers)
                
                setSecondBattingTeam(matchState.teamAName)
                setSecondInningBatsmen(matchState.teamAPlayers)
            } else {
                setFirstBattingTeam(matchState.teamAName)
                setFirstInningBatsmen(matchState.teamAPlayers)
                
                setSecondBattingTeam(matchState.teamBName)
                setSecondInningBatsmen(matchState.teamBPlayers)
            }
        }
    }, [ matchState ])
    
    
    
    
    
    return {
        firstBattingTeam,
        formNumber,
        getMatches,
        incFormNumber,
        matches,
        matchState,
        redFormNumber,
        rmMatch,
        secondBattingTeam,
        status,
        updateMatchStatus,
    }
}