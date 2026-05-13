import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { 
  Heart, ShoppingBag, Trash2, X, 
  ShoppingCart, ArrowRight, AlertCircle,
  Star, StarHalf, Truck, CreditCard, Shield,
  Sparkles, TrendingUp, Clock
} from "lucide-react";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import summaryApi from "../common/summartApi";
import { addToWishlist, removeFromWishlist, clearWishlist, setWishlist } from "../redux/wishlistSlice";
import { addToCart } from "../redux/cartSlice";
import CardProduct from "../components/CardProduct";
import ConfirmBox from "../components/ConfirmBox";
import { calculateDiscountedPrice, formatPrice } from "../utils/priceUtils";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const [loading, setLoading] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [addingToCart, setAddingToCart] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const abortControllerRef = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchWishlist = useCallback(async () => {
    if (!user?.id) return;
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      setIsFetching(true);
      const response = await Axios({
        ...summaryApi().getWishlist,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        signal: abortControllerRef.current.signal,
      });
      
      if (isMounted.current && response.data?.success) {
        dispatch(setWishlist(response.data.data || []));
      }
    } catch (error) {
      if (isMounted.current && error.name !== 'AbortError') {
        console.error("Failed to fetch wishlist", error);
      }
    } finally {
      if (isMounted.current) {
        setIsFetching(false);
      }
    }
  }, [user?.id, dispatch]);

  useEffect(() => {
    if (user?.id) {
      fetchWishlist();
    }
  }, [user?.id, fetchWishlist]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user?.id && isMounted.current) {
        fetchWishlist();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user?.id, fetchWishlist]);

  const handleRemoveItem = async (productId) => {
    if (!productId) return;

    try {
      const response = await Axios({
        ...summaryApi().removeFromWishlist,
        data: { productId },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (isMounted.current && response.data?.success) {
        dispatch(removeFromWishlist(productId));
        toast.success("Item removed from wishlist");
        setItemToRemove(null);
        fetchWishlist();
      } else if (isMounted.current) {
        toast.error(response.data?.message || "Failed to remove item");
      }
    } catch (error) {
      if (isMounted.current) {
        console.error("Remove from wishlist error:", error);
        toast.error("Failed to remove item");
      }
    }
  };

  const handleClearWishlist = async () => {
    try {
      const response = await Axios({
        ...summaryApi().clearWishlist,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (isMounted.current && response.data?.success) {
        dispatch(clearWishlist());
        toast.success("Wishlist cleared successfully");
        setShowClearConfirm(false);
        fetchWishlist();
      } else if (isMounted.current) {
        toast.error(response.data?.message || "Failed to clear wishlist");
      }
    } catch (error) {
      if (isMounted.current) {
        console.error("Clear wishlist error:", error);
        toast.error("Failed to clear wishlist");
      }
    }
  };

  const handleAddToCart = async (product) => {
    if (!user?.id) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    if (!product || product.stock === 0) {
      toast.error("Product is out of stock");
      return;
    }

    const discountedPrice = calculateDiscountedPrice(product.price, product.discount);

    setAddingToCart(product._id);
    try {
      const response = await Axios({
        ...summaryApi().addToCart,
        data: {
          productId: product._id,
          quantity: 1,
          priceAtAddTime: discountedPrice,
        },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (isMounted.current && response.data?.success) {
        dispatch(addToCart({ 
          productId: product, 
          quantity: 1 
        }));
        toast.success("Added to cart!");
      } else if (isMounted.current) {
        toast.error(response.data?.message || "Failed to add to cart");
      }
    } catch (error) {
      if (isMounted.current) {
        console.error("Add to cart error:", error);
        toast.error("Failed to add to cart");
      }
    } finally {
      if (isMounted.current) {
        setAddingToCart(null);
      }
    }
  };

  const handleMoveAllToCart = async () => {
    if (wishlistItems.length === 0) return;
    
    setLoading(true);
    let successCount = 0;
    const failedProducts = [];
    
    for (const item of wishlistItems) {
      const product = item.productId || item;
      const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
      
      if (product.stock === 0) {
        failedProducts.push(product.name);
        continue;
      }
      
      try {
        const response = await Axios({
          ...summaryApi().addToCart,
          data: {
            productId: product._id,
            quantity: 1,
            priceAtAddTime: discountedPrice,
          },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (response.data?.success) {
          dispatch(addToCart({ 
            productId: product, 
            quantity: 1 
          }));
          successCount++;
        } else {
          failedProducts.push(product.name);
        }
      } catch (error) {
        console.error("Add to cart error:", error);
        failedProducts.push(product.name);
      }
    }
    
    if (isMounted.current) {
      if (successCount > 0) {
        toast.success(`${successCount} item(s) added to cart!`);
        if (failedProducts.length > 0) {
          toast.error(`${failedProducts.length} item(s) could not be added (out of stock)`);
        }
        fetchWishlist();
      } else {
        toast.error("No items could be added to cart");
      }
      setLoading(false);
    }
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const numRating = rating || 0;
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars && i < 5; i++) {
      stars.push(<Star key={`star-${i}`} size={14} className="fill-yellow-400 text-yellow-400" />);
    }
    if (hasHalfStar && stars.length < 5) {
      stars.push(<StarHalf key="half" size={14} className="fill-yellow-400 text-yellow-400" />);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={14} className="text-gray-300" />);
    }
    return stars;
  };

  if (!user?.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-orange-100 flex items-center justify-center mb-6">
            <Heart className="w-12 h-12 text-blue-600" aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Your Wishlist Awaits
          </h2>
          <p className="text-gray-500 mb-6">
            Login to view and manage your wishlist items
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-3 rounded-lg"
          >
            Login to Continue
          </button>
        </div>
      </div>
    );
  }

  if ((isFetching || loading) && wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Loading your wishlist...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0 && !isFetching) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Heart className="w-12 h-12 text-gray-400" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Your Wishlist is Empty
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Start adding items you love to your wishlist. They'll appear here for easy access.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-3 rounded-lg"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-blue-600 to-orange-500" aria-hidden="true"></div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              My Wishlist
            </h1>
          </div>
          <p className="text-gray-500 ml-4">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-blue-600" aria-hidden="true" />
            <span className="text-gray-800 font-medium">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'} in Wishlist
            </span>
          </div>
          <div className="flex gap-3">
            {wishlistItems.length > 1 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="border-2 border-gray-300 text-gray-700 flex items-center gap-2 px-4 py-2 rounded-lg hover:border-red-600 hover:text-red-600 transition"
              >
                <Trash2 size={16} />
                Clear All
              </button>
            )}
            <button
              onClick={handleMoveAllToCart}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center gap-2 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={16} />
              Move All to Cart
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => {
            const product = item.productId || item;
            const isAdding = addingToCart === product._id;
            const discountPercent = product.discount || 0;
            const originalPrice = product.price || 0;
            const discountedPrice = calculateDiscountedPrice(originalPrice, discountPercent);
            const hasDiscount = discountPercent > 0;
            
            return (
              <div
                key={product._id}
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <Link to={`/product/${product._id}`} className="block relative overflow-hidden aspect-square">
                  <img
                    src={product.image?.[0] || product.image || "/placeholder.png"}
                    alt={product.name || "Product"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = "/placeholder.png";
                    }}
                  />
                  {hasDiscount && (
                    <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{discountPercent}%
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setItemToRemove(product._id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-red-50 text-gray-500 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </Link>

                <div className="p-4">
                  <Link to={`/product/${product._id}`}>
                    <h3 className="font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-2 min-h-[48px]">
                      {product.name || "Unnamed Product"}
                    </h3>
                  </Link>

                  {product.rating > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      <div className="flex items-center gap-0.5">
                        {getRatingStars(product.rating)}
                      </div>
                      <span className="text-xs text-gray-500 ml-1">
                        ({product.reviews?.length || 0})
                      </span>
                    </div>
                  )}

                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                      {formatPrice(discountedPrice)}
                    </span>
                    {hasDiscount && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(originalPrice)}
                      </span>
                    )}
                  </div>

                  <div className="mt-2">
                    {(product.stock || 0) > 0 ? (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <Shield size={12} />
                        In Stock
                      </span>
                    ) : (
                      <span className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle size={12} />
                        Out of Stock
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={isAdding || (product.stock || 0) === 0}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-lg"
                    >
                      {isAdding ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <ShoppingCart size={14} />
                          Add to Cart
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => navigate(`/product/${product._id}`)}
                      className="px-3 py-2 rounded-lg border border-gray-200 hover:border-blue-600 hover:text-blue-600 transition-colors"
                      aria-label="View details"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-100 border border-gray-200">
            <Truck className="w-8 h-8 text-blue-600" aria-hidden="true" />
            <div>
              <p className="font-semibold text-gray-800">Free Shipping</p>
              <p className="text-xs text-gray-500">On orders over ₹999</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-100 border border-gray-200">
            <CreditCard className="w-8 h-8 text-blue-600" aria-hidden="true" />
            <div>
              <p className="font-semibold text-gray-800">Secure Payment</p>
              <p className="text-xs text-gray-500">100% secure transactions</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-100 border border-gray-200">
            <Shield className="w-8 h-8 text-blue-600" aria-hidden="true" />
            <div>
              <p className="font-semibold text-gray-800">Easy Returns</p>
              <p className="text-xs text-gray-500">30 days return policy</p>
            </div>
          </div>
        </div>
      </div>

      {itemToRemove && (
        <ConfirmBox
          isOpen={!!itemToRemove}
          title="Remove Item"
          message="Are you sure you want to remove this item from your wishlist?"
          confirmText="Remove"
          cancelText="Cancel"
          confirmColor="red"
          onClose={() => setItemToRemove(null)}
          onCancel={() => setItemToRemove(null)}
          onConfirm={() => handleRemoveItem(itemToRemove)}
        />
      )}

      {showClearConfirm && (
        <ConfirmBox
          isOpen={showClearConfirm}
          title="Clear Wishlist"
          message={`Are you sure you want to remove all ${wishlistItems.length} items from your wishlist? This action cannot be undone.`}
          confirmText="Clear All"
          cancelText="Cancel"
          confirmColor="red"
          onClose={() => setShowClearConfirm(false)}
          onCancel={() => setShowClearConfirm(false)}
          onConfirm={handleClearWishlist}
        />
      )}
    </div>
  );
};

export default Wishlist;