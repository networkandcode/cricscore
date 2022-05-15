const OverScore = ({ overScore }) => {
    <div className="mb-4 p-4 rounded shadow-md text-gray-500">
        { overScore.map( (i, idx) => (
            <div  key={`${i}-${idx}`}>
                <div className="bg-blue-500 m-2 p-2 text-white">
                    { i.wicketType && i.wicketType } { i.runs } { i.byesType && i.byesType } { i.extras && i.extras }
                </div>
                { !i.extras && (
                    <div className="flex items-center pt-2 relative">
                        <div className="border-gray-400 border-t flex-grow "></div>
                        <span className="flex-shrink mx-4 text-gray-400">Ball {i.ballNo + 1} / 6</span>
                        <div className="border-gray-400 border-t flex-grow "></div>
                    </div>
                )}
            </div>
        ))}
    </div>
}

export default OverScore