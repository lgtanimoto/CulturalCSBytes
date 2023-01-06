import React from 'react';
import { useNavigate } from "react-router-dom";
import './login.css';

const Login = () => {

  const navigate = useNavigate();

  const goHome = () => {
    navigate("/home")
  }

  const continueClick = () => {
    // TODO: check backend to see if login is correct
    navigate("/course-enrollments", {state: {username: document.getElementById("username").value } } );
  }

  return(
    <div className='Create'>
      <h1>Login</h1>
      <div className="username">
        <div className="item">
          <p>Username:</p>
          <input id="username" type="text"></input>
        </div>
        <div className="item">
          <p>Password:</p>
          <input id="password" type="text"></input>
        </div>
      </div>
      <div className='item'>
        <button onClick={goHome}>Cancel</button>
        <button onClick={continueClick}>Continue</button>
      </div>
      <p id="feedback"></p>
    </div>
  );
}

export default Login;