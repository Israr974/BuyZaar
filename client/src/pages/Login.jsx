import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import {jwtDecode} from "jwt-decode";
import Axios from "../utils/Axios";
import summaryApi from "../common/summartApi";
import AxiosError from "../utils/AxiosToError";
import { setUser } from "../redux/userSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedData = {
      email: data.email.trim(),
      password: data.password.trim(),
    };

    if (!trimmedData.email || !trimmedData.password) {
      return toast.error("Both email and password are required");
    }

    setLoading(true);
    try {
      const response = await Axios({ ...summaryApi().login, data: trimmedData });
      const resData = response?.data;

      if (resData?.success) {
        
        localStorage.setItem("token", resData.data.accessToken);
        localStorage.setItem("refreshToken", resData.data.refreshToken);

       
        dispatch(setUser(resData.data.user));

        toast.success("Login successful 🎉");
        navigate("/");
        setData({ email: "", password: "" });
      } else {
        toast.error(resData?.message || "Login failed");
      }
    } catch (error) {
      AxiosError(error);
    } finally {
      setLoading(false);
    }
  };

  const valid = Object.values(data).every(Boolean);

  return (
    <div
      className="min-h-[82.4vh] flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #F3ECFA, #FAFAFC)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 rounded-2xl shadow-2xl"
        style={{
          backgroundColor: "var(--color-card)",
          border: "1px solid var(--color-border)",
        }}
      >
        <h2
          className="text-3xl font-bold text-center"
          style={{ color: "var(--color-primary)" }}
        >
          Welcome Back
        </h2>
        <p
          className="text-center mt-2"
          style={{ color: "var(--color-text-muted)" }}
        >
          Login to continue shopping
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              className="block mb-1 text-sm font-medium"
              style={{ color: "var(--color-text)" }}
            >
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-3"
                style={{ color: "var(--color-text-muted)" }}
              />
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                autoComplete="username"
                className="w-full pl-10 pr-3 py-3 rounded-lg outline-none border border-gray-300 focus:border-purple-600"
                required
              />
            </div>
          </div>

          <div>
            <label
              className="block mb-1 text-sm font-medium"
              style={{ color: "var(--color-text)" }}
            >
              Password
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-3"
                style={{ color: "var(--color-text-muted)" }}
              />
              <input
                type="password"
                name="password"
                value={data.password}
                onChange={handleChange}
                autoComplete="current-password"
                className="w-full pl-10 pr-3 py-3 rounded-lg outline-none border border-gray-300 focus:border-purple-600"
                required
              />
            </div>
            <div className="text-right mt-1">
              <Link
                to="/forgot-password"
                className="text-sm"
                style={{ color: "var(--color-primary)" }}
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={!valid || loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
              valid
                ? "bg-purple-600 hover:bg-purple-700 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p
          className="text-center text-sm mt-6"
          style={{ color: "var(--color-text-muted)" }}
        >
          Don’t have an account?
          <Link
            to="/register"
            className="ml-1 font-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;



