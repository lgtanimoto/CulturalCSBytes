import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import './enroll.css';

const Enroll = ({setAuth}) => {

  const navigate = useNavigate();
  const location = useLocation();
  const [loaded, setLoaded] = useState(false);

  const id = location.state.id;
  const name = location.state.name;
  const [sessionId, setSessionId] = useState();
  const [difficulty, setDifficulty] = useState('Medium');
  const [culture, setCulture] = useState('Default Culture');
  const [additionalCultures, setAdditionalCultures] = useState([]);

  async function getInfo() {
    try {
      setLoaded(true);
      const res = await fetch(`http://localhost:3001/enrollments/${id}/sessions/new`, {
        method: 'GET',
        headers: { token: localStorage.token }
      });
        
      const parseData = await res.json();

      console.log(parseData);
      setSessionId(parseData.sessionId);
      
      var select = document.getElementById("difficulties"); 
      for(var i = 0; i < parseData.difficulties.length; i++) {
        var element = document.createElement("option");
        element.text = parseData.difficulties[i];
        element.value = parseData.difficulties[i];
        select.add(element);
      }
      
      select = document.getElementById("cultures"); 
      for(i = 0; i < parseData.cultures.length; i++) {
        element = document.createElement("option");
        element.text = parseData.cultures[i].name;
        element.value = parseData.cultures[i].name;
        select.add(element);
      }

      select = document.getElementById("additionalCultures"); 
      for(i = 0; i < parseData.cultures.length; i++) {
        element = document.createElement("option");
        element.text = parseData.cultures[i].name;
        element.value = parseData.cultures[i].name;
        select.add(element);
      }
    } catch (err) {
        console.log(err.message);
    }
  }

  useEffect(() => {
    if (loaded === false) {
      getInfo()
    }
  })

  const changeCulture = e => {
    setCulture(e.target.value);
  };

  const changeDifficulty = e => {
    setDifficulty(e.target.value);
  };

  const changeAdditionalCultures = e => {
    var temp = [];
    for(var i=0; i < e.target.options.length; i++) {
      console.log(e.target.options[i]);
      if(e.target.options[i].selected === true) {
        temp.push(e.target.options[i].text);
      }
    }
    setAdditionalCultures(temp);
  };

  const cancel = () => {
    navigate("/course-enrollments");
  }

  const ok = async e => {
    console.log(difficulty);
    console.log(culture);
    console.log(additionalCultures);
    navigate("/confirmation", {state: {id: id, sessionId: sessionId, difficulty: difficulty, culture: culture, additionalCultures: additionalCultures, name: name}});
  }

  return (
    <div className="Center">
      <h1>Initial Session</h1>
      <div className="item">
        <p>Question Set:</p>
        <div className="dropdown">
          <select name="name" id="name" value={name}>
            <option value={name}>{name}</option>
          </select>
        </div>
      </div>
      <div className="item">
        <p>Preferred Culture:</p>
        <div className="dropdown">
          <select name="cultures" id="cultures" value={culture} onChange={e => changeCulture(e)}>
          </select>
        </div>
      </div>
      <div className="item">
        <p>Difficulty:</p>
        <div className="dropdown">
          <select name="difficulties" id="difficulties" value={difficulty} onChange={e => changeDifficulty(e)}>
          </select>
        </div>
      </div>
      <div className="item">
        <p>Additional Cultures:</p>
        <div className="dropdown">
          <select name="additionalCultures" id="additionalCultures" value={additionalCultures} onChange={(e) => changeAdditionalCultures(e)} multiple={true}>
          </select>
        </div>
      </div>
      <button id="login" onClick={cancel} >Cancel</button>
      <button id="createAccount" onClick={ok} >Ok</button>
    </div>
  );
}

export default Enroll;
