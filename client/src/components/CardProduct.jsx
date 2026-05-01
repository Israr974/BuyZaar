// import React, { useEffect, useState, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { validateUrlConverter } from "../utils/validateUrl";
// import Axios from "../utils/Axios";
// import summaryApi from "../common/summartApi";
// import toast from "react-hot-toast";
// import { setCartItems } from "../redux/cartSlice";
// import { addToWishlist, removeFromWishlist } from "../redux/wishlistSlice";
// import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";
// import { TiShoppingCart } from "react-icons/ti";
// import { Heart, ShoppingBag, CheckCircle, Truck, TrendingUp, Zap } from "lucide-react";

// const CardProduct = ({ product, viewMode = "grid" }) => {
//   // Safety check for invalid product
//   if (!product || !product._id) {
//     return (
//       <div className="bg-card rounded-xl border border-border overflow-hidden h-full flex flex-col animate-pulse">
//         <div className="aspect-square bg-bg-alt"></div>
//         <div className="p-3">
//           <div className="h-4 bg-bg-alt rounded w-3/4 mb-2"></div>
//           <div className="h-3 bg-bg-alt rounded w-1/2"></div>
//         </div>
//       </div>
//     );
//   }

//   const url = `/product/${validateUrlConverter(product.name)}-${product._id}`;
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const cartitems = useSelector((state) => state.cart.cartitems);
//   const wishlistItems = useSelector((state) => state.wishlist?.items || []);
//   const cartItem = Array.isArray(cartitems)
//     ? cartitems.find((item) => item.productId?._id === product._id)
//     : null;
//   const quantityInCart = cartItem?.quantity || 0;

//   const user = useSelector((state) => state.user);
//   const [isWishlisted, setIsWishlisted] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [imageLoaded, setImageLoaded] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);
//   const [isBuying, setIsBuying] = useState(false);

//   const hoverTimeoutRef = useRef(null);

//   useEffect(() => {
//     const inWishlist = wishlistItems.some(
//       (item) => item.productId === product._id || item._id === product._id
//     );
//     setIsWishlisted(inWishlist);
//   }, [wishlistItems, product._id]);

//   const handleMouseEnter = () => {
//     if (hoverTimeoutRef.current) {
//       clearTimeout(hoverTimeoutRef.current);
//     }
//     setIsHovered(true);
//   };

//   const handleMouseLeave = () => {
//     hoverTimeoutRef.current = setTimeout(() => {
//       setIsHovered(false);
//     }, 150);
//   };

//   const isAuthenticated = () => {
//     const token = localStorage.getItem('token');
//     const storedUser = localStorage.getItem('user');

//     if (storedUser) {
//       try {
//         const parsedUser = JSON.parse(storedUser);
//         const hasUserId = !!(parsedUser.id || parsedUser._id || parsedUser.email);
//         return hasUserId;
//       } catch (error) {
//         console.error("Error parsing localStorage user:", error);
//         return false;
//       }
//     }

//     const hasReduxUser = !!(user?.id || user?.email);
//     return hasReduxUser;
//   };

//   const getDiscountPercent = () => {
//     if (!product) return 0;
    
//     const discount = product.discount;
//     const price = product.price;
//     const originalPrice = product.originalPrice;
    
//     if (!discount || discount <= 0) return 0;
    
//     if (discount <= 100) return discount;
    
//     if (originalPrice && originalPrice > price) {
//       const percent = Math.round(((originalPrice - price) / originalPrice) * 100);
//       return percent > 0 ? percent : 0;
//     }
    
//     return 0;
//   };
  
//   const discountPercent = getDiscountPercent();

//   const renderStars = (rating) => {
//     if (!rating || rating === 0) return null;
    
//     const stars = [];
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 >= 0.5;
    
//     for (let i = 0; i < fullStars; i++) {
//       stars.push(<IoIosStar key={`full-${i}`} className="text-yellow-400 text-xs" />);
//     }
    
