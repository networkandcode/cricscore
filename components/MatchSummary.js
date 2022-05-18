// components/MatchSummary.js

import { useBallStateContext } from '../hooks/useBallState'
import { useMatchState } from '../hooks/useMatchState'
import { useEffect } from 'react'

const MatchSummary = () => {
    
    const { firstInningsRuns, secondInningsOvers, secondInningsRuns, secondInningsWickets } = useBallStateContext()
    const { firstBattingTeam, matchState, updateMatchStatus } = useMatchState()
    
    useEffect(() => {
        if( secondInningsOvers === matchState.matchNoOfOvers ) {
            if(firstInningsRuns > secondInningsRuns) {
                updateMatchStatus({ ...matchState, matchStatus: 'Ended', winner: firstBattingTeam })
            } else if(firstInningsRuns === secondInningsRuns) {
                updateMatchStatus({ ...matchState, matchStatus: 'Ended', winner: "Both  teams, its a Tie" })
            }
        }
    }, [ secondInningsOvers, secondInningsRuns ])
    
    return (
        matchState.winner ? (
            <div className="mb-4 p-4 rounded shadow-md text-gray-500">
                <p className="font-bold text-blue-500 text-xl"> Match summary: </p>
                <p> Toss winner: { matchState.tossWinner } </p>
                <p> Match winner: { matchState.winner } </p>
            </div>
        ) : (
            <></>
        )
    )
}

export default MatchSummary