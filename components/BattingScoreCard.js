// components/BattingScoreCard.js

import { useBatStateContext } from '../hooks/useBatState'
import { useEffect, useState } from 'react'

const InningsBattingScoreCard = ({ battingScoreCard }) => (
    <table className="table-auto">
        <tbody>
            { battingScoreCard.sort( (a,b) => (a.batsmanNo - b.batsmanNo) )   && battingScoreCard.map((i, idx) => (
                <tr className="border-b-4" key={`${i}-${idx}`}>
                    <td>
                        { i.batsmanNo }
                    </td>
                    <td>
                        { i.batsman }
                    </td>
                    <td>
                        { i.runs } ({ i.balls })
                    </td>
                    <td>
                        { i.out ? 'Out' : 'Not out' }
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
)

const BattingScoreCard = ({ innings }) => {
    const { battingScoreCard } = useBatStateContext()
    
    const [ inningsBattingScoreCard, setInningsBattingScoreCard ] = useState([])
    
    useEffect(()=> {
        let temp = []
        battingScoreCard.forEach( i => {
            if( i.innings === innings ) {
                temp.push(i)
            }
        })
        
        setInningsBattingScoreCard([...temp])
    }, [ battingScoreCard ])
    
    
    return (
        <div>
            { inningsBattingScoreCard.length > 0 && (
                <>
                    <p className="font-bold mt-2 text-gray-500 text-sm"> Batting score card: </p>
                    <InningsBattingScoreCard battingScoreCard={inningsBattingScoreCard} />
                </>
            )}
        </div>
    )
}

export default BattingScoreCard