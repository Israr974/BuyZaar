// // // components/ProductReviews.jsx
// // import React, { useState, useEffect } from "react";
// // import { Star, StarHalf, User, ThumbsUp, Flag, Clock } from "lucide-react";
// // import { useSelector } from "react-redux";
// // import toast from "react-hot-toast";
// // import Axios from "../utils/Axios";
// // import summaryApi from "../common/summartApi";

// // const ProductReviews = ({ productId, reviews: initialReviews = [], averageRating: initialRating = 0, totalReviews: initialTotal = 0 }) => {
// //   const [showWriteReview, setShowWriteReview] = useState(false);
// //   const [rating, setRating] = useState(0);
// //   const [hoverRating, setHoverRating] = useState(0);
// //   const [comment, setComment] = useState("");
// //   const [title, setTitle] = useState("");
// //   const [submitting, setSubmitting] = useState(false);
// //   const [reviews, setReviews] = useState(initialReviews);
// //   const [averageRating, setAverageRating] = useState(initialRating);
// //   const [totalReviews, setTotalReviews] = useState(initialTotal);
// //   const [loading, setLoading] = useState(false);

// //   const user = useSelector((state) => state.user);

// //   // Fetch reviews on component mount
// //   useEffect(() => {
// //     if (productId) {
// //       fetchReviews();
// //     }
// //   }, [productId]);

// //   const fetchReviews = async () => {
// //     try {
// //       setLoading(true);
// //       const response = await Axios({
// //         ...summaryApi().getProductReviews(productId),
// //       });
// //       if (response.data?.success) {
// //         setReviews(response.data.data || []);
// //         setTotalReviews(response.data.pagination?.total || 0);
// //       }
// //     } catch (error) {
// //       console.error("Fetch reviews error:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const renderStars = (ratingValue, size = 16) => {
// //     const stars = [];
// //     const fullStars = Math.floor(ratingValue);
// //     const hasHalfStar = ratingValue % 1 >= 0.5;

// //     for (let i = 0; i < fullStars; i++) {
// //       stars.push(<Star key={i} size={size} className="fill-accent text-accent" />);
// //     }
// //     if (hasHalfStar) {
// //       stars.push(<StarHalf key="half" size={size} className="fill-accent text-accent" />);
// //     }
// //     const emptyStars = 5 - stars.length;
// //     for (let i = 0; i < emptyStars; i++) {
// //       stars.push(<Star key={`empty-${i}`} size={size} className="text-border" />);
// //     }
// //     return stars;
// //   };

// //   const handleSubmitReview = async (e) => {
// //     e.preventDefault();
    
// //     if (!user?.id) {
// //       toast.error("Please login to submit a review");
// //       return;
// //     }
    
// //     if (rating === 0) {
// //       toast.error("Please select a rating");
// //       return;
// //     }
    
// //     if (!comment.trim()) {
// //       toast.error("Please write a review");
// //       return;
// //     }

// //     setSubmitting(true);
    
// //     try {
// //       const response = await Axios({
// //         ...summaryApi().addReview,
// //         data: {
// //           productId: productId,
// //           rating: rating,
// //           title: title,
// //           comment: comment
// //         }
// //       });

