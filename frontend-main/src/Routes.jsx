import React, { useEffect } from "react";
import { useNavigate, useRoutes, useLocation } from "react-router-dom";

// Pages List
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/user/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";

// Auth Context
import { useAuth } from "./authContext";

const ProjectRoutes = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let userIdFromStorage = localStorage.getItem("userId");

    if (!userIdFromStorage) {
      localStorage.setItem("userId", "guest-demo-user");
      localStorage.setItem("token", "guest-demo-token");
      userIdFromStorage = "guest-demo-user";
    }

    if (userIdFromStorage && !currentUser) {
      setCurrentUser(userIdFromStorage);
    }
  }, [currentUser, setCurrentUser]);

  let element = useRoutes([
    {
      path: "/",
      element: <Dashboard />,
    },
    {
      path: "/repo",
      element: <Dashboard />,
    },
    {
      path: "/repo/:id",
      element: <Dashboard />,
    },
    {
      path: "/auth",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "*",
      element: <Dashboard />,
    },
  ]);

  return element;
};

export default ProjectRoutes;
