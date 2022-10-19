import React from "react";

const Tile = ({change, id,status, num}) => {

  const tileClick = () => {
    change(id)
  }

  let value;

  if(status=="closed"){
    value="";
  }
  if(status=="flaged"){
    value="$"
  }
  if(status=="solved"){
    if(num=="0"){value="~"}
    if(num=="9"){value="*"}
    if(num > 0 && num < 9){value=num}
  }

  return (
    <span
      onClick={tileClick}
      className={"tile"
         + " noselect"
         + (status=="closed" ? " closedtile": "")
         + (status=="flaged" ? " closedtile": "")}>
      {value}
    </span>
  );
};

export default Tile;
