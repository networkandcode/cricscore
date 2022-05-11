// components/Over.js

import { useMatchState } from '../hooks/useMatchState'
import { useEffect, useState } from 'react'

const Over = ({ firstInningBatsmen, secondInningBatsmen }) => {
    
    const { addOver, battingScoreCard, matchState, overs, updateBattingScore, updateMatchStatus } = useMatchState()
    
    const [ batsmen, setBatsmen ] = useState([])
    const [ next, setNext ] = useState({})
    const [ nonStriker, setNonStriker ] = useState({ balls: 0, batsman: '', batsmanNo: 2, innings: 1, matchID: '', out: false, position: 'nonStriker', runs: 0 })
    const [ rotateStrike, setRotateStrike ] = useState(false)
    const [ striker, setStriker ] = useState({ balls: 0, batsman: '', batsmanNo: 1, innings: 1, matchID: '', out: false, position: 'striker', runs: 0 })
    
    const [ bowlers, setBowlers ] = useState([])
    const [ innings, setInnings ] = useState(1)
    const [ matchEnded, setMatchEnded ] = useState(false)
    const [ over, setOver ] = useState(0)
    const [ overScore, setOverScore ] = useState([])
    const [ runs, setRuns ] = useState(0)
    const [ state, setState ] = useState({
        ballNo: 0,
        batsmanOut: '',
        byesType: '',
        bowler: '',
        extras: '',
        rotateStrike: false,
        runs: 0,
        wicketType: ''
    })
    const [ wickets, setWickets ] = useState(0)
    
    const onChange = e => {
        setRotateStrike(false)
        const { name, value } = e.target
        setState({ ...state, [name]: value })
    }
    
    const onChangeStriker = e => {
        const { name, value } = e.target
        if(!value || nonStriker[name] !== value){
            setStriker({ ...striker, [ name ]: value })
        }
    }
    
    const onChangeNonStriker = e => {
        const { name, value } = e.target
        if(!value || striker[name] !== value){
            setNonStriker({ ...nonStriker, batsman: value })
        }
    }
    
    const onChangeNextBatsman = e => {
        const { name, value } = e.target
        if(state.wicketType === 'Bowled' || state.wicketType === 'Caught') {
            if(nonStriker[name] !== value && striker[name] !== value){
                setNext({ ...striker, balls: 0, batsman: value, out: false, runs: 0  })
            }    
        } else if(state.wicketType === 'Run out') {
            if(state.batsmanOut === 'striker' && nonStriker[name] !== value && striker[name] !== value) {
                setNext({ ...striker, balls: 0, batsman: value, out: false, runs: 0  })
            } else if(state.batsmanOut === 'nonStriker' && nonStriker[name] !== value && striker[name] !== value) {
                setNext({ ...nonStriker, balls: 0, batsman: value, out: false, runs: 0  })
            }
        }
    }
        
    const addScore = () => {
        let runsPerBall = 0
        
        runsPerBall = runsPerBall +  parseInt(state.runs)
        
        if(!state.byesType){
            setStriker({ ...striker, balls: striker.balls + 1, runs: striker.runs + runsPerBall })
        } else {
            setStriker({ ...striker, balls: striker.balls + 1 })
        }
        
        if(runsPerBall % 2 !== 0 && state.ballNo < 6){
            console.log('rotate strike, ball < 6')
            setRotateStrike(true)
        }
        
        
        if(state.extras){
            runsPerBall = runsPerBall + 1
        }
        
        setRuns(runs + runsPerBall)
        
        if(state.wicketType){
            setWickets(wickets + 1)
        }
        
        setOverScore([ ...overScore, state ])
        
        setState({ ...state, 
            ballNo: state.extras ? state.ballNo : state.ballNo + 1,
            byesType: '',
            extras: '',
            runs: 0,
            wicketType: ''
        })
    }
    
    const partialOver = () => {
        const overState = {
            bowler: state.bowler,
            matchID: matchState.$id,
            innings,
            over: state.ballNo < 6 ? parseFloat(`${over}.${state.ballNo}`) : parseFloat(`${over + 1}.0`),
            runs,
            wickets
        }
        
        console.log('overState', overState)
        
        addOver(overState)
        updateBattingScore(striker)
        updateBattingScore(nonStriker)
    }
    
    const nextOver = () => {
        const overState = {
            bowler: state.bowler,
            matchID: matchState.$id,
            innings,
            over: over + 1,
            runs,
            wickets
        }
        
        addOver(overState)
        
        if(over !== matchState.matchNoOfOvers - 1) {
            console.log('rotate strike, next over')
            updateBattingScore({ ...striker, position: 'nonStriker' })
            updateBattingScore({ ...nonStriker, position: 'striker' })
            setRotateStrike(true)
        } else {
            updateBattingScore(striker)
            updateBattingScore(nonStriker)
        }
        setOver(over + 1)
        
        setState({
            ballNo: 0,
            byesType: '',
            bowler: '',
            extras: '',
            runs: 0,
            wicketType: ''
        })
        
        setOverScore([])
        setRuns(0)
        setWickets(0)
    }
    
    useEffect(() => {
        if(matchState.$id){
            setStriker({ ...striker, matchID: matchState.$id })
            setNonStriker({ ...nonStriker, matchID: matchState.$id })
        }
    }, [ matchState ])
    
    useEffect(() => {
        if( innings === 1 
            && 
            ( 
                (over === matchState.matchNoOfOvers && state.ballNo === 0 ) || wickets === (matchState.matchNoOfPlayers - 1)
            )
            &&
            matchState.matchStatus !== 'Ended'
        ){
            // second innings starts
            console.log('second batting starts')
            updateMatchStatus({ matchStatus: 'inning2Started' })
            setInnings(2)
            setWickets(0)
            setOver(0)
            setState({ ...state, bowler: '' })
            setNonStriker({ balls: 0, batsman: '', batsmanNo: 2, innings: 2, matchID: matchState.$id, out: false, position: 'nonStriker', runs: 0 })
            setStriker({ balls: 0, batsman: '', batsmanNo: 1, innings: 2, matchID: matchState.$id, out: false, position: 'striker', runs: 0 })
            setBowlers(firstInningBatsmen)
            setBatsmen(secondInningBatsmen)
        }
        
        if( innings === 2 && ( over === matchState.matchNoOfOvers || wickets === matchState.matchNoOfPlayers - 1 ) ){
            // second innings ends
            setMatchEnded(true)
        }
    },[ matchState,  over, wickets ])
    
    useEffect(() => {
        console.log('set striker and non striker from backend')
        battingScoreCard.length > 0 && battingScoreCard.forEach(i => {
            if(i.position === 'striker'){
                setStriker(i)
            }
            if(i.position === 'nonStriker'){
                setNonStriker(i)    
            }
        })
    }, [ battingScoreCard ])
    
    useEffect(() => {
        let firstInningsOvers = []
        let secondInningsOvers = []
    
        overs.forEach( i => {
            if(i.innings === 1) {
                firstInningsOvers.push(i)
            } else if(i.innings === 2) {
                secondInningsOvers.push(i)
            }
        })
        
        if(innings === 1) {
            setOver(firstInningsOvers.length)
        } else if (innings === 2) {
            setOver(secondInningsOvers.length)
        }
        
    },[ innings, overs ])
    
    useEffect(() => {
        if(firstInningBatsmen && secondInningBatsmen) {
            if(innings === 1){
                setBatsmen(firstInningBatsmen)
                setBowlers(secondInningBatsmen)
            } else if(innings === 2) {
                setBatsmen(secondInningBatsmen)
                setBowlers(firstInningBatsmen)
            }
        }
    }, [ firstInningBatsmen, secondInningBatsmen ])
    
    useEffect(() => {
        
        if(state.wicketType){
            
            if(state.wicketType === 'Bowled' || state.wicketType === 'Caught') {
               setState({ ...state, byesType: '', extras: '', runs: 0 })
            }
        }
        
    }, [ state.wicketType ])


    useEffect(() => {
        if(state.extras === 'Wide' && state.runs > 0){
            setState({ ...state, byesType: 'Byes' })
        }
    }, [ state.extras ])
    
    useEffect(() => {
        if (over > 2*matchState.matchNoOfOvers) {
            setMatchEnded(true)
        }
    }, [matchState, over])
    
    useEffect(() => {
        if(matchState.status === 'innings2Started') {
            setInnings(2)
        }
    }, [ matchState ])
    
    
    useEffect(() => {
        
        if(rotateStrike){
            console.log('rotate strike')
            const temp = { ...striker }
            setStriker({...nonStriker, position: 'striker'})
            setNonStriker({...striker, position: 'nonStriker'})    
        }
        
    }, [ rotateStrike ])
    
    useEffect(() => {
        if(wickets >= 1){
            if(next.position === 'striker') {
                updateBattingScore({ ...nonStriker })
                updateBattingScore({ ...striker, out: true, position: '' })
                setStriker({ ...next, batsmanNo: wickets + 2 })
            } if(next.position === 'nonStriker') {
                updateBattingScore({ ...nonStriker, out: true })
                updateBattingScore({ ...striker })
                setNonStriker({ ...next, batsmanNo: wickets + 2 })
            }
            
            if(wickets === (matchState.matchNoOfPlayers - 1) ) {
                setMatchEnded(true)
            }
            if(state.rotateStrike){
                setRotateStrike(true)
                setState({ ...state, rotateStrike: false })
            }
        }
    }, [ wickets ])
    
    return(
        <div>
                { matchState.matchStatus !== 'Ended' && (
                    <>
            
                        <p className="font-bold text-2xl text-gray-500"> {innings === 1 ? 'First' : 'Second'} Batting </p>
                        
                        <p className="font-bold text-xl text-gray-500"> Overs: {state.ballNo < 6 ? `${over}.${state.ballNo}` : `${over + 1}.0`} </p>
                        
                        { !(state.bowler && nonStriker.batsman && striker.batsman) && (
                            <div className="mb-4 p-4 rounded shadow-md text-gray-500">
                                <p className="font-bold mb-2 text-blue-500 text-xl"> Selection </p>
                            
                                { state.ballNo === 0 && (<div className="mb-2">
                                    <label htmlFor="bowler"> Choose bowler: </label>
                                    <select className="border p-2 rounded w-full focus:outline-blue-500" id="bowler" name="bowler" onChange={onChange} value={state.bowler}>
                                        <option>  </option>
                                        { bowlers.map( (b, idx) => (
                                            <option key={`bowler-${idx}`} value={b}> {b} </option>
                                        ))}
                                    </select>
                                </div>)}
                                
                                { over === 0 && (state.ballNo === 0) && (
                                    <div className="mb-2">
                                        <label htmlFor="strikerBatsman"> Choose striker: </label>
                                        <select className="border p-2 rounded w-full focus:outline-blue-500" id="strikerBatsman" name="batsman" onChange={onChangeStriker} value={striker.batsman}>
                                            <option>  </option>
                                            { batsmen.map( (b, idx) => (
                                                <option key={`strikerBatsman-${idx}`} value={b}> {b} </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                
                            
                                { over === 0 && (state.ballNo === 0) && (
                                    <div className="mb-2">
                                        <label htmlFor="nonStrikerBatsman"> Choose non striker: </label>
                                        <select className="border p-2 rounded w-full focus:outline-blue-500" id="nonStrikerBatsman" name="batsman" onChange={onChangeNonStriker} value={nonStriker.batsman}>
                                            <option>  </option>
                                            { batsmen.map( (b, idx) => (
                                                <option key={`nonStrikerBatsman-${idx}`} value={b}> {b} </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            
            
            
            { state.bowler && nonStriker.batsman && striker.batsman && (<>
                
                <div className="mb-4 p-4 rounded shadow-md text-gray-500">
                
                    <p className="mb-2 font-bold text-blue-500 text-xl"> Add Score </p>
            
                <div className="mb-4">
                    <label htmlFor="byesType"> Wicket type </label>
                    <select className="border p-2 rounded w-full focus:outline-blue-500"  id="wicketType" name="wicketType" onChange={onChange} value={state.wicketType}>
                        <option value=""> </option>
                        <option value="Bowled"> Bowled </option>
                        <option value="Caught"> Caught </option>
                        <option value="Run out"> Run out </option>
                    </select>
                    
                    { state.wicketType === 'Run out' && (
                        <div className="mb-2">
                            <label htmlFor="batsmanOut"> Batsman out: </label>
                            <select className="border p-2 rounded w-full focus:outline-blue-500" id="batsmanOut" name="batsmanOut" onChange={onChange} value={state.batsmanOut}>
                                <option value="striker"> {striker.batsman} </option>
                                <option value="nonStriker">  {nonStriker.batsman} </option>
                            </select>
                        </div>
                    )}
                    
                    { state.wicketType && (
                        <div className="mb-2">
                            <label htmlFor="nextBatsman"> Choose next batsman: </label>
                            <select className="border p-2 rounded w-full focus:outline-blue-500" id="nextBatsman" name="batsman" onChange={onChangeNextBatsman} value={next.batsman}>
                                <option>  </option>
                                { batsmen.map( (b, idx) => (
                                    <option key={`nextBatsman-${idx}`} value={b}> {b} </option>
                                ))}
                            </select>
                        </div>
                    )}
                    
                    { (state.wicketType === 'Caught' || state.wicketType === 'Run out') && (
                        <div className="mb-2">
                            <label htmlFor="rotateStrike"> Rotate strike </label>
                            <select className="border p-2 rounded w-full focus:outline-blue-500" id="rotateStrike" name="rotateStrike" onChange={onChange} value={state.rotateStrike}>
                                <option value={false}>  No </option>
                                <option value={true}> Yes </option>
                            </select>
                        </div>
                    )}
                </div>
                
                { ! (state.wicketType === 'Bowled' || state.wicketType === 'Caught') && ( <>
                
                    <div className="mb-4">
                        <label htmlFor="runs"> Run(s) with out extras </label>
                        <input className="border border-gray-500 p-1 rounded w-10 focus:outline-blue-500" id="runs" min={0} max={6} name="runs" onChange={onChange} readOnly={state.extras==='Wide'} required type="number" value={state.runs}/>
                    </div>
                
                    <div className="mb-4">
                        <label htmlFor="extras"> Extras </label>
                        <select className="border p-2 rounded w-full focus:outline-blue-500" id="extras" name="extras" onChange={onChange} value={state.extras}>
                            <option value=""> N/A </option>
                            <option value="Wide"> Wide </option>
                            <option value="No Ball"> No Ball </option>
                        </select>
                    </div>
                    
                    {state.runs > 0 && ( <div className="mb-4">
                        <label htmlFor="byesType"> Byes type </label>
                        <select className="border p-2 rounded w-full focus:outline-blue-500" id="byesType" name="byesType" onChange={onChange} value={state.bytesType}>
                            <option value=""> </option>
                            <option value="Byes"> Byes </option>
                            <option value="Leg byes"> Leg byes </option>
                        </select>
                    </div> )}
                
                </> )}
                
                <div className="mb-4">
                    <button 
                        className="bg-blue-500 font-bold px-2 py-1 rounded text-white disabled:bg-gray-500 hover:bg-blue-600"
                        disabled={ state.ballNo === 6  || (state.wicketType && !next.batsman) }
                        onClick={addScore}
                    >
                        Add
                    </button>
                    
                    { state.ballNo === 6 && (
                    <button 
                            className="bg-blue-500 font-bold ml-2 px-2 py-1 rounded text-white disabled:bg-gray-500 hover:bg-blue-600"
                            onClick={nextOver}
                    >
                        { innings === 1 && (
                            (  
                                (over === matchState.matchNoOfOvers - 1 && state.ballNo === 6 )
                                || 
                                wickets === (matchState.matchNoOfPlayers - 1 )
                            ) ? 'Second batting' : 'Add over'
                        )}
                        
                        { innings === 2 && (
                            (
                                (over === matchState.matchNoOfOvers - 1 && state.ballNo === 6 )
                                || 
                                wickets === (matchState.matchNoOfPlayers - 1 )
                            ) ? 'End match' : 'Add over'
                        )}
                    </button>
                    )}
                </div>
                    
            </div>
            
            { overScore.length > 0 && ( 
                <div className="mb-4 p-4 rounded shadow-md text-gray-500">
                    { overScore.map( (i, idx) => (
                        <div  key={`${i}-${idx}`}>
                            <div className="bg-blue-500 m-2 p-2 text-white">
                                { i.wicketType && i.wicketType } { i.runs } { i.byesType && i.byesType } { i.extras && i.extras }
                            </div>
                            { !i.extras && (
                                <div className="flex items-center pt-2 relative">
                                    <div className="border-gray-400 border-t flex-grow "></div>
                                    <span className="flex-shrink mx-4 text-gray-400">Ball {i.ballNo + 1} / 6</span>
                                    <div className="border-gray-400 border-t flex-grow "></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            
            <div className="mb-4 p-4 rounded shadow-md text-gray-500">
                <p className="font-bold text-blue-500 text-xl"> Live score </p>
                Striker: {striker.batsman} { striker.runs } ({ striker.balls })<br/>
                NonStriker: {nonStriker.batsman} { nonStriker.runs } ({ nonStriker.balls }) <br/>
                Current Bowler: {state.bowler} {runs} / {wickets}
            </div>
            
            </>)}
            
                { matchEnded === true && (
                    <div>
                        Match ended.
                    </div>
                )}
        </div>
    )
}

export default Over