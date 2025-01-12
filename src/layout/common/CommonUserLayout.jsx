import React from "react";
import { Outlet } from "react-router-dom";
import ClassCardComponent from "../../component/shared/cards/ClassCardComponent";
import "./common.css";
import Header from "./Header";
import Sidebar from "../user/Sidebar";
import useAuth from "../../hook/useAuth";
import AdminSidebar from "../admin/AdminSidebar";

const CommonUserLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { auth } = useAuth();
  return (
    <div className="user-layout-container">
      <Header isSidebarOpen={isSidebarOpen} setSidebarOpen={setIsSidebarOpen} />
      <div className="user-layout-main-area">
        {auth?.roles?.includes("USER") && (
          <Sidebar isSidebarOpen={isSidebarOpen} />
        )}
        {auth?.roles?.includes("ADMIN") && (
          <AdminSidebar isSidebarOpen={isSidebarOpen} />
        )}
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CommonUserLayout;