//     if (hasHalfStar) {
//       stars.push(<IoIosStarHalf key="half" className="text-yellow-400 text-xs" />);
//     }
    
//     const remainingStars = 5 - stars.length;
//     for (let i = 0; i < remainingStars; i++) {
//       stars.push(<IoIosStarOutline key={`empty-${i}`} className="text-gray-300 text-xs" />);
//     }
    
//     return stars;
//   };

//   const handleAddToCart = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();

//     const isAuth = isAuthenticated();

//     if (!isAuth) {
//       toast.error("Please login to add items to cart!");
//       navigate('/login', {
//         state: {
//           from: window.location.pathname,
//           productId: product._id,
//           productName: product.name,
//           message: "Login required to add items to cart"
//         }
//       });
//       return;
//     }

//     try {
//       const res = await Axios({
//         ...summaryApi().addToCart,
//         data: {
//           productId: product._id,
//           quantity: 1,
//           priceAtAddTime: product.price
//         },
//       });

//       if (res.data.success) {
//         toast.success("Added to cart!");

//         const cartRes = await Axios({
//           ...summaryApi().getCartProducts
//         });

//         if (cartRes.data.success) {
//           dispatch(setCartItems(cartRes.data.data));
//         }
//       } else {
//         toast.error(res.data.message || "Failed to add to cart");
//       }
//     } catch (error) {
//       if (error.response?.status === 401) {
//         toast.error("Session expired. Please login again.");
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         localStorage.removeItem('refreshToken');
//         navigate('/login');
//       } else {
//         toast.error("Network error! Please check your connection.");
//       }
//     }
//   };

//   const handleBuyNow = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     if (!isAuthenticated()) {
//       toast.error("Please login to continue");
//       navigate('/login');
//       return;
//     }

//     setIsBuying(true);
    
//     try {
//       const res = await Axios({
//         ...summaryApi().addToCart,
//         data: {
//           productId: product._id,
//           quantity: 1,
//           priceAtAddTime: product.price
//         },
//       });

//       if (res.data.success) {
//         const cartRes = await Axios({
//           ...summaryApi().getCartProducts
//         });

//         if (cartRes.data.success) {
//           dispatch(setCartItems(cartRes.data.data));
//         }
        
//         navigate('/checkout', {
//           state: {
//             buyNow: true,
//             productId: product._id,
//             quantity: 1
//           }
//         });
//       } else {
//         toast.error(res.data.message || "Failed to process");
//       }
//     } catch (error) {
//       toast.error("Something went wrong. Please try again.");
//     } finally {
//       setIsBuying(false);
//     }
//   };

//   const handleWishlist = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     if (!isAuthenticated()) {
//       toast.error("Please login to add to wishlist");
//       navigate('/login');
//       return;
//     }

//     if (isProcessing) return;
//     setIsProcessing(true);

//     try {
//       if (isWishlisted) {
//         const response = await Axios({
//           ...summaryApi().removeFromWishlist,
//           data: { productId: product._id },
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         });
        
//         if (response.data.success) {
//           dispatch(removeFromWishlist(product._id));
//           setIsWishlisted(false);
//           toast.success("Removed from wishlist");
//         } else {
//           toast.error(response.data.message || "Failed to remove from wishlist");
//         }
//       } else {
//         const response = await Axios({
//           ...summaryApi().addToWishlist,
//           data: { productId: product._id },
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         });
        
