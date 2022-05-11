import Header from '../components/Header'
import { CentralStateProvider } from '../hooks/useCentralState'
import { MatchStateProvider } from '../hooks/useMatchState'
import '../styles/globals.css'

const MyApp = ({ Component, pageProps }) => {
    return (
        <CentralStateProvider>
            <MatchStateProvider>
                <Header/>
                <div className="m-auto max-w-xl p-4 rounded shadow-md text-gray-500">
                    <div className="mb-2">
                        <Component {...pageProps} />
                    </div>
                    <div>
                        <img className="object-cover h-48 w-full" src="https://source.unsplash.com/featured/?wickets"/>
                    </div>
                </div>
            </MatchStateProvider>
        </CentralStateProvider>
    )
}

export default MyApp
