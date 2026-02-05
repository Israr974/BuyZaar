import React, { useState, useEffect } from 'react';
import Axios from '../utils/Axios';
import summaryApi from '../common/summartApi';
import AxiosError from '../utils/AxiosToError';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!email) {
      toast.error('Email missing. Please verify OTP again.');
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

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
        toast.success(resData.message);
        navigate('/login');
      } else {
        toast.error(resData.message);
      }
    } catch (error) {
      AxiosError(error);
    }
  };

  const isValid =
    email &&
    newPassword.trim().length >= 6 &&
    newPassword === confirmPassword;

  return (
    <section>
      <div className="flex justify-center mt-5">
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-lg">
          <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
            Reset Password
          </h2>
          <form className="grid gap-5" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                placeholder="Enter new password"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                placeholder="Confirm new password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!isValid}
              className={`w-full py-3 mt-2 rounded-lg font-semibold text-white transition duration-200 ${
                isValid
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-blue-300 cursor-not-allowed'
              }`}
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
