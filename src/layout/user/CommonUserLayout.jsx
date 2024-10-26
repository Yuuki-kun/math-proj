import React from "react";
import { Outlet } from "react-router-dom";
import ClassCardComponent from "../../component/shared/cards/ClassCardComponent";
import "./common.css";
import Header from "./Header";
import Sidebar from "./Sidebar";

const CommonUserLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  return (
    <div className="user-layout-container">
      <Header isSidebarOpen={isSidebarOpen} setSidebarOpen={setIsSidebarOpen} />
      <div className="user-layout-main-area">
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CommonUserLayout;
