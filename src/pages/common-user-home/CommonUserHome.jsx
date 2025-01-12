import React from "react";
import ClassCardComponent from "../../component/shared/cards/ClassCardComponent";
import useAuth from "../../hook/useAuth";
import UserHome from "../home/user/UserHome";
import AdminHome from "../home/admin/AdminHome";
import "./commonHome.css";
const CommonUserHome = () => {
  const { auth } = useAuth();
  return (
    <>
      {auth?.roles?.includes("USER") && <UserHome />}
      {auth?.roles?.includes("ADMIN") && <AdminHome />}
    </>
  );
};

export default CommonUserHome;
