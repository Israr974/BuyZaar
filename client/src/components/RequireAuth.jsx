
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const RequireAuth = ({ children }) => {
  const location = useLocation();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (!user?.id) {
      toast.error("You must be logged in to access this page!");
    } else if (user.role !== "admin") {
      toast.error("Admin access required!");
    }
  }, [user]);

  if (!user?.id) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireAuth;
