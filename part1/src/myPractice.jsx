import { useState } from "react";

const MyApp = () => {
    const [count,setCount] = useState(10);
    const countPlus = () => setCount(prevCount => prevCount+1);
    const countMinus = () => setCount(prevCount => prevCount-1)
    return(
        <>
            
            <button onClick={countPlus}>+</button>
            <h1>{count}</h1>
            <button onClick={countMinus}>-</button>
        </>
    )
}

export default MyApp;