// //       if (response.data?.success) {
// //         toast.success("Review submitted successfully!");
// //         setShowWriteReview(false);
// //         setRating(0);
// //         setComment("");
// //         setTitle("");
// //         fetchReviews(); 
// //       } else {
// //         toast.error(response.data?.message || "Failed to submit review");
// //       }
// //     } catch (error) {
// //       console.error("Submit review error:", error);
// //       toast.error(error.response?.data?.message || "Failed to submit review");
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   return (
// //     <div>
// //       {/* Rating Summary */}
// //       <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-border">
// //         <div className="text-center md:text-left">
// //           <div className="text-4xl font-bold gradient-text">{averageRating.toFixed(1)}</div>
// //           <div className="flex items-center justify-center md:justify-start gap-1 my-2">
// //             {renderStars(averageRating, 20)}
// //           </div>
// //           <p className="text-text-muted text-sm">{totalReviews} reviews</p>
// //         </div>

// //         <div className="flex-1">
// //           <button
// //             onClick={() => setShowWriteReview(!showWriteReview)}
// //             className="btn btn-primary px-6"
// //           >
// //             Write a Review
// //           </button>
// //         </div>
// //       </div>

// //       {/* Write Review Form */}
// //       {showWriteReview && (
// //         <div className="bg-bg-alt rounded-xl p-6 mb-8 border border-border">
// //           <h3 className="font-semibold text-text mb-4">Write a Review</h3>
// //           <form onSubmit={handleSubmitReview}>
// //             <div className="mb-4">
// //               <label className="block text-sm font-medium text-text mb-2">Rating *</label>
// //               <div className="flex items-center gap-1">
// //                 {[1, 2, 3, 4, 5].map((star) => (
// //                   <button
// //                     key={star}
// //                     type="button"
// //                     onMouseEnter={() => setHoverRating(star)}
// //                     onMouseLeave={() => setHoverRating(0)}
// //                     onClick={() => setRating(star)}
// //                     className="focus:outline-none"
// //                   >
// //                     <Star
// //                       size={28}
// //                       className={`${
// //                         star <= (hoverRating || rating)
// //                           ? "fill-accent text-accent"
// //                           : "text-border"
// //                       } transition-colors`}
// //                     />
// //                   </button>
// //                 ))}
// //               </div>
// //             </div>

// //             <div className="mb-4">
// //               <label className="block text-sm font-medium text-text mb-2">Review Title</label>
// //               <input
// //                 type="text"
// //                 value={title}
// //                 onChange={(e) => setTitle(e.target.value)}
// //                 placeholder="Summarize your experience"
// //                 className="input w-full"
// //               />
// //             </div>

// //             <div className="mb-4">
// //               <label className="block text-sm font-medium text-text mb-2">Your Review *</label>
// //               <textarea
// //                 value={comment}
// //                 onChange={(e) => setComment(e.target.value)}
// //                 placeholder="Share your experience with this product..."
// //                 rows={4}
// //                 className="input w-full resize-none"
// //               />
// //             </div>

// //             <div className="flex gap-3">
// //               <button
// //                 type="submit"
// //                 disabled={submitting}
// //                 className="btn btn-primary px-6 disabled:opacity-50"
// //               >
// //                 {submitting ? "Submitting..." : "Submit Review"}
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={() => setShowWriteReview(false)}
// //                 className="btn btn-outline px-6"
// //               >
// //                 Cancel
// //               </button>
// //             </div>
// //           </form>
// //         </div>
// //       )}

// //       {/* Reviews List */}
// //       {loading ? (
// //         <div className="text-center py-8">
// //           <div className="spinner w-8 h-8 mx-auto"></div>
// //         </div>
// //       ) : reviews.length === 0 ? (
// //         <div className="text-center py-8">
// //           <Star className="w-12 h-12 text-border mx-auto mb-3" />
// //           <p className="text-text-muted">No reviews yet. Be the first to review!</p>
// //         </div>
// //       ) : (
// //         <div className="space-y-6">
// //           {reviews.map((review, index) => (
// //             <div key={index} className="border-b border-border pb-6">
// //               <div className="flex items-center justify-between mb-2">
// //                 <div className="flex items-center gap-3">
// //                   <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
// //                     <User size={18} className="text-primary" />
// //                   </div>
// //                   <div>
// //                     <p className="font-medium text-text">{review.user?.name || "Anonymous"}</p>
// //                     <div className="flex items-center gap-1">
// //                       {renderStars(review.rating, 14)}
// //                     </div>
// //                   </div>
// //                 </div>
// //                 <div className="flex items-center gap-3 text-text-muted text-xs">
// //                   <span className="flex items-center gap-1">
// //                     <Clock size={12} />
// //                     {new Date(review.createdAt).toLocaleDateString()}
// //                   </span>
// //                 </div>
// //               </div>
// //               {review.title && (
// //                 <h4 className="font-semibold text-text mt-2">{review.title}</h4>
// //               )}
// //               <p className="text-text-muted text-sm mt-1 leading-relaxed">{review.comment}</p>
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default ProductReviews;

// import React, { useState, useEffect } from "react";
// import { Star, StarHalf, User, Clock } from "lucide-react";
// import { useSelector } from "react-redux";
// import toast from "react-hot-toast";
// import Axios from "../utils/Axios";
// import summaryApi from "../common/summartApi";

// const ProductReviews = ({ productId, reviews: initialReviews = [], averageRating: initialRating = 0, totalReviews: initialTotal = 0 }) => {
//   const [showWriteReview, setShowWriteReview] = useState(false);
//   const [rating, setRating] = useState(0);
//   const [hoverRating, setHoverRating] = useState(0);
//   const [comment, setComment] = useState("");
//   const [title, setTitle] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [reviews, setReviews] = useState(initialReviews);
//   const [averageRating, setAverageRating] = useState(initialRating);
//   const [totalReviews, setTotalReviews] = useState(initialTotal);
//   const [loading, setLoading] = useState(false);

//   const user = useSelector((state) => state.user);

//   useEffect(() => {
//     if (productId) fetchReviews();
//   }, [productId]);

//   const fetchReviews = async () => {
//     setLoading(true);
//     try {
//       const response = await Axios({
//         ...summaryApi().getProductReviews(productId),
//       });
//       if (response.data?.success) {
//         setReviews(response.data.data || []);
//         setTotalReviews(response.data.pagination?.total || 0);
//       }
//     } catch {
//       // Silent fail
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderStars = (ratingValue, size = 16) => {
//     const stars = [];
//     const fullStars = Math.floor(ratingValue);
//     const hasHalfStar = ratingValue % 1 >= 0.5;

//     for (let i = 0; i < fullStars; i++) {
//       stars.push(<Star key={i} size={size} className="fill-accent text-accent" />);
//     }
//     if (hasHalfStar) {
//       stars.push(<StarHalf key="half" size={size} className="fill-accent text-accent" />);
//     }
//     for (let i = stars.length; i < 5; i++) {
//       stars.push(<Star key={`empty-${i}`} size={size} className="text-border" />);
//     }
//     return stars;
//   };

//   const handleSubmitReview = async (e) => {
//     e.preventDefault();
    
//     if (!user?.id) {
//       toast.error("Please login to submit a review");
//       return;
//     }
    
//     if (rating === 0) {
//       toast.error("Please select a rating");
//       return;
//     }
    
//     if (!comment.trim()) {
//       toast.error("Please write a review");
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const response = await Axios({
//         ...summaryApi().addReview,
//         data: { productId, rating, title, comment }
//       });

//       if (response.data?.success) {
//         toast.success("Review submitted successfully!");
//         setShowWriteReview(false);
//         setRating(0);
//         setComment("");
//         setTitle("");
//         fetchReviews();
//       } else {
//         toast.error(response.data?.message || "Failed to submit review");
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to submit review");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const StarInput = ({ star, currentRating, hoverRating, onMouseEnter, onMouseLeave, onClick }) => (
//     <button
//       type="button"
//       onMouseEnter={() => onMouseEnter(star)}
//       onMouseLeave={onMouseLeave}
//       onClick={onClick}
//       className="focus:outline-none"
//     >
//       <Star
//         size={28}
//         className={`${
//           star <= (hoverRating || currentRating)
//             ? "fill-accent text-accent"
//             : "text-border"
//         } transition-colors`}
//       />
//     </button>
//   );

//   return (
//     <div>
//       {/* Rating Summary */}
//       <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-border">
//         <div className="text-center md:text-left">
//           <div className="text-4xl font-bold gradient-text">{averageRating.toFixed(1)}</div>
//           <div className="flex items-center justify-center md:justify-start gap-1 my-2">
//             {renderStars(averageRating, 20)}
//           </div>
//           <p className="text-text-muted text-sm">{totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}</p>
//         </div>

//         <div className="flex-1">
//           <button
//             onClick={() => setShowWriteReview(!showWriteReview)}
//             className="btn btn-primary px-6"
//           >
//             Write a Review
//           </button>
//         </div>
//       </div>

//       {/* Write Review Form */}
//       {showWriteReview && (
//         <div className="bg-bg-alt rounded-xl p-6 mb-8 border border-border">
//           <h3 className="font-semibold text-text mb-4">Write a Review</h3>
//           <form onSubmit={handleSubmitReview}>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-text mb-2">Rating *</label>
//               <div className="flex items-center gap-1">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <StarInput
//                     key={star}
//                     star={star}
//                     currentRating={rating}
//                     hoverRating={hoverRating}
//                     onMouseEnter={setHoverRating}
//                     onMouseLeave={() => setHoverRating(0)}
//                     onClick={() => setRating(star)}
//                   />
//                 ))}
//               </div>
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm font-medium text-text mb-2">Review Title</label>
//               <input
//                 type="text"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 placeholder="Summarize your experience"
//                 className="input w-full"
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm font-medium text-text mb-2">Your Review *</label>
//               <textarea
//                 value={comment}
//                 onChange={(e) => setComment(e.target.value)}
//                 placeholder="Share your experience with this product..."
//                 rows={4}
//                 className="input w-full resize-none"
//               />
//             </div>

//             <div className="flex gap-3">
//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className="btn btn-primary px-6 disabled:opacity-50"
//               >
//                 {submitting ? "Submitting..." : "Submit Review"}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setShowWriteReview(false)}
//                 className="btn btn-outline px-6"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Reviews List */}
//       {loading ? (
//         <div className="text-center py-8">
//           <div className="spinner w-8 h-8 mx-auto border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
//         </div>
//       ) : reviews.length === 0 ? (
//         <div className="text-center py-8">
//           <Star className="w-12 h-12 text-border mx-auto mb-3" />
//           <p className="text-text-muted">No reviews yet. Be the first to review!</p>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {reviews.map((review, index) => (
//             <div key={review._id || index} className="border-b border-border pb-6">
//               <div className="flex items-center justify-between mb-2">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
//                     <User size={18} className="text-primary" />
//                   </div>
//                   <div>
//                     <p className="font-medium text-text">{review.user?.name || "Anonymous"}</p>
//                     <div className="flex items-center gap-1">
//                       {renderStars(review.rating, 14)}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3 text-text-muted text-xs">
//                   <span className="flex items-center gap-1">
//                     <Clock size={12} />
//                     {new Date(review.createdAt).toLocaleDateString()}
//                   </span>
//                 </div>
//               </div>
//               {review.title && (
//                 <h4 className="font-semibold text-text mt-2">{review.title}</h4>
//               )}
//               <p className="text-text-muted text-sm mt-1 leading-relaxed">{review.comment}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductReviews;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import useRecentlyViewed from "../hooks/useRecentlyViewed";

const RecentlyViewed = ({ maxItems = 6, showScrollButtons = true }) => {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);
  const scrollContainerRef = React.useRef(null);

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftScroll(scrollLeft > 20);
      setShowRightScroll(scrollLeft + clientWidth < scrollWidth - 20);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && showScrollButtons && recentlyViewed.length > 0) {
      setTimeout(checkScrollPosition, 100);
      container.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, [recentlyViewed, showScrollButtons]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  if (recentlyViewed.length === 0) {
    return null;
  }

  const displayedProducts = recentlyViewed.slice(0, maxItems);

  return (
    <div className="mt-12 md:mt-16 px-4 md:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 md:h-8 rounded-full bg-gradient-to-b from-blue-600 to-orange-500"></div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              Recently Viewed
            </h2>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5">
              Products you've been looking at
            </p>
          </div>
          <Clock size={18} className="text-gray-500 hidden sm:block" />
        </div>
        
        <button
          onClick={clearRecentlyViewed}
          className="text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-50 self-start sm:self-auto"
        >
          <Trash2 size={14} />
          Clear History
        </button>
      </div>

      <div className="relative">
        {showScrollButtons && showLeftScroll && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-lg hover:bg-blue-600 hover:text-white transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className={`${showScrollButtons ? 'overflow-x-auto scroll-smooth' : ''}`}
          style={showScrollButtons ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}
        >
          <div className={`${showScrollButtons ? 'flex gap-4' : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'}`}>
            {displayedProducts.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product.name?.toLowerCase().replace(/\s+/g, "-")}-${product._id}`}
                className={`group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                  showScrollButtons ? 'w-[180px] sm:w-[200px] flex-shrink-0' : ''
                }`}
              >
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={product.image?.[0] || "/placeholder.png"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Eye size={24} className="text-white" />
                  </div>
                </div>
                
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[40px] group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                      ₹{product.price?.toLocaleString()}
                    </p>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <p className="text-xs text-gray-500 line-through">
                        ₹{product.originalPrice?.toLocaleString()}
                      </p>
                    )}
                  </div>
                  
                  {product.discount > 0 && (
                    <div className="mt-1">
                      <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                        {product.discount <= 100 ? `${product.discount}% OFF` : `${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF`}
                      </span>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <Clock size={10} />
                    Recently viewed
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {showScrollButtons && showRightScroll && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-lg hover:bg-blue-600 hover:text-white transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      {recentlyViewed.length > maxItems && (
        <div className="text-center mt-6">
          <Link
            to="/recently-viewed"
            className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
          >
            View all ({recentlyViewed.length}) recently viewed products
            <ChevronRight size={14} />
          </Link>
        </div>
      )}

      <style>{`
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
        .overflow-x-auto {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default RecentlyViewed;