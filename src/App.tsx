import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import NavbarComponent from "./components/NavbarComponent";
import { Providers } from "./providers";
import { Outlet } from "react-router-dom";

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
