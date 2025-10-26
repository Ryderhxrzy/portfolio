// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { projects, personalInfo } from './data/projects';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar personalInfo={personalInfo} />
        <Routes>
          <Route path="/" element={<Home projects={projects} personalInfo={personalInfo} />} />
          <Route path="/projects" element={<Projects projects={projects} />} />
          <Route path="/contact" element={<Contact personalInfo={personalInfo} />} />
        </Routes>
        <Footer personalInfo={personalInfo} />
      </div>
    </Router>
  );
}

export default App;