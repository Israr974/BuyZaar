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

  // Cleanup on unmount
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Fetch wishlist function
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

  // Fetch wishlist on component mount and when user changes
  useEffect(() => {
    if (user?.id) {
      fetchWishlist();
    }
  }, [user?.id, fetchWishlist]);

  // Refresh when page becomes visible
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

    setAddingToCart(product._id);
    try {
      const response = await Axios({
        ...summaryApi().addToCart,
        data: {
          productId: product._id,
          quantity: 1,
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
      stars.push(<Star key={`star-${i}`} size={14} className="fill-accent text-accent" />);
    }
    if (hasHalfStar && stars.length < 5) {
      stars.push(<StarHalf key="half" size={14} className="fill-accent text-accent" />);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={14} className="text-border" />);
    }
    return stars;
  };

  // Fix: Import name was Wishlistt but export is Wishlist
  // Make sure your export matches the import

  if (!user?.id) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4 fade-in">
        <div className="max-w-md text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-6">
            <Heart className="w-12 h-12 text-primary" aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-display font-bold text-text mb-3">
            Your Wishlist Awaits
          </h2>
          <p className="text-text-muted mb-6">
            Login to view and manage your wishlist items
          </p>
          <button
            onClick={() => navigate("/login")}
            className="btn-primary px-8 py-3 rounded-lg"
          >
            Login to Continue
          </button>
        </div>
      </div>
    );
  }

  if ((isFetching || loading) && wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-bg p-6 fade-in">
        <div className="container-narrow">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-text-muted">Loading your wishlist...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0 && !isFetching) {
    return (
      <div className="min-h-screen bg-bg p-6 fade-in">
        <div className="container-narrow">
          <div className="bg-card rounded-2xl border border-border p-12 text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-bg-alt flex items-center justify-center mb-6">
              <Heart className="w-12 h-12 text-text-muted" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-display font-bold text-text mb-3">
              Your Wishlist is Empty
            </h2>
            <p className="text-text-muted mb-8 max-w-md mx-auto">
              Start adding items you love to your wishlist. They'll appear here for easy access.
            </p>
            <button
              onClick={() => navigate("/")}
              className="btn-primary px-8 py-3 rounded-lg"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 fade-in">
      <div className="container-narrow">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-primary to-accent" aria-hidden="true"></div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-text">
              My Wishlist
            </h1>
          </div>
          <p className="text-text-muted ml-4">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-card rounded-xl border border-border">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" aria-hidden="true" />
            <span className="text-text font-medium">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'} in Wishlist
            </span>
          </div>
          <div className="flex gap-3">
            {wishlistItems.length > 1 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="btn-outline flex items-center gap-2 px-4 py-2 rounded-lg"
              >
                <Trash2 size={16} />
                Clear All
              </button>
            )}
            <button
              onClick={handleMoveAllToCart}
              disabled={loading}
              className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={16} />
              Move All to Cart
            </button>
          </div>
        </div>

        {/* Wishlist Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => {
            const product = item.productId || item;
            const isAdding = addingToCart === product._id;
            
            return (
              <div
                key={product._id}
                className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Product Image */}
                <Link to={`/product/${product._id}`} className="block relative overflow-hidden aspect-square">
                  <img
                    src={product.image?.[0] || product.image || "/placeholder.png"}
                    alt={product.name || "Product"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = "/placeholder.png";
                    }}
                  />
                  {product.discount > 0 && (
                    <span className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{product.discount}%
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setItemToRemove(product._id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-red-50 text-text-muted hover:text-red-600 transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </Link>

                {/* Product Info */}
                <div className="p-4">
                  <Link to={`/product/${product._id}`}>
                    <h3 className="font-semibold text-text hover:text-primary transition-colors line-clamp-2 min-h-[48px]">
                      {product.name || "Unnamed Product"}
                    </h3>
                  </Link>

                  {/* Rating */}
                  {product.rating > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      <div className="flex items-center gap-0.5">
                        {getRatingStars(product.rating)}
                      </div>
                      <span className="text-xs text-text-muted ml-1">
                        ({product.reviews?.length || 0})
                      </span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span className="text-xl font-bold gradient-text">
                      ₹{(product.price || 0).toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice && product.originalPrice > (product.price || 0) && (
                      <span className="text-sm text-text-muted line-through">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="mt-2">
                    {(product.stock || 0) > 0 ? (
                      <span className="text-xs text-success flex items-center gap-1">
                        <Shield size={12} />
                        In Stock
                      </span>
                    ) : (
                      <span className="text-xs text-error flex items-center gap-1">
                        <AlertCircle size={12} />
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={isAdding || (product.stock || 0) === 0}
                      className="flex-1 btn-primary py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-lg"
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
                      className="px-3 py-2 rounded-lg border border-border hover:border-primary hover:text-primary transition-colors"
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

        {/* Benefits Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-bg-alt border border-border">
            <Truck className="w-8 h-8 text-primary" aria-hidden="true" />
            <div>
              <p className="font-semibold text-text">Free Shipping</p>
              <p className="text-xs text-text-muted">On orders over ₹999</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-bg-alt border border-border">
            <CreditCard className="w-8 h-8 text-primary" aria-hidden="true" />
            <div>
              <p className="font-semibold text-text">Secure Payment</p>
              <p className="text-xs text-text-muted">100% secure transactions</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-bg-alt border border-border">
            <Shield className="w-8 h-8 text-primary" aria-hidden="true" />
            <div>
              <p className="font-semibold text-text">Easy Returns</p>
              <p className="text-xs text-text-muted">30 days return policy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Remove Item Confirmation */}
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

      {/* Clear All Confirmation */}
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