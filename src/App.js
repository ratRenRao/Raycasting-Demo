import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Game from './Controllers/GameController';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Game/>
      </div>
    );
  }
}

export default App;
