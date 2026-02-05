import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { Toaster } from "react-hot-toast";
import GlobalProvider from "./providers/GlobalProvider";
import fetchUserDetails from "./utils/fetchUserDetails";

const App = () => {

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetchUserDetails().catch(() => {
        
        console.warn("User session expired");
      });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <GlobalProvider>
        <Header />

        <main className="flex-1">
          <Outlet />
        </main>

        <Footer />
        <Toaster position="top-center" reverseOrder={false} />
      </GlobalProvider>
    </div>
  );
};

export default App;
