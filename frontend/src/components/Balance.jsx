export const Balance= ({value})=> {
    return <div className="flex">
        <div className="font-bold ml-3 mr-2 mt-4 text-xl">
            Your Balance is 
        </div>
        <div className="font-semibold text-xl mt-4 mb-2">
        ₹ {value}
        </div>
    </div>
}