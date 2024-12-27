import { createBrowserRouter } from "react-router-dom";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import App from "../App";
import LoginPage from "../pages/LoginPage/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "../pages/HomePage/HomePage";
import BillsPage from "../pages/BillPage/BillPage";
import FriendsPage from "../pages/FriendsPage/FriendsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      {
        path: "home",
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "bills",
        element: (
          <ProtectedRoute>
            <BillsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "friends",
        element: (
          <ProtectedRoute>
            <FriendsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
