import { Outlet } from "react-router";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import NavbarComponent from "./components/NavbarComponent";
import { Providers } from "./providers";

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
