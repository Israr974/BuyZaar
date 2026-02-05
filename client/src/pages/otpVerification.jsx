import React, { useState } from 'react';
import Axios from '../utils/Axios';
import summaryApi from '../common/summartApi';
import AxiosError from '../utils/AxiosToError';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const OtpVerification = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sending:", { email, otp });

    try {
      const response = await Axios({
        ...summaryApi().forgotPasswordVerifyOtp,
        data: { email, otp }
      });

      const resData = response?.data;

      if (resData?.success) {
        toast.success(resData.message);
        navigate('/reset-password', {
          state: { email } 
        });
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
            Verify OTP
          </h2>

          <form className="grid gap-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
                Registered Email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                required
              />
            </div>

            <div>
              <label htmlFor="otp" className="block mb-1 font-medium text-gray-700">
                Enter OTP
              </label>
              <input
                type="text"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={!otp || !email}
              className={`w-full py-3 mt-2 rounded-lg font-semibold text-white transition duration-200 ${
                otp && email ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-300 cursor-not-allowed'
              }`}
            >
              Verify OTP
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default OtpVerification;
