import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import './enroll.css';

function Enroll() {

  const navigate = useNavigate();
  const location = useLocation();

  const id = location.state.id;
  const name = location.state.name;
  const [sessionId, setSessionId] = useState();
  const [difficulty, setDifficulty] = useState();
  const [culture, setCulture] = useState();
  const [additionalCultures, setAdditionalCultures] = useState();

  const [difficultyOptions, setDifficultyOptions] = useState([]);
  const [cultureOptions, setCultureOptions] = useState([]);

  async function getInfo() {
    try {
      const res = await fetch(`http://localhost:3001/enrollments/${id}/sessions/new`, {
        method: 'GET',
        headers: { token: localStorage.token }
      });
        
      const parseData = await res.json();

      console.log(parseData);
      setSessionId(parseData.sessionId);
      /*
      setDifficultyOptions(parseData.difficulties);
      setCultureOptions(parseData.cultures);
      
      var select = document.getElementById("difficulties"); 
      for(var i = 0; i < difficultyOptions.length; i++) {
        var element = document.createElement("option");
        element.text = difficultyOptions[i];
        element.value = difficultyOptions[i];
        select.add(element);
        console.log("hi");
      }
      
      select = document.getElementById("cultures"); 
      for(var i = 0; i < cultureOptions.length; i++) {
        var element = document.createElement("option");
        element.text = cultureOptions[i].name;
        element.value = cultureOptions[i.name];
        select.add(element);
      }
      */
    } catch (err) {
        console.log(err.message);
    }
  }

  useEffect(() => {
    getInfo()
  })

  const onChange = e => {
    
  };

  const cancel = () => {
    navigate("/course-enrollments");
  }

  const ok = async e => {
    navigate("/confirmation", {state: {id: id, sessionId: sessionId, difficulty: "Medium", culture: "Default Culture", additionalCultures: []}});
  }

  return (
    <div className="Enroll">
      <div id="welcome">
        <h1>Initial Session</h1>
      </div>
      <div className="item">
        <p>Question Set:</p>
        <div className="dropdown">
          <select name="name" id="name" value={name} onChange={e => onChange(e)}>
            <option value={name}>{name}</option>
          </select>
        </div>
      </div>
      <div className="item">
        <p>Preferred Culture:</p>
        <div className="dropdown">
          <select name="cultures" id="cultures" value={culture} onChange={e => onChange(e)}>
          <option value="Default Culture">Default Culture</option>
          <option value="Test Culture 1">Test Culture 1</option>
          <option value="Test Culture 2">Test Culture 2</option>
          </select>
        </div>
      </div>
      <div className="item">
        <p>Difficulty:</p>
        <div className="dropdown">
          <select name="difficulties" id="difficulties" value={difficulty} onChange={e => onChange(e)}>
          <option value="Medium">Medium</option>
          </select>
        </div>
      </div>
      <div className="item">
        <p>Additional Cultures:</p>
        <input id="password" type="text" name="password" value={id} onChange={e => onChange(e)}></input>
      </div>
      <button id="login" onClick={cancel} >Cancel</button>
      <button id="createAccount" onClick={ok} >Ok</button>
    </div>
  );
}

export default Enroll;
