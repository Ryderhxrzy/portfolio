import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Footer from './components/Footer';
import { projects, personalInfo } from './data/projects';

function App() {
  return (
    <div className="App">
      <Navbar personalInfo={personalInfo} />
      <Home projects={projects} personalInfo={personalInfo} />
      <Footer personalInfo={personalInfo} />
    </div>
  );
}

export default App;