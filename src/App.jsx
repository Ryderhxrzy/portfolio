import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Footer from './components/Footer';
import { personalInfo } from './data/projects';

function App() {
  return (
    <div className="App">
      <Navbar personalInfo={personalInfo} />
      <Home />
      <Footer personalInfo={personalInfo} />
    </div>
  );
}

export default App;