//         if (response.data.success) {
//           dispatch(addToWishlist({ productId: product._id, product: product }));
//           setIsWishlisted(true);
//           toast.success("Added to wishlist");
//         } else {
//           if (response.data?.message === "Product already in wishlist") {
//             setIsWishlisted(true);
//             dispatch(addToWishlist({ productId: product._id, product: product }));
//             toast.success("Product already in wishlist");
//           } else {
//             toast.error(response.data.message || "Failed to add to wishlist");
//           }
//         }
//       }
//     } catch (error) {
//       if (error.response?.data?.message === "Product already in wishlist") {
//         setIsWishlisted(true);
//         dispatch(addToWishlist({ productId: product._id, product: product }));
//         toast.success("Product already in wishlist");
//       } else {
//         toast.error("Something went wrong");
//       }
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // List view mode
//   if (viewMode === "list") {
//     return (
//       <div className="block bg-card rounded-xl border border-border hover:shadow-lg transition-all duration-300 group overflow-hidden">
//         <Link to={url} className="flex flex-col sm:flex-row">
//           <div className="relative w-full sm:w-48 h-48 flex-shrink-0 overflow-hidden bg-bg-alt">
//             {!imageLoaded && (
//               <div className="absolute inset-0 bg-gradient-to-r from-bg-alt to-bg-alt/50 animate-pulse"></div>
//             )}
//             <img
//               src={product.image?.[0] || "/placeholder.png"}
//               alt={product.name}
//               className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
//               onLoad={() => setImageLoaded(true)}
//             />
//             {discountPercent > 0 && (
//               <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
//                 -{discountPercent}%
//               </div>
//             )}
//             {product.stock === 0 && (
//               <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
//                 <span className="text-white font-bold text-xs bg-red-500 px-2 py-1 rounded-full">
//                   Out of Stock
//                 </span>
//               </div>
//             )}
//             {product.stock > 0 && product.stock < 10 && (
//               <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
//                 Only {product.stock} left
//               </div>
//             )}
//           </div>
          
//           <div className="flex-1 p-4">
//             <h3 className="text-base sm:text-lg font-semibold text-text hover:text-primary transition-colors line-clamp-2">
//               {product.name}
//             </h3>
            
//             {product.rating && (
//               <div className="flex items-center gap-2 mt-1">
//                 <div className="flex items-center gap-0.5">
//                   {renderStars(product.rating)}
//                 </div>
//                 <span className="text-sm text-text-muted">{product.rating.toFixed(1)}</span>
//                 <span className="text-xs text-text-muted">({product.reviewCount || 0} reviews)</span>
//               </div>
//             )}
            
//             <p className="text-text-muted text-sm mt-2 line-clamp-2">
//               {product.description || "No description available"}
//             </p>
            
