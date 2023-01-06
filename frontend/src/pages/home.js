import React from 'react';
import { useNavigate } from "react-router-dom";
import './home.css';

function Home() {

  const navigate = useNavigate();

  const login = () => {
    navigate("/login")
  }

  const createAccount = () => {
    navigate("/create-account")
  }

  const about = () => {
    navigate("/about")
  }

  return (
    <div className="Home">
      <div id="welcome">
        <h1>Welcome to CulturalCSBytes!</h1>
        <h2>By All Together Computer Science Education (ATCSED)</h2>
      </div>
      <button id="login" onClick={login} >Login</button>
      <button id="createAccount" onClick={createAccount} >Create Account</button>
      <button id="about" onClick={about} >About</button>
    </div>
  );
}

export default Home;
