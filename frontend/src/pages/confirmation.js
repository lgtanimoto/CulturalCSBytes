import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import './questions.css';

const Confirmation = ({setAuth}) => {

  const navigate = useNavigate();
  const location = useLocation();

  const id = location.state.id;
  const sessionId = location.state.sessionId;
  const difficulty = location.state.difficulty;
  const preferredCulture = location.state.culture;
  const additionalCultures = location.state.additionalCultures;
  const name = location.state.name;

  const cancel = () => {
    navigate("/course-enrollments");
  }

  const ok = async e => {
    e.preventDefault();

    try {
      const body = {
        preferredCulture,
        difficulty,
        additionalCultures
      };

      console.log(body);
      if(sessionId != false) {
        const response = await fetch(`http://localhost:3001/enrollments/${id}/sessions/${sessionId}`, {
          method: 'PATCH',
          headers: {
            "Content-type": "application/json",
            token: localStorage.token
          },
          body: JSON.stringify(body)
        });

        const parseRes = await response.json();
        console.log(parseRes);

        navigate("/questions", {state: {id: id, sessionId: sessionId, order: 1, name: name}});
      } else {
        const response = await fetch(`http://localhost:3001/enrollments/${id}/sessions`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            token: localStorage.token
          },
          body: JSON.stringify(body)
        });

        const parseRes = await response.json();
        console.log(parseRes);

        navigate("/questions", {state: {id: id, sessionId: parseRes.sessionId, order: 1, name: name}});
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <div className="Center">
      <div id="welcome">
        <h1>{name}</h1>
        <h2>20 questions : ~60 minutes</h2>
      </div>
      <button id="login" onClick={cancel}>Cancel</button>
      <button id="createAccount" onClick={ok}>Begin Session</button>
    </div>
  );
}

export default Confirmation;
