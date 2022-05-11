import { useCentralState } from '../hooks/useCentralState'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Header = () => {
    const router = useRouter()
    const state = useCentralState()
    
    
    
    return (
        
        
        <div className="bg-gray-500 flex justify-end space-x-4 p-2 text-white w-full">
            <Link href="/"><a> Match </a></Link>
            
            { state?.user?.$id ? (
                <>
                    <button onClick={state.userLogout}> Logout </button>
                </>
            ) : (
                <Link href="/signup"><a>
                    Signup
                </a></Link>
            )}
        </div>
        
    )
}

export default Header