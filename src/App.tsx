import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Providers } from "./providers";
import { Outlet } from "react-router-dom";
import NavbarComponent from "./components/Navbar/NavbarComponent";

function App() {
  return (
    <>
      <Providers>
        <NavbarComponent />
        <Outlet />
        <ToastContainer />
      </Providers>
    </>
  );
}

export default App;
