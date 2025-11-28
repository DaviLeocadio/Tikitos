import { ToastContainer, toast, Bounce } from "react-toastify";

export function aparecerToast(msg) {
    toast(msg, {
      icon: (
        <img src="/img/toast/logo_ioio.png" alt="logo" className="h-6 mt-0.5" />
      ),
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      style: { backgroundColor: "#924187", color: "#fff" },
      transition: Bounce,
    });
  }