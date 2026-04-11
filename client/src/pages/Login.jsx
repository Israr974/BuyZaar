import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ShoppingBag, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import Axios from "../utils/Axios";
import summaryApi from "../common/summartApi";
import AxiosError from "../utils/AxiosToError";
import { setUser } from "../redux/userSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Check for saved email
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }

    // Check if already logged in
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const { exp } = jwtDecode(token);
        if (Date.now() < exp * 1000) {
          navigate("/");
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // Function to resend verification email
  const resendVerificationEmail = async (email) => {
    try {
      const response = await Axios({
        ...summaryApi().resendVerification,
        data: { email }
      });
      if (response?.data?.success) {
        toast.success("Verification email sent! Please check your inbox.");
      } else {
        toast.error(response?.data?.message || "Failed to send verification email");
      }
    } catch (error) {
      AxiosError(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedData = {
      email: data.email.trim(),
      password: data.password.trim(),
    };
    
    if (!trimmedData.email || !trimmedData.password) {
      return toast.error("Both email and password are required");
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedData.email)) {
      return toast.error("Please enter a valid email address");
    }

    setLoading(true);
    try {
      const response = await Axios({ 
        ...summaryApi().login, 
        data: trimmedData 
      });
      const resData = response?.data;

      if (resData?.success) {
        // Save tokens
        localStorage.setItem("token", resData.data.accessToken);
        localStorage.setItem("refreshToken", resData.data.refreshToken);

        // Save user data to Redux
        dispatch(setUser(resData.data.user));

        // Handle remember me
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", trimmedData.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        // Show welcome message
        toast.success(`Welcome back, ${resData.data.user.name || "User"}!`);

        // Check if email verification is required (using your backend's flag)
        if (resData.requiresEmailVerification === true) {
          // Custom toast with resend button
          toast(
            (t) => (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">Email Not Verified</p>
                </div>
                <p className="text-sm">Please verify your email to access all features.</p>
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    resendVerificationEmail(trimmedData.email);
                  }}
                  className="mt-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition duration-200"
                >
                  Resend Verification Email
                </button>
              </div>
            ),
            { 
              duration: 8000, 
              position: "top-center",
              style: {
                background: "#1f2937",
                color: "#fff",
                padding: "16px",
              }
            }
          );
        }

        // Redirect to previous page or home
        const from = localStorage.getItem("redirectAfterLogin") || "/";
        localStorage.removeItem("redirectAfterLogin");
        
        // Small delay before redirect
        setTimeout(() => {
          navigate(from);
        }, 500);

        setData({ email: "", password: "" });
      } else {
        toast.error(resData?.message || "Login failed. Please try again.");
      }
    } catch (error) {
      AxiosError(error);
    } finally {
      setLoading(false);
    }
  };

  const valid = data.email.trim() && data.password.trim();

  return (
    <div
      className="min-h-[82.4vh] flex items-center justify-center px-4 py-8"
      style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Login Card */}
        <div
          className="rounded-2xl shadow-2xl overflow-hidden"
          style={{ backgroundColor: "var(--color-card)" }}
        >
          <div className="p-8">
            <h2
              className="text-3xl font-bold text-center"
              style={{ color: "var(--color-primary)" }}
            >
              Welcome Back
            </h2>
            <p
              className="text-center mt-2 text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              Login to continue your premium shopping experience
            </p>
            
            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div>
                <label
                  className="block mb-2 text-sm font-semibold"
                  style={{ color: "var(--color-text)" }}
                >
                  Email Address
                </label>
                <div className="relative group">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors group-focus-within:text-primary"
                    style={{ color: "var(--color-text-muted)" }}
                  />
                  <input
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    autoComplete="username"
                    placeholder="john@example.com"
                    className="w-full pl-10 pr-3 py-3 rounded-lg outline-none transition-all duration-200"
                    style={{
                      backgroundColor: "var(--color-bg-alt)",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-text)"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--color-border)"}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  className="block mb-2 text-sm font-semibold"
                  style={{ color: "var(--color-text)" }}
                >
                  Password
                </label>
                <div className="relative group">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors group-focus-within:text-primary"
                    style={{ color: "var(--color-text-muted)" }}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-3 rounded-lg outline-none transition-all duration-200"
                    style={{
                      backgroundColor: "var(--color-bg-alt)",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-text)"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--color-border)"}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded"
                      style={{ accentColor: "var(--color-primary)" }}
                    />
                    <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                      Remember me
                    </span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium transition-colors hover:underline"
                    style={{ color: "var(--color-primary)" }}
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={!valid || loading}
                className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 group"
                style={{
                  background: !valid || loading
                    ? "var(--color-border)"
                    : "linear-gradient(90deg, var(--color-primary), var(--color-primary-light))",
                  cursor: !valid || loading ? "not-allowed" : "pointer",
                  opacity: !valid || loading ? 0.6 : 1
                }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Login
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: "var(--color-border)" }}></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-card" style={{ color: "var(--color-text-muted)" }}>
                  New to BuyZaar?
                </span>
              </div>
            </div>

            {/* Register Link */}
            <Link
              to="/register"
              className="w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 border-2"
              style={{
                borderColor: "var(--color-primary)",
                color: "var(--color-primary)",
                backgroundColor: "transparent"
              }}
            >
              Create New Account
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;