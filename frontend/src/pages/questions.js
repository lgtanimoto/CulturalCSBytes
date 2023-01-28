import React from 'react';
import { useNavigate } from "react-router-dom";
import './questions.css';

function Questions() {

  const [answered, setAnswered] = React.useState(false);
  const numOfQuestions = 5; //get from backend
  const [curNum, setCurNum] = React.useState(1); //get from backend
  const [curQuestion, setCurQuestion] = React.useState("This is the question This is the questionThis is the questionThis is the questionThis is the questionThis is the question"); //get from backend
  const [answer1, setAnswer1] = React.useState("Answer 1"); //get from json
  const [answer2, setAnswer2] = React.useState("Answer 2"); //get from json
  const [answer3, setAnswer3] = React.useState("Answer 3"); //get from json
  const [answer4, setAnswer4] = React.useState("Answer 4"); //get from json
  const [answer5, setAnswer5] = React.useState("Answer 5"); //get from json
  const [correctAnswer, setCorrectAnswer] = React.useState(1); //get from json
  const [totalCorrect, setTotalCorrect] = React.useState(0); //get from backend

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
      <p>{curQuestion}</p>
      <img src=""/>
      <div className="Answer">
        <button id="1" onClick={() => answerClick("1")}>{answer1}</button>
      </div>
      <div className="Answer">
        <button id="2" onClick={() => answerClick("2")}>{answer2}</button>
      </div>
      <div className="Answer">
        <button id="3" onClick={() => answerClick("3")}>{answer3}</button>
      </div>
      <div className="Answer">
        <button id="4" onClick={() => answerClick("4")}>{answer4}</button>
      </div>
      <div className="Answer">
        <button id="5" onClick={() => answerClick("5")}>{answer5}</button>
      </div>
      <button id="next" onClick={nextQuestion}>Next</button>
    </div>
  );
}

export default Questions;
