import { Outlet } from "react-router-dom";
import { Navbar } from "../views/client/components/Navbar";
import { Footer } from "../views/client/components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};
