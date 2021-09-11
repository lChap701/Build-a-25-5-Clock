import React from "react";

/* Stateless component */
const LengthControl = (props) => {
  return (
    <div className="lenCtrl">
      <h4 id={props.label}>{props.hdg}</h4>

      <div className="d-flex align-items-center">
        <button
          id={props.inc}
          onClick={props.onClick}
          className="bg-transparent text-white"
        >
          <i className="fas fa-chevron-circle-up fa-2x"></i>
        </button>
        <span id={props.lenId}>{props.len}</span>
        <button
          id={props.dec}
          onClick={props.onClick}
          className="bg-transparent text-white"
        >
          <i className="fas fa-chevron-circle-down fa-2x"></i>
        </button>
      </div>
    </div>
  );
};

export default LengthControl;