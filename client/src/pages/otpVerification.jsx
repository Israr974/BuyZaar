import { Link } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import Axios from '../utils/Axios';
import summaryApi from '../common/summartApi';
import AxiosError from '../utils/AxiosToError';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Key, Shield, ArrowRight, ChevronLeft, Clock, AlertCircle } from 'lucide-react';

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  // Get email from location state if available
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !canResend) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [timeLeft, canResend]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email address");
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
        toast.success("OTP resent successfully!");
        setTimeLeft(300);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        toast.error(resData?.message || "Failed to resend OTP");
      }
    } catch (error) {
      AxiosError(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      const response = await Axios({
        ...summaryApi().forgotPasswordVerifyOtp,
        data: { email, otp: otpValue }
      });

      const resData = response?.data;

      if (resData?.success) {
        toast.success(resData.message || "OTP verified successfully!");
        navigate('/reset-password', {
          state: { email, otp: otpValue }
        });
      } else if (resData?.error) {
        toast.error(resData.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      AxiosError(error);
      toast.error("Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const otpComplete = otp.every(digit => digit !== '');

  return (
    <div className="min-h-[82.4vh] flex items-center justify-center px-4 py-8 fade-in">
      <div className="w-full max-w-md">
        {/* Brand Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Key className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">BuyZaar</span>
          </Link>
        </div>

        {/* OTP Verification Card */}
        <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-display font-bold text-text">
                Verify OTP
              </h2>
              <p className="text-sm text-text-muted mt-2">
                Enter the 6-digit code sent to your email address
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-text mb-2">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="input pl-10 py-3 w-full"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* OTP Input Fields */}
              <div>
                <label className="block text-sm font-semibold text-text mb-2">
                  Enter OTP
                </label>
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => inputRefs.current[index] = el}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-xl font-bold rounded-lg border border-border bg-bg-alt focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      maxLength={1}
                      disabled={loading}
                    />
                  ))}
                </div>
                <p className="text-xs text-text-muted text-center mt-2">
                  Enter the 6-digit verification code
                </p>
              </div>

              {/* Timer */}
              <div className="text-center">
                {!canResend ? (
                  <p className="text-sm text-text-muted flex items-center justify-center gap-1">
                    <Clock size={14} />
                    OTP expires in <span className="font-semibold text-primary">{formatTime(timeLeft)}</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-sm text-primary hover:underline flex items-center justify-center gap-1 mx-auto"
                  >
                    Didn't receive OTP? Resend
                  </button>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!otpComplete || !email || loading}
                className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 group ${
                  otpComplete && email && !loading
                    ? 'btn-primary'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <div className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify OTP
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
                  Need help?
                </span>
              </div>
            </div>

            {/* Back to Login */}
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 border-2"
              style={{
                borderColor: "var(--color-primary)",
                color: "var(--color-primary)",
                backgroundColor: "transparent"
              }}
            >
              <ChevronLeft size={18} />
              Back to Login
            </button>
          </div>

          {/* Footer Note */}
          <div
            className="px-8 py-4 text-center text-xs"
            style={{
              backgroundColor: "var(--color-bg-alt)",
              borderTop: "1px solid var(--color-border)",
              color: "var(--color-text-muted)"
            }}
          >
            <div className="flex items-center justify-center gap-4">
              <span className="flex items-center gap-1">
                <Shield size={12} />
                Secure Verification
              </span>
              <span className="flex items-center gap-1">
                <AlertCircle size={12} />
                OTP valid for 5 minutes
              </span>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center text-xs text-text-muted mt-6">
          Check your spam folder if you didn't receive the OTP.{" "}
          <button 
            onClick={handleResendOtp}
            disabled={loading}
            className="text-primary hover:underline"
          >
            Resend OTP
          </button>
        </p>
      </div>
    </div>
  );
};

export default OtpVerification;