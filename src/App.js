import React from 'react';
import ApiComponent from './ApiComponent';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
		<h1>Welcome to test-app!</h1>
        <img src={logo} className="App-logo" alt="logo" />
        
        <a>
          Jarmo Pylkkö 250201
		  <ApiComponent />
        </a>
      </header>
    </div>
  );
}

export default App;
