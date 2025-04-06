import { useState } from "react";

const Button = ({onClick,text}) => <button onClick={onClick} text={text} >{text}</button>
const Stats = ({text, value = 0}) => <div>{text} {value}</div>

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);


  const addGood = () => setGood(good => good + 1);

  const addNeutral = () => setNeutral(neutral => neutral + 1);

  const addBad = () => setBad(bad => bad +1);

  return(
    <>
      <h1>Give Feedback</h1>
      <Button text='Good' onClick={addGood}></Button>
      <Button text='Neutral' onClick={addNeutral}></Button>
      <Button text='Bad' onClick={addBad}></Button>

      <h1>Statistics</h1>
      <Stats text='Good' value={good}></Stats>
      <Stats text='Neutral' value={neutral}></Stats>
      <Stats text='Bad' value={bad}></Stats>

    </>
  )
}

export default App;