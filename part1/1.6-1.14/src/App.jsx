import { useState } from "react";

const StatisticsLine = (props) => {
  return (
    <>
      <tr>
        <td>{props.text}</td>
        <td>{props.value}</td>
      </tr>
    </>
  );
};

const Statistics = ({ good, neutral, bad }) => {
  const getAllCnt = () => good + neutral + bad;
  const getAverage = () => (good + neutral + bad) / 3;
  const getPositive = () => (good / getAllCnt()) * 100;

  if (getAllCnt() === 0) {
    return (
      <>
        <h1>Statistics</h1>
        <p>No feedback given</p>
      </>
    );
  }

  return (
    <>
      <h1>Statistics</h1>

      <table>
        <tbody>
          <StatisticsLine text="good" value={good}></StatisticsLine>
          <StatisticsLine text="neutral" value={neutral}></StatisticsLine>
          <StatisticsLine text="bad" value={bad}></StatisticsLine>
          <StatisticsLine text="all" value={getAllCnt()}></StatisticsLine>
          <StatisticsLine text="average" value={getAverage()}></StatisticsLine>
          <StatisticsLine
            text="positive"
            value={getPositive()}
          ></StatisticsLine>
        </tbody>
      </table>
    </>
  );
};

const Button = (props) => <button onClick={props.onClick}>{props.text}</button>;

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const goodHandler = () => setGood(good + 1);
  const neutralHandler = () => setNeutral(neutral + 1);
  const badHandler = () => setBad(bad + 1);

  return (
    <div>
      <h1>Give feedback</h1>
      <Button onClick={goodHandler} text="good" />
      <Button onClick={neutralHandler} text="neutral" />
      <Button onClick={badHandler} text="bad" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
