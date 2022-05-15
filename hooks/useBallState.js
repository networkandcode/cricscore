// hooks/useBallState.js

import { useMatchState } from './useMatchState'
import { appwrite, server } from '../utils/appwrite'
import { Query } from 'appwrite'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'

const ballStateContext = createContext({})
export const useBallStateContext = () => useContext(ballStateContext)
const { Provider } = ballStateContext

export const BallStateProvider = ({ children }) => {
    const ballState = useBallStateProvider()
    return <Provider value={ballState}> {children} </Provider>
}

const useBallStateProvider = () => {
    const router = useRouter()
    
    const { matchState } = useMatchState()
    
    const [ firstInningsCurrentOver, setFirstInningsCurrentOver ] = useState('')
    const [ firstInningsOvers, setFirstInningsOvers ] = useState([])
    const [ firstInningsRuns, setFirstInningsRuns ] = useState(0)
    const [ firstInningsWickets, setFirstInningsWickets ] = useState(0)
    const [ innings, setInnings ] = useState(1)
    const [ matchID, setMatchID ] = useState('')
    const [ overs, setOvers ] = useState([])
    const [ secondInningsCurrentOver, setSecondInningsCurrentOver ] = useState('')
    const [ secondInningsOvers, setSecondInningsOvers ] = useState([])
    const [ secondInningsRuns, setSecondInningsRuns ] = useState(0)
    const [ secondInningsWickets, setSecondInningsWickets ] = useState(0)
    const [ status, setStatus ] = useState({})
    
    const addOver = async(overState) => {
        console.log('Add over')
        let { $id, ...over } = overState
        console.log(over)
        await appwrite.database.createDocument(server.oversCollectionID, $id , { ...over }).then(
            res => {
                setStatus({ res: 'Over added successfully', err:'' , progress: ''})
            },
            err => {
                console.log(err.message)
            }
        )
    }
    
    const getOvers = async() => {
        if(matchID){
            await appwrite.database.listDocuments(server.oversCollectionID,  [Query.equal('matchID', matchID)]).then(
                res => {
                    setOvers([ ...res.documents ])
                },
                err => {
                    console.log(err.message)
                }
            )    
        }
    }
    
    const updateInnings = (n) => {
        setInnings(n)
    }
    
    const updateOvers = (overState) => {
        console.log('update overs')
        let temp = overs
        let existingBowler = false
        
        overs.forEach( (i, idx) => {
            if(i.$id === overState.$id) {
                temp[idx] = overState
                existingBowler = true
            }
        })
        
        if(existingBowler) {
            console.log('Existing bowler', temp)
            setOvers([ ...temp ])
        } else {
            setOvers([ ...overs, overState ])
        }
    }
    
    useEffect(() => {
        if(router.route.includes('/match')){
            console.log('Setting match ID')
            const mID= router.query.matchID
            if(mID) {
                setMatchID(mID)
            }
        } else {
            setOvers([])
        }
    }, [ router ])
    
    useEffect(() => {
        console.log('getting bowling score card from backend')
        getOvers()
    }, [ matchID ])
    
    useEffect(() => {
        let overs1 = 0
        let overs2 = 0
        
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
        
    }, [ overs ])
    
    useEffect(()=> {
        let temp1 = []
        let temp2 = []
        
        overs.forEach( i => {
            if(i.innings === 1) {
                temp1.push(i)
            } else if(i.innings === 2) {
                temp2.push(i)
            }
        })
        
        setFirstInningsOvers([ ...temp1 ])
        setSecondInningsOvers([ ...temp2 ])
    }, [ innings, overs ])
    
    useEffect (() => {
        let temp = 0
        firstInningsOvers.forEach(i => {
            temp += i.balls
        })
        setFirstInningsCurrentOver(`${~~(temp / 6)}.${~~(temp % 6)}`)
    }, [ firstInningsOvers ])
    
    useEffect(()=> {
        let temp = 0
        secondInningsOvers.forEach(i => {
            temp += i.balls
        })
        setSecondInningsCurrentOver(`${~~(temp / 6)}.${~~(temp % 6)}`)
    }, [ secondInningsOvers ])
    
    useEffect(() => {
        if(matchState.matchStatus === 'Second batting started') {
            if(innings !== 2) {
                console.log('Set innings from match state')
                setInnings(2)
            }
        }
    }, [ matchState ])
    
    return {
        addOver,
        firstInningsCurrentOver,
        firstInningsOvers,
        firstInningsRuns,
        firstInningsWickets,
        innings,
        overs,
        secondInningsCurrentOver,
        secondInningsOvers,
        secondInningsRuns,
        secondInningsWickets,
        updateInnings,
        updateOvers
    }
}