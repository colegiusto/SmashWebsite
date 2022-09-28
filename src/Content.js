import { useEffect, useState } from 'react';
import './Graphics.css'
import Graph from './Graph.js'
import CharacterMatchupChart from './CMatchup';



function Content(props){
    const [playerElos, setPlayerElos] = useState([])
    const [playerSets, setPlayerSets] = useState([])
    const [allSets, setAllSets] = useState([])
    const [tab, setTab] = useState(0)
    

    useEffect(() => {
        
        async function loadSets(){
            if(props.playerState.player == null){
                return
            }
            fetch(process.env.REACT_APP_URL+"/set/player/"+props.playerState.player)
            .then((response)=>response.json())
            .then((data)=>{setPlayerSets(data.sets)})
        }
        function calculateElos(p){
            function eloChange(ra, rb, games){
                return Math.round(40*(1.2-games*.1-1/(1+Math.pow(10,(rb-ra)/400))))
            }
            var players = []
            if(allSets.length==0){
                return
            }
            allSets.flatMap((element) => [element[1], element[2]])
            .forEach(element => {
                if(players.findIndex(e=>e==element) == -1){
                    players.push(element)
                }
            })
            var elos = {}
            players.forEach((element) => {
                elos[element] = 1000
            })
            let hist = []
            allSets.forEach(set => {
                let [p1, p2] = [set[1], set[2]]

                let [ra, rb] = [elos[p1], elos[p2]]
                let change = eloChange(ra, rb, set[3].length)

                elos[p1] = ra+change
                elos[p2] = rb-change
                if([p1,p2].find(value => value==p)){
                    if(hist.length<1){
                        hist.push([1000, set[set.length-1]])
                    }
                    hist.push([elos[p], set[set.length-1]])
                }
                
            })
            setPlayerElos(hist)
            
        }
        loadSets()
        .then(calculateElos(props.playerState.player))
    }, [props.playerState.player]);

    useEffect(() => {
        function getSets(){
            fetch(process.env.REACT_APP_URL+"/set")
            .then((response)=>response.json())
            .then((data)=>setAllSets(data.sets))
        }
        getSets()
    },[])
    
    return(
        <div className="Content">
            <div className="Tabs">
                <Tab value={0}label="Sets"setter={setTab}/>
                <Tab value={1}label="MatchupBreakdown"setter={setTab}/>
                <Tab value={2}label="Graph"setter={setTab}/>
            </div>
            <div className='Windows'>
                {tab===0&&<MatchupChart dict={props.playerState.pDict}sets={playerSets}player={props.playerState.player}/>}
                {tab===1&&<CharacterMatchupChart player={props.playerState.player}pDict={props.playerState.pDict}/>}
                {tab===2&&<Graph xs={playerElos.map(s=>s[0])}ys={playerElos.map(s=>s[1])}/>}
            </div>
        </div>
        
    )
}


function Tab(props){
    function handleClick(){
        props.setter(props.value)
    }
    return(
        <button onClick={handleClick}>{props.label}</button>
    )
}

function MatchupChart(props){
    var id=0;
    return(
        <table>
            <thead>
                <tr>
                    <th>Winner</th>
                    <th>Loser</th>
                    <th>Games</th>
                </tr>
            </thead>
            <tbody>
                {props.sets.map((set) => {
                    return(
                        <tr key={id++}>
                            <td>{props.dict[set[1]]}</td> 
                            <td>{props.dict[set[2]]}</td>
                            <td>{set[3].length}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}



export default Content;