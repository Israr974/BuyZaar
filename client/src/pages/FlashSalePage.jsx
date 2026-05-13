
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import summaryApi from "../common/summartApi";
import { Star, ShoppingBag, Flame, ArrowLeft } from "lucide-react";
import { AxiosError } from "axios";

const FlashSalePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFlashSaleProducts();
  }, []);

  const fetchFlashSaleProducts = async () => {
    try {
      const response = await Axios(summaryApi().getAllProduct);
      const allProducts = response.data?.data || [];
      const discountedProducts = allProducts.filter(product => (product.discount || 0) >= 40);
      setProducts(discountedProducts);
      setLoading(false);
    } catch (error) {
      AxiosError(error)
      setLoading(false);
    }
  };

  const handleBuyNow = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map((item) => (
            <div key={item} className="h-80 bg-gray-200 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-red-100 px-4 py-2 rounded-full text-red-600 font-semibold mb-4">
          <Flame size={18} />
          Flash Sale
        </div>
        <h1 className="text-3xl md:text-5xl font-black mb-4 bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
          40%+ Discount Deals
        </h1>
        <p className="text-gray-600 text-lg">Limited time offers on premium products</p>
        <p className="text-gray-500 mt-2">{products.length} products found</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No products with 40%+ discount available</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => {
            const discountPercent = product.discount || 0;
            const originalPrice = product.price;
            const discountedPrice = originalPrice - (originalPrice * discountPercent / 100);

            return (
              <div
                key={product._id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer border border-gray-100"
                onClick={() => handleBuyNow(product._id)}
              >
                <div className="relative overflow-hidden bg-gray-100">
                  <img
                    src={product.image?.[0] || product.image || "/placeholder.png"}
                    alt={product.name}
                    className="w-full h-48 md:h-56 object-cover group-hover:scale-110 transition duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs md:text-sm font-bold px-2 md:px-3 py-1 rounded-full z-10">
                    -{discountPercent}%
                  </span>
                  {product.stock === 0 && (
                    <span className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold">
                      Out of Stock
                    </span>
                  )}
                </div>
                <div className="p-3 md:p-4">
                  <h3 className="font-semibold text-sm md:text-base line-clamp-2 mb-2 min-h-[40px] md:min-h-[48px] group-hover:text-blue-600 transition">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-xs md:text-sm font-medium">{product.rating || 4.5}</span>
                    <span className="text-xs text-gray-400">({product.reviewCount || 100})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg md:text-xl font-bold text-red-500">
                      ₹{Math.round(discountedPrice).toLocaleString()}
                    </span>
                    <span className="text-xs md:text-sm text-gray-400 line-through">
                      ₹{originalPrice.toLocaleString()}
                    </span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuyNow(product._id);
                    }}
                    className="w-full mt-3 md:mt-4 bg-gradient-to-r from-red-500 to-orange-500 text-white py-2 rounded-xl text-sm md:text-base font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={16} />
                    Buy Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FlashSalePage;