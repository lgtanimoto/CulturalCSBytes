import React from 'react';
import Navbar from './components/index.js';
import { BrowserRouter as Router, Routes, Route}
    from 'react-router-dom';
import Home from './pages/home.js';
import About from './pages/about.js';
import Login from './pages/login.js';
import CreateAccount from './pages/onboarding/create.js';
import ContinueCreateAccount from './pages/onboarding/continue-create.js';
import CourseEnrollments from './pages/course-enrollments.js';

function App() {
return (
    <Router>
    <Routes>
        <Route path='/home' element={<Home/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/create-account' element={<CreateAccount/>} />
        <Route path='/continue-create-account' element={<ContinueCreateAccount/>} />
        <Route path='/course-enrollments' element={<CourseEnrollments/>} />
    </Routes>
    </Router>
);
}

export default App;