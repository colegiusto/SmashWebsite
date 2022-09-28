import { useEffect, useRef } from 'react'


function Graph({ xs, ys }){
    const canvasRef = useRef(null);
    

    useEffect(() => {
        let max = Math.max(...xs)
        let min = Math.min(...xs)
        function normHeight(y){

            return (y-min)/(max-min)*325+50
        }
        function unNormHeight(y){
            return (y-50)*(max-min)/325+min
        }
        function lerp(a,b,t){
            return a*(1-t)+b*t
        }
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#FFFFFF'
        ctx.font= "10px Arial"
        ctx.textAlign = "left"
        ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height)
        if(xs === undefined || xs.length<2){
            return
        }
        
        let inter = 25
        let num = 325/inter+1
        ctx.beginPath()
        ctx.fillStyle = "#000000"
        for(let i=0; i<num; i++){
            let y = 400-(50.5+inter*i)
            ctx.fillText(Math.round(unNormHeight(400-y)).toString(), 0, y)
            ctx.moveTo(25, y)
            ctx.lineTo(ctx.canvas.width, y)
        }
        ctx.stroke()
        var n = -1
        const dif = (ctx.canvas.width-25)/(xs.length-1)
        let nPts = xs.map(e=>normHeight(e))
        var spots = nPts.map((pt) => {
            n++;
            return{
                x :25+n*dif,
                y :ctx.canvas.height-pt
            }
        });
        ctx.beginPath()
        ctx.textAlign="center"
        for(var i=0; i<spots.length-1; i++){
            ctx.fillText(ys[i].toString(), spots[i].x, 400-25)
            ctx.moveTo(spots[i].x,spots[i].y)
            ctx.lineTo(spots[i+1].x,spots[i+1].y)
        }
        ctx.fillText(ys[ys.length-1].toString(), 375, 400-25)
        ctx.stroke()

    }, [xs, ys])
    
    return(
    <div>
        <p>Elo Graph</p>
        <canvas className="Graph"ref={canvasRef}width="400" height="400"/>
    </div>
)}

export default Graph;