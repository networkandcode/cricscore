import { useMatchState }  from '../hooks/useMatchState'

const History = ()=> {
    const {
        matches
    }    = useMatchState()
    
    return (
        { matches && matches.map( i => (
            i.matchNae
        ))}
    )
}

export default History