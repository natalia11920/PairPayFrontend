import { Outlet } from "react-router";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./contexts/AuthContext";
import NavbarComponent from "./components/NavbarComponent";

function App() {
  return (
    <>
      <AuthProvider>
        <NavbarComponent />
        <Outlet />
        <ToastContainer />
      </AuthProvider>
    </>
  );
}

export default App;
