import "./App.css"

async function getPlayers(){
    return fetch(process.env.REACT_APP_URL+ "/player")
    .then((response)=> response.json())
  }

function Bar(props) {
    function loadPlayers(){
      getPlayers()
      .then((data)=>{
        var dict = {};
        data.players.forEach(p => {dict[p[0]] = p[1]});
        props.setPlayerState({player: -1, players: data.players, pDict: dict});
      }); 
    }
    
  
    function getOptions(){
      const options = props.playerState.players.map((p)=>{
        return {id: p[0], label: p[1]}
      });
      options.unshift({id: -1, label: "Choose a Player"})
      return options;
  
    }
    return (
        <div className='Bar'>
          <div className='Bar-element'>
            <Dropdown
              handleChange={(event)=>{props.setPlayerState({...props.playerState, player: event.target.value})}}
              options={getOptions()}
              label="Player"
            />
          </div>
          <div className='Bar-element'>
            <button onClick={loadPlayers}>Load Players</button>
          </div>
        </div>
    )}
  
  function Dropdown(props){
    return(
        <label>
          {props.label+ ": "}
          <select className="Player-select" onChange={props.handleChange}>
            {props.options.map((option)=>(
              <option value={option.id}key={option.id}>{option.label}</option>
            ))}
          </select>
      </label>
    )
  }

  export default Bar;