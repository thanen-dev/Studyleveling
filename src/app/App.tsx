import { useState, useMemo } from "react";
import { RouterProvider } from "react-router";
import { createRouter } from "./routes";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const router = useMemo(
    () => createRouter(isLoggedIn, handleLogin, handleLogout),
    [isLoggedIn]
  );

  return <RouterProvider router={router} />;
}
