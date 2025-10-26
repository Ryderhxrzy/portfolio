import React from 'react';
import './App.css';
import Navbar from './components/Navbar.jsx';
import Home from './components/Home.jsx';
import { projects, personalInfo } from './data/projects';

function App() {
  return (
    <div className="App">
      <Navbar personalInfo={personalInfo} />
      <Home projects={projects} personalInfo={personalInfo} />
    </div>
  );
}

export default App;