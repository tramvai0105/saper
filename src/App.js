import './App.css';
import React, {useState, useEffect, useRef} from "react";
import Tile from "./components/Tile"
import useSound from 'use-sound';
import alahSong from './sounds/alah.mp3';

function App() {
  const WIDTH = 25;
  const HEIGHT = 16;
  const BOMBS = 50;
  var STATUS = true;

  var tilesArray = Array.from(Array(HEIGHT*WIDTH), () =>
      [0, "closed"])
  var [tiles, setTiles] = useState(tilesArray);
  var [mode, setMode] = useState("open")
  var [alah, {stop}] = useSound(alahSong, { volume: 0.5 })

  useEffect(()=>{
    if(STATUS){
      placeBombs()
    }
  }, [])

  useEffect(()=>{
    checkWin()
  }, [tiles])

  function checkWin(){
  }

  function clearTiles(){
    tiles.forEach(function(currentValue,index) {
          this[index] = [index, 0, "closed"]
    },tiles)
    placeBombs()
    setMode("open")
  }

  function useKey(key, cb){
    const callbackRef = useRef(cb);

    useEffect(()=>{
      callbackRef.current = cb;
    })

    useEffect(()=>{
      function handle(event){
        if(event.code===key){
          callbackRef.current(event)
        }
      }
      document.addEventListener("keypress",handle);
      return () => document.removeEventListener("keypress",handle);
    },[key])
  }

  tilesArray.forEach(function(currentValue,index) {
        this[index] = [index].concat(currentValue)
  }, tilesArray);

  function placeBombs() {
      let counter = 0;
      let gen_tiles = [];
      gen_tiles = tiles.map(function(tile){
      if (Math.random()>0.875 && counter < BOMBS) {
        counter++; return [tile[0],9,tile[2]]}
      else {return tile}
      })
      gen_tiles = placeNumbers(gen_tiles)
      setTiles(gen_tiles)
      STATUS = false;
  }

  function placeNumbers(arr) {
      arr.forEach(function(tile, index){
        if (tile[1] != 9){
          if(index % 25 != 0 && arr[index-1][1]==9){tile[1]+=1}
          if((index+1) % 25 != 0 && arr[index+1][1]==9){tile[1]+=1}
          if(index > 24 && arr[index-25][1]==9){tile[1]+=1}
          if(index % 25 && index > 24 && arr[index-26][1]==9){tile[1]+=1}
          if((index+1) % 25 != 0 && index > 24 && arr[index-24][1]==9){tile[1]+=1}
          if(index < 375 && arr[index+25][1]==9){tile[1]+=1}
          if(index % 25 && index < 375 && arr[index+24][1]==9){tile[1]+=1}
          if((index+1) % 25 != 0 && index < 375 && arr[index+26][1]==9){tile[1]+=1}
        }
      })
    return arr
  }

  function openEmptyTile(index){
    let arr = [];
    arr = tiles;
    console.log(index)
    if(index % 25){arr[index-1][2] = "solved";
      if((index-1) % 25 && arr[index-1][1]==0 && arr[index-2][2] != "solved"){
        arr[index-2][2] = "solved"
        openEmptyTile(index-1)}}
      if(((index-1) % 25) == 0 && arr[index-1][1]==0){openEmptyTile(index-1)}
    if((index+1) % 25 != 0){arr[index+1][2] = "solved";
      if((index+2) % 25 && arr[index+1][1]==0 && arr[index+2][2] != "solved"){
        arr[index+2][2] = "solved"
        openEmptyTile(index+1)}}
      if(((index+2) % 25) == 0 && arr[index+1][1]==0){openEmptyTile(index+1)}
    if(index > 25){arr[index-25][2] = "solved";
      if(index > 50 && arr[index-25][1]==0 && arr[index-50][2] != "solved"){
        arr[index-50][2] = "solved"
        openEmptyTile(index-25)}
      if(index <= 50 && index >= 0 && arr[index-25][1]==0){openEmptyTile(index-25)}
    }
    if(index < 375){arr[index+25][2] = "solved";
      if(index < 350 && arr[index+25][1]==0 && arr[index+50][2] != "solved"){
        arr[index+50][2] = "solved"
        openEmptyTile(index+25)}
      if(index <= 400 && index >= 350 && arr[index+25][1]==0){openEmptyTile(index+25)}}
    if(index % 25 && index > 25){arr[index-26][2] = "solved";}
    if((index+1) % 25 != 0 && index > 25){arr[index-24][2] = "solved";}
    if(index % 25 && index < 375){arr[index+24][2] = "solved";}
    if((index+1) % 25 != 0 && index < 375){arr[index+26][2] = "solved";}
    setTiles(arr)
  }

  const openTile = (id) => {
    if(mode=="over"){

    }
    if(mode=="open"){
      if(tiles[id][2]!=="flaged"){
        if(tiles[id][1]==0){openEmptyTile(id)}
        setTiles(tiles.map(tile => (tile[0]==id) ? [tile[0],tile[1],"solved"] : tile))
        if(tiles[id][1]==9){gameOver()}
      }
    }
    if(mode=="flag"){
      if(tiles[id][2] != "solved" && tiles[id][2] != "flaged"){
        setTiles(tiles.map(tile => (tile[0]==id) ? [tile[0],tile[1],"flaged"] : tile))}
      if(tiles[id][2] == "flaged"){
        setTiles(tiles.map(tile => (tile[0]==id) ? [tile[0],tile[1],"closed"] : tile))}
      }
    }


  function gameOver(){
    setTiles(tiles.map(tile => (tile[1]==9) ? [tile[0],tile[1],"solved"] : tile))
    setMode("over")
    alah()
  }

  function restart(){
    clearTiles()
    stop()
  }

  function handleEnter(){
    if(mode=="open"){setMode("flag")}
    if(mode=="flag"){setMode("open")}
  }

  useKey("Space", handleEnter)

  return (
    <div className="App">
      <div className="game">
        <div className="controls">
          <h1>{mode}</h1>
          <button onClick={handleEnter}>Change mode (SPACE)</button>
          <button onClick={restart}>Restart</button>
        </div>
        <div className="board">
        {tiles.map(tile => <Tile
          change={openTile}
          id={tile[0]}
          key={tile[0]}
          status={tile[2]}
          num={tile[1]}/>)}
        </div>
      </div>
    </div>
  );
}

export default App;
