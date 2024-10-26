import React from "react";
import "./header.style.css";
import {
  BellTwoTone,
  CloseOutlined,
  MenuOutlined,
  PlusCircleTwoTone,
  SearchOutlined,
} from "@ant-design/icons";
import CustomSearchComponent from "../../component/shared/search/CustomSearchComponent";
const Header = ({ isSidebarOpen, setSidebarOpen }) => {
  return (
    <header>
      <div className="header-container">
        <div className="menubar-container">
          <button
            className="menubar-button"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? (
              <>
                <CloseOutlined style={{ fontSize: "20px", color: "#5f6368" }} />
              </>
            ) : (
              <>
                <MenuOutlined style={{ fontSize: "20px", color: "#5f6368" }} />
              </>
            )}
          </button>
          <div className="app-logo">
            <img
              className="img-fluid"
              src="assets/images/Logo-test.png"
              alt="Logo"
            />
          </div>
        </div>
        <div className="user-area-container">
          <div className="head-plus-icon head-icon">
            <PlusCircleTwoTone style={{ fontSize: "24px" }} />
          </div>
          <CustomSearchComponent />
          <div className="head-notification-icon head-icon">
            <BellTwoTone />
            <div className="notification-number">4</div>
          </div>
          <div className="head-user-info">
            <div className="user-name">Tống Công Minh</div>

            <div className="user-avatar">
              <img
                className="img-fluid"
                src="assets/images/Logo-test.png"
                alt="Avatar"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
