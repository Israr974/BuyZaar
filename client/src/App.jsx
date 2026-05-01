import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { Toaster } from "react-hot-toast";
import GlobalProvider from "./providers/GlobalProvider";
import fetchUserDetails from "./utils/fetchUserDetails";
import ScrollToTop from "./components/ScrollToTop";
import FullPageLoader from "./components/FullPageLoader";

const App = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      const token = localStorage.getItem("token");
      
      if (token) {
        try {
          await fetchUserDetails();
        } catch (error) {
          console.warn("User session expired or invalid");
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
        }
      }
      
      setIsLoading(false);
    };

    initializeApp();
  }, []);

  const isAdminRoute = location.pathname.startsWith("/dashboard") && 
    (location.pathname.includes("/category") || 
     location.pathname.includes("/subcategory") ||
     location.pathname.includes("/uploadproduct") ||
     location.pathname.includes("/product") ||
     location.pathname.includes("/order"));

  if (isLoading) {
    return <FullPageLoader />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <GlobalProvider>
        <Header />
        
        <main className="flex-1">
          <Outlet />
        </main>
        
        {!isAdminRoute && <Footer />}
        
        <Toaster 
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName="toast-container"
          toastOptions={{
            duration: 4000,
            style: {
              background: "var(--color-card)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
              borderRadius: "12px",
              padding: "12px 16px",
              fontSize: "14px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            },
            success: {
              iconTheme: {
                primary: "var(--color-success)",
                secondary: "white",
              },
              style: {
                borderLeft: "4px solid var(--color-success)",
              },
            },
            error: {
              iconTheme: {
                primary: "var(--color-error)",
                secondary: "white",
              },
              style: {
                borderLeft: "4px solid var(--color-error)",
              },
            },
            loading: {
              style: {
                borderLeft: "4px solid var(--color-primary)",
              },
            },
          }}
        />
        
        <ScrollToTop />
      </GlobalProvider>
    </div>
  );
};

export default App;