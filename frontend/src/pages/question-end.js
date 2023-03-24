import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import './question-end.css';

const QuestionEnd = ({setAuth}) => {

  const navigate = useNavigate();
  const location = useLocation();

  const totalCorrect = location.state.correct;
  const totalQuestions = location.state.numOfQuestions;

  return (
    <div className="Question">
      <div id="welcome">
        <h1>Recommendations</h1>
      </div>
      <p>You got {totalCorrect} out of {totalQuestions}</p>
      <button onClick={() => setAuth(false)}>Logout</button>
    </div>
  );
}

export default QuestionEnd;
