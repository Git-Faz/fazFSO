import { useState } from "react";

const Button = ({ onClick, text }) => <button onClick={onClick} text={text} >{text}</button>
const Stats = ({ text, value = 0 }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);


  const addGood = () => setGood(good => good + 1);

  const addNeutral = () => setNeutral(neutral => neutral + 1);

  const addBad = () => setBad(bad => bad + 1);

  return (
    <>
      <h1>Give Feedback</h1>
      <Button text='Good' onClick={addGood}></Button>
      <Button text='Neutral' onClick={addNeutral}></Button>
      <Button text='Bad' onClick={addBad}></Button>
      {(good === 0 && neutral === 0 && bad === 0) ? (
        <p>No feedback given</p>
      ) : (
        <>
          <h1>Statistics</h1>
          <table>
            <tbody>
              <Stats text='Good' value={good}></Stats>
              <Stats text='Neutral' value={neutral}></Stats>
              <Stats text='Bad' value={bad}></Stats>
              <Stats text={'Total'} value={good + neutral + bad}></Stats>
              <Stats text={'Average'} value={(good - bad) / (good + neutral + bad)}></Stats>
              <Stats text={'Positive'} value={good / (good + neutral + bad)}></Stats>
            </tbody>
          </table>
        </>
      )}
    </>
  )
}

export default App;