import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import Axios from "../utils/Axios";
import summaryApi from "../common/summartApi";
import CardProduct from "./CardProduct";

const Recommendations = ({ currentProductId, categoryId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await Axios({
          ...summaryApi().getProductByCategory,
          data: { id: categoryId }
        });
        if (res.data.success) {
          // Filter out current product and limit to 4
          const filtered = res.data.data
            .filter(p => p._id !== currentProductId)
            .slice(0, 4);
          setProducts(filtered);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchRecommendations();
    }
  }, [categoryId, currentProductId]);

  if (loading || products.length === 0) return null;

  return (
    <div className="mt-12">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles size={20} className="text-accent" />
        <h2 className="text-xl font-display font-bold text-text">
          You May Also Like
        </h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map((product) => (
          <CardProduct key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Recommendations;