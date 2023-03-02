import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import './continue-create.css';

const ContinueCreateAccount = ({setAuth}) => {

  const navigate = useNavigate();
  const location = useLocation();

  const [inputs, setInputs] = useState({
    username: location.state.name,
    password: location.state.pw,
    nickname: "",
    email: "",
    age: 0,
    zipcode: 0
  });

  const { username, password, nickname, email, age, zipcode } = inputs;

  const onChange = e => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const goHome = () => {
    navigate("/home");
  }

  const continueClick = async e => {
    e.preventDefault();
    
    try {
      const body = {username,
        password,
        nickname,
        email,
        age,
        zipcode
      };

      const response = await fetch("http://localhost:3001/authentication/register", {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(body)
      });

      const parseRes = await response.json();

      localStorage.setItem("token", parseRes.token);

      setAuth(true);

      console.log(parseRes);
    } catch (err) {
      console.error(err.message);
    }

    // TODO: store info in back end from location.state.name and location.state.pw and this screen input
    //navigate("/course-enrollments", {state: {username: location.state.name, nickname: document.getElementById("nickname").value}});
  }

  return(
    <div className='Create'>
      <h1>Create Account</h1>
      <div className="username">
        <div className="item">
          <p>Nickname:</p>
          <input id="nickname" type="text" name="nickname" value={nickname} onChange={e => onChange(e)}></input>
        </div>
        <div className="item">
          <p>Email:</p>
          <input id="email" type="text" name="email" value={email} onChange={e => onChange(e)}></input>
        </div>
        <div className="item">
          <p>Age:</p>
          <div className="dropdown">
            <select name="age" id="age" value={age} onChange={e => onChange(e)}>
                <option value="less-than-8">Younger than 8</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="16">16</option>
                <option value="17">17</option>
                <option value="18">18</option>
                <option value="19">19</option>
                <option value="20">20</option>
                <option value="21">21</option>
                <option value="older-than-21">Older than 21</option>
            </select>
          </div>
        </div>
        <div className="item">
          <p>Zip Code:</p>
          <input id="zipcode" type="text" name="zipcode" value={zipcode} onChange={e => onChange(e)}></input>
        </div>
        <div className="item">
          <p>Initial Question Set:</p>
          <div className='dropdown'>
            <select name="sets" id="sets">
                <option value="cs_principle_basics">Computer Science Principle Basics</option>
            </select>
          </div>
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

export default ContinueCreateAccount;