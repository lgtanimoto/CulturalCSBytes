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
      <div id="welcome">
        <h1>Cultural CS Bytes</h1>
      </div>
      <div id="about">
        <p>This is the initial prototype of Cultural CS Bytes.</p>
        <p>Cultural CS Bytes is an online flashcard website consisting of multiple-choice questions typical for a pre/post-test for an introductory high school computer science course or the first semester of an AP Computer Science Principles class.</p>
        <p>The main difference between Cultural CS Bytes (CCSB) and other flashcard systems is that students can learn CS through stories that represent their life experiences in a "culture" that engages them.   Students can also take flashcard learning sessions that mix in questions from a variety of “cultures” but still have each the same underlying computer science principles.</p>
        <p>Data stored through this prototype will not persist beyond the next update. This prototype makes no assertions about privacy.  Users should feel free to use fake data in registering.</p>
        <p>Cultural CS Bytes is free to teachers to supplement their courses and individual students who want to learn CS independently.  All code is open source and available under MIT/X license.   All content is licensed under Creative Commons Attribution-ShareAlike 4.0.   Code and content are available at <a href="https://github.com/lgtanimoto/CulturalCSBytes">https://github.com/lgtanimoto/CulturalCSBytes</a></p>
        <p>Please send any questions or comments to <b>lt@atsced.org</b>.   We would love to hear from you, especially if you would like to contribute content to share with this effort.</p>
      </div>
      <button onClick={goHome}>Go Back</button>
    </div>
  );
};

export default About;