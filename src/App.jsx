import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar.jsx';
import Home from './components/Home.jsx';
import Projects from './components/Projects.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import GitHubStats from './components/GithubStats.jsx';
import { projects, personalInfo } from './data/projects.js';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar personalInfo={personalInfo} />
        <Routes>
          <Route path="/" element={<Home projects={projects} personalInfo={personalInfo} />} />
          <Route path="/projects" element={<Projects projects={projects} />} />
          <Route path="/github-stats" element={<GitHubStats />} />
          <Route path="/contact" element={<Contact personalInfo={personalInfo} />} />
        </Routes>
        <Footer personalInfo={personalInfo} />
      </div>
    </Router>
  );
}

export default App;