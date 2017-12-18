import React, { Component } from 'react';
import SocketIOClient from 'socket.io-client';
import uuidv1 from 'uuid/v1';
import logo from './logo.svg';
import './App.css';
const socket = SocketIOClient('http://localhost:1848');

class App extends Component {
  state = {
    gameID: null,
    game: { players: [] },
    player: {
      name: 'Player',
      id: uuidv1(),
      pos: { x: 0, y: 0 },
    },
  };

  joinToGame(gameID) {
    this.setState({ gameID })
    return socket.emit('want-to-join', { player: this.state.player, gameID });
  };

  setPlayerPos(params) {
    console.warn(params);
     socket.emit('gameOperation', {
      gameID: this.state.gameID,
      playerID: this.state.player.id,
      type: 'move',
      params,
     });
  }

  setPlayerName(value) {
    return this.setState({ player : { ...this.state.player, name: value } });
  };

  drawGame() {
    return (
      <div>
      {[...this.state.game.players].map((player) => (
        <button 
          onClick={() => this.setPlayerPos({ x: 0, y: 50 })}
          key={player.id}
          className={hero}
          style={{ top: player.pos.y }}
        >
        </button>))
      }
      </div>);
  }

  render() {
    this.state.gameID && socket.on('game-' + this.state.gameID, (res) => {
      console.warn(res.game);
      this.setState({ game: res.game });
    });
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
          <input type="text" onChange={e => this.setPlayerName(e.target.value)} placeholder="Player name" />
          <button onClick={() => this.joinToGame(1)}>Game 1</button>
          {this.drawGame()}
        </header>
      </div>
    );
  }
}

export default App;
