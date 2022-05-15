import MatchForm from '../components/MatchForm'
import { useCentralState } from '../hooks/useCentralState'
import { NewMatchProvider } from '../hooks/useNewMatchState'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const NewMatch = () => {
    const router = useRouter()
    const state = useCentralState()
    
    useEffect(() => {
        if(state.user && !state.user.$id){
            router.replace('/login')
        }
    }, [])
    
    return (
        <NewMatchProvider>
            <MatchForm/>
        </NewMatchProvider>
    )
}

export default NewMatch