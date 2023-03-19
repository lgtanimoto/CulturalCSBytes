import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './login.css';

const Login = ({setAuth}) => {

  const navigate = useNavigate();

  const goHome = () => {
    navigate("/home")
  }

  const [inputs, setInputs] = useState({
    username: "",
    password: ""
  });

  const { username, password } = inputs;

  const onChange = e => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  //makes backend call to login, navigates to enrollments if successful, displays message if not
  const continueClick = async e => {
    e.preventDefault();
    try {
      const body = { username, password };
      const response = await fetch("http://localhost:3001/authentication/login", {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(body)
      });

      const parseRes = await response.json();

      if (parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        setAuth(true);
      } else {
        setAuth(false);
        document.getElementById("feedback").innerText = "Username or password is incorrect";
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  return(
    <div className='Create'>
      <h1>Login</h1>
      <div className="username">
        <div className="item">
          <p>Username:</p>
          <input id="username" type="text" name="username" value={username} onChange={e => onChange(e)}></input>
        </div>
        <div className="item">
          <p>Password:</p>
          <input id="password" type="text" name="password" value={password} onChange={e => onChange(e)}></input>
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