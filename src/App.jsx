import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { useSettings } from "./providers/SettingsProvider";
import { AppRouting } from "./routing";
import { PathnameProvider } from "./providers";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const { BASE_URL } = import.meta.env;
import "./axiosConfig.js";

const App = () => {
  const { settings } = useSettings();
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add(settings.themeMode);
  }, [settings]);
  return (
    <BrowserRouter basename={BASE_URL}>
      <PathnameProvider>
        <AppRouting />
      </PathnameProvider>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </BrowserRouter>
  );
};
export { App };
