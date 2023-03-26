import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './questions.css';
import Course from './course.js';

const CourseEnrollments = ({setAuth}) => {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  const [courseData, setCourseData] = React.useState([]);

  async function getName() {
    try {
      const res = await fetch('/api/enrollments', {
        method: 'GET',
        headers: { token: localStorage.token }
      });
      
      const parseData = await res.json();

      setName(parseData.nickname);
      setUsername(parseData.username);

      var temp = [];
      for(var i=0; i<parseData.enrollments.length; i++){
        var statusText;
        if(parseData.enrollments[i].status.started === false) {
          statusText = "Not started";
        } else if(parseData.enrollments[i].status.completed === false) {
          statusText = "In progress";
        } else {
          statusText = "Finished";
        }
        temp.push({
          id: parseData.enrollments[i].id,
          name: parseData.enrollments[i].name,
          completed: parseData.enrollments[i].completedSessions,
          high: parseData.enrollments[i].highScore,
          status: statusText,
        })
      };
      setCourseData(temp);

    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    getName()
  })

  async function continueClick(id, name) {
    try {
      const res = await fetch(`/api/enrollments/${id}/sessions/continue`, {
        method: 'GET',
        headers: {
          "Content-type": "application/json",
          token: localStorage.token
        },
      });
      
      const parseData = await res.json();

      if(parseData.route === "new") {
        navigate("/enroll", {state: {id: id, name: name, practice: parseData.params ? true : false}});
      } else {
        console.log(parseData);
        navigate("/questions", {state: {id: id, sessionId: parseData.route.sessionId, order: parseData.route.questionOrder, name: name}});
      }

    } catch (err) {
      console.log(err.message);
    }
  }

  function statsClick(id, name) {
    navigate("/metrics", {state: {id: id, name: name}});
  }

  //TO DO: get nickname from backend on login
  return(
    <div className='Center'>
      <h1>Course Enrollments</h1>
      <div className="item">
        {<p>Username: {username}</p>
        }<p>Nickname: {name}</p>
      </div>
      <div id="options">
            {courseData.map(
             (course, idx) => {
               if (courseData != null) {
                 return (<Course
                 key={idx}
                 id={course.id}
                 name={course.name}
                 completed={course.completed}
                 high={course.high}
                 status={course.status} 
                 statsClick={statsClick}
                 continueClick={continueClick} />);
               } else {
                 return (<div />);
               }
             }
           )}
      </div>
      <button onClick={() => setAuth(false)}>Logout</button>
    </div>
  );
}

export default CourseEnrollments;