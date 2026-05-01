// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { User, Mail, Lock, Eye, EyeOff, ArrowRight, ShoppingBag } from "lucide-react";
// import toast from "react-hot-toast";
// import Axios from "../utils/Axios";
// import summaryApi from "../common/summartApi";
// import AxiosError from "../utils/AxiosToError";


// const Register = () => {
//   const navigate = useNavigate();

//   const [data, setData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [agreeToTerms, setAgreeToTerms] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
    
//     if (name === "name" || name === "email") {
//       setData((prev) => ({ ...prev, [name]: value.trim() }));
//     } else {
//       setData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validation
//     if (data.name.length < 3) {
//       return toast.error("Name must be at least 3 characters");
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(data.email)) {
//       return toast.error("Please enter a valid email address");
//     }

//     if (data.password.length < 6) {
//       return toast.error("Password must be at least 6 characters");
//     }

//     if (data.password !== data.confirmPassword) {
//       return toast.error("Passwords do not match");
//     }

//     if (!agreeToTerms) {
//       return toast.error("Please agree to the Terms & Conditions");
//     }

//     const payload = {
//   name: data.name,
//   email: data.email,
//   password: data.password,
//   confirmPassword: data.confirmPassword, 
// };

//     setLoading(true);
//     try {
//       const response = await Axios({
//         ...summaryApi().register,
//         data: payload,
//       });

//       const resData = response?.data;

//       if (resData?.success) {
//         toast.success("Account created successfully! ");
//         setData({
//           name: "",
//           email: "",
//           password: "",
//           confirmPassword: "",
//         });
//         setAgreeToTerms(false);
//         navigate("/login");
//       } else {
//         toast.error(resData?.message || "Registration failed");
//       }
//     } catch (error) {
//       AxiosError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const valid = data.name && data.email && data.password && data.confirmPassword && agreeToTerms;

//   // Demo credentials for testing
//   const fillDemoCredentials = () => {
//     setData({
//       name: "Demo User",
//       email: "demo@buyzaar.com",
//       password: "demo123",
//       confirmPassword: "demo123"
//     });
//     setAgreeToTerms(true);
//     toast.success("Demo credentials filled!");
//   };

//   return (
//     <div
//       className="min-h-[82.4vh] flex items-center justify-center px-4 py-8"
//       style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
//     >
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.5 }}
//         className="w-full max-w-md"
//       >
      

//         {/* Register Card */}
//         <div
//           className="rounded-2xl shadow-2xl overflow-hidden"
//           style={{ backgroundColor: "var(--color-card)" }}
//         >
//           <div className="p-8">
//             <h2
//               className="text-3xl font-bold text-center"
//               style={{ color: "var(--color-primary)" }}
//             >
//               Create Account
//             </h2>
//             <p
//               className="text-center mt-2 text-sm"
//               style={{ color: "var(--color-text-muted)" }}
//             >
//               Join us and start your premium shopping journey
//             </p>

