const ChooseBowler = ({ bowlers, onChange })=> {
    return(
        <div className="mb-4 p-4 rounded shadow-md text-gray-500">
            <label htmlFor="bowler"> Choose bowler: </label>
            <select className="border p-2 rounded w-full focus:outline-blue-500" id="bowler" name="bowler" onChange={onChange}>
                <option value=""> </option>
                { bowlers && bowlers.map( (b, idx) => (
                    <option key={`b-${idx}`} value={b}> {b} </option>
                ))}
            </select>
        </div>
    )
}

export default ChooseBowler