// pages/login.js

import { useCentralState } from '../hooks/useCentralState'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const Signup = () => {
    
    const router = useRouter()
    const state = useCentralState()
    
    const [ name, setName ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ username, setUsername ] = useState('')
    
    const onSubmit = async(e) => {
        e.preventDefault()
        await state.userSignup(username, password, name)
    }
    
    useEffect(() => {
        if(state.user && state.user.$id) {
            router.replace('/')
        }
    }, [ router, state ])
    
    if(state.user && state.user.$id) {
        return(
            <div className="max-w-sm w-full">
                <div className="m-8 p-8 rounded shadow-md text-gray-500">
                    Redirecting...
                </div>
            </div>
        )
    }
    
    return (
        
            <form className="m-2 p-2 rounded shadow-md text-gray-500" onSubmit={onSubmit}>
                <div className="mb-4">
                    <label className="block" htmlFor="username"> Name </label>
                    <input className="border p-2 rounded w-full focus:outline-blue-500" id="name" name="name" onChange={e => { state.clearStatus(); setName(e.target.value) }} value={name} />
                </div>
                
                <div className="mb-4">
                    <label className="block" htmlFor="username"> Username </label>
                    <input className="border p-2 rounded w-full focus:outline-blue-500" placeholder="Enter email address" id="username" name="username" onChange={e => { state.clearStatus(); setUsername(e.target.value) }} type="email" value={username} />
                </div>
                
                <div className="mb-6">
                    <label className="block" htmlFor="password"> Password </label>
                    <input className="border p-2 rounded w-full focus:outline-blue-500" id="password" name="password" onChange={e => { state.clearStatus(); setPassword(e.target.value) }} type="password" value={password} />
                </div>
                
                <p className="pb-2 text-green-500"> {state?.status?.res} </p>
                <p className="pb-2 text-red-500"> {state?.status?.err} </p>
                <p className="pb-2 text-amber-500"> {state?.status?.progress} </p>
                
                <button className="bg-blue-500 font-bold px-4 py-2 rounded text-white disabled:bg-gray-500 hover:bg-blue-600" disabled={!name || !username || !password} type="submit"> Signup </button>
            </form>
        
    )
}

export default Signup