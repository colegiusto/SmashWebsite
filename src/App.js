import './App.css';
import Content from './Content';
import Bar from './TopBar';
import { useState } from 'react';




function App() {
  
  const [playerState, setPlayerState] = useState({
    player: null,
    players: [],
    pDict: {}
  });
 
  return (
      <div className="App">
        <Bar playerState={playerState} setPlayerState={setPlayerState}/>
        <Content playerState={playerState}/>
        <header className="App-header">
          
        </header>
      </div>
      );
}








export default App;
