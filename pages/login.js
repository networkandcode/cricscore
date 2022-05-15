// pages/login.js

import { useCentralState } from '../hooks/useCentralState'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const Login = () => {
    
    const router = useRouter()
    const state = useCentralState()

    const [ password, setPassword ] = useState('')
    const [ username, setUsername ] = useState('')

    useEffect(() => {
        if (state?.user?.$id){
            router.replace('/')
        }
    }, [ router, state ])
    
    if(state?.user?.$id) {
        return <div className="max-w-sm w-full"> Redirecting... </div>
    }
    
    return (
        <div className="max-w-xl w-full">
            <form className="m-8 p-8 rounded shadow-md text-gray-500" onSubmit={e => { e.preventDefault();state.userLogin(username, password) }}>
                <div className="mb-4">
                    <label className="block text-sm" htmlFor="username"> Username </label>
                    <input className="border p-2 rounded text-sm w-full focus:outline-blue-500" id="username" name="username" onChange={e => { setUsername(e.target.value) }} placeholder="Enter email address" type="email" value={username} />
                </div>
                
                <div className="mb-6">
                    <label className="block text-sm" htmlFor="password"> Password </label>
                    <input className="border p-2 rounded text-sm w-full focus:outline-blue-500" id="password" name="password" onChange={e => { setPassword(e.target.value) }} type="password" value={password} />
                </div>
                
                <p className="pb-2 text-green-500"> {state?.status?.res} </p>
                <p className="pb-2 text-red-500"> {state?.status?.err} </p>
                <p className="pb-2 text-amber-500"> {state?.status?.progress} </p>

                
                <button disabled={!username.length>0 || !password.length>0} className="bg-blue-500 font-bold px-4 py-2 rounded text-white disabled:bg-gray-500 hover:bg-blue-600" type="submit"> Login </button>
            </form>
        </div>
    )
}

export default Login