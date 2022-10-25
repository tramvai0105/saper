import React from "react";

const ModeButton = ({pos, change, mode}) => {

  const modeChange = () => {
    change()
  }

  return (
    <button
      onClick={modeChange}
      className={"mode-button"
        +(mode=="flag" ? " flag" : "")
        +(mode=="open" ? " open" : "")
        +(mode=="over" ? " over" : "")
        +(mode=="win" ? " win" : "")
        +((pos < 40 && mode!="win") ? " bottom" : "")
        +((pos > 70 && mode!="win") ? " top" : "")}>
    </button>
  );
};

export default ModeButton;
