import React, { useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import './questions.css';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

function Questions() {

  const location = useLocation();

  const [answered, setAnswered] = React.useState(false);
  const numOfQuestions = 5; //get from backend
  const [curNum, setCurNum] = React.useState(1); //get from backend
  const [curQuestion, setCurQuestion] = React.useState("This is the question This is the questionThis is the questionThis is the questionThis is the questionThis is the question"); //get from backend
  const [answer1, setAnswer1] = React.useState("Answer 1"); //get from json
  const [answer2, setAnswer2] = React.useState("Answer 2"); //get from json
  const [answer3, setAnswer3] = React.useState("Answer 3"); //get from json
  const [answer4, setAnswer4] = React.useState("Answer 4"); //get from json
  const [correctAnswer, setCorrectAnswer] = React.useState(1); //get from json
  const [totalCorrect, setTotalCorrect] = React.useState(0); //get from backend

  async function getQuestion() {
    try {
      var parseData = "";
      if (location.state.sessionId == null) {
        const res = await fetch(`http://localhost:3001/enrollments/${location.state.id}/sessions/${location.state.redirect}`, {
          method: 'GET',
          headers: { token: localStorage.token }
        });
        parseData = await res.json();
      } else {
        console.log("id = " + location.state.id + " sessionId = " + location.state.sessionId);
        const res = await fetch(`http://localhost:3001/enrollments/${location.state.id}/sessions/${location.state.sessionId}/questions/${1}`, {
          method: 'GET',
          headers: { token: localStorage.token }
        });
        parseData = await res.json();
      }
      
      

      console.log(parseData);

      setCurQuestion(parseData.questionJson.Question);
      setAnswer1(parseData.questionJson.Answer1);
      setAnswer2(parseData.questionJson.Answer2);
      setAnswer3(parseData.questionJson.Answer3);
      setAnswer4(parseData.questionJson.Answer4);

    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    getQuestion()
  })

  const navigate = useNavigate();

  function answerClick(answer) {
    if(answered == false) {
        if(answer == correctAnswer) {
            document.getElementById(answer).style.backgroundColor = "green";
            setTotalCorrect(totalCorrect + 1);
        } else {
            document.getElementById(answer).style.backgroundColor = "red";
            document.getElementById(correctAnswer).style.backgroundColor = "green";
        }
        setAnswered(true);
    }
  }

  const nextQuestion = () => {
    if (answered == true) {
      console.log("curNum = " + curNum + "  numOfQuestions = " + numOfQuestions);
      if (curNum != numOfQuestions) {
        //get next set of question/answers
        setAnswered(false);
        setCurNum(curNum + 1);
        document.getElementById(1).style.backgroundColor = "white";
        document.getElementById(2).style.backgroundColor = "white";
        document.getElementById(3).style.backgroundColor = "white";
        document.getElementById(4).style.backgroundColor = "white";
        document.getElementById(5).style.backgroundColor = "white";
      } else {
        navigate("/question-end", {state: {correct: totalCorrect, numOfQuestions: numOfQuestions}});
      }
    }
  }

  return (
    <div className="Question">
      <div id="welcome">
        <h1>Question {curNum} of {numOfQuestions}</h1>
      </div>
      <div>{ ReactHtmlParser(curQuestion) }</div>
      <img src=""/>
      <div className="Answer">
        <button id="1" onClick={() => answerClick("1")}>{ ReactHtmlParser(answer1) }</button>
      </div>
      <div className="Answer">
        <button id="2" onClick={() => answerClick("2")}>{ ReactHtmlParser(answer2) }</button>
      </div>
      <div className="Answer">
        <button id="3" onClick={() => answerClick("3")}>{ ReactHtmlParser(answer3) }</button>
      </div>
      <div className="Answer">
        <button id="4" onClick={() => answerClick("4")}>{ ReactHtmlParser(answer4) }</button>
      </div>
      <button id="next" onClick={nextQuestion}>Next</button>
    </div>
  );
}

export default Questions;
