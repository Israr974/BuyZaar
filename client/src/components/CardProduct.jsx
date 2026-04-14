import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { validateUrlConverter } from "../utils/validateUrl";
import Axios from "../utils/Axios";
import summaryApi from "../common/summartApi";
import toast from "react-hot-toast";
import { setCartItems } from "../redux/cartSlice";
import { addToWishlist, removeFromWishlist } from "../redux/wishlistSlice";
import { IoIosStar } from "react-icons/io";
import { TiShoppingCart } from "react-icons/ti";
import { Heart, Eye, ShoppingBag, CheckCircle } from "lucide-react";

const CardProduct = ({ product, viewMode = "grid" }) => {
  const url = `/product/${validateUrlConverter(product.name)}-${product._id}`;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartitems = useSelector((state) => state.cart.cartitems);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const cartItem = Array.isArray(cartitems)
    ? cartitems.find((item) => item.productId?._id === product._id)
    : null;
  const quantityInCart = cartItem?.quantity || 0;

  const user = useSelector((state) => state.user);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const inWishlist = wishlistItems.some(
      (item) => item.productId === product._id || item._id === product._id
    );
    setIsWishlisted(inWishlist);
  }, [wishlistItems, product._id]);

  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const hasUserId = !!(parsedUser.id || parsedUser._id || parsedUser.email);
        return hasUserId;
      } catch (error) {
        console.error("Error parsing localStorage user:", error);
        return false;
      }
    }

    const hasReduxUser = !!(user?.id || user?.email);
    return hasReduxUser;
  };

  // Calculate discount percentage safely
  const getDiscountPercent = () => {
    if (!product) return 0;
    
    const discount = product.discount;
    const price = product.price;
    const originalPrice = product.originalPrice;
    
    if (!discount || discount <= 0) return 0;
    
    if (discount <= 100) return discount;
    
    if (originalPrice && originalPrice > price) {
      const percent = Math.round(((originalPrice - price) / originalPrice) * 100);
      return percent > 0 ? percent : 0;
    }
    
    return 0;
  };
  
  const discountPercent = getDiscountPercent();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const isAuth = isAuthenticated();

    if (!isAuth) {
      toast.error("Please login to add items to cart!", {
        duration: 3000,
        style: {
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
          color: '#fff',
          borderRadius: '12px',
        },
      });
      navigate('/login', {
        state: {
          from: window.location.pathname,
          productId: product._id,
          productName: product.name,
          message: "Login required to add items to cart"
        }
      });
      return;
    }

    try {
      const res = await Axios({
        ...summaryApi().addToCart,
        data: {
          productId: product._id,
          quantity: 1,
          priceAtAddTime: product.price
        },
      });

      if (res.data.success) {
        toast.success("Added to cart!", {
          icon: <TiShoppingCart size={18} />,
          duration: 2000,
          style: {
            background: 'linear-gradient(135deg, #10B981, #059669)',
            color: '#fff',
            borderRadius: '12px',
          },
        });

        const cartRes = await Axios({
          ...summaryApi().getCartProducts
        });

        if (cartRes.data.success) {
          dispatch(setCartItems(cartRes.data.data));
        }
      } else {
        toast.error(res.data.message || "Failed to add to cart");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.", {
          duration: 4000,
          style: {
            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            color: '#fff',
            borderRadius: '12px',
          },
        });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');
        navigate('/login', {
          state: {
            from: window.location.pathname,
            message: "Session expired. Please login again."
          }
        });
      } else if (error.response?.status === 403) {
        toast.error("Access denied. Please check your permissions.");
      } else {
        toast.error("Network error! Please check your connection.");
      }
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated()) {
      toast.error("Please login to add to wishlist");
      navigate('/login');
      return;
    }

    if (isProcessing) return;
    setIsProcessing(true);

    try {
      if (isWishlisted) {
        const response = await Axios({
          ...summaryApi().removeFromWishlist,
          data: { productId: product._id },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        
        if (response.data.success) {
          dispatch(removeFromWishlist(product._id));
          setIsWishlisted(false);
          toast.success("Removed from wishlist");
        } else {
          toast.error(response.data.message || "Failed to remove from wishlist");
        }
      } else {
        const response = await Axios({
          ...summaryApi().addToWishlist,
          data: { productId: product._id },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        
        if (response.data.success) {
          dispatch(addToWishlist({ productId: product._id, product: product }));
          setIsWishlisted(true);
          toast.success("Added to wishlist");
        } else {
          if (response.data?.message === "Product already in wishlist") {
            setIsWishlisted(true);
            dispatch(addToWishlist({ productId: product._id, product: product }));
            toast.success("Product already in wishlist");
          } else {
            toast.error(response.data.message || "Failed to add to wishlist");
          }
        }
      }
    } catch (error) {
      console.error("Wishlist error:", error);
      
      if (error.response?.data?.message === "Product already in wishlist") {
        setIsWishlisted(true);
        dispatch(addToWishlist({ productId: product._id, product: product }));
        toast.success("Product already in wishlist");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // List view mode
  if (viewMode === "list") {
    return (
      <div className="block bg-card rounded-xl border border-border hover:shadow-lg transition-all duration-300 group overflow-hidden">
        <Link to={url} className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-48 h-48 flex-shrink-0 overflow-hidden bg-bg-alt">
            <img
              src={product.image?.[0] || "/placeholder.png"}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {discountPercent > 0 && (
              <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                -{discountPercent}%
              </div>
            )}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-bold text-xs bg-red-500 px-2 py-1 rounded-full">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
          
          <div className="flex-1 p-4">
            <h3 className="text-lg font-semibold text-text hover:text-primary transition-colors line-clamp-1">
              {product.name}
            </h3>
            
            {product.rating && (
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <IoIosStar
                      key={i}
                      className={`text-sm ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-text-muted">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-text-muted">({product.reviewCount || 0} reviews)</span>
              </div>
            )}
            
            <p className="text-text-muted text-sm mt-2 line-clamp-2">
              {product.description || "No description available"}
            </p>
            
            <div className="flex items-center gap-2 mt-3">
              <span className="text-2xl font-bold text-primary">
                ₹{product.price?.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-text-muted line-through">
                  ₹{product.originalPrice?.toLocaleString()}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 btn ${product.stock === 0 ? 'bg-gray-300 cursor-not-allowed' : 'btn-primary'} py-2 text-sm flex items-center justify-center gap-2`}
              >
                {quantityInCart > 0 ? (
                  <>
                    <CheckCircle size={16} />
                    In Cart ({quantityInCart})
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    Add to Cart
                  </>
                )}
              </button>
              <button
                onClick={handleWishlist}
                disabled={isProcessing}
                className="p-2 rounded-lg border border-border hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
              >
                <Heart size={18} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
              </button>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // Grid view mode
  return (
    <div className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
      <Link to={url} className="block relative overflow-hidden">
        <div className="relative aspect-square bg-bg-alt">
          <img
            src={product.image?.[0] || "/placeholder.png"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {discountPercent > 0 && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
              -{discountPercent}%
            </div>
          )}
          
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-semibold text-sm bg-red-500/90 px-3 py-1.5 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
          
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-3 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-white text-gray-800 hover:bg-primary hover:text-white rounded-lg py-2 text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {quantityInCart > 0 ? (
                  <>
                    <CheckCircle size={14} />
                    In Cart ({quantityInCart})
                  </>
                ) : (
                  <>
                    <ShoppingBag size={14} />
                    Add to Cart
                  </>
                )}
              </button>
              <button
                onClick={handleWishlist}
                disabled={isProcessing}
                className="w-9 h-9 bg-white rounded-lg hover:bg-red-500 hover:text-white transition-all flex items-center justify-center disabled:opacity-50"
              >
                <Heart size={16} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-3">
          <h3 className="font-semibold text-text text-sm line-clamp-2 min-h-[40px] group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          {product.rating && (
            <div className="flex items-center gap-1 mt-1">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <IoIosStar
                    key={i}
                    className={`text-xs ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-text-muted">({product.reviewCount || 0})</span>
            </div>
          )}
          
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-lg font-bold text-primary">
              ₹{product.price?.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-text-muted line-through">
                ₹{product.originalPrice?.toLocaleString()}
              </span>
            )}
          </div>
          
          {product.stock > 0 && product.stock < 10 && (
            <p className="text-xs text-orange-500 mt-1">Only {product.stock} left!</p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default CardProduct;