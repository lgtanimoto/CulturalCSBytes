import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import './confirmation.css';

function Confirmation() {

  const navigate = useNavigate();
  const location = useLocation();

  const cancel = () => {
    navigate("/course-enrollments", {state: {username: location.state.username}})
  }

  const ok = () => {
    navigate("/questions", {state: {username: location.state.username, course: location.state.course}});
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
