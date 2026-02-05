import Axios from "./Axios";

const fetchUserDetails = async () => {
  try {
    const res = await Axios.get("/api/user/me"); 
    return res.data?.user || null; 
  } catch (error) {
    console.error("Fetch user failed:", error?.response?.data?.message || error.message);
    return null; 
  }
};

export default fetchUserDetails;
