import React, { useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import './questions.css';

const Recommendations = ({setAuth}) => {

  const navigate = useNavigate();
  const location = useLocation();

  const id = location.state.id;
  const sessionId = location.state.sessionId;
  const enrollmentName = location.state.enrollmentName;

  const [nickname, setNickname] = React.useState("");
  const [correct, setCorrect] = React.useState("");
  const [totalQuestions, setTotalQuestions] = React.useState("");
  const [sessionName, setSessionName] = React.useState("");
  const [culture, setCulture] = React.useState([]);
  const [questionSet, setQuestionSet] = React.useState([]);
  const [questionsMissed, setQuestionsMissed] = React.useState([]);

  async function getRecommendations() {
    try {
      const res = await fetch(`http://localhost:3001/enrollments/${id}/sessions/${sessionId}/recommendations`, {
        method: 'GET',
        headers: { token: localStorage.token }
      });

      const parseData = await res.json();
      console.log(parseData);

      setNickname(parseData.nickname);
      setCorrect(parseData.correct);
      setTotalQuestions(parseData.totalQuestions);
      setSessionName(parseData.sessionName);
      setCulture(parseData.resources.culture);
      setQuestionSet(parseData.resources.questionSet);
      setQuestionsMissed(parseData.resources.questionsMissed);

    } catch (err) {
      console.log(err.message);
    }
  }

  useEffect(() => {
    getRecommendations();
  })

  const goBack = () => {
    navigate("/course-enrollments");
  }

  return (
    <div className="Center">
      <div id="welcome">
        <h1>Recommendations</h1>
      </div>
      <p>Congratulations, <b>{nickname}</b>. 
        You got <b>{correct}</b> out of <b>{totalQuestions}</b> correct in your <b>{sessionName}</b> in enrollment <b>{enrollmentName}</b>. 
        Great work so far! Come back in a few weeks to test again.</p>
      <p>To keep improving your CS skills, please check out the following resources </p>
      <div id="recommendations">
        <div>
          {culture}
        </div>
        <div>
            {questionSet.map(
             (question) => {
               if (questionSet != null) {
                 return (<div><a href={question.url}>{question.title}</a><br></br></div>);
               } else {
                 return (<div />);
               }
             }
           )}
        </div>
        <div>
          {questionsMissed}
        </div>
      </div>
      <button onClick={goBack}>Back to Courses</button>
    </div>
  );
}

export default Recommendations;
