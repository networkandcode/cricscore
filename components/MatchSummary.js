// components/MatchSummary.js

import { useMatchState } from '../hooks/useMatchState'
import { useEffect } from 'react'

const MatchSummary = () => {
    
    const { firstBattingTeam, firstInningsRuns, matchState, secondBattingTeam, secondInningsOvers, secondInningsRuns, secondInningsWickets, updateMatchStatus } = useMatchState()
    
    useEffect(() => {
        if(secondInningsRuns > firstInningsRuns) {
            updateMatchStatus({ ...matchState, matchStatus: 'Ended', winner: secondBattingTeam })
        } else if( 
            ( (secondInningsOvers === matchState.matchNoOfOvers) || (secondInningsWickets === matchState.matchNoOfPlayers - 1) )
        ){
            if(firstInningsRuns > secondInningsRuns) {
                updateMatchStatus({ ...matchState, matchStatus: 'Ended', winner: firstBattingTeam })
            } else if(firstInningsRuns === secondInningsRuns) {
                updateMatchStatus({ ...matchState, matchStatus: 'Ended', winner: "Both  teams, its a Tie" })
            }
        }
    }, [ secondInningsRuns ])
    
    return (
        matchState.winner ? (
            <div className="mb-4 p-4 rounded shadow-md text-gray-500">
                <p className="font-bold text-blue-500 text-xl"> Match summary: </p>
                <p> Status: { matchState.matchStatus } </p>
                <p> Winner: { matchState.winner } </p>
            </div>
        ) : (
            <></>
        )
    )
}

export default MatchSummary