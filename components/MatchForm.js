import TeamForm from '../components/TeamForm'
import TossForm from '../components/TossForm'
import { useMatchState } from '../hooks/useMatchState'

const MatchForm = () => {
    
    const {
        formNumber,
        incFormNumber,
        matchState,
        onChange,
        redFormNumber,
    } = useMatchState()
    
    if (formNumber !== 1) {
        if(formNumber === 2) {
            return (
                <TeamForm suffix="A"/>
            )
        } else if(formNumber === 3) {
            return (
                <TeamForm suffix="B"/>
            )
        } else if(formNumber === 4) {
            return (
                <TossForm/>
            )
        } else {
            return <></>
        }
    }
    
    return (
        
        <form className="m-8 p-8 rounded shadow-md text-gray-500" onSubmit={ e => { e.preventDefault(); incFormNumber() }}>
        
            <div className="flex justify-between mb-6 text-sm">
                <button className="bg-blue-500 font-bold px-2 py-1 rounded text-white disabled:bg-gray-500 hover:bg-blue-600" disabled={formNumber === 1} onClick={ e => { e.preventDefault(); redFormNumber }}>
                    PREV
                </button>
                {formNumber}/4
                <button className="bg-blue-500 font-bold px-2 py-1 rounded text-white disabled:bg-gray-500 hover:bg-blue-600" disabled={formNumber === 4} type="submit">
                    NEXT
                </button>
            </div>
        
        
            <div>
                <p className="font-bold text-blue-500 text-xl mb-4">
                    Match details
                </p>
                <div className="mb-4">
                    <label className="block" htmlFor="matchName"> Name of the match </label>
                    <input className="border p-2 rounded w-full focus:outline-blue-500" id="matchName" name="matchName" onChange={onChange} placeholder="Name(unique) of the match" required type="text" value={matchState.matchName} />
                </div>
                
                <div className="mb-4">
                    <label htmlFor="matchNoOfOvers"> Number of overs </label>
                    <input className="border border-gray-500 p-1 rounded w-10 focus:outline-blue-500" id="matchNoOfOvers" max={50} min={3} name="matchNoOfOvers" onChange={onChange} required type="number" value={matchState.matchNoOfOvers} />
                </div>
                
                <div className="mb-4">
                    <label htmlFor="matchNoOfPlayers"> Number of players per team </label>
                    <input className="border border-gray-500 p-1 rounded w-10 focus:outline-blue-500" id="matchNoOfPlayers" max={11} min={3} name="matchNoOfPlayers" onChange={onChange} required type="number" value={matchState.matchNoOfPlayers} />
                </div>
                
                <div className="mb-4">
                    <label className="block" htmlFor="matchPlace"> Place </label>
                    <input className="border p-2 rounded w-full focus:outline-blue-500" id="matchPlace" name="matchPlace" onChange={onChange} placeholder="Where is the match happening" required value={matchState.matchPlace} />
                </div>
            </div>
            
        </form>
    )
    
}
    
export default MatchForm            