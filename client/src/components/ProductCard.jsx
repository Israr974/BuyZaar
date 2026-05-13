import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import summaryApi from "../common/summartApi";
import { setCartItems } from "../redux/cartSlice";
import { addToWishlist, removeFromWishlist } from "../redux/wishlistSlice";
import { calculateDiscountedPrice, formatPrice } from "../utils/priceUtils";
import { Star, StarHalf } from "lucide-react";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (product && wishlistItems.length) {
      setIsWishlisted(wishlistItems.some(item => item.productId === product._id || item._id === product._id));
    }
  }, [product, wishlistItems]);

  const discountPercent = product?.discount || 0;
  const originalPrice = product?.price || 0;
  const discountedPrice = calculateDiscountedPrice(originalPrice, discountPercent);
  const rating = product.rating || 0;
  const reviewCount = product.reviewCount || 0;

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="text-yellow-400"><Star size={12} className="fill-yellow-400 text-yellow-400" /></span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400"><StarHalf size={12} className="fill-yellow-400 text-yellow-400" /></span>);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">★</span>);
    }
    return stars;
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!localStorage.getItem('token')) {
      toast.error("Please login to add items to cart");
      navigate('/login');
      return;
    }
    if (product?.stock === 0) { toast.error("Out of stock"); return; }
    setAddingToCart(true);
    try {
      const res = await Axios({ ...summaryApi().addToCart, data: { productId: product._id, quantity: 1, priceAtAddTime: discountedPrice } });
      if (res.data.success) {
        toast.success("Added to cart!");
        const cartRes = await Axios(summaryApi().getCartProducts);
        if (cartRes.data.success) dispatch(setCartItems(cartRes.data.data));
      }
    } catch (error) { toast.error("Failed to add",error); }
    finally { setAddingToCart(false); }
  };

  const handleBuyNow = async (e) => {
    e.stopPropagation();
    if (!localStorage.getItem('token')) { toast.error("Please login"); navigate('/login'); return; }
    if (product?.stock === 0) { toast.error("Out of stock"); return; }
    setAddingToCart(true);
    try {
      await Axios({ ...summaryApi().addToCart, data: { productId: product._id, quantity: 1, priceAtAddTime: discountedPrice } });
      navigate('/checkout');
    } catch (error) { toast.error("Failed",error); }
    finally { setAddingToCart(false); }
  };

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    if (!localStorage.getItem('token')) { toast.error("Please login"); navigate('/login'); return; }
    try {
      if (isWishlisted) {
        await Axios({ ...summaryApi().removeFromWishlist, data: { productId: product._id } });
        dispatch(removeFromWishlist(product._id));
        toast.success("Removed from wishlist");
      } else {
        await Axios({ ...summaryApi().addToWishlist, data: { productId: product._id } });
        dispatch(addToWishlist({ productId: product._id, product }));
        toast.success("Added to wishlist");
      }
      setIsWishlisted(!isWishlisted);
    } catch (error) { toast.error("Failed",error); }
  };

  const handleProductClick = () => navigate(`/product/${product._id}`);

  if (!product) return null;

  return (
    <div 
      onClick={handleProductClick}
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image?.[0] || "/placeholder.png"}
          alt={product.name}
          className="w-full h-32 sm:h-36 md:h-40 object-cover cursor-pointer transition duration-500 group-hover:scale-110"
          onClick={() => handleBuyNow(product._id)}
          loading="lazy"
        />
        {discountPercent > 0 && (
          <span className={`absolute top-2 left-2 bg-red-500 text-white font-bold rounded-full shadow-md ${
            discountPercent >= 40 ? "text-[10px] md:text-xs px-1.5 py-0.5" : "text-[10px] px-1.5 py-0.5"
          }`}>
            -{discountPercent}%
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white text-xs font-bold bg-red-500 px-2 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2 right-2 p-1.5 rounded-full transition-all duration-200 ${
            isWishlisted 
              ? "bg-red-500 text-white shadow-md" 
              : "bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white backdrop-blur-sm"
          }`}
        >
          <Heart size={14} className={isWishlisted ? "fill-white" : ""} />
        </button>
      </div>

      <div className="p-2 md:p-3">
        <h3 
          className="font-semibold text-gray-800 hover:text-red-500 cursor-pointer transition-colors text-xs md:text-sm line-clamp-2 min-h-[32px]"
          onClick={() => handleBuyNow(product._id)}
        >
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mt-1">
          <div className="flex items-center gap-0.5 text-[10px] md:text-xs">
            {renderStars()}
          </div>
          <span className="text-[9px] md:text-xs font-medium text-gray-600">
            {rating.toFixed(1)}
          </span>
          <span className="text-[8px] md:text-[10px] text-gray-400">
            ({reviewCount})
          </span>
        </div>

        <div className="mt-1 md:mt-1.5">
          <span className="font-bold text-red-500 text-sm md:text-base">
            {formatPrice(discountedPrice)}
          </span>
          {discountPercent > 0 && (
            <span className="text-gray-400 line-through ml-1 text-[10px] md:text-xs">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        <div className="flex gap-2 mt-2">
          <button 
            onClick={handleAddToCart}
            disabled={product.stock === 0 || addingToCart}
            className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-1 py-1.5 md:py-2 text-[10px] md:text-xs disabled:opacity-50"
          >
            {addingToCart ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><ShoppingBag size={12} /> Add to Cart</>}
          </button>
          <button 
            onClick={handleBuyNow}
            disabled={product.stock === 0}
            className="flex-1 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition disabled:opacity-50 py-1.5 md:py-2 text-[10px] md:text-xs"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;