//             <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
//               {/* Name Field */}
//               <div>
//                 <label
//                   className="block mb-2 text-sm font-semibold"
//                   style={{ color: "var(--color-text)" }}
//                 >
//                   Full Name
//                 </label>
//                 <div className="relative group">
//                   <User
//                     size={18}
//                     className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors group-focus-within:text-primary"
//                     style={{ color: "var(--color-text-muted)" }}
//                   />
//                   <input
//                     type="text"
//                     name="name"
//                     value={data.name}
//                     onChange={handleChange}
//                     placeholder="John Doe"
//                     autoComplete="name"
//                     className="w-full pl-10 pr-3 py-3 rounded-lg outline-none transition-all duration-200"
//                     style={{
//                       backgroundColor: "var(--color-bg-alt)",
//                       border: "1px solid var(--color-border)",
//                       color: "var(--color-text)"
//                     }}
//                     onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"}
//                     onBlur={(e) => e.target.style.borderColor = "var(--color-border)"}
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Email Field */}
//               <div>
//                 <label
//                   className="block mb-2 text-sm font-semibold"
//                   style={{ color: "var(--color-text)" }}
//                 >
//                   Email Address
//                 </label>
//                 <div className="relative group">
//                   <Mail
//                     size={18}
//                     className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors group-focus-within:text-primary"
//                     style={{ color: "var(--color-text-muted)" }}
//                   />
//                   <input
//                     type="email"
//                     name="email"
//                     value={data.email}
//                     onChange={handleChange}
//                     placeholder="john@example.com"
//                     autoComplete="email"
//                     className="w-full pl-10 pr-3 py-3 rounded-lg outline-none transition-all duration-200"
//                     style={{
//                       backgroundColor: "var(--color-bg-alt)",
//                       border: "1px solid var(--color-border)",
//                       color: "var(--color-text)"
//                     }}
//                     onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"}
//                     onBlur={(e) => e.target.style.borderColor = "var(--color-border)"}
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Password Field */}
//               <div>
//                 <label
//                   className="block mb-2 text-sm font-semibold"
//                   style={{ color: "var(--color-text)" }}
//                 >
//                   Password
//                 </label>
//                 <div className="relative group">
//                   <Lock
//                     size={18}
//                     className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors group-focus-within:text-primary"
//                     style={{ color: "var(--color-text-muted)" }}
//                   />
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     value={data.password}
//                     onChange={handleChange}
//                     placeholder="••••••••"
//                     autoComplete="new-password"
//                     className="w-full pl-10 pr-10 py-3 rounded-lg outline-none transition-all duration-200"
//                     style={{
//                       backgroundColor: "var(--color-bg-alt)",
//                       border: "1px solid var(--color-border)",
//                       color: "var(--color-text)"
//                     }}
//                     onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"}
//                     onBlur={(e) => e.target.style.borderColor = "var(--color-border)"}
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2"
//                     style={{ color: "var(--color-text-muted)" }}
//                   >
//                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                   </button>
//                 </div>
//                 <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
//                   Password must be at least 6 characters
//                 </p>
//               </div>

//               {/* Confirm Password Field */}
//               <div>
//                 <label
//                   className="block mb-2 text-sm font-semibold"
//                   style={{ color: "var(--color-text)" }}
//                 >
//                   Confirm Password
//                 </label>
//                 <div className="relative group">
//                   <Lock
//                     size={18}
//                     className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors group-focus-within:text-primary"
//                     style={{ color: "var(--color-text-muted)" }}
//                   />
//                   <input
//                     type={showConfirmPassword ? "text" : "password"}
//                     name="confirmPassword"
//                     value={data.confirmPassword}
//                     onChange={handleChange}
//                     placeholder="••••••••"
//                     autoComplete="new-password"
//                     className="w-full pl-10 pr-10 py-3 rounded-lg outline-none transition-all duration-200"
//                     style={{
//                       backgroundColor: "var(--color-bg-alt)",
//                       border: "1px solid var(--color-border)",
//                       color: "var(--color-text)"
//                     }}
//                     onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"}
//                     onBlur={(e) => e.target.style.borderColor = "var(--color-border)"}
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2"
//                     style={{ color: "var(--color-text-muted)" }}
//                   >
//                     {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                   </button>
//                 </div>
//               </div>

//               {/* Terms and Conditions */}
//               <div className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   id="terms"
//                   checked={agreeToTerms}
//                   onChange={(e) => setAgreeToTerms(e.target.checked)}
//                   className="w-4 h-4 rounded"
//                   style={{ accentColor: "var(--color-primary)" }}
//                 />
//                 <label htmlFor="terms" className="text-xs" style={{ color: "var(--color-text-muted)" }}>
//                   I agree to the{" "}
//                   <Link to="/terms" className="hover:underline" style={{ color: "var(--color-primary)" }}>
//                     Terms of Service
//                   </Link>{" "}
//                   and{" "}
//                   <Link to="/privacy" className="hover:underline" style={{ color: "var(--color-primary)" }}>
//                     Privacy Policy
//                   </Link>
//                 </label>
//               </div>

