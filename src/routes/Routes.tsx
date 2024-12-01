import { createBrowserRouter } from "react-router-dom";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import App from "../App";
import LoginPage from "../pages/LoginPage/LoginPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      //   { path: "", element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
]);
