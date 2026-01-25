import React from "react";
import "./Loading.css";

export default function Loading() {
  return (
    <div className="d-flex justify-content-center p-2 h-100 w-100">
      <div
        className=" rounded-circle  spinner-border"
        style={{
          width: "100px",
          height: "100px",
          border: "5px solid blue",
          borderBottom: "5px solid transparent",
          animationDuration: "1s",
        }}
      ></div>
    </div>
  );
}
