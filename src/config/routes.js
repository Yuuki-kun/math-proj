import React from "react";
import CommonUserLayout from "../layout/common/CommonUserLayout";
import AuthenLayout from "../layout/AuthenLayout";
import Exam from "../pages/exams/Exam";
import CreateExam from "../pages/exams/CreateExam";
import PreviewQuestion from "../pages/exams/PreviewQuestion";
import ExamInfo from "../pages/exams/ExamInfo";
import ExamPractice from "../pages/exams/practice/ExamPractice";
import Class from "../pages/class/Class";

const Login = React.lazy(() => import("../component/auth/Login"));
const Registration = React.lazy(() => import("../component/auth/Registration"));
const CommonUserHome = React.lazy(() =>
  import("../pages/common-user-home/CommonUserHome")
);
const routes = [
  {
    path: "/",
    layout: <CommonUserLayout />,
    children: [
      {
        path: "/",
        element: <CommonUserHome />,
      },
      {
        path: "/home",
        element: <CommonUserHome />,
      },
    ],
    protected: true,
    roles: ["USER", "ADMIN"],
  },
  {
    path: "/class",
    layout: <CommonUserLayout />,
    children: [
      {
        path: ":id",
        element: <Class />,
      },
    ],
    protected: true,
    roles: ["USER", "ADMIN"],
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
    path: "exams",
    layout: <CommonUserLayout />,
    children: [
      {
        path: "",
        element: <Exam />,
      },
    ],
    protected: true,
    roles: ["USER", "ADMIN"],
  },
  {
    path: "exams/practice/:id",
    layout: <CommonUserLayout />,
    children: [
      {
        path: "",
        element: <ExamPractice />,
      },
    ],
    protected: true,
    roles: ["USER"],
  },
  {
    path: "exams/create",
    layout: <CommonUserLayout />,
    children: [
      {
        path: "",
        element: <CreateExam />,
      },
    ],
    protected: true,
    roles: ["ADMIN"],
  },

  {
    path: "exams/info",
    layout: <CommonUserLayout />,
    children: [
      {
        path: "",
        element: <ExamInfo />,
      },
    ],
    protected: true,
    roles: ["ADMIN"],
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
  {
    path: "/administrator",
    layout: <CommonUserLayout />,
    children: [
      {
        path: "",
        element: <h1>Administrator Page</h1>,
      },
      {
        path: "dashboard",
        element: <h1>Dashboard</h1>,
      },
    ],
  },
];

export default routes;
