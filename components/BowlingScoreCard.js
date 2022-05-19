import { useBallStateContext } from '../hooks/useBallState'
import { useEffect, useState } from 'react'

const InningsBowlingScoreCard = ({ overs }) => (
    <table>
        <thead>
            <tr>
                <th className="p-1 text-left"> Over </th>
                <th className="p-1 text-left"> Bowler </th>
                <th className="p-1 text-left"> Runs </th>
                <th className="p-1 text-left"> Wickets </th>
            </tr>
        </thead>
        <tbody>
            {overs.map((i, idx) => (
                <tr className="border-b-4" key={`${i}-${idx}`}>
                    <td className="p-1">{ i.balls === 6 ? i.over + 1 : `${i.over}.${i.balls}` }</td>
                    <td className="p-1">{i.bowler}</td>
                    <td className="p-1">{i.runs}</td>
                    <td className="p-1">{i.wickets}</td>
                </tr>
            ))}
        </tbody>
    </table>
)

const BowlingScoreCard = ({ innings }) => {
    
    const { firstInningsCurrentOver, secondInningsCurrentOver, firstInningsOvers, firstInningsRuns, firstInningsWickets, secondInningsOvers, secondInningsRuns, secondInningsWickets } = useBallStateContext()
    
    const [ inningsOvers, setInningsOvers ]= useState([])
    
    useEffect(() => {
        if(innings === 1) {
            setInningsOvers([ ...firstInningsOvers ])
        } else if(innings === 2) {
            setInningsOvers([ ...secondInningsOvers ])
        }
    },[ firstInningsOvers, innings, secondInningsOvers ])
    
    return (
        <div>
            { inningsOvers.length > 0 && (
                <>
                    <p className="font-bold mt-2 text-gray-500 text-sm"> Bowling score card:</p>
                    <InningsBowlingScoreCard overs={inningsOvers} />
                    <div className="mt-2">
                        <span className="font-bold text-gray-500 m-2 text-xl"> Score:</span> <span className="font-bold text-blue-500 text-xl">
                            { innings === 1 ? firstInningsRuns : secondInningsRuns }/{ innings === 1 ? firstInningsWickets : secondInningsWickets }
                        </span>
                        <span className="font-bold px-2 text-gray-500 text-xl">
                            in { innings === 1 ? firstInningsCurrentOver : secondInningsCurrentOver } overs
                        </span>
                    </div>
                </>
            )}
        </div>
    )
}

export default BowlingScoreCard