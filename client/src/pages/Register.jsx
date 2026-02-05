import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";

import Axios from "../utils/Axios";
import summaryApi from "../common/summartApi";
import AxiosError from "../utils/AxiosToError";

const Register = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    
    if (name === "name" || name === "email") {
      setData((prev) => ({ ...prev, [name]: value.trim() }));
    } else {
      setData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (data.password !== data.confirmPassword) {
      return toast.error("Passwords do not match ❌");
    }

    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
    };

    setLoading(true);
    try {
      const response = await Axios({
        ...summaryApi().register,
        data: payload,
      });

      const resData = response?.data;

      if (resData?.success) {
        toast.success(resData.message || "Account created 🎉");
        setData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        navigate("/login");
      } else {
        toast.error(resData?.message || "Registration failed");
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
          Create Account
        </h2>
        <p
          className="text-center mt-2"
          style={{ color: "var(--color-text-muted)" }}
        >
          Join us and start shopping today
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          
          <div>
            <label className="block mb-1 text-sm font-medium">
              Full Name
            </label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-3" />
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 rounded-lg border"
                required
              />
            </div>
          </div>

        
          <div>
            <label className="block mb-1 text-sm font-medium">
              Email Address
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-3" />
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 rounded-lg border"
                required
              />
            </div>
          </div>

         
          <div>
            <label className="block mb-1 text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3" />
              <input
                type="password"
                name="password"
                value={data.password}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 rounded-lg border"
                required
              />
            </div>
          </div>

      
          <div>
            <label className="block mb-1 text-sm font-medium">
              Confirm Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3" />
              <input
                type="password"
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 rounded-lg border"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!valid || loading}
            className={`w-full py-3 rounded-lg font-semibold text-white ${
              valid ? "bg-purple-600" : "bg-gray-400"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          Already have an account?
          <Link to="/login" className="ml-1 font-semibold text-purple-600">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
