import React from "react";
import { useNavigate } from "react-router-dom";
import './questions.css';

const About = () => {

  const navigate = useNavigate();

  const goHome = () => {
    navigate("/home")
  }

  return (
    <div className="Center">
      <p>
        CulturalCSBytes is started by All Together Computer Science Education (ATCSED)
      </p>
      <button onClick={goHome}>Go Back</button>
    </div>
  );
};

export default About;