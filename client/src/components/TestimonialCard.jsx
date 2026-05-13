import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import TestimonialCard from "./TestimonialCard";
import Axios from "../utils/Axios";
import summaryApi from "../common/summartApi";
import useMobile from "../hooks/useMobile";

const TestimonialsSection = ({ limit = 3 }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useMobile(768);

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const fetchAllReviews = async () => {
    try {
      const response = await Axios(summaryApi().getAllReviews);
      let reviews = [];
      
      if (response.data?.success && Array.isArray(response.data.data)) {
        reviews = response.data.data;
      }
      
      const filteredReviews = reviews
        .filter(review => (review.rating || 0) >= 4 && review.status === "approved")
        .slice(0, limit);
      
      setTestimonials(filteredReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} ${i <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }
    return stars;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="py-6 md:py-8">
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-3">
            <Sparkles size={14} />
            Customer Reviews
          </div>
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mx-auto mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-48 md:h-56 bg-gray-200 animate-pulse rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <div className="py-6 md:py-8">
      <div className="text-center mb-6 md:mb-8">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-3">
          <Sparkles size={14} />
          Customer Reviews
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Loved By Thousands
        </h2>
        <p className="text-sm text-gray-500 max-w-2xl mx-auto">
          See why customers trust BuyZaar for premium shopping.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {testimonials.map((review, index) => (
          <div
            key={review._id || index}
            className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-md hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-600 to-orange-500 flex items-center justify-center text-white font-bold text-sm md:text-base`}>
                {review.user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 text-sm md:text-base">
                  {review.user?.name || "Anonymous"}
                </h4>
                <p className="text-[10px] md:text-xs text-gray-500">
                  {review.isVerifiedPurchase ? "Verified Buyer" : "Customer"}
                </p>
              </div>
            </div>
            
            <div className="flex gap-0.5 mb-2">
              {renderStars(review.rating)}
            </div>
            
            {review.title && (
              <h5 className="font-semibold text-gray-700 text-xs md:text-sm mb-1">
                {review.title}
              </h5>
            )}
            
            <p className="text-gray-600 text-xs md:text-sm leading-relaxed line-clamp-4">
              {review.comment}
            </p>
            
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
              <span className="text-[9px] md:text-xs text-gray-400">
                {formatDate(review.createdAt)}
              </span>
              <span className="text-[9px] md:text-xs text-gray-400">
                {review.helpful || 0} found helpful
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;