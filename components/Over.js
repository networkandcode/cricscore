// components/Over.js

import OverScore from './OverScore'
import SelectBatsmen from './SelectBatsmen'
import { useBatStateContext } from '../hooks/useBatState'
import { useBallStateContext } from '../hooks/useBallState'
import { useMatchState } from '../hooks/useMatchState'
import { useEffect, useState } from 'react'

const Over = ({ firstInningBatsmen, secondInningBatsmen }) => {
    const {
        nonStriker,
        striker,
        updateBattingScore,
        updateNonStriker,
        updateStriker,
    } = useBatStateContext()
    const { 
        addOver, 
        firstInningsCurrentOver, 
        firstInningsOvers, 
        firstInningsRuns, 
        firstInningsWickets, 
        innings, 
        secondInningsCurrentOver, 
        secondInningsOvers,
        secondInningsRuns, 
        secondInningsWickets,
        updateInnings, 
        updateOvers
    } = useBallStateContext()
    const { matchState, secondBattingTeam, updateMatchStatus } = useMatchState()
    
    const [ batsmen, setBatsmen ] = useState([])
    const [ next, setNext ] = useState({})
    const [ nextOverButtonText, setNextOverButtonText ] = useState('')
    const [ rotateStrike, setRotateStrike ] = useState(false)
    
    const [ bowlers, setBowlers ] = useState([])
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
    
    const onChangeBowler = e => {
        const { name, value } = e.target
        
        let lastBowler = ''
        
        if(innings == 1) {
            firstInningsOvers.forEach(i => {
                if(i.over === parseInt(firstInningsCurrentOver) - 1) {
                    lastBowler = i.bowler 
                }
            })
        } else {
            secondInningsOvers.forEach(i => {
                if(i.over === parseInt(secondInningsCurrentOver) - 1) {
                    lastBowler = i.bowler
                }
            })
        }
        
        if(value !== lastBowler) {
            setState({ ...state, [name]: value })
            const overState = {
                $id: `${matchState.$id}-${innings}-${over}`,
                balls: state.ballNo,
                bowler: value,
                matchID: matchState.$id,
                innings,
                over: over,
                runs,
                wickets
            }
            updateOvers(overState)
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
        console.log('Add score')
        let runsPerBall = 0
        
        runsPerBall = runsPerBall +  parseInt(state.runs)
        
        if(!state.byesType){
            updateStriker({ ...striker, balls: striker.balls + 1, runs: striker.runs + runsPerBall })
        } else {
            updateStriker({ ...striker, balls: striker.balls + 1 })
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
        
        const overState = {
            $id: `${matchState.$id}-${innings}-${over}`,
            balls: state.extras ? state.ballNo : state.ballNo + 1,
            bowler: state.bowler,
            matchID: matchState.$id,
            innings,
            over,
            runs: runs + runsPerBall,
            wickets: state.wicketType ? wickets + 1 : wickets
        }
        updateOvers(overState)
    }
    
    const nextOver = () => {
        const overState = {
            $id: `${matchState.$id}-${innings}-${over-1}`,
            balls: state.ballNo,
            bowler: state.bowler,
            matchID: matchState.$id,
            innings,
            over: ( state.ballNo > 0 && state.ballNo < 6 ) ? over : over - 1,
            runs,
            wickets
        }
        
        addOver(overState)
        
        if(over !== matchState.matchNoOfOvers && state.ballNo === 6) {
            console.log('rotate strike, next over')
            updateBattingScore({ ...striker, position: 'nonStriker' })
            updateBattingScore({ ...nonStriker, position: 'striker' })
            setRotateStrike(true)
        } else {
            updateBattingScore(striker)
            updateBattingScore(nonStriker)
        }
        
        console.log('Reset ball state')
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
        
        if( innings === 1 && ( parseInt(firstInningsCurrentOver) === matchState.matchNoOfOvers || firstInningsWickets === matchState.matchNoOfPlayers ) ){
            console.log('Second innings...')
            updateInnings(2)
            updateMatchStatus({ matchStatus: 'Second batting started' })
        }
        
        if( innings === 2 && ( secondInningsRuns > firstInningsRuns ) ) {
            updateMatchStatus({ ...matchState, matchStatus: 'Ended', winner: secondBattingTeam })
        }
    }
    
    /*useEffect(() => {
        if( innings === 2 && nonStriker.batsman && striker.batsman){
            // second innings starts
            console.log('second batting starts')
            updateMatchStatus({ matchStatus: 'Second batting started' })
            setWickets(0)
            setState({ ...state, bowler: '' })
            updateNonStriker({ balls: 0, batsman: '', batsmanNo: 2, innings: 2, matchID: matchState.$id, out: false, position: 'nonStriker', runs: 0 })
            updateStriker({ balls: 0, batsman: '', batsmanNo: 1, innings: 2, matchID: matchState.$id, out: false, position: 'striker', runs: 0 })
            setBatsmen(secondInningBatsmen)
        }
    },[ matchState,  over, wickets ])*/
    
    useEffect(()=> {
        console.log('set over')
        if(innings === 1) {
            setOver(parseInt(firstInningsCurrentOver))
        } else if(innings === 2) {
            setOver(parseInt(secondInningsCurrentOver))
        }
    }, [ firstInningsCurrentOver, innings, secondInningsCurrentOver ])
    
    useEffect(() => {
        console.log('set bowlers and batsmen')
        if(firstInningBatsmen && secondInningBatsmen) {
            if(innings === 1){
                setBatsmen(firstInningBatsmen)
                setBowlers(secondInningBatsmen)
            } else if(innings === 2) {
                setBatsmen(secondInningBatsmen)
                setBowlers(firstInningBatsmen)
            }
        }
    }, [ firstInningBatsmen, secondInningBatsmen, innings ])
    
    useEffect(() => {
        console.log('update state on wicket')
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
        if (innings === 2 && over > 2*matchState.matchNoOfOvers) {
            setMatchEnded(true)
        }
    }, [ matchState, over ])
    
    useEffect(() => {
        
        if(rotateStrike){
            console.log('rotate strike')
            const temp = { ...striker }
            updateStriker({...nonStriker, position: 'striker'})
            updateNonStriker({...striker, position: 'nonStriker'})
        }
        
    }, [ rotateStrike ])
    
    useEffect(() => {
        if(wickets >= 1){
            if(next.position === 'striker') {
                updateBattingScore({ ...nonStriker })
                updateBattingScore({ ...striker, out: true, position: '' })
                updateStriker({ ...next, batsmanNo: wickets + 2 })
            } if(next.position === 'nonStriker') {
                updateBattingScore({ ...nonStriker, out: true })
                updateBattingScore({ ...striker })
                updateNonStriker({ ...next, batsmanNo: wickets + 2 })
            }
            
            if(innings === 2 && wickets === (matchState.matchNoOfPlayers - 1) ) {
                setMatchEnded(true)
            }
            if(state.rotateStrike){
                setRotateStrike(true)
                setState({ ...state, rotateStrike: false })
            }
        }
    }, [ wickets ])
    
    useEffect(() => {
        if(innings === 1) {
            if ( 
                ( parseInt(firstInningsCurrentOver) === matchState.matchNoOfOvers )
                || 
                ( firstInningsWickets === (matchState.matchNoOfPlayers - 1 ) )
            ) {
                setNextOverButtonText('Second batting')
            } else if (state.ballNo === 6) {
                setNextOverButtonText('Next over')    
            } else {
                setNextOverButtonText('')
            }
        } else if (innings === 2) {
            if (
                (parseInt(secondInningsCurrentOver) === matchState.matchNoOfOvers)
                || 
                (secondInningsWickets === (matchState.matchNoOfPlayers - 1 ))
                ||
                (secondInningsRuns > firstInningsRuns)
            ) {
                setNextOverButtonText('End match')
            } else if (state.ballNo === 6) {
                setNextOverButtonText('Next over')
            } else {
                setNextOverButtonText('')
            }
        }
    }, [ firstInningsCurrentOver, firstInningsRuns, firstInningsWickets, innings, matchState, secondInningsCurrentOver, secondInningsRuns, secondInningsWickets, state, ])
    
    return(
        <div>
                { matchState.matchStatus !== 'Ended' && (
                    <>
            
                        <p className="font-bold text-xl text-gray-500">
                            { innings === 1 ? 'First' : 'Second' } Batting, <span className="font-bold text-lg text-gray-500"> Overs: {innings === 1 ? firstInningsCurrentOver: secondInningsCurrentOver} </span>
                        </p>
                        { !matchEnded && !(state.bowler && nonStriker.batsman && striker.batsman) && (
                            <div className="mb-4 p-4 rounded shadow-md text-gray-500">
                                <p className="font-bold mb-2 text-blue-500 text-xl"> Selection </p>
                                { state.ballNo === 0 && (<div className="mb-2">
                                    <label htmlFor="bowler"> Choose bowler: </label>
                                    <select className="border p-2 rounded w-full focus:outline-blue-500" id="bowler" name="bowler" onChange={onChangeBowler} value={state.bowler}>
                                        <option>  </option>
                                        { bowlers.map( (b, idx) => (
                                            <option key={`bowler-${idx}`} value={b}> {b} </option>
                                        ))}
                                    </select>
                                </div>)}
                                
                                { 
                                    (
                                        (innings === 1 && firstInningsCurrentOver === '0.0') 
                                        || 
                                        (innings === 2 && secondInningsCurrentOver === '0.0') 
                                    )
                                    && (
                                        <SelectBatsmen batsmen={batsmen}/>
                                    )
                                }
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
                        disabled={ state.ballNo === 6  || (state.wicketType && !next.batsman) || nextOverButtonText }
                        onClick={addScore}
                    >
                        Add
                    </button>
                    
                    { nextOverButtonText && (
                        <button 
                            className="bg-blue-500 font-bold ml-2 px-2 py-1 rounded text-white disabled:bg-gray-500 hover:bg-blue-600"
                            onClick={nextOver}
                        >
                            { nextOverButtonText }
                        </button>
                    )}
                </div>
                    
            </div>
            
            { overScore.length > 0 && ( 
                <OverScore overScore={ overScore } />
            )}
            
            <div className="mb-4 p-4 rounded shadow-md text-gray-500">
                <p className="font-bold text-blue-500 text-xl"> Live score </p>
                Striker: {striker.batsman} { striker.runs } ({ striker.balls })<br/>
                NonStriker: {nonStriker.batsman} { nonStriker.runs } ({ nonStriker.balls }) <br/>
                Current Bowler: {state.bowler} {runs} / {wickets}
            </div>
            
            </>)}
                
        </div>
    )
}

export default Over