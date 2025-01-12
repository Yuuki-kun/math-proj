import React from "react";
import "./rotatez.css";
const CustomRotateZLoader = ({ content, isLoading, isFullScreen = false }) => {
  return (
    <div className={`loader-z-container ${isLoading ? "is-loading" : ""}`}>
      <div
        className="loader-z-wrapper"
        style={{
          width: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "auto",
        }}
      >
        <span class={"loader-z"}></span>
        <span className={"loader-z-content"}>{content}</span>
      </div>
    </div>
  );
};

export default CustomRotateZLoader;
