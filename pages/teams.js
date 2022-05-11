const Teams = () => {
    
    return (
        <div className="m-auto max-w-md text-md w-full">
            <form className="m-8 p-8 rounded shadow-md text-gray-500" onSubmit={e => { e.preventDefault(); state.addPlayer(player); setPlayer('') }}>
            Team A
                <div className="mb-4">
                    <select id="teamA" multiple name="teamA">
                        <option value="playerA"> playerA </option>
                    </select>
                </div>
            </form>
            
            <form className="m-8 p-8 rounded shadow-md text-gray-500" onSubmit={e => { e.preventDefault(); state.addPlayer(player); setPlayer('') }}>
            Team B
                <div className="mb-4">
                </div>
            </form>
        </div>
    )
    
}

export default Teams