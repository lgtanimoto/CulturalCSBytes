import React, { useState } from 'react';
import Navbar from './components/index.js';
import { BrowserRouter as Router, Routes, Route, Navigate }
    from 'react-router-dom';
import Home from './pages/home.js';
import About from './pages/about.js';
import Login from './pages/login.js';
import CreateAccount from './pages/onboarding/create.js';
import ContinueCreateAccount from './pages/onboarding/continue-create.js';
import CourseEnrollments from './pages/course-enrollments.js';
import Confirmation from './pages/confirmation.js';
import Enroll from './pages/enroll.js';
import Questions from './pages/questions.js';
import QuestionEnd from './pages/question-end.js';

function App() {

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const setAuth = boolean => {
        setIsAuthenticated(boolean);
    };

    return (
        <Router>
        <Routes>
            <Route exact path="/" element={<Navigate to="/home" />} />
            <Route path='/home' element={<Home/>} />
            <Route path='/about' element={<About/>} />
            <Route path='/login' element={!isAuthenticated ? (<Login setAuth={setAuth} />) : (<Navigate to="/course-enrollments" />) } />
            <Route path='/create-account' element={!isAuthenticated ? (<CreateAccount setAuth={setAuth} />) : (<Navigate to="/login" />) } />
            <Route path='/continue-create-account' element={!isAuthenticated ? (<ContinueCreateAccount setAuth={setAuth} />) : (<Navigate to="/login" />) } />
            <Route path='/course-enrollments' element={isAuthenticated ? (<CourseEnrollments setAuth={setAuth} />) : (<Navigate to="/login" />) } />
            <Route path='/confirmation' element={<Confirmation/>} />
            <Route path='/enroll' element={<Enroll/>} />
            <Route path='/questions' element={<Questions/>} />
            <Route path='/question-end' element={<QuestionEnd/>} />
        </Routes>
        </Router>
    );
}

export default App;