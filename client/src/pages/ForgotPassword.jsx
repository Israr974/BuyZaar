// import React, { useState } from 'react';
// import Axios from '../utils/Axios';
// import summaryApi from '../common/summartApi';
// import AxiosError from '../utils/AxiosToError';
// import toast from 'react-hot-toast';
// import { Link, useNavigate } from 'react-router-dom';
// import { Mail, ArrowRight, Shield, Lock, ChevronLeft } from 'lucide-react';

// const ForgotPassword = () => {
//     const navigate = useNavigate();
//     const [email, setEmail] = useState('');
//     const [loading, setLoading] = useState(false);

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!email.trim()) {
//             toast.error("Please enter your email address");
//             return;
//         }

//         // Email validation
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(email)) {
//             toast.error("Please enter a valid email address");
//             return;
//         }

//         setLoading(true);

//         try {
//             const response = await Axios({
//                 ...summaryApi().forgotPassword,
//                 data: { email }
//             });

//             const resData = response?.data;

//             if (resData?.success) {
//                 toast.success(resData.message || "OTP sent to your email!", {
//                     duration: 4000,
//                 });
//                 setEmail('');
//                 navigate("/verify-otp", { 
//                     state: { email: email } 
//                 });
//             } else if (resData?.error) {
//                 toast.error(resData.message || "Failed to send OTP");
//             }
//         } catch (error) {
//             AxiosError(error);
//             toast.error("Something went wrong. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-[82.4vh] flex items-center justify-center px-4 py-8 fade-in">
//             <div className="w-full max-w-md">
//                 {/* Brand Logo */}
//                 <div className="text-center mb-6">
//                     <Link to="/" className="inline-flex items-center gap-2">
//                         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
//                             <Lock className="w-5 h-5 text-white" />
//                         </div>
//                         <span className="text-2xl font-bold gradient-text">BuyZaar</span>
//                     </Link>
//                 </div>

//                 {/* Forgot Password Card */}
//                 <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
//                     <div className="p-8">
//                         {/* Header */}
//                         <div className="text-center mb-6">
//                             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
//                                 <Mail className="w-8 h-8 text-primary" />
//                             </div>
//                             <h2 className="text-2xl font-display font-bold text-text">
//                                 Forgot Password?
//                             </h2>
//                             <p className="text-sm text-text-muted mt-2">
//                                 Enter your registered email address and we'll send you an OTP to reset your password.
//                             </p>
//                         </div>

//                         {/* Form */}
//                         <form className="space-y-5" onSubmit={handleSubmit}>
//                             <div>
//                                 <label className="block text-sm font-semibold text-text mb-2">
//                                     Email Address
//                                 </label>
//                                 <div className="relative group">
//                                     <Mail
//                                         size={18}
//                                         className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors group-focus-within:text-primary"
//                                         style={{ color: "var(--color-text-muted)" }}
//                                     />
//                                     <input
//                                         type="email"
//                                         name="email"
//                                         value={email}
//                                         onChange={(e) => setEmail(e.target.value)}
//                                         placeholder="john@example.com"
//                                         className="input pl-10 py-3 w-full"
//                                         autoFocus
//                                         required
//                                     />
//                                 </div>
//                                 <p className="text-xs text-text-muted mt-2">
//                                     We'll send a 6-digit OTP to this email address
//                                 </p>
//                             </div>

//                             <button
//                                 type="submit"
//                                 disabled={!email || loading}
//                                 className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 group ${
//                                     email && !loading
//                                         ? 'btn-primary'
//                                         : 'bg-gray-300 cursor-not-allowed'
//                                 }`}
//                             >
//                                 {loading ? (
//                                     <>
//                                         <div className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                                         Sending OTP...
//                                     </>
//                                 ) : (
//                                     <>
//                                         Send OTP
//                                         <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
//                                     </>
//                                 )}
//                             </button>
//                         </form>

//                         {/* Divider */}
//                         <div className="relative my-6">
//                             <div className="absolute inset-0 flex items-center">
//                                 <div className="w-full border-t" style={{ borderColor: "var(--color-border)" }}></div>
//                             </div>
//                             <div className="relative flex justify-center text-xs">
//                                 <span className="px-2 bg-card" style={{ color: "var(--color-text-muted)" }}>
//                                     Remember your password?
//                                 </span>
//                             </div>
//                         </div>

//                         {/* Login Link */}
//                         <Link
//                             to="/login"
//                             className="w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 border-2"
//                             style={{
//                                 borderColor: "var(--color-primary)",
//                                 color: "var(--color-primary)",
//                                 backgroundColor: "transparent"
//                             }}
//                         >
//                             <ChevronLeft size={18} />
//                             Back to Login
//                         </Link>
//                     </div>

//                     {/* Footer Note */}
//                     <div
//                         className="px-8 py-4 text-center text-xs"
//                         style={{
//                             backgroundColor: "var(--color-bg-alt)",
//                             borderTop: "1px solid var(--color-border)",
//                             color: "var(--color-text-muted)"
//                         }}
//                     >
//                         <div className="flex items-center justify-center gap-4">
//                             <span className="flex items-center gap-1">
//                                 <Shield size={12} />
//                                 Secure
//                             </span>
//                             <span className="flex items-center gap-1">
//                                 <Lock size={12} />
//                                 Encrypted
//                             </span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Help Text */}
//                 <p className="text-center text-xs text-text-muted mt-6">
//                     Didn't receive the OTP? Check your spam folder or{" "}
//                     <button 
//                         onClick={() => {
//                             if (email) handleSubmit(new Event('submit'));
//                             else toast.error("Please enter your email first");
//                         }}
//                         className="text-primary hover:underline"
//                     >
//                         try again
//                     </button>
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default ForgotPassword;

import React, { useState } from 'react';
import Axios from '../utils/Axios';
import summaryApi from '../common/summartApi';
import AxiosError from '../utils/AxiosToError';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, Shield, Lock, ChevronLeft } from 'lucide-react';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error("Please enter your email address");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        setLoading(true);

        try {
            const response = await Axios({
                ...summaryApi().forgotPassword,
                data: { email }
            });

            const resData = response?.data;

            if (resData?.success) {
                toast.success(resData.message || "OTP sent to your email!", {
                    duration: 4000,
                });
                setEmail('');
                navigate("/verify-otp", { 
                    state: { email: email } 
                });
            } else if (resData?.error) {
                toast.error(resData.message || "Failed to send OTP");
            }
        } catch (error) {
            AxiosError(error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[82.4vh] flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
                {/* Brand Logo */}
                <div className="text-center mb-6">
                    <Link to="/" className="inline-flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-orange-500 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">BuyZaar</span>
                    </Link>
                </div>

                {/* Forgot Password Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    <div className="p-8">
                        {/* Header */}
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                                <Mail className="w-8 h-8 text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                Forgot Password?
                            </h2>
                            <p className="text-sm text-gray-500 mt-2">
                                Enter your registered email address and we'll send you an OTP to reset your password.
                            </p>
                        </div>

                        {/* Form */}
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
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
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="john@example.com"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                        autoFocus
                                        required
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    We'll send a 6-digit OTP to this email address
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={!email || loading}
                                className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 group ${
                                    email && !loading
                                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg'
                                        : 'bg-gray-300 cursor-not-allowed'
                                }`}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Sending OTP...
                                    </>
                                ) : (
                                    <>
                                        Send OTP
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
                                    Remember your password?
                                </span>
                            </div>
                        </div>

                        {/* Login Link */}
                        <Link
                            to="/login"
                            className="w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 bg-transparent hover:bg-blue-50"
                        >
                            <ChevronLeft size={18} />
                            Back to Login
                        </Link>
                    </div>

                    {/* Footer Note */}
                    <div className="px-8 py-4 text-center text-xs bg-gray-50 border-t border-gray-200 text-gray-500">
                        <div className="flex items-center justify-center gap-4">
                            <span className="flex items-center gap-1">
                                <Shield size={12} />
                                Secure
                            </span>
                            <span className="flex items-center gap-1">
                                <Lock size={12} />
                                Encrypted
                            </span>
                        </div>
                    </div>
                </div>

                {/* Help Text */}
                <p className="text-center text-xs text-gray-500 mt-6">
                    Didn't receive the OTP? Check your spam folder or{" "}
                    <button 
                        onClick={() => {
                            if (email) handleSubmit(new Event('submit'));
                            else toast.error("Please enter your email first");
                        }}
                        className="text-blue-600 hover:underline"
                    >
                        try again
                    </button>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;