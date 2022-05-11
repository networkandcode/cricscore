import MatchForm from '../components/MatchForm'
import { useCentralState } from '../hooks/useCentralState'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Match = () => {
    const router = useRouter()
    const state = useCentralState()
    
    useEffect(() => {
        if(state.user && !state.user.$id){
            router.replace('/login')
        }
    }, [])
    
    return <MatchForm/>
}

export default Match