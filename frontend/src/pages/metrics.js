import React, { useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import './questions.css';
import Metric from './metric.js';

const Metrics = ({setAuth}) => {

  const navigate = useNavigate();
  const location = useLocation();

  const id = location.state.id;
  const name = location.state.name;

  const [username, setUsername] = React.useState("");
  const [nickname, setNickname] = React.useState("");
  const [sessions, setSessions] = React.useState([]);
  const [actions, setActions] = React.useState("");

  async function getMetrics() {
    try {
      const res = await fetch(`/api/enrollments/${id}`, {
        method: 'GET',
        headers: { token: localStorage.token }
      });
        
      const parseData = await res.json();
      console.log(parseData);

      setUsername(parseData.username);
      setNickname(parseData.nickname);
      setSessions(parseData.sessions);
      setActions(parseData.actions);

    } catch (err) {
      console.log(err.message);
    }
  }

  useEffect(() => {
    getMetrics();
  })

  const goBack = () => {
    navigate("/course-enrollments");
  }

  return (
    <div className="Center">
      <div id="welcome">
        <h1>Enrollment Metrics</h1>
      </div>
      <div className="item">
        <p>Username: {username}</p>
        <p>Nickname: {nickname}</p>
        <p>Enrollment Name: {name}</p>
      </div>
      <div>
        {sessions?.map(
            (session, idx) => {
            if (sessions != null) {
                return (<Metric
                key={idx}
                id={session.id}
                name={session.name}
                date={session.date}
                cultures={session.cultures}
                correct={session.correct}
                totalQuestions={session.totalQuestions}
                isOfficialSession={session.isOfficialSession} />);
            } else {
                return (<div />);
            }
            }
        )}
      </div>
      <button onClick={goBack}>Back to Courses</button>
    </div>
  );
}

export default Metrics;
