import React from "react";
import "./classCard.css";
import { Link } from "react-router-dom";
const ClassCardComponent = ({ data }) => {
  console.log(data);

  return (
    // <div
    //   className="d-grid align-items-between"
    //   style={{
    //     gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    //     gap: "10px",
    //   }}
    // >
    <div className="class-card-container card-enter">
      <div className="class-image">
        <img
          src={data?.imageUrl || ""}
          alt="class-image"
          className="img-fluid img-class-avt"
        />
      </div>
      <Link to={`/class/${data?.id}`} className="text-center">
        <div className="fw-bold">{data?.className}</div>
      </Link>
    </div>
    // </div>
  );
};

export default ClassCardComponent;
