import React from "react";
import "./actionResultNotification.css";
import { CheckOutlined } from "@ant-design/icons";
const ActionResultNotification = ({ isActivated, type, message }) => {
  return (
    <div
      className={`action-result-notification ${
        isActivated ? "activated" : "de-activated"
      }`}
    >
      <CheckOutlined className="check-icon" />
      <span className="card-fade-in" style={{ opacity: "0" }}>
        {message}
      </span>
    </div>
  );
};

export default ActionResultNotification;
