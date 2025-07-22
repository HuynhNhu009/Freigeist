import Home from "../pages/Home";
import Diary from "../pages/Diary";
import Layout from "../components/Layout";
import { Navigate } from "react-router-dom";
import LoginForm from "../pages/LoginForm";
import Regis from "../pages/Regis";
import NewEntry from "../components/Diary/NewEntry";
import UserProfile from "../pages/UserProfile";
import EditEntry from "../components/Diary/EditEntry";
import MoodChart from "../pages/MoodChart";
import Reminder from "../pages/Reminder";

export const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "diary",
        element: <Diary />,
      },
      {
        path: "/new-entry",
        element: <NewEntry />,
      },
      {
        path: "/edit-entry/:id",
        element: <EditEntry />,
      },
      {
        path: "/user-profile",
        element: <UserProfile />, 
      },
      {
        path: "/mood-chart",
        element: <MoodChart />,
      },
      {
        path: "/reminder",
        element: <Reminder />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/register",
    element: <Regis />,
  },
  
];
