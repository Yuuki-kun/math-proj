import React from "react";
import CommonUserLayout from "../layout/CommonUserLayout";
import AuthenLayout from "../layout/AuthenLayout";

const Login = React.lazy(() => import("../component/auth/Login"));
const Registration = React.lazy(() => import("../component/auth/Registration"));

const routes = [
  {
    path: "/",
    layout: <CommonUserLayout />,
    children: [
      {
        path: "/",
        element: <h1>Home Page</h1>,
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
