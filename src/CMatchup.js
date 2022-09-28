import { useEffect, useState } from "react";

function CharacterMatchupChart({player, pDict}){
    const [against, setAgainst] = useState(-1)
    function getOptions(){
        let options = Object.entries(pDict).map((e) => {
            return{
                id: e[0],
                label: e[1]
            }})
        options.unshift({id: -1, label: "All"})
        return options
    }
    return(
        <div>
            <Dropdown
                label="Against"
                handleChange={(event)=>{setAgainst(event.target.value)}}
                options={getOptions()}
            />
            <Chart player={player}against={against}/>
        </div>
    )
}


function Chart({player, against}){
    const [matchups, setMatchups] = useState([])
    function calcMatchups(games){
        if(against != -1){
            games = games.filter(game => game[1]==against || game[2]==against)
        }
        let mus = []
        let ls = games.filter(game => game[2] == player)
        let ws = games.filter(game => game[1] == player)
        ws.forEach(win => {
            let index = mus.findIndex(mu => mu.playing == win[3] && mu.against == win[4])
            if(index == -1){
                mus.push({
                    playing: win[3],
                    against: win[4],
                    wins: 1,
                    losses: 0
                })
            }
            else{
                mus[index].wins++
            }
        });
        ls.forEach(loss => {
            let index = mus.findIndex(mu => mu.playing == loss[4] && mu.against == loss[3])
            if(index == -1){
                mus.push({
                    playing: loss[4],
                    against: loss[3],
                    wins: 0,
                    losses: 1
                })
            }
            else{
                mus[index].losses++
            }
        });
        mus.sort((a,b)=>-(a.wins+a.losses)+(b.wins+b.losses))
        setMatchups(mus)
        //console.log(mus)

    }

    useEffect(() => {
        if(player == null||player == against){
            setMatchups([])
            return
        }
        fetch(process.env.REACT_APP_URL+"/game/player/"+player)
        .then(response=>response.json())
        .then(data=>calcMatchups(data.games))
    }, [player, against])

    var id=0;
    return(
        <table>
            <thead>
                <tr>
                    <th>Playing</th>
                    <th>Against</th>
                    <th>Wins</th>
                    <th>Losses</th>
                    <th>W%</th>
                </tr>
            </thead>
            <tbody>
                {matchups.map((mu) => {
                    return(
                        <tr key={id++}>
                            <td>{mu.playing}</td>
                            <td>{mu.against}</td>
                            <td>{mu.wins}</td>
                            <td>{mu.losses}</td>
                            <td>{mu.wins/(mu.wins+mu.losses)}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

function Dropdown(props){
    return(
        <label>
          {props.label+ ": "}
          <select onChange={props.handleChange}>
            {props.options.map((option)=>(
              <option value={option.id}key={option.id}>{option.label}</option>
            ))}
          </select>
      </label>
    )
  }

  export default CharacterMatchupChart