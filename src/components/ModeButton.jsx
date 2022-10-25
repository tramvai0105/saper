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
        +((pos < 40) ? " bottom" : "")
        +((pos > 50) ? " top" : "")}>
    </button>
  );
};

export default ModeButton;
