import React from "react";
import CommonUserLayout from "../layout/user/CommonUserLayout";
import AuthenLayout from "../layout/AuthenLayout";

const Login = React.lazy(() => import("../component/auth/Login"));
const Registration = React.lazy(() => import("../component/auth/Registration"));
const UserHome = React.lazy(() => import("../pages/user-home/UserHome"));
const routes = [
  {
    path: "/",
    layout: <CommonUserLayout />,
    children: [
      {
        path: "/",
        element: <UserHome />,
      },
      {
        path: "/home",
        element: <UserHome />,
      },
    ],
  },
  {
    path: "/profile",
    layout: <CommonUserLayout />,
    children: [
      {
        path: "",
        element: <h1>Profile Page</h1>,
      },
    ],
    protected: true,
    roles: ["user"],
  },
  {
    path: "/authentication",
    layout: <AuthenLayout />,
    index: <Login />,
    children: [
      {
        path: "login",
        element: <Login />,
        index: true,
      },
      {
        path: "register",
        element: <Registration />,
      },
    ],
  },
];

export default routes;
