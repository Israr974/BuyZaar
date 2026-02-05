
import axios from "axios";
import store from "../redux/store";
import { logout } from "../redux/userSlice";
import { baseUrl } from "../common/summartApi";

const Axios = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});


Axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);


Axios.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;

      
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      store.dispatch(logout());

      
    }

    return Promise.reject(error);
  }
);

export default Axios;
