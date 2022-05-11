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
    
    const [ matchState, setMatchState ] = useState({
        matchName: '',
        matchNoOfPlayers: 3,
        matchNoOfOvers: 3,
        matchPlace: 'Thengapattanam',
        matchStatus: 'innings1Started',
        teamAName: 'Team Shark',
        teamAPlayers: ['Ihthisham', 'Isham', 'Imran'],
        teamBName: 'Team Lions',
        teamBPlayers: ['Shakir', 'Sajjad', 'Ahmed'],
        tossWinner: '',
        tossWinnerChoice: '',
        userID: '',
        winner: ''
    })
    
    const [ formNumber, setFormNumber ] = useState(1)
    
    const [ firstInningBatsmen, setFirstInningBatsmen ] = useState([])
    const [ firstBattingTeam, setFirstBattingTeam ] = useState('')
    const [ firstInningsRuns, setFirstInningsRuns ] = useState(0)
    const [ firstInningsWickets, setFirstInningsWickets ] = useState(0)
    
    const [ secondInningBatsmen, setSecondInningBatsmen ] = useState([])
    const [ secondBattingTeam, setSecondBattingTeam ] = useState('')
    const [ secondInningsRuns, setSecondInningsRuns ] = useState(0)
    const [ secondInningsWickets, setSecondInningsWickets ] = useState(0)
    
    const [ batsmen, setBatsmen ] = useState([])
    const [ battingScoreCard, setBattingScoreCard ] = useState([])
    const [ matches, setMatches ] = useState([])
    const [ overs, setOvers ] = useState([])
    const [ status, setStatus ] = useState({})
    
    const addMatch = async(userID) => {
        
        await appwrite.database.createDocument(server.matchesCollectionID, 'unique()', { ...matchState, matchStatus: 'started', userID }).then(
            res => {
                // setMatchState(res)
                setMatchState({ ...res })
                const temp = [ ...matches, res ]
                setMatches([ ...temp ])
                setStatus({ res: 'Update successful' , err: '' })
                router.push('/')
            },
            err => {
                setStatus({ res: '', err: 'Update unsuccessful' })
            }
        )
    }
    
    const addOver = async(overState) => {
        console.log(`add over for ${matchState.$id}`)
        await appwrite.database.createDocument(server.oversCollectionID, 'unique()', { ...overState, matchID: matchState.$id }).then(
            res => {
                setOvers([ ...overs, res ])
            },
            err => {
                console.log(err.message)
            }
        )
    }
    
    const addTeamPlayer = (player, suffix) => {
        
        if(suffix === 'A') {
            let { teamAPlayers } = matchState
            teamAPlayers = [ ...teamAPlayers, player ]
            setMatchState({ ...matchState, teamAPlayers })
        } else if (suffix === 'B') {
            let { teamBPlayers } = matchState
            teamBPlayers = [ ...teamBPlayers, player ]
            setMatchState({ ...matchState, teamBPlayers })
        }
        
    }
    
    const getBattingScoreCard = async() => {
        if(matchState.$id){
            await appwrite.database.listDocuments(server.batScoreCollectionID,  [Query.equal('matchID', matchState.$id)]).then(
                res => {
                    setBattingScoreCard(res.documents)
                },
                err => {
                    console.log(err.message)
                }
            )
        }
    }
    
    const getOvers = async() => {
        if(matchState.$id){
            await appwrite.database.listDocuments(server.oversCollectionID,  [Query.equal('matchID', matchState.$id)]).then(
                res => {
                    setOvers([ ...res.documents ])
                },
                err => {
                    console.log(err.message)
                }
            )    
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
            // matchName is unique
            if(!matches.some( i => i.matchName === value)){
                setMatchState({ ...matchState, [name]: value })   
            }
        } else {
            setMatchState({ ...matchState, [name]: value })
        }
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
                        setOvers([])
                        setBattingScoreCard([])
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
            let { teamAPlayers } = matchState
            const idx = teamAPlayers.indexOf(p)
            teamAPlayers.splice(idx, 1)
            setMatchState({ ...matchState, teamAPlayers })
        } else if (suffix === 'B') {
            let { teamAPlayers } = matchState
            const idx = teamAPlayers.indexOf(p)
            teamAPlayers.splice(idx, 1)
            setMatchState({ ...matchState, teamAPlayers })
        }
    }
    
    const updateBattingScore = async( batsmanData ) => {
        
        let promise
        
        if(batsmanData.$id) {
            console.log('creating batsmanData')
            promise = appwrite.database.updateDocument(server.batScoreCollectionID, batsmanData.$id, { ...batsmanData, matchID: matchState.$id })
        } else {
            console.log('updating batsmanData')
            promise = appwrite.database.createDocument(server.batScoreCollectionID, 'unique()', { ...batsmanData, matchID: matchState.$id })
        }
        
        await promise.then(
            res => {
                return res.$id
                setBatsmen([ ...batsmen, res ])
                getBattingScoreCard()
                setStatus({ res: 'Update successful' , err: '' })
            },
            err => {
                setStatus({ res: '', err: 'Update unsuccessful' })
                console.log(err.message)
            }
        )
    }
    
    const updateMatchState = (matchID) => {
        matches.forEach( i => {
            if ( i.$id === matchID ) {
                setMatchState(i)
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
        getMatches()
    }, [])
    
    useEffect(() => {
        if(router.route.includes('/score') && matches.length > 0){
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
    
    useEffect(() => {
        getBattingScoreCard()
        getOvers()
    }, [ matchState.$id ])
    
    useEffect(() => {
        
        let runs1 = 0
        let runs2 = 0
        
        let wkts1 = 0
        let wkts2 = 0
            
        overs.forEach( i => {
            if(i.innings === 1) {
                runs1 += i.runs
                wkts1 += i.wickets
            } else if (i.innings === 2) {
                runs2 += i.runs
                wkts2 += i.wickets
            }
        })
        
        if(runs1) setFirstInningsRuns(runs1)
        if(runs2) setSecondInningsRuns(runs2)
        if(wkts1) setFirstInningsWickets(wkts1)
        if(wkts2) setSecondInningsWickets(wkts2)
        
    }, [ overs, router ])
    
    return {
        addMatch,
        addTeamPlayer,
        addOver,
        battingScoreCard,
        firstBattingTeam,
        firstInningsRuns,
        firstInningsWickets,
        formNumber,
        getBattingScoreCard,
        getMatches,
        getOvers,
        incFormNumber,
        matches,
        matchState,
        onChange,
        overs,
        redFormNumber,
        rmMatch,
        rmTeamPlayer,
        secondBattingTeam,
        secondInningsRuns,
        secondInningsWickets,
        status,
        updateBattingScore,
        updateMatchStatus
    }
}