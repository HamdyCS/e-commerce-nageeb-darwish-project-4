import React from "react";
import "./Loading.css";

export default function Loading() {
  return (
    <div className="d-flex justify-content-center p-2 h-100 w-100">
      <div
        className=" rounded-circle  spinner-border"
        style={{
          width: "50px",
          height: "50px",
          border: "5px solid gray",
          borderBottom: "5px solid transparent",
          animationDuration: "1s",
        }}
      ></div>
    </div>
  );
}
