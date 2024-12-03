import { createBrowserRouter } from "react-router-dom";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import App from "../App";
import LoginPage from "../pages/LoginPage/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "../pages/HomePage/HomePage";
import BillsPage from "../pages/BillPage/BillPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      // { path: "bills", element: <BillsPage /> },
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
    ],
  },
]);