//               {/* Register Button */}
//               <button
//                 type="submit"
//                 disabled={!valid || loading}
//                 className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 group"
//                 style={{
//                   background: !valid || loading 
//                     ? "var(--color-border)" 
//                     : "linear-gradient(90deg, var(--color-primary), var(--color-primary-light))",
//                   cursor: !valid || loading ? "not-allowed" : "pointer",
//                   opacity: !valid || loading ? 0.6 : 1
//                 }}
//               >
//                 {loading ? (
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 ) : (
//                   <>
//                     Create Account
//                     <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
//                   </>
//                 )}
//               </button>
//             </form>

//             {/* Divider */}
//             <div className="relative my-6">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t" style={{ borderColor: "var(--color-border)" }}></div>
//               </div>
//               <div className="relative flex justify-center text-xs">
//                 <span className="px-2 bg-card" style={{ color: "var(--color-text-muted)" }}>
//                   Already have an account?
//                 </span>
//               </div>
//             </div>

//             {/* Login Link */}
//             <Link
//               to="/login"
//               className="w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 border-2"
//               style={{
//                 borderColor: "var(--color-primary)",
//                 color: "var(--color-primary)",
//                 backgroundColor: "transparent"
//               }}
//             >
//               Sign In to Existing Account
//             </Link>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Register;


import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, ShoppingBag } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

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

    if (data.name.length < 3) {
      return toast.error("Name must be at least 3 characters");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return toast.error("Please enter a valid email address");
    }

    if (data.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (data.password !== data.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (!agreeToTerms) {
      return toast.error("Please agree to the Terms & Conditions");
    }

    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword, 
    };

    setLoading(true);
    try {
      const response = await Axios({
        ...summaryApi().register,
        data: payload,
      });

      const resData = response?.data;

      if (resData?.success) {
        toast.success("Account created successfully!");
        setData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setAgreeToTerms(false);
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

  const valid = data.name && data.email && data.password && data.confirmPassword && agreeToTerms;

  return (
    <div className="min-h-[82.4vh] flex items-center justify-center px-4 py-8 bg-gradient-to-br from-purple-600 to-purple-800">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-center text-blue-600">
              Create Account
            </h2>
            <p className="text-center mt-2 text-sm text-gray-500">
              Join us and start your premium shopping journey
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              {/* Name Field */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-800">
                  Full Name
                </label>
                <div className="relative group">
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-blue-600 transition-colors"
                  />
                  <input
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    autoComplete="name"
                    className="w-full pl-10 pr-3 py-3 rounded-lg outline-none transition-all duration-200 border border-gray-200 bg-gray-50 text-gray-800 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-800">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-blue-600 transition-colors"
                  />
                  <input
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    autoComplete="email"
                    className="w-full pl-10 pr-3 py-3 rounded-lg outline-none transition-all duration-200 border border-gray-200 bg-gray-50 text-gray-800 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-800">
                  Password
                </label>
                <div className="relative group">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-blue-600 transition-colors"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="w-full pl-10 pr-10 py-3 rounded-lg outline-none transition-all duration-200 border border-gray-200 bg-gray-50 text-gray-800 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs mt-1 text-gray-500">
                  Password must be at least 6 characters
                </p>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-800">
                  Confirm Password
                </label>
                <div className="relative group">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-blue-600 transition-colors"
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={data.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="w-full pl-10 pr-10 py-3 rounded-lg outline-none transition-all duration-200 border border-gray-200 bg-gray-50 text-gray-800 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="w-4 h-4 rounded accent-blue-600"
                />
                <label htmlFor="terms" className="text-xs text-gray-500">
                  I agree to the{" "}
                  <Link to="/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={!valid || loading}
                className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 group bg-gradient-to-r from-blue-600 to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Login Link */}
            <Link
              to="/login"
              className="w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 bg-transparent hover:bg-blue-50"
            >
              Sign In to Existing Account
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;