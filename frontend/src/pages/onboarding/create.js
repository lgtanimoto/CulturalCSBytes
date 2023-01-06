import React from 'react';
import { useNavigate } from "react-router-dom";
import './create.css';

const CreateAccount = () => {

  const navigate = useNavigate();

  const goHome = () => {
    navigate("/home")
  }

  //checks to make sure username is not blank, and is unique
  //checks to make sure the password is 8 characters or longer
  //checks to make sure passwords match
  const continueClick = () => {
    // TODO: check backend for if username is unique (not case sensitive, so Bob and bob cannot both exist)
    // TODO: add more limitations for password (only certain characters, at least one capital, number, and symbol)
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    if(username === "") {
      document.getElementById("feedback").innerText = "Username cannot be blank";
    } else if (document.getElementById("password").value.length < 8) {
      document.getElementById("feedback").innerText = "Password must be 8 characters or longer";
    } else if (document.getElementById("password").value !== document.getElementById("confirm-password").value) {
      document.getElementById("feedback").innerText = "Passwords do not match";
    } else {
      navigate("/continue-create-account", {state: {name: username, pw: password} })
    }
  }

  return(
    <div className='Create'>
      <h1>Create Account</h1>
      <div className="username">
        <div className="item">
          <p>Username:</p>
          <input id="username" type="text"></input>
        </div>
        <div className="item">
          <p>Password:</p>
          <input id="password" type="text"></input>
        </div>
        <div className="item">
          <p>Confirm Password:</p>
          <input id="confirm-password" type="text"></input>
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

export default CreateAccount;