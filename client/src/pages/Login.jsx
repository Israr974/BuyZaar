import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ShoppingBag, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import summaryApi from "../common/summartApi";
import { setUser } from "../redux/userSlice";
import AxiosError from "../utils/AxiosToError";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
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
        
        localStorage.setItem("token", resData.data.accessToken);
        localStorage.setItem("refreshToken", resData.data.refreshToken);
        dispatch(setUser(resData.data.user));

        if (rememberMe) {
          localStorage.setItem("rememberedEmail", trimmedData.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        toast.success(`Welcome back, ${resData.data.user.name || "User"}!`);

        const from = localStorage.getItem("redirectAfterLogin") || "/";
        localStorage.removeItem("redirectAfterLogin");
        
        setTimeout(() => navigate(from), 500);
        setData({ email: "", password: "" });
      } else {
        toast.error(resData?.message || "Login failed. Please try again.");
      }
    } catch(error) {
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
        <div className="rounded-2xl shadow-2xl overflow-hidden bg-card">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-center text-primary">
              Welcome Back
            </h2>
            <p className="text-center mt-2 text-sm text-text-muted">
              Login to continue your premium shopping experience
            </p>
            
            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-2 text-sm font-semibold text-text">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted group-focus-within:text-primary"
                  />
                  <input
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    autoComplete="username"
                    placeholder="john@example.com"
                    className="w-full pl-10 pr-3 py-3 rounded-lg outline-none transition-all duration-200 bg-bg-alt border border-border text-text focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-text">
                  Password
                </label>
                <div className="relative group">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted group-focus-within:text-primary"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-3 rounded-lg outline-none transition-all duration-200 bg-bg-alt border border-border text-text focus:border-primary"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted"
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
                      className="rounded accent-primary"
                    />
                    <span className="text-xs text-text-muted">Remember me</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-primary hover:underline transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={!valid || loading}
                className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 group ${
                  !valid || loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
                style={{
                  background: !valid || loading
                    ? "var(--color-border)"
                    : "linear-gradient(90deg, var(--color-primary), var(--color-primary-light))"
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

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-card text-text-muted">
                  New to BuyZaar?
                </span>
              </div>
            </div>

            <Link
              to="/register"
              className="w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 border-2 border-primary text-primary bg-transparent hover:bg-primary/5"
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