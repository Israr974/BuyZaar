import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Shield, AlertTriangle, Loader2, Lock } from "lucide-react";

// Change default requiredRole to null (no role required, just authentication)
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
          style: {
            background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
            color: "#fff",
            borderRadius: "12px",
          },
        });
      } else if (requiredRole && user.role !== requiredRole) {
        toast.error(`Access denied! ${requiredRole.charAt(0).toUpperCase() + requiredRole.slice(1)} privileges required.`, {
          duration: 4000,
          icon: <Shield size={18} />,
          style: {
            background: "linear-gradient(135deg, #EF4444, #DC2626)",
            color: "#fff",
            borderRadius: "12px",
          },
        });
      }
    }
  }, [user, isChecking, requiredRole]);

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center fade-in">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-text-muted">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Not logged in
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

  // Role check failed (only if requiredRole is specified)
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4 fade-in">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden text-center">
            <div className="h-2 bg-gradient-to-r from-error via-red-500 to-error"></div>
            
            <div className="p-8">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center">
                  <Shield className="w-14 h-14 text-error" />
                </div>
                <div className="absolute -top-2 -right-2 animate-bounce">
                  <AlertTriangle className="w-6 h-6 text-warning" />
                </div>
              </div>

              <h1 className="text-2xl font-display font-bold text-text mb-3">
                Access Denied
              </h1>
              
              <p className="text-text-muted mb-6">
                You don't have permission to access this page.
                {requiredRole && ` This area requires ${requiredRole} privileges.`}
              </p>

              {user?.role && (
                <div className="bg-bg-alt rounded-xl p-4 mb-6">
                  <p className="text-sm text-text-muted">Your current role:</p>
                  <p className="text-lg font-semibold text-text capitalize">
                    {user.role}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = "/"}
                  className="w-full btn btn-primary py-3 rounded-xl"
                >
                  Go to Homepage
                </button>
                
                {user?.id && user.role !== requiredRole && (
                  <button
                    onClick={() => window.location.href = "/dashboard/profile"}
                    className="w-full btn btn-outline py-3 rounded-xl"
                  >
                    Go to Dashboard
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-muted">
              Need access? Contact your system administrator.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

// Pre-configured role-based guards
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