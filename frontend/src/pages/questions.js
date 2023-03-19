import React, { useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import './questions.css';
import ReactHtmlParser from 'react-html-parser';

function Questions() {

  const navigate = useNavigate();
  const location = useLocation();

  const id = location.state.id;
  const sessionId = location.state.sessionId;
  const [order, setOrder] = React.useState(location.state.order);
  const [numOfQuestions, setNumOfQuestions] = React.useState(4);

  const [curQuestion, setCurQuestion] = React.useState("");
  const [answer1, setAnswer1] = React.useState("Answer 1"); 
  const [answer2, setAnswer2] = React.useState("Answer 2"); 
  const [answer3, setAnswer3] = React.useState("Answer 3"); 
  const [answer4, setAnswer4] = React.useState("Answer 4"); 
  const [correctAnswer, setCorrectAnswer] = React.useState(1); 
  const [explanation, setExplanation] = React.useState("");
  
  const [answered, setAnswered] = React.useState(false);
  const [totalCorrect, setTotalCorrect] = React.useState(0);

  async function getQuestion() {
    try {
      console.log("id = " + id);
      console.log("sessionId = " + sessionId);
      
      const res = await fetch(`http://localhost:3001/enrollments/${id}/sessions/${sessionId}/questions/${order}`, {
        method: 'GET',
        headers: { token: localStorage.token }
      });
      
      const parseData = await res.json();
      console.log(parseData);

      return parseData;
      
    } catch (err) {
      console.error(err.message);
    }
  }

  function displayQuestions(parseData) {
    if(parseData.hasOwnProperty("questionJson")) {
      setCurQuestion(parseData.questionJson.Question);
      setAnswer1(parseData.questionJson.Answer1);
      setAnswer2(parseData.questionJson.Answer2);
      setAnswer3(parseData.questionJson.Answer3);
      setAnswer4(parseData.questionJson.Answer4);
      setCorrectAnswer(parseData.questionJson.CorrectAnswer);
      setExplanation(parseData.questionJson.Explanation);
      setNumOfQuestions(parseData.totalQuestions);

      if(parseData.imagesBlob !== null) {
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(new Blob(parseData.imagesBlob.data, {type: parseData.imagesBlob.type}));
        console.log(imageUrl);
        if(document.getElementById("qimg0") !== null) {
          document.getElementById("qimg0").src = imageUrl;
        }
      }

      console.log("question: " + order + "/" + numOfQuestions);
    }
  }

  async function submitAnswer(answer) {
    try {
      const body = {answer};

      const response = await fetch(`http://localhost:3001/enrollments/${id}/sessions/${sessionId}/questions/${order}`, {
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json',
          token: localStorage.token
        },
        body: JSON.stringify(body)
      });
      
      const parseRes = await response.json();

      console.log(parseRes);

    } catch (err) {
      console.log(err.message);
    }
  }

  async function continueSession() {
    try {
      const body = { next: true };

      const response = await fetch(`http://localhost:3001/enrollments/${id}/sessions/${sessionId}/questions/${order}`, {
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json',
          token: localStorage.token
        },
        body: JSON.stringify(body)
      });
      
      const parseRes = await response.json();

      console.log(parseRes);

    } catch (err) {
      console.log(err.message);
    }
  }

  useEffect(() => {
    getQuestion().then((parseData) => displayQuestions(parseData));
  })

  function answerClick(answer) {
    if(answered === false) {
        if(answer === correctAnswer) {
            document.getElementById(answer).style.backgroundColor = "green";
            setTotalCorrect(totalCorrect + 1);
        } else {
            document.getElementById(answer).style.backgroundColor = "red";
            document.getElementById(correctAnswer).style.backgroundColor = "green";
        }
        setAnswered(true);
        document.getElementById("explanation").style.display = "block";
        submitAnswer(answer);
    }
  }

  const nextQuestion = () => {
    if (answered === true) {
      console.log("order = " + order + "  numOfQuestions = " + numOfQuestions);
      if (1 === 1) {
        continueSession().then(result => {
          setOrder(order + 1);
          setAnswered(false);
          document.getElementById(1).style.backgroundColor = "white";
          document.getElementById(2).style.backgroundColor = "white";
          document.getElementById(3).style.backgroundColor = "white";
          document.getElementById(4).style.backgroundColor = "white";
          document.getElementById("explanation").style.display = "none";
        });
      } else {
        navigate("/question-end", {state: {correct: totalCorrect, numOfQuestions: numOfQuestions}});
      }
    }
  }

  return (
    <div >
      <div id="welcome">
        <h1>Question {order} of {numOfQuestions}</h1>
      </div>
      <div>{ ReactHtmlParser(curQuestion) }</div>
      <img src="" alt=""/>
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
      <div id="explanation">{ ReactHtmlParser(explanation) }</div>
      <button id="next" onClick={nextQuestion}>Next</button>
    </div>
  );
}

export default Questions;
