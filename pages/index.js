import { useCentralState } from '../hooks/useCentralState'
import { useMatchState } from '../hooks/useMatchState'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Home = () => {
    
    const router = useRouter()
    const state = useCentralState()
    const { getMatches, matches, rmMatch } = useMatchState()
    
    useEffect(() => {
        
        if (state.user && !state.user.$id){
            router.replace('/login')
        } else {
            getMatches()
        }
        
    }, [ router, state ])
  
    if(state?.user?.$id) {
        return (
            <div>
                <h1 className="font-bold mb-4 text-gray-500 text-xl">
                    Hi { state?.user?.name }
                </h1>
                
                <Link href="/new-match"><a>
                    <button className="bg-blue-500 font-bold hover:bg-blue-600 px-4 py-2 rounded text-white " type="button">
                        New match
                    </button>
                </a></Link>
                
                { matches.length > 0 && (
                <div className="mt-6">
                    <h1 className="font-bold mb-2 text-2xl text-blue-500">
                        Match history:
                    </h1>
                { matches.map( i => (
                    <div className="flex font-bold justify-between my-4 text-xl text-gray-500" key={i.$id}>
                        <span>
                            <Link href={`/match/${i.$id}`}><a>
                                {i.matchName} {i.matchStatus}
                                <p className="text-sm"> { i.teamAName } vs { i.teamBName } </p>
                                <p className="text-xs"> { i.matchPlace } </p>
                                { i.matchStatus === 'Ended' && <p className="text-sm"> Winner: { i.winner } </p> }
                            </a></Link>
                        </span>
                        <div className="bg-gray-500 h-8 rounded-full text-center text-white w-8" onClick={ () => { rmMatch(i) }}> 
                            x 
                        </div>
                    </div>
                ))}
                </div>
                )}
                
            </div>
        )
    }
    
    return(
        <div>
            <p className="pb-2 text-green-500"> {state?.status?.res} </p>
            <p className="pb-2 text-red-500"> {state?.status?.err} </p>
            <p className="pb-2 text-amber-500"> {state?.status?.progress} </p>
        </div>
    )
}

export default Home