import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import Axios from "../utils/Axios";
import summaryApi from "../common/summartApi";
import CardProduct from "./CardProduct";
import toast from "react-hot-toast";

const Recommendations = ({ currentProductId, categoryId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!categoryId) return;
      
      try {
        const res = await Axios({
          ...summaryApi().getProductByCategory,
          data: { id: categoryId }
        });
        
        if (res.data.success) {
          const filtered = res.data.data
            .filter(p => p._id !== currentProductId)
            .slice(0, 4);
          setProducts(filtered);
        }
      } catch(error) {
        toast.error(error)
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
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