import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import './course-enrollments.css';
import Course from './course.js';

const CourseEnrollments = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const continueClick = (name) => {
    navigate("/confirmation", {state: {username: location.state.username, course: name }} );
  }

  //currently dummy data
  //TO DO: fill in with data from backend
  const [courseData, setCourseData] = React.useState([{
      name: "A",
      completed: "5/10",
      high: "100%",
      status: "in progress",
    },
    {
      name: "B",
      completed: "3/10",
      high: "87%",
      status: "in progress",
    },
    {
      name: "C",
      completed: "10/10",
      high: "75%",
      status: "completed",
    }]);

  //TO DO: get nickname from backend on login
  return(
    <div className='Create'>
      <h1>Course Enrollments</h1>
      <div className="item">
        <p>Username: {location.state.username}</p>
        <p>Nickname: XXXXX</p>
      </div>
      <div id="options">
            {courseData.map(
             (course, idx) => {
               if (courseData != null) {
                 return (<Course
                 key={idx}
                 name={course.name}
                 completed={course.completed}
                 high={course.high}
                 status={course.status} 
                 continueClick={continueClick} />);
               } else {
                 return (<div />);
               }
             }
           )}
        </div>
    </div>
  );
}

export default CourseEnrollments;