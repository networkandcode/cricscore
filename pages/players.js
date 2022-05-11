// pages/players.js

import { useCentralState } from '../hooks/useCentralState'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const Players = () => {
    const router = useRouter()
    const state = useCentralState()
    
    const [ player, setPlayer ] = useState('')
    
    const onChange = e => {
        e.preventDefault()
        const { value } = e.target
        setPlayer(value)
    }
    
    useEffect(() => {
        if (state.user && !state.user.$id){
            router.replace('/login')
        }
        
    }, [ router, state ])
    
    if(state?.user?.$id){
        return (
            <div className="m-auto max-w-md text-md w-full">
                <form className="m-8 p-8 rounded shadow-md text-gray-500" onSubmit={e => { e.preventDefault(); state.addPlayer(player); setPlayer('') }}>
                    <div className="mb-4">
                        <label className="block" htmlFor="name"> Add player </label>
                        <input className="border p-2 rounded w-full focus:outline-blue-500" id="name" name="name" onChange={onChange} placeholder="Enter player name" value={player} />
                    </div>
                    <button disabled={!player} className="bg-blue-500 font-bold px-4 py-2 rounded text-white disabled:bg-gray-500 hover:bg-blue-600" type="submit"> Add </button>
                </form>
                
                <span className="font-bold mx-8 px-8">
                    { state?.status?.res && <span className="text-green-500"> {state?.status?.res} </span> }
                    { state?.status?.err && <span className="text-red-500"> {state?.status?.err} </span> }
                </span>
                    
                { state?.players?.length > 0 && (
                    <div className="mx-8 p-8 rounded shadow-md text-gray-500 text-md">
                        { [...state.players].sort().map ( (p, idx) => (
                            <div className="flex justify-between my-2" key={`${p}-${idx}`}> 
                                <span> {p} </span>
                                <div className="bg-gray-500 h-7 rounded-full text-center text-white w-7" onClick={e => { e.preventDefault(); state.rmPlayer(p); setPlayer('')}}> 
                                    x 
                                </div> 
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )    
    }
    
    return (
        <div className="max-w-sm w-full">
            <p className="m-8 p-8 rounded shadow-md text-gray-500">
                Redirecting... 
            </p>
        </div>
    )
}

export default Players