// pages/score/[matchID].js

import BattingScoreCard from '../../components/BattingScoreCard'
import BowlingScoreCard from '../../components/BowlingScoreCard'
import MatchSummary from '../../components/MatchSummary'
import Over from '../../components/Over'
import { BatStateProvider } from '../../hooks/useBatState'
import { BallStateProvider } from '../../hooks/useBallState'
import { useMatchState } from '../../hooks/useMatchState'
import { useEffect, useState } from 'react'

const Score = () => {
    const  {
        matchState,
    } = useMatchState()
    
    const { firstBattingTeam, secondBattingTeam } = useMatchState()
    const [ firstInningBatsmen, setFirstInningBatsmen ] = useState([])
    const [ secondInningBatsmen, setSecondInningBatsmen ] = useState([])
    
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
        
        <BatStateProvider>
            <BallStateProvider>
                <p className="font-bold text-3xl text-blue-500"> {matchState.matchName} </p>
                <p className="font-bold text-2xl text-gray-500"> {matchState.teamAName} vs {matchState.teamBName} </p>
                
                { firstInningBatsmen && secondInningBatsmen && <Over firstInningBatsmen={firstInningBatsmen} secondInningBatsmen={secondInningBatsmen} /> }
                
                <MatchSummary/>
                
                
                <div className="mb-4 p-4 rounded shadow-md text-gray-500">
                    <p className="font-bold text-blue-500 text-xl"> First batting, { firstBattingTeam }: </p>
                    <BattingScoreCard innings={1} team={firstBattingTeam} />
                    <BowlingScoreCard innings={1} />
                </div>
                
                
                <div className="mb-4 p-4 rounded shadow-md text-gray-500">
                    <p className="font-bold text-blue-500 text-xl"> Second batting, { secondBattingTeam }: </p>
                    <BattingScoreCard innings={2} team={secondBattingTeam} />
                    <BowlingScoreCard innings={2} />
                </div>
            </BallStateProvider>
        </BatStateProvider>
        
    )
}

export default Score