import React from "react";
import "./classCard.css";
const ClassCardComponent = () => {
  return (
    // <div
    //   className="d-grid align-items-between"
    //   style={{
    //     gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    //     gap: "10px",
    //   }}
    // >
    <div className="class-card-container">
      <div className="class-image">
        <img
          src="https://scontent.fvca1-4.fna.fbcdn.net/v/t39.30808-6/454005381_799465345693291_6559741550055714940_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=OgFajjB-QBgQ7kNvgHG0816&_nc_zt=23&_nc_ht=scontent.fvca1-4.fna&_nc_gid=A4IEs0Jzo6hq8HamXslecaq&oh=00_AYAXIYv40F0KwkXNKSPmp1tBQhj5ZK8fW9MYTXgf16DOzA&oe=671C0F15"
          alt=""
          className="img-fluid"
        />
      </div>
      <div className="mt-5 fw-bold">Toán 11A</div>
    </div>
    // </div>
  );
};

export default ClassCardComponent;
