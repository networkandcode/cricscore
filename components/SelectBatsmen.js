// components/SelectBatsmen.js

import { useBatStateContext }from '../hooks/useBatState'

const SelectBatsmen = ({ batsmen }) => {
    const {
        nonStriker,
        onChangeNonStriker,
        onChangeStriker, 
        striker,
    } = useBatStateContext() 
    
    return (
        <div>
            <div className="mb-2">
                <label htmlFor="strikerBatsman"> Choose striker: </label>
                <select className="border p-2 rounded w-full focus:outline-blue-500" id="strikerBatsman" name="batsman" onChange={onChangeStriker} value={striker.batsman}>
                    <option>  </option>
                    { batsmen.map( (b, idx) => (
                        <option key={`strikerBatsman-${idx}`} value={b}> {b} </option>
                    ))}
                </select>
            </div>
            
            <div className="mb-2">
                <label htmlFor="nonStrikerBatsman"> Choose non striker: </label>
                <select className="border p-2 rounded w-full focus:outline-blue-500" id="nonStrikerBatsman" name="batsman" onChange={onChangeNonStriker} value={nonStriker.batsman}>
                    <option>  </option>
                    { batsmen.map( (b, idx) => (
                        <option key={`nonStrikerBatsman-${idx}`} value={b}> {b} </option>
                    ))}
                </select>
            </div>
        </div>
    )
}

export default SelectBatsmen