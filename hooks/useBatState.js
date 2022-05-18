import { useMatchState } from './useMatchState'
import { appwrite, server } from '../utils/appwrite'
import { Query } from 'appwrite'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'

const batStateContext = createContext({})
export const useBatStateContext = () => useContext(batStateContext)
const { Provider } = batStateContext

export const BatStateProvider = ({ children }) => {
    const batState = useBatStateProvider()
    return <Provider value={batState}> {children} </Provider>
}

const useBatStateProvider = () => {
    const router = useRouter()
    const { matchState } = useMatchState()
    
    const [ battingScoreCard, setBattingScoreCard ] = useState([])
    const [ innings, setInnings ] = useState()
    const [ matchID, setMatchID ] = useState('')
    const [ nonStriker, setNonStriker ] = useState({ })
    const [ status, setStatus ] = useState({ })
    const [ striker, setStriker ] = useState({ })
    
    const onChangeNonStriker = e => {
        const { name, value } = e.target
        if(!value || striker[name] !== value){
            setNonStriker({ ...nonStriker, batsman: value })
        }
    }
    
    const onChangeStriker = e => {
        console.log({ ...striker, [ name ]: value })
        const { name, value } = e.target
        if(!value || nonStriker[name] !== value){
            setStriker({ ...striker, [ name ]: value })
        }
    }
    
    const getBattingScoreCard = async() => {
        let nonStrikerFound = false
        let strikerFound = false
        
        await appwrite.database.listDocuments( server.batScoreCollectionID,  [ Query.equal('matchID', matchID) ] ).then(
            res => {
                setBattingScoreCard([ ...res.documents ])
                res.documents.length > 0 && res.documents.forEach(i => {
                    console.log('set striker and non striker from batting state')
                    
                    if(i.matchID === matchID) {
                        if(i.position === 'striker' && i.innings === innings){
                            console.log('Striker found')
                            strikerFound = true
                            setStriker({ ...i })
                        }
                        if(i.position === 'nonStriker' && i.innings === innings){
                            console.log('Non striker found')
                            nonStrikerFound = true
                            setNonStriker({ ...i })    
                        }
                    }
                })
            },
            err => {
                console.log(err.message)
            }
        )
        
        if(!nonStrikerFound) {
            console.log('Non  striker not found')
            setNonStriker({ $id: '', balls: 0, batsman: '', batsmanNo: 2, innings, matchID, out: false, position: 'nonStriker', runs: 0 })
        }
        
        if(!strikerFound){
            console.log('Striker not found')
            setStriker({ $id: '', balls: 0, batsman: '', batsmanNo: 1, innings, matchID, out: false, position: 'striker', runs: 0 })
            
        }
    }
    
    const updateBattingScore = async( batsmanData ) => {
        let promise
        
        const { $id, ...batsmanDataWithOutId } = batsmanData
        if($id) {
            console.log('updating batsmanData')
            promise = appwrite.database.updateDocument(server.batScoreCollectionID, $id, { ...batsmanData })
        } else {
            console.log('creating batsmanData')
            promise = appwrite.database.createDocument(server.batScoreCollectionID, 'unique()', { ...batsmanDataWithOutId })
        }
        
        await promise.then(
            res => {
                if(batsmanData.position ==='striker') {
                    setStriker({ ...res })
                } else if(batsmanData.position === 'nonStriker') {
                    setNonStriker({ ...res })
                } 
                setStatus({ res: 'Update successful' , err: '' })
            },
            err => {
                setStatus({ res: '', err: 'Update unsuccessful' })
                console.log(err.message)
            }
        )
    }
    
    const batsmanOut =  async( position, batsmanData, nextBatsman ) => {
        console.log(batsmanData)
        console.log('next batsman', nextBatsman)
        let promise
        
        const { $id, ...batsmanDataWithOutId } = batsmanData
    
        if($id) {
            console.log('updating batsmanData')
            promise = appwrite.database.updateDocument(server.batScoreCollectionID, $id, { ...batsmanData })
        } else {
            console.log('creating batsmanData')
            promise = appwrite.database.createDocument(server.batScoreCollectionID, 'unique()', { ...batsmanDataWithOutId })
        }
        
        await promise.then(
            res => {
                if(position === 'nonStriker') {
                    let temp = battingScoreCard
                    let nonStrikerIdx
                    
                    temp.forEach( (i, idx) => {
                        if( i.matchID === nonStriker.matchID && i.innings === nonStriker.innings && i.batsmanNo === nonStriker.batsmanNo ) {
                            nonStrikerIdx = idx
                        }
                    })
                    
                    temp[nonStrikerIdx] = { ...temp[nonStrikerIdx], ...batsmanData, $id: res.$id }
                    temp = [ ...temp ]
                    
                    setBattingScoreCard([ ...temp ])
                    if(nextBatsman) {
                        setNonStriker({ ...nextBatsman })
                    } else {
                        setNonStriker({ ...nonStriker, $id: res.$id, out: true })
                    }
                } else if(position === 'striker') {
                    let temp = battingScoreCard
                    let strikerIdx
                    
                    temp.forEach( (i, idx) => {
                        if( i.matchID === striker.matchID && i.innings === striker.innings && i.batsmanNo === striker.batsmanNo ) {
                            strikerIdx = idx
                        }
                    })
                    
                    temp[strikerIdx] = { ...temp[strikerIdx], ...batsmanData, $id: res.$id }
                    temp = [ ...temp ]
                    
                    setBattingScoreCard([ ...temp ])
                    if(nextBatsman) {
                        console.log(nextBatsman, 'set striker')
                        setStriker({ ...nextBatsman })
                    } else {
                        setStriker({ ...striker, $id: res.$id, out: true })
                    }
                }
                setStatus({ res: 'Update successful' , err: '' })
            },
            err => {
                setStatus({ res: '', err: 'Update unsuccessful' })
                console.log(err.message)
            }
        )
    }
    
    const updateBatInnings = (n) => {
        setInnings(n)
    }
    
    const updateBattingScoreState = () => {
        let temp = battingScoreCard
        let nonStrikerIdx
        let strikerIdx
        
        console.log(temp)
        temp.forEach( i => {
            if( i.matchID === nonStriker.matchID && i.innings === nonStriker.innings && i.batsmanNo === nonStriker.batsmanNo ) {
                nonStrikerIdx = temp.indexOf(i)
                console.log(temp.indexOf(i))
            } else if( i.matchID === striker.matchID && i.innings === striker.innings && i.batsmanNo === striker.batsmanNo ) {
                strikerIdx = temp.indexOf(i)
            }
        })
        
        if(nonStrikerIdx >= 0) {
            console.log('Non striker index found')
            temp[nonStrikerIdx] = nonStriker
        } else {
            console.log('Non striker index not found')
            temp = [ ...temp, nonStriker ]
        }
        
        if(strikerIdx >= 0) {
            console.log('Striker index found')
            temp[strikerIdx] = striker
        } else {
            console.log('Striker index not found')
            temp = [ ...temp, striker ]
        }
        
        setBattingScoreCard([ ...temp ])
    }
    
    const updateNonStriker = (data) => {
        console.log('update non striker')
        setNonStriker({ ...data })
    }
    
    const updateStriker = (data) => {
        console.log('update striker')
        setStriker({ ...data })
    }
    
    useEffect(() => {
        if( router.route.includes('/match') ){
            console.log('Setting match ID')
            const mID = router.query.matchID
            
            if(mID){
                setMatchID(mID)
                setNonStriker({ ...nonStriker, matchID: mID })
                setStriker({ ...striker, matchID: mID })
            }
        }
    }, [ router ])
    
    useEffect(() => {
        console.log(matchState)
        console.log('Set innings')
        if(matchState.matchStatus === 'Second batting started') {
            console.log('Set innings 2')
            setInnings(2)
            setNonStriker({ $id: '', balls: 0, batsman: '', batsmanNo: 2, innings: 2, matchID, out: false, position: 'nonStriker', runs: 0 })
            setStriker({ $id: '', balls: 0, batsman: '', batsmanNo: 1, innings: 2, matchID, out: false, position: 'striker', runs: 0 })
        } else {
            console.log('Set innings 1')
            setInnings(1)
        }
    }, [ matchState ])
    
    useEffect(() => {
        if(matchID && innings) {
            console.log('get batting state from backend')
            getBattingScoreCard()
        }
    }, [ innings, matchID ])
    
    useEffect(() => {
        if(nonStriker.batsman && striker.batsman) {
            console.log('set batting state')
            updateBattingScoreState()
        }
    }, [ nonStriker, striker ])
    
    return {
        batsmanOut,
        battingScoreCard,
        nonStriker,
        onChangeNonStriker,
        onChangeStriker,
        striker,
        updateBatInnings,
        updateBattingScore,
        updateNonStriker,
        updateStriker
    }
}