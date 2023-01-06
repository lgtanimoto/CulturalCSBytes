import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import './course-enrollments.css';

const CourseEnrollments = () => {

  const navigate = useNavigate();
  const location = useLocation();

  

  //TO DO: get nickname from backend on login
  return(
    <div className='Create'>
      <h1>Course Enrollments</h1>
      <div className="item">
        <p>Username: {location.state.username}</p>
        <p>Nickname: XXXXX</p>
      </div>
    </div>
  );
}

export default CourseEnrollments;