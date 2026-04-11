// components/ProductReviews.jsx
import React, { useState, useEffect } from "react";
import { Star, StarHalf, User, ThumbsUp, Flag, Clock } from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import summaryApi from "../common/summartApi";

const ProductReviews = ({ productId, reviews: initialReviews = [], averageRating: initialRating = 0, totalReviews: initialTotal = 0 }) => {
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviews, setReviews] = useState(initialReviews);
  const [averageRating, setAverageRating] = useState(initialRating);
  const [totalReviews, setTotalReviews] = useState(initialTotal);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user);

  // Fetch reviews on component mount
  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...summaryApi().getProductReviews(productId),
      });
      if (response.data?.success) {
        setReviews(response.data.data || []);
        setTotalReviews(response.data.pagination?.total || 0);
      }
    } catch (error) {
      console.error("Fetch reviews error:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (ratingValue, size = 16) => {
    const stars = [];
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={size} className="fill-accent text-accent" />);
    }
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" size={size} className="fill-accent text-accent" />);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={size} className="text-border" />);
    }
    return stars;
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error("Please login to submit a review");
      return;
    }
    
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    
    if (!comment.trim()) {
      toast.error("Please write a review");
      return;
    }

    setSubmitting(true);
    
    try {
      const response = await Axios({
        ...summaryApi().addReview,
        data: {
          productId: productId,
          rating: rating,
          title: title,
          comment: comment
        }
      });

      if (response.data?.success) {
        toast.success("Review submitted successfully!");
        setShowWriteReview(false);
        setRating(0);
        setComment("");
        setTitle("");
        fetchReviews(); 
      } else {
        toast.error(response.data?.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Submit review error:", error);
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Rating Summary */}
      <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-border">
        <div className="text-center md:text-left">
          <div className="text-4xl font-bold gradient-text">{averageRating.toFixed(1)}</div>
          <div className="flex items-center justify-center md:justify-start gap-1 my-2">
            {renderStars(averageRating, 20)}
          </div>
          <p className="text-text-muted text-sm">{totalReviews} reviews</p>
        </div>

        <div className="flex-1">
          <button
            onClick={() => setShowWriteReview(!showWriteReview)}
            className="btn btn-primary px-6"
          >
            Write a Review
          </button>
        </div>
      </div>

      {/* Write Review Form */}
      {showWriteReview && (
        <div className="bg-bg-alt rounded-xl p-6 mb-8 border border-border">
          <h3 className="font-semibold text-text mb-4">Write a Review</h3>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-text mb-2">Rating *</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      size={28}
                      className={`${
                        star <= (hoverRating || rating)
                          ? "fill-accent text-accent"
                          : "text-border"
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-text mb-2">Review Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your experience"
                className="input w-full"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-text mb-2">Your Review *</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this product..."
                rows={4}
                className="input w-full resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary px-6 disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
              <button
                type="button"
                onClick={() => setShowWriteReview(false)}
                className="btn btn-outline px-6"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="spinner w-8 h-8 mx-auto"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8">
          <Star className="w-12 h-12 text-border mx-auto mb-3" />
          <p className="text-text-muted">No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <div key={index} className="border-b border-border pb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-text">{review.user?.name || "Anonymous"}</p>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating, 14)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-text-muted text-xs">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {review.title && (
                <h4 className="font-semibold text-text mt-2">{review.title}</h4>
              )}
              <p className="text-text-muted text-sm mt-1 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;