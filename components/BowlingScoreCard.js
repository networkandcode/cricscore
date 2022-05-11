import { useMatchState } from '../hooks/useMatchState'

const InningsBowlingScoreCard = ({ overs }) => (
    <table className="table-auto">
        <thead>
            <tr>
                <th>Over</th>
                <th>Bowler</th>
                <th>Runs</th>
                <th>Wickets</th>
            </tr>
        </thead>
        <tbody>
            {overs.map((i, idx) => (
                <tr className="border-b-4" key={`${i}-${idx}`}>
                    <td>{i.over}</td>
                    <td>{i.bowler}</td>
                    <td>{i.runs}</td>
                    <td>{i.wickets}</td>
                </tr>
            ))}
        </tbody>
    </table>
)

const BowlingScoreCard = ({ innings }) => {
    
    const { overs } = useMatchState()
    
    let inningsOvers = []
    
    overs.forEach( i => {
        if(i.innings === innings) {
            inningsOvers.push(i)
        }
    })
    
    return (
        <div>
            <p className="font-bold mt-2 text-gray-500 text-sm"> Bowling score card:</p>
            { inningsOvers.length > 0 && (
                <InningsBowlingScoreCard overs={inningsOvers} />
            )}
        </div>
    )
}

export default BowlingScoreCard