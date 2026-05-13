
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Shield, AlertTriangle, Loader2, Lock } from "lucide-react";

const RequireAuth = ({ children, requiredRole = null, redirectTo = "/login" }) => {
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isChecking) {
      if (!user?.id) {
        toast.error("You must be logged in to access this page!", {
          duration: 4000,
          icon: <Lock size={18} />,
        });
      } else if (requiredRole && user.role !== requiredRole) {
        toast.error(`Access denied! ${requiredRole.charAt(0).toUpperCase() + requiredRole.slice(1)} privileges required.`, {
          duration: 4000,
          icon: <Shield size={18} />,
        });
      }
    }
  }, [user, isChecking, requiredRole]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-600/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-500">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!user?.id) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ 
          from: location.pathname,
          message: "Please login to access this page",
          requiredRole 
        }}
      />
    );
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden text-center">
            <div className="h-2 bg-gradient-to-r from-red-600 via-red-500 to-red-600"></div>
            
            <div className="p-8">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                  <Shield className="w-14 h-14 text-red-600" />
                </div>
                <div className="absolute -top-2 -right-2 animate-bounce">
                  <AlertTriangle className="w-6 h-6 text-yellow-500" />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-gray-800 mb-3">
                Access Denied
              </h1>
              
              <p className="text-gray-500 mb-6">
                You don't have permission to access this page.
                {requiredRole && ` This area requires ${requiredRole} privileges.`}
              </p>

              {user?.role && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-gray-500">Your current role:</p>
                  <p className="text-lg font-semibold text-gray-800 capitalize">
                    {user.role}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = "/"}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-xl font-medium"
                >
                  Go to Homepage
                </button>
                
                {user?.id && user.role !== requiredRole && (
                  <button
                    onClick={() => window.location.href = "/dashboard/profile"}
                    className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:border-blue-600 hover:text-blue-600 transition-colors"
                  >
                    Go to Dashboard
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Need access? Contact your system administrator.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export const AdminRoute = ({ children }) => (
  <RequireAuth requiredRole="admin" redirectTo="/login">
    {children}
  </RequireAuth>
);

export const UserRoute = ({ children }) => (
  <RequireAuth requiredRole="user" redirectTo="/login">
    {children}
  </RequireAuth>
);

export const AuthRoute = ({ children }) => (
  <RequireAuth requiredRole={null} redirectTo="/login">
    {children}
  </RequireAuth>
);

export default RequireAuth;