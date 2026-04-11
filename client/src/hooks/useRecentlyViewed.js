import { useState, useEffect } from "react";

const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Load recently viewed from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("recentlyViewed");
    if (stored) {
      try {
        setRecentlyViewed(JSON.parse(stored));
      } catch (e) {
        console.error("Error loading recently viewed:", e);
      }
    }
  }, []);

  // Add product to recently viewed
  const addToRecentlyViewed = (product) => {
    if (!product || !product._id) return;

    setRecentlyViewed((prev) => {
      // Remove if already exists
      const filtered = prev.filter((item) => item._id !== product._id);
      // Add to beginning
      const updated = [product, ...filtered];
      // Keep only last 10 items
      const limited = updated.slice(0, 10);
      // Save to localStorage
      localStorage.setItem("recentlyViewed", JSON.stringify(limited));
      return limited;
    });
  };

  // Clear recently viewed
  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    localStorage.removeItem("recentlyViewed");
  };

  return { recentlyViewed, addToRecentlyViewed, clearRecentlyViewed };
};

export default useRecentlyViewed;