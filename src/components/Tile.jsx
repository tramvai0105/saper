import React from "react";

const Tile = ({change, flag, id, x, y, status, num}) => {

  const tileClick = () => {
    change(id, x, y)
  }

  const rightClick = (e) => {
    e.preventDefault()
    flag(id)
  }

  let value;

  if(status=="closed"){
    value="";
  }
  if(status=="flaged"){
    value=""
  }
  if(status=="solved"){
    if(num=="0"){value=""}
    if(num=="9"){value=""}
    if(num > 0 && num < 9){value=num}
  }

  return (
    <span
      onClick={tileClick}
      onContextMenu={rightClick}
      className={"tile"
         + " noselect"
         + (status=="closed" ? " closedtile": "")
         + (status=="flaged" ? " closedtile flagedtile": "")
         + (num==9 && status=="solved" ? " bomb" : "")}>
      {value}
    </span>
  );
};

export default Tile;
