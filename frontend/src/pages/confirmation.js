import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import './confirmation.css';

function Confirmation() {

  const navigate = useNavigate();
  const location = useLocation();

  const id = location.state.id;
  const sessionId = location.state.sessionId;
  const difficulties = location.state.difficulty;
  const cultures = location.state.culture;
  const additionalCultures = location.state.additionalCultures;

  const cancel = () => {
    navigate("/course-enrollments");
  }

  const ok = async e => {
    e.preventDefault();

    try {
      const body = {
        cultures,
        difficulties,
        additionalCultures
      };

      console.log(body);
      
      const response = await fetch(`http://localhost:3001/enrollments/${id}/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: { token: localStorage.token },
        body: JSON.stringify(body)
      });
      
      const parseRes = await response.json();

      console.log(parseRes);

      navigate("/questions", {state: {id: id, sessionId: sessionId, difficulties: difficulties, cultures: additionalCultures}});
    } catch {

    }
  }

  return (
    <div className="Confirmation">
      <div id="welcome">
        <h1>{location.state.course} Confirmation Screen</h1>
        <h2>Info from classroom Enrollment/Initial Session/Session Start screen including number of questions, expected time to complete</h2>
      </div>
      <button id="login" onClick={cancel} >Cancel</button>
      <button id="createAccount" onClick={ok} >Ok</button>
    </div>
  );
}

export default Confirmation;