//             <div className="flex flex-wrap items-center gap-3 mt-3">
//               <span className="text-xl sm:text-2xl font-bold gradient-text">
//                 ₹{product.price?.toLocaleString()}
//               </span>
//               {product.originalPrice && product.originalPrice > product.price && (
//                 <span className="text-sm text-text-muted line-through">
//                   ₹{product.originalPrice?.toLocaleString()}
//                 </span>
//               )}
//               <div className="flex items-center gap-1 text-xs text-text-muted">
//                 <Truck size={12} />
//                 <span>Free Delivery</span>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-2 mt-3">
//               <button
//                 onClick={handleAddToCart}
//                 disabled={product.stock === 0}
//                 className={`flex-1 py-2 text-sm rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
//                   product.stock === 0 
//                     ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
//                     : quantityInCart > 0
//                       ? 'bg-green-500 text-white hover:bg-green-600'
//                       : 'btn-primary'
//                 }`}
//               >
//                 {quantityInCart > 0 ? (
//                   <>
//                     <CheckCircle size={16} />
//                     In Cart ({quantityInCart})
//                   </>
//                 ) : (
//                   <>
//                     <ShoppingBag size={16} />
//                     Add to Cart
//                   </>
//                 )}
//               </button>
//               <button
//                 onClick={handleBuyNow}
//                 disabled={product.stock === 0 || isBuying}
//                 className="bg-primary text-white hover:bg-primary-dark py-2 px-4 text-sm rounded-lg font-medium transition-all flex items-center justify-center gap-2"
//               >
//                 {isBuying ? (
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                 ) : (
//                   <>
//                     <Zap size={16} />
//                     Buy Now
//                   </>
//                 )}
//               </button>
//               <button
//                 onClick={handleWishlist}
//                 disabled={isProcessing}
//                 className="p-2 rounded-lg border border-border hover:border-red-500 hover:text-red-500 transition-colors disabled:opacity-50"
//               >
//                 <Heart size={18} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
//               </button>
//             </div>
//           </div>
//         </Link>
//       </div>
//     );
//   }

//   // Grid view mode
//   return (
//     <div 
//       className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col"
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//     >
//       <Link to={url} className="block relative overflow-hidden">
//         <div className="relative aspect-square bg-bg-alt overflow-hidden">
//           {!imageLoaded && (
//             <div className="absolute inset-0 bg-gradient-to-r from-bg-alt to-bg-alt/50 animate-pulse"></div>
//           )}
//           <img
//             src={product.image?.[0] || "/placeholder.png"}
//             alt={product.name}
//             className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
//             onLoad={() => setImageLoaded(true)}
//             loading="lazy"
//           />
          
//           <div className="absolute top-2 left-2 flex flex-col gap-1">
//             {discountPercent > 0 && (
//               <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
//                 {discountPercent}% OFF
//               </span>
//             )}
//             {product.isNew && (
//               <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
//                 New
//               </span>
//             )}
//           </div>
          
//           <div className="absolute top-2 right-2 flex flex-col gap-1">
//             {product.stock > 0 && product.stock < 10 && (
//               <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
//                 Only {product.stock} left
//               </span>
//             )}
//             {product.stock === 0 && (
//               <span className="bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
//                 Out of Stock
//               </span>
//             )}
//           </div>
          
//           <div 
//             className={`absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-all duration-300 ${
//               (isHovered || (typeof window !== 'undefined' && window.innerWidth < 768)) && product.stock !== 0
//                 ? 'opacity-100 translate-y-0'
//                 : 'opacity-0 translate-y-full'
//             }`}
//           >
//             <div className="flex gap-2">
//               <button
//                 onClick={handleAddToCart}
//                 disabled={product.stock === 0}
//                 className={`flex-1 rounded-lg py-2 text-xs font-medium transition-all flex items-center justify-center gap-1 ${
//                   product.stock === 0
//                     ? 'bg-gray-500 text-white cursor-not-allowed'
//                     : quantityInCart > 0
//                       ? 'bg-green-500 text-white hover:bg-green-600'
//                       : 'bg-white text-gray-800 hover:bg-primary hover:text-white'
//                 }`}
//               >
//                 {quantityInCart > 0 ? (
//                   <>
//                     <CheckCircle size={12} />
//                     In Cart
//                   </>
//                 ) : (
//                   <>
//                     <ShoppingBag size={12} />
//                     Cart
//                   </>
//                 )}
//               </button>
//               <button
//                 onClick={handleBuyNow}
//                 disabled={product.stock === 0 || isBuying}
//                 className="flex-1 rounded-lg py-2 text-xs font-medium transition-all flex items-center justify-center gap-1 bg-primary text-white hover:bg-primary-dark"
//               >
//                 {isBuying ? (
//                   <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                 ) : (
//                   <>
//                     <Zap size={12} />
//                     Buy
//                   </>
//                 )}
//               </button>
//               <button
//                 onClick={handleWishlist}
//                 disabled={isProcessing}
//                 className="w-8 h-8 rounded-full bg-white text-gray-800 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center disabled:opacity-50"
//               >
//                 <Heart size={14} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
//               </button>
//             </div>
//           </div>
//         </div>
        
//         <div className="p-3">
//           <h3 className="font-semibold text-text text-sm line-clamp-2 min-h-[40px] group-hover:text-primary transition-colors">
//             {product.name}
//           </h3>
          
//           {product.rating && product.rating > 0 && (
//             <div className="flex items-center gap-1 mt-1">
//               <div className="flex items-center gap-0.5">
//                 {renderStars(product.rating)}
//               </div>
//               <span className="text-[10px] text-text-muted">({product.reviewCount || 0})</span>
//             </div>
//           )}
          
//           <div className="mt-2">
//             <div className="flex items-baseline gap-2 flex-wrap">
//               <span className="text-base font-bold gradient-text">
//                 ₹{product.price?.toLocaleString() || 0}
//               </span>
//               {product.originalPrice && product.originalPrice > product.price && (
//                 <span className="text-[10px] text-text-muted line-through">
//                   ₹{product.originalPrice?.toLocaleString()}
//                 </span>
//               )}
//             </div>
//           </div>
          
//           <div className="flex items-center gap-1 mt-2 text-[10px] text-text-muted">
//             <Truck size={10} />
//             <span>Free Delivery</span>
//             {discountPercent > 0 && (
//               <>
//                 <span className="mx-1">•</span>
//                 <TrendingUp size={10} className="text-accent" />
//                 <span className="text-accent">Best Deal</span>
//               </>
//             )}
//           </div>
//         </div>
//       </Link>
//     </div>
//   );
// };

// export default CardProduct;


import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { validateUrlConverter } from "../utils/validateUrl";
import Axios from "../utils/Axios";
import summaryApi from "../common/summartApi";
import toast from "react-hot-toast";
import { setCartItems } from "../redux/cartSlice";
import { addToWishlist, removeFromWishlist } from "../redux/wishlistSlice";
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";
import { TiShoppingCart } from "react-icons/ti";
import { Heart, ShoppingBag, CheckCircle, Truck, TrendingUp, Zap } from "lucide-react";

const CardProduct = ({ product, viewMode = "grid" }) => {
  if (!product || !product._id) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden h-full flex flex-col animate-pulse">
        <div className="aspect-square bg-gray-100"></div>
        <div className="p-3">
          <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-100 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  const hoverTimeoutRef = useRef(null);

  useEffect(() => {
    const inWishlist = wishlistItems.some(
      (item) => item.productId === product._id || item._id === product._id
    );
    setIsWishlisted(inWishlist);
  }, [wishlistItems, product._id]);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 150);
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const hasUserId = !!(parsedUser.id || parsedUser._id || parsedUser.email);
        return hasUserId;
      } catch {
        return false;
      }
    }

    return !!(user?.id || user?.email);
  };

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

  const renderStars = (rating) => {
    if (!rating || rating === 0) return null;
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<IoIosStar key={`full-${i}`} className="text-yellow-400 text-xs" />);
    }
    
    if (hasHalfStar) {
      stars.push(<IoIosStarHalf key="half" className="text-yellow-400 text-xs" />);
    }
    
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<IoIosStarOutline key={`empty-${i}`} className="text-gray-300 text-xs" />);
    }
    
    return stars;
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated()) {
      toast.error("Please login to add items to cart!");
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
        toast.success("Added to cart!");

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
        toast.error("Session expired. Please login again.");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');
        navigate('/login');
      } else {
        toast.error("Network error! Please check your connection.");
      }
    }
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated()) {
      toast.error("Please login to continue");
      navigate('/login');
      return;
    }

    setIsBuying(true);
    
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
        const cartRes = await Axios({
          ...summaryApi().getCartProducts
        });

        if (cartRes.data.success) {
          dispatch(setCartItems(cartRes.data.data));
        }
        
        navigate('/checkout', {
          state: {
            buyNow: true,
            productId: product._id,
            quantity: 1
          }
        });
      } else {
        toast.error(res.data.message || "Failed to process");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsBuying(false);
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
      if (error.response?.data?.message === "Product already in wishlist") {
        setIsWishlisted(true);
        dispatch(addToWishlist({ productId: product._id, product: product }));
        toast.success("Product already in wishlist");
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
      <div className="block bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 group overflow-hidden">
        <Link to={url} className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-48 h-48 flex-shrink-0 overflow-hidden bg-gray-100">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-50 animate-pulse"></div>
            )}
            <img
              src={product.image?.[0] || "/placeholder.png"}
              alt={product.name}
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
            />
            {discountPercent > 0 && (
              <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
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
            {product.stock > 0 && product.stock < 10 && (
              <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                Only {product.stock} left
              </div>
            )}
          </div>
          
          <div className="flex-1 p-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-2">
              {product.name}
            </h3>
            
            {product.rating && (
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-0.5">
                  {renderStars(product.rating)}
                </div>
                <span className="text-sm text-gray-500">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-gray-400">({product.reviewCount || 0} reviews)</span>
              </div>
            )}
            
            <p className="text-gray-500 text-sm mt-2 line-clamp-2">
              {product.description || "No description available"}
            </p>
            
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                ₹{product.price?.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-400 line-through">
                  ₹{product.originalPrice?.toLocaleString()}
                </span>
              )}
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Truck size={12} />
                <span>Free Delivery</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 py-2 text-sm rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  product.stock === 0 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : quantityInCart > 0
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg'
                }`}
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
                onClick={handleBuyNow}
                disabled={product.stock === 0 || isBuying}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg py-2 px-4 text-sm rounded-lg font-medium transition-all flex items-center justify-center gap-2"
              >
                {isBuying ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Zap size={16} />
                    Buy Now
                  </>
                )}
              </button>
              <button
                onClick={handleWishlist}
                disabled={isProcessing}
                className="p-2 rounded-lg border border-gray-200 hover:border-red-500 hover:text-red-500 transition-colors disabled:opacity-50"
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
    <div 
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={url} className="block relative overflow-hidden">
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-50 animate-pulse"></div>
          )}
          <img
            src={product.image?.[0] || "/placeholder.png"}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
          
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discountPercent > 0 && (
              <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                {discountPercent}% OFF
              </span>
            )}
            {product.isNew && (
              <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                New
              </span>
            )}
          </div>
          
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {product.stock > 0 && product.stock < 10 && (
              <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                Only {product.stock} left
              </span>
            )}
            {product.stock === 0 && (
              <span className="bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                Out of Stock
              </span>
            )}
          </div>
          
          <div 
            className={`absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-all duration-300 ${
              (isHovered || (typeof window !== 'undefined' && window.innerWidth < 768)) && product.stock !== 0
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-full'
            }`}
          >
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 rounded-lg py-2 text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                  product.stock === 0
                    ? 'bg-gray-500 text-white cursor-not-allowed'
                    : quantityInCart > 0
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-white text-gray-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 hover:text-white'
                }`}
              >
                {quantityInCart > 0 ? (
                  <>
                    <CheckCircle size={12} />
                    In Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag size={12} />
                    Cart
                  </>
                )}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0 || isBuying}
                className="flex-1 rounded-lg py-2 text-xs font-medium transition-all flex items-center justify-center gap-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg"
              >
                {isBuying ? (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Zap size={12} />
                    Buy
                  </>
                )}
              </button>
              <button
                onClick={handleWishlist}
                disabled={isProcessing}
                className="w-8 h-8 rounded-full bg-white text-gray-800 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center disabled:opacity-50"
              >
                <Heart size={14} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-3">
          <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 min-h-[40px] group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          
          {product.rating && product.rating > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <div className="flex items-center gap-0.5">
                {renderStars(product.rating)}
              </div>
              <span className="text-[10px] text-gray-400">({product.reviewCount || 0})</span>
            </div>
          )}
          
          <div className="mt-2">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-base font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                ₹{product.price?.toLocaleString() || 0}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[10px] text-gray-400 line-through">
                  ₹{product.originalPrice?.toLocaleString()}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-500">
            <Truck size={10} />
            <span>Free Delivery</span>
            {discountPercent > 0 && (
              <>
                <span className="mx-1">•</span>
                <TrendingUp size={10} className="text-orange-500" />
                <span className="text-orange-500">Best Deal</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CardProduct;