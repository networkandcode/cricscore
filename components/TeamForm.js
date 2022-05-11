import { useMatchState } from '../hooks/useMatchState'
import { useState } from 'react'

const TeamForm = ({ suffix }) => {
    const state = useMatchState()
    const {
        addTeamPlayer,
        formNumber,
        incFormNumber,
        matchState,
        onChange,
        redFormNumber,
        rmTeamPlayer,
    } = state
    
    const [ player, setPlayer ] = useState('')
    
    const onChangePlayer = e => {
        e.preventDefault()
        setPlayer(e.target.value)
    }
    
    return (
        
        <form className="m-8 p-8 rounded shadow-md text-gray-500" onSubmit={ e => { e.preventDefault(); incFormNumber() }}>
        
            <div className="flex justify-between mb-6 text-sm">
                <button className="bg-blue-500 font-bold px-2 py-1 rounded text-white disabled:bg-gray-500 hover:bg-blue-600" disabled={formNumber === 1} onClick={ e => { e.preventDefault(); redFormNumber() }}>
                    PREV
                </button>
                {formNumber}/4
                <button className="bg-blue-500 font-bold px-2 py-1 rounded text-white disabled:bg-gray-500 hover:bg-blue-600" disabled={formNumber === 4 || (matchState[`team${suffix}Players`].length != matchState.matchNoOfPlayers)} type="submit">
                    NEXT
                </button>
            </div>
            
            <div>
                <p className="font-bold text-blue-500 text-xl mb-4">
                    Team {suffix}
                </p>
            
                <div className="mb-4 p-4 rounded shadow-md text-gray-500">
                    <label className="block" htmlFor={`team${suffix}Name`}> Name of the team </label>
                    <input className="border p-2 rounded w-full focus:outline-blue-500" id={`team${suffix}Name`} name={`team${suffix}Name`} onChange={onChange} placeholder="Name of the team" required type="text" value={matchState[`team${suffix}Name`]} />
                </div>
                
                <div className="mb-4 p-4 rounded shadow-md text-gray-500">
                    <div className="mb-4">
                        <label className="block" htmlFor="name"> Add player </label>
                        <input className="border mr-2 p-2 rounded w-full focus:outline-blue-500" disabled={matchState[`team${suffix}Players`].length == matchState.matchNoOfPlayers} id="name" name="name" onChange={onChangePlayer} placeholder="Enter player name" value={player} />
                    </div>
                    <div className="flex justify-end">
                        <button className="bg-blue-500 font-bold px-2 py-1 rounded text-right text-white disabled:bg-gray-500 hover:bg-blue-600" disabled={!player || (matchState[`team${suffix}Players`].length == matchState.matchNoOfPlayers)} onClick={ e => { e.preventDefault(); addTeamPlayer(player, suffix); setPlayer('') }}>
                            Add
                        </button>
                    </div>
                </div>
                
                <span className="font-bold mx-8 px-8">
                    { state?.status?.res && <span className="text-green-500"> {state?.status?.res} </span> }
                    { state?.status?.err && <span className="text-red-500"> {state?.status?.err} </span> }
                </span>
                    
                { matchState[`team${suffix}Players`]?.length > 0 && (
                    <div className="mb-4 p-4 rounded shadow-md text-gray-500">
                        <p> Players({matchState[`team${suffix}Players`].length})</p>
                        { [...matchState[`team${suffix}Players`]].sort().map ( (p, idx) => (
                            <div className="flex justify-between my-2" key={`${p}-${idx}`}> 
                                <span> {p} </span>
                                <div className="bg-gray-500 h-7 rounded-full text-center text-white w-7" onClick={ e => { e.preventDefault(); rmTeamPlayer(p, suffix) }}> 
                                    x 
                                </div> 
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
        </form>
    )
}

export default TeamForm