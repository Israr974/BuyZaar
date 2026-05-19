
import Axios from "./Axios";
import AxiosError from "./AxiosToError";

const fetchUserDetails = async () => {

  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }

  try {
    const res = await Axios.get("/api/user/me"); 
    return res.data?.user || null; 
  } catch (error) {

    return null; 
  }
};

export default fetchUserDetails;