import React, { useState, useEffect } from 'react';
import Axios from '../utils/Axios';
import summaryApi from '../common/summartApi';
import AxiosError from '../utils/AxiosToError';
import toast from 'react-hot-toast';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, Shield, CheckCircle, ArrowRight, ChevronLeft } from 'lucide-react';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    if (!email) {
      toast.error('Email missing. Please verify OTP again.');
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  // Password strength checker
  useEffect(() => {
    let strength = 0;
    if (newPassword.length >= 6) strength += 1;
    if (newPassword.length >= 8) strength += 1;
    if (/[A-Z]/.test(newPassword)) strength += 1;
    if (/[0-9]/.test(newPassword)) strength += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 1;
    setPasswordStrength(strength);
  }, [newPassword]);

  const getStrengthText = () => {
    if (passwordStrength <= 1) return { text: 'Weak', color: 'text-error' };
    if (passwordStrength <= 3) return { text: 'Medium', color: 'text-warning' };
    return { text: 'Strong', color: 'text-success' };
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-error';
    if (passwordStrength <= 3) return 'bg-warning';
    return 'bg-success';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await Axios({
        ...summaryApi().resetPassword,
        data: {
          email,
          newPassword: newPassword.trim(),
        },
      });

      const resData = response?.data;
      if (resData?.success) {
        toast.success(resData.message || 'Password reset successfully!');
        navigate('/login');
      } else {
        toast.error(resData?.message || 'Failed to reset password');
      }
    } catch (error) {
      AxiosError(error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isValid = email && newPassword.trim().length >= 6 && newPassword === confirmPassword;

  return (
    <div className="min-h-[82.4vh] flex items-center justify-center px-4 py-8 fade-in">
      <div className="w-full max-w-md">
        {/* Brand Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">BuyZaar</span>
          </Link>
        </div>

        {/* Reset Password Card */}
        <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-display font-bold text-text">
                Reset Password
              </h2>
              <p className="text-sm text-text-muted mt-2">
                Create a new secure password for your account
              </p>
              {email && (
                <p className="text-xs text-text-muted mt-3 bg-bg-alt p-2 rounded-lg">
                  Resetting password for: <span className="font-medium text-primary">{email}</span>
                </p>
              )}
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* New Password Field */}
              <div>
                <label className="block text-sm font-semibold text-text mb-2">
                  New Password
                </label>
                <div className="relative group">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors group-focus-within:text-primary"
                    style={{ color: "var(--color-text-muted)" }}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="input pl-10 pr-10 py-3 w-full"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-bg-alt rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getStrengthColor()} transition-all duration-300`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${getStrengthText().color}`}>
                        {getStrengthText().text}
                      </span>
                    </div>
                    <ul className="text-xs text-text-muted space-y-1">
                      <li className={`flex items-center gap-1 ${newPassword.length >= 6 ? 'text-success' : ''}`}>
                        <CheckCircle size={10} /> At least 6 characters
                      </li>
                      <li className={`flex items-center gap-1 ${/[A-Z]/.test(newPassword) ? 'text-success' : ''}`}>
                        <CheckCircle size={10} /> Uppercase letter
                      </li>
                      <li className={`flex items-center gap-1 ${/[0-9]/.test(newPassword) ? 'text-success' : ''}`}>
                        <CheckCircle size={10} /> Number
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-semibold text-text mb-2">
                  Confirm New Password
                </label>
                <div className="relative group">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors group-focus-within:text-primary"
                    style={{ color: "var(--color-text-muted)" }}
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="input pl-10 pr-10 py-3 w-full"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="mt-1 text-xs text-error flex items-center gap-1">
                    <span>⚠️</span> Passwords do not match
                  </p>
                )}
                {confirmPassword && newPassword === confirmPassword && newPassword && (
                  <p className="mt-1 text-xs text-success flex items-center gap-1">
                    <CheckCircle size={10} /> Passwords match
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isValid || loading}
                className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 group ${
                  isValid && !loading
                    ? 'btn-primary'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <div className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Resetting...
                  </>
                ) : (
                  <>
                    Reset Password
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
                  Remember your password?
                </span>
              </div>
            </div>

            {/* Back to Login */}
            <Link
              to="/login"
              className="w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 border-2"
              style={{
                borderColor: "var(--color-primary)",
                color: "var(--color-primary)",
                backgroundColor: "transparent"
              }}
            >
              <ChevronLeft size={18} />
              Back to Login
            </Link>
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
                Secure Password
              </span>
              <span className="flex items-center gap-1">
                <Lock size={12} />
                Encrypted
              </span>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center text-xs text-text-muted mt-6">
          Your password will be encrypted and securely stored.
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;