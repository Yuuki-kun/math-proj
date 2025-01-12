import React from "react";
import "./sidebar.css";
import {
  AppstoreTwoTone,
  FileTextTwoTone,
  HomeTwoTone,
  PushpinTwoTone,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
const Sidebar = ({ isSidebarOpen }) => {
  // const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isSelected, setIsSelected] = React.useState(1);
  return (
    <div
      className={`sidebar-container ${
        isSidebarOpen ? "sidebar-activated" : ""
      }`}
    >
      <div className="sidebar-items-container">
        <div
          className={`sidebar-item ${
            isSelected === 1 ? "sidebar-item-selected" : ""
          }`}
        >
          <Link
            to={"/home"}
            className="sidebar-button"
            onClick={() => setIsSelected(1)}
          >
            {/* <button className="sidebar-button" onClick={() => setIsSelected(1)}> */}
            <HomeTwoTone />
            <span className="sidebar-content">Trang chủ</span>
            {/* </button> */}
          </Link>
        </div>
        <div
          className={`sidebar-item ${
            isSelected === 2 ? "sidebar-item-selected" : ""
          }`}
        >
          <Link
            to={"/exams"}
            className="sidebar-button"
            onClick={() => setIsSelected(2)}
          >
            {/* <button className="sidebar-button" onClick={() => setIsSelected(2)}> */}
            <FileTextTwoTone />
            <span className="sidebar-content">Bài kiểm tra</span>
            {/* </button> */}
          </Link>
        </div>
        <div
          className={`sidebar-item ${
            isSelected === 3 ? "sidebar-item-selected" : ""
          }`}
        >
          <button className="sidebar-button" onClick={() => setIsSelected(3)}>
            <AppstoreTwoTone />
            <span className="sidebar-content">Danh sách lớp</span>
          </button>
        </div>
        <div
          className={`sidebar-item ${
            isSelected === 4 ? "sidebar-item-selected" : ""
          }`}
        >
          <button className="sidebar-button" onClick={() => setIsSelected(4)}>
            <PushpinTwoTone />
            <span className="sidebar-content">Lớp học đã ghim</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
