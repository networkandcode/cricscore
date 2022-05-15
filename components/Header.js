import { useCentralState } from '../hooks/useCentralState'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Header = () => {
    const router = useRouter()
    const state = useCentralState()
    
    
    
    return (
        
        
        <div className="bg-gray-500 flex italic justify-end space-x-4 p-2 text-xl text-white w-full">
            <Link href="/"><a> Cricscore </a></Link>
            
            { state?.user?.$id ? (
                <>
                    <button onClick={state.userLogout}> Logout </button>
                </>
            ) : (
                <>
                    { router.route !== '/login' && (
                        <Link href="/login"><a>
                            Login
                        </a></Link>
                    )}
                    
                    { router.route !== '/signup' && (
                        <Link href="/signup"><a>
                            Signup
                        </a></Link>
                    )}
                </>
            )}
        </div>
        
    )
}

export default Header