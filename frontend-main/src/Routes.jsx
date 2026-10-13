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

    // Automatically set a guest demo session for live GitHub Pages viewers
    if (!userIdFromStorage) {
      localStorage.setItem("userId", "guest-demo-user");
      localStorage.setItem("token", "guest-demo-token");
      userIdFromStorage = "guest-demo-user";
    }

    if (userIdFromStorage && !currentUser) {
      setCurrentUser(userIdFromStorage);
    }

    if (!userIdFromStorage && !["/auth", "/signup"].includes(location.pathname)) {
      navigate("/auth");
    }

    if (userIdFromStorage && location.pathname === "/auth") {
      navigate("/");
    }
  }, [currentUser, navigate, setCurrentUser, location.pathname]);

  let element = useRoutes([
    {
      path: "/",
    },
    {
      path: "/repo",
      element: <Dashboard />,
    },
    {
      path: "*",
      element: <Dashboard />
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
  ]);

  return element;
};

export default ProjectRoutes;
