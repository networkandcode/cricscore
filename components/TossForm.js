import { useCentralState } from '../hooks/useCentralState'
import { useNewMatch } from '../hooks/useNewMatchState'

const TossForm = () => {
    
    const { user } = useCentralState()
    const {
        addMatch,
        formNumber,
        incFormNumber,
        newMatch,
        onChange,
        redFormNumber,
        status
    } = useNewMatch()
    
    return (
        <form className="m-8 p-8 rounded shadow-md text-gray-500" onSubmit={ e => { e.preventDefault(); incFormNumber() }}>
            <div className="flex justify-between mb-6 text-sm">
                <button className="bg-blue-500 font-bold px-2 py-1 rounded text-white disabled:bg-gray-500 hover:bg-blue-600" disabled={formNumber === 1} onClick={ e => { e.preventDefault(); redFormNumber() }}>
                    PREV
                </button>
                {formNumber}/4
                <button className="bg-blue-500 font-bold px-2 py-1 rounded text-white disabled:bg-gray-500 hover:bg-blue-600" disabled={formNumber === 4 } type="submit">
                    NEXT
                </button>
            </div>
            
             
            <div className="mb-4 p-4 rounded shadow-md text-gray-500">
                <p> Toss won by </p>
                <div>
                    <input checked={newMatch.tossWinner === newMatch.teamAName} className="focus:outline-blue-500" id="teamA" name="tossWinner" onChange={onChange} type="radio" value={newMatch.teamAName}/>
                    <label htmlFor="teamA"> {newMatch.teamAName} </label>
                </div>
                
                <div>
                    <input checked={newMatch.tossWinner === newMatch.teamBName} className="focus:outline-blue-500" id="teamB" name="tossWinner" onChange={onChange} type="radio" value={newMatch.teamBName}/>
                    <label htmlFor="teamB"> {newMatch.teamBName} </label>
                </div>
            </div>
            
            
            { newMatch.tossWinner && ( <div>
                <div className="mb-4 p-4 rounded shadow-md text-gray-500">
                    <p> {newMatch.tossWinner} decides to </p>
                    <div>
                        <input checked={newMatch.tossWinnerChoice === "Bat first"} className="focus:outline-blue-500" id="batFirst" name="tossWinnerChoice" onChange={onChange} type="radio" value="Bat first"/>
                        <label htmlFor="teamA"> Bat first </label>
                    </div>
                    
                    <div>
                        <input checked={newMatch.tossWinnerChoice === "Bowl first"} className="focus:outline-blue-500" id="bowlFirst" name="tossWinnerChoice" onChange={onChange} type="radio" value="Bowl first"/>
                        <label htmlFor="teamA"> Bowl first </label>
                    </div>
                </div>
                
                <p className="pb-2 text-green-500"> {status?.res} </p>
                <p className="pb-2 text-red-500"> {status?.err} </p>
                
                <button className="bg-blue-500 font-bold px-2 py-1 rounded text-white disabled:bg-gray-500 hover:bg-blue-600" disabled={ !newMatch.tossWinner || !newMatch.tossWinnerChoice } onClick={() => {addMatch(user.$id)}}>
                    Start Match
                </button>
            </div> )}
           
        </form>
    )
}

export default TossForm