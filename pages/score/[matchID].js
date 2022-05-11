// pages/score/[matchID].js

import BattingScoreCard from '../../components/BattingScoreCard'
import BowlingScoreCard from '../../components/BowlingScoreCard'
import MatchSummary from '../../components/MatchSummary'
import Over from '../../components/Over'
import { useMatchState } from '../../hooks/useMatchState'
import { useEffect, useState } from 'react'

const Score = () => {

    const  { 
        firstInningsRuns,
        firstInningsWickets,
        secondInningsRuns,
        secondInningsWickets,
        matchState,
        overs
    } = useMatchState()
    
    const [ firstInningBatsmen, setFirstInningBatsmen ] = useState([])
    const [ secondInningBatsmen, setSecondInningBatsmen ] = useState([])
    
    const [ score, setScore ] = useState({
        nonStriker: '',
        striker: ''
    })
    
    const onChange = e => {
        const { name, value } = e.target
        setScore({ ...score, [name]: value })
    }
    
    useEffect(() => {
        if(matchState.tossWinner === matchState.teamAName) {
            if(matchState.tossWinnerChoice === 'Bat first') {
                setFirstInningBatsmen(matchState.teamAPlayers)
                setSecondInningBatsmen(matchState.teamBPlayers)
            } else {
                setFirstInningBatsmen(matchState.teamBPlayers)
                setSecondInningBatsmen(matchState.teamAPlayers)
            }
        } else {
            if(matchState.tossWinnerChoice === 'Bat first') {
                setFirstInningBatsmen(matchState.teamBPlayers)
                setSecondInningBatsmen(matchState.teamAPlayers)
            } else {
                setFirstInningBatsmen(matchState.teamAPlayers)
                setSecondInningBatsmen(matchState.teamBPlayers)
            }
        }
    }, [ matchState ])
    
    return (
        
        <div>
            <p className="font-bold text-3xl text-blue-500"> {matchState.matchName} </p>
            { !overs.length === 2*matchState.matchNoOfOvers && (
                <div className="mb-4 p-4 rounded shadow-md text-gray-500">
                    Choose Batsmen:
                    
                    <div>
                        <label htmlFor="striker"> Striker: </label>
                        <select id="striker" name="striker" onChange={onChange}>
                            <option> </option>
                            { firstInningBatsmen.map( (b, idx) => (
                                <option key={`striker-${b}-${idx}`} value={b}> {b} </option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label htmlFor="nonStriker"> Non striker: </label>
                        <select id="nonStriker" name="nonStriker" onChange={onChange}>
                            <option>  </option>
                            { firstInningBatsmen.map( (b, idx) => (
                                <option key={`nonstriker-${b}-${idx}`} value={b}> {b} </option>
                            ))}
                        </select>
                    </div>
                    
                </div>
            )}
            
            { firstInningBatsmen && secondInningBatsmen && <Over firstInningBatsmen={firstInningBatsmen} secondInningBatsmen={secondInningBatsmen} /> }
            
            <MatchSummary/>
            
            <div className="mb-4 p-4 rounded shadow-md text-gray-500">
                <p className="font-bold text-blue-500 text-xl"> First batting: </p>
                <BattingScoreCard innings={1} />
                <BowlingScoreCard innings={1} />
                <div className="mt-2">
                    <span className="font-bold text-gray-500 text-xl"> Score:</span> <span className="font-bold text-blue-500 text-xl"> {firstInningsRuns}/{firstInningsWickets} </span>
                </div>
            </div>
            
            <div className="mb-4 p-4 rounded shadow-md text-gray-500">
                <p className="font-bold text-blue-500 text-xl"> Second batting: </p>
                <BattingScoreCard innings={2} />
                <BowlingScoreCard innings={2} />
                <div className="mt-2">
                    <span className="font-bold text-gray-500 text-xl"> Score:</span> <span className="font-bold text-blue-500 text-xl"> {secondInningsRuns}/{secondInningsWickets} </span>
                </div>
            </div>
            
        </div>
        
    )
}

export default Score