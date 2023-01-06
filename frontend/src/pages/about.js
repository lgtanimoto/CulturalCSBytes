import React from "react";
import { useNavigate } from "react-router-dom";
import './about.css';

const About = () => {

  const navigate = useNavigate();

  const goHome = () => {
    navigate("/home")
  }

  return (
    <div className="About">
      <p>
        CulturalCSBytes is started by All Together Computer Science Education (ATCSED)
      </p>
      <button onClick={goHome}>Go Back</button>
    </div>
  );
};

export default About;