import React from "react";
import { Outlet } from "react-router-dom";

const CommonUserLayout = () => {
  return (
    <div>
      CommonUserLayout <Outlet />
    </div>
  );
};

export default CommonUserLayout;
