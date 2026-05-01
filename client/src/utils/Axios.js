import axios from "axios";
import store from "../redux/store";
import { logout } from "../redux/userSlice";
import { baseUrl } from "../common/summartApi";

const Axios = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

Axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

Axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (!error.response) {
      return Promise.reject(error);
    }
    
    const { status } = error.response;
    
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      store.dispatch(logout());
    }
    
    return Promise.reject(error);
  }
);

export default Axios;