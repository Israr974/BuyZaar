import React, { useState } from 'react';
import Axios from '../utils/Axios';
import summaryApi from '../common/summartApi';
import AxiosError from '../utils/AxiosToError';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const navigate=useNavigate()
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...summaryApi().forgotPassword, 
        data: { email }
      });

      const resData = response?.data;

      if (resData?.success) {
        toast.success(resData.message);
        setEmail('');
        navigate("/verify-otp")
      } else if (resData?.error) {
        toast.error(resData.message);
      }
    } catch (error) {
      AxiosError(error);
    }

  };

  return (
    <section>
      <div className="flex justify-center mt-5">
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-lg">
          <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
            Forgot Password
          </h2>
          <form className="grid gap-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
                Enter your registered email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={!email}
              className={`w-full py-3 mt-2 rounded-lg font-semibold text-white transition duration-200 ${
                email ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-300 cursor-not-allowed'
              }`}
            >
              Send Otp
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-5">
            Remembered your password?
            <Link to="/login" className="text-blue-600 font-semibold ml-1 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
