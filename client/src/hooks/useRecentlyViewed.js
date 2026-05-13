import { useState, useEffect } from "react";

const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("recentlyViewed");
    if (stored) {
      try {
        setRecentlyViewed(JSON.parse(stored));
      } catch (e) {
        console.log(e)
      }
    }
  }, []);

  const addToRecentlyViewed = (product) => {
    if (!product || !product._id) return;

    setRecentlyViewed((prev) => {
      const filtered = prev.filter((item) => item._id !== product._id);
      const updated = [product, ...filtered];
      const limited = updated.slice(0, 10);
      localStorage.setItem("recentlyViewed", JSON.stringify(limited));
      return limited;
    });
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    localStorage.removeItem("recentlyViewed");
  };

  return { recentlyViewed, addToRecentlyViewed, clearRecentlyViewed };
};

export default useRecentlyViewed;