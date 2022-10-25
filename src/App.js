import './App.css';
import React, {useState, useEffect, useRef} from "react";
import Tile from "./components/Tile"
import useSound from 'use-sound';
import alahSong from './sounds/alah.mp3';
import ModeButton from "./components/ModeButton"

function App() {
  const WIDTH = 25;
  const HEIGHT = 16;
  const BOMBS = 50;
  var STATUS = true;

  var [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollPosition]);

  var tilesArray = Array.from(Array(HEIGHT*WIDTH), () =>
    new Object())

  function * coordsgenerator(){
    for(let h = 0; h < HEIGHT; h++){
      for(let w = 0; w < WIDTH; w++){
        yield [h,w]
      }
    }
  }

  var coords = coordsgenerator()

  tilesArray.forEach(function(value, i){
    let c = coords.next();
    this[i].index = i;
    this[i].y = c.value[0];
    this[i].x = c.value[1];
    this[i].num = 0;
    this[i].status = "closed";
  }, tilesArray)

  var [tiles, setTiles] = useState(tilesArray);
  var [mode, setMode] = useState("open");
  var [alah, {stop}] = useSound(alahSong, { volume: 0.5 });
  var [flags, setFlags] = useState(0);

  useEffect(()=>{
    if(STATUS){
      placeBombs()
    }
  }, [])

  useEffect(()=>{
    tiles.forEach(function(tile){
      if(tile["status"]=="flaged"){setFlags(flags++)}
    })
    if(flags==BOMBS && checkFlaged()){
      win()
    }
  }, [tiles])

  function checkFlaged(){
    let check = 0;
    tiles.forEach(function(tile){
      if (tile.num == 9 && tile.status == "flaged"){check++}
    })
    if(check == BOMBS){return true}else{return false}
  }

  function clearTiles(){
    setTiles(tiles.map(tile => changeObj(tile, "num", 0)))
    placeBombs()
    setTiles(tiles.map(tile => changeObj(tile, "status", "closed")))
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

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function placeBombs() {
    let counter = BOMBS;
    while(counter){
      let row = getRandomInt(HEIGHT-1);
      let column = getRandomInt(WIDTH-1);
      setTiles(tiles.map(tile => (tile.x === column && tile.y === row)
      ? changeObj(tile, "num", 9)
      : tile))
      counter--;
    }
    setTiles(placeNumbers(tiles))
    STATUS = false;
  }

  function getTile(arr, tile, dir){
    if(dir == "left"){
      return arr.filter(function(v){
        return(v.x == tile.x - 1 && v.y == tile.y)})[0]}
    if(dir == "right"){
      return arr.filter(function(v){
        return(v.x == tile.x + 1 && v.y == tile.y)})[0]}
    if(dir == "up"){
      return arr.filter(function(v){
        return(v.x == tile.x && v.y == tile.y - 1)})[0]}
    if(dir == "down"){
      return arr.filter(function(v){
        return(v.x == tile.x && v.y == tile.y + 1)})[0]}
    if(dir == "up-left"){
      return arr.filter(function(v){
        return(v.x == tile.x - 1 && v.y == tile.y - 1)})[0]}
    if(dir == "up-right"){
      return arr.filter(function(v){
        return(v.x == tile.x + 1 && v.y == tile.y - 1)})[0]}
    if(dir == "down-left"){
      return arr.filter(function(v){
        return(v.x == tile.x - 1 && v.y == tile.y + 1)})[0]}
    if(dir == "down-right"){
      return arr.filter(function(v){
        return(v.x == tile.x + 1 && v.y == tile.y + 1)})[0]}
  }

  function checkOpenTiles(tile){
    if(tile.x != 0 && getTile(tiles, tile, "left").num == 0
    && getTile(tiles, tile, "left").status == "solved"){return true}
    if(tile.x != 24 && getTile(tiles, tile, "right").num == 0
    && getTile(tiles, tile, "right").status == "solved"){return true}
    if(tile.y != 0 && getTile(tiles, tile, "up").num == 0
    && getTile(tiles, tile, "up").status == "solved"){return true}
    if(tile.y != 15 && getTile(tiles, tile, "down").num == 0
    && getTile(tiles, tile, "down").status == "solved"){return true}
    if(tile.y != 0 && tile.x != 0 && getTile(tiles, tile, "up-left").num == 0
    && getTile(tiles, tile, "up-left").status == "solved"){return true}
    if(tile.x != 24 && tile.y != 0 && getTile(tiles, tile, "up-right").num == 0
    && getTile(tiles, tile, "up-right").status == "solved"){return true}
    if(tile.y != 15 && tile.x != 0 && getTile(tiles, tile, "down-left").num == 0
    && getTile(tiles, tile, "down-left").status == "solved"){return true}
    if(tile.y != 15 && tile.x != 24 && getTile(tiles, tile, "down-right").num == 0
    && getTile(tiles, tile, "down-right").status == "solved"){return true}
    else{return false}
  }

  function placeNumbers(arr) {
      arr.forEach(function(tile){
        if (tile.num != 9){
          if(tile.x != 0 && getTile(arr, tile, "left").num == 9){addNum(tile);}
          if(tile.x != 24 && getTile(arr, tile, "right").num == 9){addNum(tile);}
          if(tile.y != 0 && getTile(arr, tile, "up").num == 9){addNum(tile);}
          if(tile.y != 15 && getTile(arr, tile, "down").num == 9){addNum(tile);}
          if(tile.y != 0 && tile.x != 0 && getTile(arr, tile, "up-left").num == 9){addNum(tile);}
          if(tile.x != 24 && tile.y != 0 && getTile(arr, tile, "up-right").num == 9){addNum(tile);}
          if(tile.y != 15 && tile.x != 0 && getTile(arr, tile, "down-left").num == 9){addNum(tile);}
          if(tile.y != 15 && tile.x != 24 && getTile(arr, tile, "down-right").num == 9){addNum(tile);}
        }
      })
    return arr
  }

  function openEmptyTile(id){
    let arr = tiles;
      if(arr[id].x != 0){
        changeObj(getTile(arr, arr[id], "left"), "status", "solved")}
      if(arr[id].x != 24){
        changeObj(getTile(arr, arr[id], "right"), "status", "solved")}
      if(arr[id].y != 0){
        changeObj(getTile(arr, arr[id], "up"), "status", "solved")}
      if(arr[id].y != 15){
        changeObj(getTile(arr, arr[id], "down"), "status", "solved")}
      if(arr[id].y != 0 && arr[id].x != 0){
        changeObj(getTile(arr, arr[id], "up-left"), "status", "solved")}
      if(arr[id].y != 0 && arr[id].x != 24){
        changeObj(getTile(arr, arr[id], "up-right"), "status", "solved")}
      if(arr[id].y != 15 && arr[id].x != 0){
        changeObj(getTile(arr, arr[id], "down-left"), "status", "solved")}
      if(arr[id].y != 15 && arr[id].x != 24){
        changeObj(getTile(arr, arr[id], "down-right"), "status", "solved")}
    setTiles(arr)
  }

  function openEmptyTiles(){
    let changes = 1;
    while(changes){
      changes = 0
        setTiles(tiles.forEach(function(t){
        if(t.status != "solved" && t.num == 0){
          if(checkOpenTiles(t)){
            t.status = "solved";
            changes = 1;
          }
        }
      }))
    }
    tiles.forEach((t)=>{
      if(t.status == "solved" && t.num == 0){
        openEmptyTile(t.index)
      }
    })

  }

  function changeObj(obj, key, value){
    obj[key] = value;
    return obj;
  }

  function addNum(obj){
    obj.num += 1;
    return obj;
  }

  const openTile = (id, x, y) => {
    setFlags(0)
    if(mode=="over"){
    }
    if(mode=="open"){
      if(tiles[id].status != "flaged"){
        if(tiles[id].num == 0){openEmptyTile(id); openEmptyTiles()}
        setTiles(tiles.map(tile => (tile.index==id) ? changeObj(tile, "status", "solved") : tile))
        if(tiles[id].num == 9){gameOver()}
      }
    }
    if(mode=="flag"){
      if(tiles[id].status === "closed" && tiles[id].status !== "flaged"){
        setTiles(tiles.map(tile => (tile.index==id) ? changeObj(tile, "status", "flaged") : tile))}
      else if(tiles[id].status === "flaged"){
        setTiles(tiles.map(tile => (tile.index==id) ? changeObj(tile, "status", "closed") : tile))}
    }
  }

  const flagClick = (id) => {
    setFlags(0)
    if(tiles[id].status === "closed" && tiles[id].status !== "flaged"){
      setTiles(tiles.map(tile => (tile.index==id) ? changeObj(tile, "status", "flaged") : tile))}
    else if(tiles[id].status === "flaged"){
      setTiles(tiles.map(tile => (tile.index==id) ? changeObj(tile, "status", "closed") : tile))}
  }

  function gameOver(){
    setTiles(tiles.map(tile => (tile.num==9) ? changeObj(tile, "status", "solved") : tile))
    setMode("over")
    alah()
  }
  //
  function restart(){
    clearTiles()
    stop()
  }

  function win(){
    setMode("win")
    setTimeout(restart, 5000)
  }

  function changeMode(){
    if(mode=="open"){setMode("flag")}
    if(mode=="flag"){setMode("open")}
    if(mode=="over"){restart()}
  }

  function handleEnter(){
    if(mode=="open"){setMode("flag")}
    if(mode=="flag"){setMode("open")}
  }

  useKey("Space", handleEnter)

  return (
    <div className="App">
      <div className="game">
        <ModeButton pos={scrollPosition} change={changeMode} mode={mode}></ModeButton>
        <div className="board">
        {tiles.map(tile => <Tile
          key={tile.index}
          change={openTile}
          flag={flagClick}
          id = {tile.index}
          x = {tile.x}
          y = {tile.y}
          status={tile.status}
          num = {tile.num}/>)}
        </div>
      </div>
    </div>
  );
}

export default App;
