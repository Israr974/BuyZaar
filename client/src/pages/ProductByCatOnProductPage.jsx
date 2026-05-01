// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import Axios from "../utils/Axios";
// import summaryApi from "../common/summartApi";
// import toast from "react-hot-toast";
// import {
//   FaStar,
//   FaRegStar,
//   FaShoppingCart,
//   FaHeart,
//   FaEye,
//   FaTruck,
//   FaCheck,
//   FaArrowRight
// } from "react-icons/fa";
// import { Filter } from "lucide-react";

// const ProductByCatOnProductPage = ({ categoryId }) => {
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [category, setCategory] = useState(null);
//   const [categoryName, setCategoryName] = useState("");
//   const [wishlistedProducts, setWishlistedProducts] = useState(new Set());
//   const [sortBy, setSortBy] = useState("recommended");
//   const [priceRange, setPriceRange] = useState([0, 100000]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [showFilters, setShowFilters] = useState(false);
//   const [maxPrice, setMaxPrice] = useState(100000);

//   const user = useSelector((state) => state.user);
//   const cartitems = useSelector((state) => state.cart.cartitems);

//   // Fetch category name
//   const fetchCategoryName = async () => {
//     if (!categoryId) return;
    
//     try {
//       const res = await Axios({
//         ...summaryApi().getAllCategory,
//         method: 'GET'
//       });
      
//       if (res.data?.success) {
//         const foundCategory = res.data.data.find(cat => cat._id === categoryId);
//         if (foundCategory) {
//           setCategoryName(foundCategory.name);
//           setCategory(foundCategory);
//         }
//       }
//     } catch (error) {
//       console.error("Failed to fetch category name:", error);
//     }
//   };

//   const fetchProductsByCategory = async () => {
//     if (!categoryId) {
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await Axios({
//         ...summaryApi().getProductByCategory,
//         data: { id: categoryId },
//       });

//       if (res.data.success) {
//         setProducts(res.data.data || []);
//         setFilteredProducts(res.data.data || []);
        
//         const prices = (res.data.data || []).map(p => p.price);
//         const maxProductPrice = Math.max(...prices, 0);
//         setMaxPrice(maxProductPrice);
//         setPriceRange([0, maxProductPrice]);
//       }
//     } catch (err) {
//       console.error("Fetch error:", err);
//       toast.error("Failed to load products");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (categoryId) {
//       fetchCategoryName();
//       fetchProductsByCategory();
//     }
//   }, [categoryId]);

//   const checkInCart = (productId) => {
//     return cartitems.some(item => item.productId?._id === productId);
//   };

//   const handleQuickAddToCart = async (product) => {
//     if (!user?.id) {
//       toast.error("Please login to add items to cart");
//       navigate("/login");
//       return;
//     }

//     if (product.stock === 0) {
//       toast.error("Product is out of stock");
//       return;
//     }

//     try {
//       const response = await Axios({
//         ...summaryApi().addToCart,
//         data: {
//           productId: product._id,
//           quantity: 1,
//           priceAtAddTime: product.price,
//         },
//       });

//       if (response.data.success) {
//         toast.success("Added to cart!");
//       }
//     } catch (error) {
//       console.error("Add to cart error:", error);
//       toast.error("Failed to add to cart");
//     }
//   };

//   const toggleWishlist = (productId) => {
//     if (!user?.id) {
//       toast.error("Please login to add to wishlist");
//       navigate("/login");
//       return;
//     }
    
//     const newWishlisted = new Set(wishlistedProducts);
//     if (newWishlisted.has(productId)) {
//       newWishlisted.delete(productId);
//       toast.success("Removed from wishlist");
//     } else {
//       newWishlisted.add(productId);
//       toast.success("Added to wishlist");
//     }
//     setWishlistedProducts(newWishlisted);
//   };

//   const handleProductClick = (product) => {
//     const slug = `${product.name.toLowerCase().replace(/\s+/g, "-")}-${product._id}`;
//     navigate(`/product/${slug}`);
//   };

//   const handleViewAll = () => {
//     if (categoryId) {
//       // Use categoryName from state or fallback to "category"
//       const name = categoryName || "category";
//       const slug = `${name.toLowerCase().replace(/\s+/g, "-")}-${categoryId}`;
//       navigate(`/${slug}/all-all`);
//     } else {
//       toast.error("Category not found");
//     }
//   };

//   const renderStars = (rating) => {
//     const stars = [];
//     const fullStars = Math.floor(rating || 0);
    
//     for (let i = 0; i < fullStars; i++) {
//       stars.push(<FaStar key={i} className="text-accent text-xs" />);
//     }
    
//     for (let i = fullStars; i < 5; i++) {
//       stars.push(<FaRegStar key={i} className="text-border text-xs" />);
//     }
    
//     return stars;
//   };

//   const applyFilters = () => {
//     let result = [...products];

//     result = result.filter(
//       (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
//     );

//     switch (sortBy) {
//       case "price-low":
//         result.sort((a, b) => a.price - b.price);
//         break;
//       case "price-high":
//         result.sort((a, b) => b.price - a.price);
//         break;
//       case "discount":
//         result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
//         break;
//       case "rating":
//         result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
//         break;
//       case "newest":
//         result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
//         break;
//       default:
//         result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
//     }

//     setFilteredProducts(result);
//   };

//   useEffect(() => {
//     applyFilters();
//   }, [sortBy, priceRange, products]);

//   const resetFilters = () => {
//     setSortBy("recommended");
//     setPriceRange([0, maxPrice]);
//     setShowFilters(false);
//   };

//   if (loading) {
//     return (
//       <div className="py-6 md:py-8 px-4 md:px-0">
//         <div className="flex items-center gap-3 mb-6">
//           <div className="w-1 h-6 rounded-full bg-gradient-to-b from-primary to-accent"></div>
//           <h2 className="text-lg md:text-xl font-display font-bold text-text">
//             You May Also Like
//           </h2>
//         </div>
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
//           {[...Array(6)].map((_, index) => (
//             <div key={index} className="bg-card rounded-xl border border-border animate-pulse">
//               <div className="aspect-square bg-bg-alt rounded-t-xl"></div>
//               <div className="p-3 space-y-2">
//                 <div className="h-3 bg-bg-alt rounded w-3/4"></div>
//                 <div className="h-4 bg-bg-alt rounded w-1/2"></div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (products.length === 0) {
//     return null;
//   }

//   return (
//     <div className="py-6 md:py-8 px-4 md:px-0 fade-in">
//       {/* Header Section */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
//         <div className="flex items-center gap-3">
//           <div className="w-1 h-6 md:h-8 rounded-full bg-gradient-to-b from-primary to-accent"></div>
//           <div>
//             <h2 className="text-xl md:text-2xl font-display font-bold text-text">
//               {categoryName ? `More from ${categoryName}` : "You May Also Like"}
//             </h2>
//             <p className="text-xs text-text-muted mt-0.5">
//               {filteredProducts.length} products available
//             </p>
//           </div>
//         </div>

//         {/* Sort Dropdown */}
//         <div className="flex items-center gap-3">
//           <select
//             value={sortBy}
//             onChange={(e) => setSortBy(e.target.value)}
//             className="input py-2 pl-4 pr-8 text-sm cursor-pointer bg-card border-border rounded-lg focus:border-primary focus:outline-none"
//           >
//             <option value="recommended">Recommended</option>
//             <option value="price-low">Price: Low to High</option>
//             <option value="price-high">Price: High to Low</option>
//             <option value="discount">Best Discount</option>
//             <option value="rating">Top Rated</option>
//             <option value="newest">Newest First</option>
//           </select>

//           {/* Filter Toggle Button (Mobile) */}
//           <button
//             onClick={() => setShowFilters(!showFilters)}
//             className="md:hidden flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-alt text-text-muted hover:text-primary transition-colors"
//           >
//             <Filter size={16} />
//             Filter
//           </button>
//         </div>
//       </div>

//       {/* Filter Section */}
//       {(showFilters || window.innerWidth >= 768) && (
//         <div className="mb-6 p-4 bg-bg-alt rounded-xl border border-border">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-2">
//               <Filter size={16} className="text-primary" />
//               <h3 className="font-semibold text-text">Filter by Price</h3>
//             </div>
//             {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
//               <button
//                 onClick={resetFilters}
//                 className="text-xs text-primary hover:underline"
//               >
//                 Reset
//               </button>
//             )}
//           </div>
          
//           <div className="space-y-3">
//             <div className="flex justify-between text-sm">
//               <span className="text-text-muted">₹{priceRange[0].toLocaleString()}</span>
//               <span className="text-text-muted">₹{priceRange[1].toLocaleString()}</span>
//             </div>
//             <input
//               type="range"
//               min="0"
//               max={maxPrice}
//               value={priceRange[1]}
//               onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
//               className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
//             />
//           </div>
          
//           <div className="mt-3 flex justify-between text-xs text-text-muted">
//             <span>0</span>
//             <span>₹{maxPrice.toLocaleString()}</span>
//           </div>
//         </div>
//       )}

//       {/* Products Grid */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
//         {filteredProducts.slice(0, 12).map((product) => {
//           const isInCart = checkInCart(product._id);
//           const isWishlisted = wishlistedProducts.has(product._id);
//           const isOutOfStock = product.stock === 0;
//           const discountPercent = product.discount > 0 
//             ? Math.round(product.discount) 
//             : 0;

//           return (
//             <div
//               key={product._id}
//               className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
//             >
//               {/* Product Image */}
//               <div className="relative aspect-square overflow-hidden bg-bg-alt cursor-pointer">
//                 <img
//                   src={product.image?.[0] || "/placeholder.png"}
//                   alt={product.name}
//                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                   onClick={() => handleProductClick(product)}
//                   loading="lazy"
//                 />

//                 {/* Badges */}
//                 <div className="absolute top-2 left-2 flex flex-col gap-1">
//                   {discountPercent > 0 && (
//                     <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
//                       -{discountPercent}%
//                     </span>
//                   )}
//                   {product.stock > 0 && product.stock < 10 && (
//                     <span className="bg-warning text-white text-xs font-bold px-2 py-0.5 rounded-full">
//                       Only {product.stock} left
//                     </span>
//                   )}
//                   {isOutOfStock && (
//                     <span className="bg-gray-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
//                       Out of Stock
//                     </span>
//                   )}
//                 </div>

//                 {/* Quick Actions */}
//                 <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                   <button
//                     onClick={() => toggleWishlist(product._id)}
//                     className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all ${
//                       isWishlisted
//                         ? "bg-error text-white"
//                         : "bg-white text-text-muted hover:bg-error hover:text-white"
//                     }`}
//                   >
//                     <FaHeart size={12} className={isWishlisted ? "fill-current" : ""} />
//                   </button>
//                   <button
//                     onClick={() => handleProductClick(product)}
//                     className="w-7 h-7 rounded-full bg-white text-text-muted flex items-center justify-center shadow-md hover:bg-primary hover:text-white transition-all"
//                   >
//                     <FaEye size={12} />
//                   </button>
//                 </div>

//                 {/* Quick Add to Cart Overlay */}
//                 {!isOutOfStock && (
//                   <button
//                     onClick={() => handleQuickAddToCart(product)}
//                     className={`absolute bottom-0 left-0 right-0 py-2 text-xs font-medium transition-all duration-300 transform translate-y-full group-hover:translate-y-0 ${
//                       isInCart
//                         ? "bg-success text-white"
//                         : "bg-gradient-primary text-white"
//                     }`}
//                   >
//                     {isInCart ? (
//                       <span className="flex items-center justify-center gap-1">
//                         <FaCheck size={10} />
//                         In Cart
//                       </span>
//                     ) : (
//                       <span className="flex items-center justify-center gap-1">
//                         <FaShoppingCart size={10} />
//                         Quick Add
//                       </span>
//                     )}
//                   </button>
//                 )}
//               </div>

//               {/* Product Info */}
//               <div className="p-3">
//                 <h4
//                   className="text-xs md:text-sm font-semibold text-text line-clamp-2 min-h-[32px] md:min-h-[40px] cursor-pointer hover:text-primary transition-colors"
//                   onClick={() => handleProductClick(product)}
//                 >
//                   {product.name}
//                 </h4>

//                 {/* Rating */}
//                 <div className="flex items-center gap-1 mt-1">
//                   <div className="flex items-center gap-0.5">
//                     {renderStars(product.rating || 4)}
//                   </div>
//                   <span className="text-[10px] md:text-xs text-text-muted">
//                     ({product.reviewCount || 0})
//                   </span>
//                 </div>

//                 {/* Price */}
//                 <div className="mt-2">
//                   <div className="flex items-baseline gap-2 flex-wrap">
//                     <span className="text-sm md:text-lg font-bold gradient-text">
//                       ₹{product.price?.toLocaleString()}
//                     </span>
//                     {product.originalPrice && product.originalPrice > product.price && (
//                       <span className="text-[10px] md:text-xs text-text-muted line-through">
//                         ₹{product.originalPrice?.toLocaleString()}
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 {/* Free Delivery Badge */}
//                 <div className="flex items-center gap-1 mt-2 text-[10px] md:text-xs text-text-muted">
//                   <FaTruck size={10} />
//                   <span>Free Delivery</span>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* View More Button */}
//       {filteredProducts.length > 12 && (
//         <div className="text-center mt-8">
//           <button
//             onClick={handleViewAll}
//             className="btn btn-outline px-4 md:px-6 py-2 rounded-lg flex items-center gap-2 mx-auto text-sm md:text-base"
//           >
//             View All {filteredProducts.length} Products
//             <FaArrowRight size={12} />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductByCatOnProductPage;


import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Axios from "../utils/Axios";
import summaryApi from "../common/summartApi";
import toast from "react-hot-toast";
import {
  FaStar,
  FaRegStar,
  FaShoppingCart,
  FaHeart,
  FaEye,
  FaTruck,
  FaCheck,
  FaArrowRight
} from "react-icons/fa";
import { Filter, X } from "lucide-react";

const ProductByCatOnProductPage = ({ categoryId }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const [wishlistedProducts, setWishlistedProducts] = useState(new Set());
  const [sortBy, setSortBy] = useState("recommended");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [isMobile, setIsMobile] = useState(false);

  const user = useSelector((state) => state.user);
  const cartitems = useSelector((state) => state.cart.cartitems);
  
  // Ref to prevent memory leaks
  const abortControllerRef = useRef(null);

  // Check mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch category name
  const fetchCategoryName = useCallback(async () => {
    if (!categoryId) return;
    
    try {
      const res = await Axios({
        ...summaryApi().getAllCategory,
        method: 'GET'
      });
      
      if (res.data?.success && Array.isArray(res.data.data)) {
        const foundCategory = res.data.data.find(cat => cat._id === categoryId);
        if (foundCategory) {
          setCategoryName(foundCategory.name);
        }
      }
    } catch (error) {
      console.error("Failed to fetch category name:", error);
    }
  }, [categoryId]);

  const fetchProductsByCategory = useCallback(async () => {
    if (!categoryId) {
      setLoading(false);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();

    setLoading(true);
    try {
      const res = await Axios({
        ...summaryApi().getProductByCategory,
        data: { id: categoryId },
        signal: abortControllerRef.current.signal,
      });

      if (res.data?.success && Array.isArray(res.data.data)) {
        const validProducts = res.data.data.filter(p => p && p._id);
        setProducts(validProducts);
        setFilteredProducts(validProducts);
        
        const prices = validProducts.map(p => p.price || 0);
        const maxProductPrice = prices.length > 0 ? Math.max(...prices) : 0;
        setMaxPrice(maxProductPrice);
        setPriceRange([0, maxProductPrice]);
      } else {
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (err) {
      if (err.name !== 'AbortError' && err.code !== 'ERR_CANCELED') {
        console.error("Fetch error:", err);
        toast.error("Failed to load products");
      }
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    if (categoryId) {
      fetchCategoryName();
      fetchProductsByCategory();
    }
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [categoryId, fetchCategoryName, fetchProductsByCategory]);

  const checkInCart = useCallback((productId) => {
    if (!productId) return false;
    return cartitems.some(item => item.productId?._id === productId);
  }, [cartitems]);

  const handleQuickAddToCart = useCallback(async (product) => {
    if (!product?._id) {
      toast.error("Invalid product");
      return;
    }

    if (!user?.id) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    if (product.stock === 0) {
      toast.error("Product is out of stock");
      return;
    }

    try {
      const response = await Axios({
        ...summaryApi().addToCart,
        data: {
          productId: product._id,
          quantity: 1,
          priceAtAddTime: product.price,
        },
      });

      if (response.data?.success) {
        toast.success("Added to cart!");
      } else {
        toast.error(response.data?.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  }, [user?.id, navigate]);

  const toggleWishlist = useCallback((productId) => {
    if (!user?.id) {
      toast.error("Please login to add to wishlist");
      navigate("/login");
      return;
    }
    
    setWishlistedProducts(prev => {
      const newWishlisted = new Set(prev);
      if (newWishlisted.has(productId)) {
        newWishlisted.delete(productId);
        toast.success("Removed from wishlist");
      } else {
        newWishlisted.add(productId);
        toast.success("Added to wishlist");
      }
      return newWishlisted;
    });
  }, [user?.id, navigate]);

  const handleProductClick = useCallback((product) => {
    if (!product?._id) return;
    const slug = `${product.name.toLowerCase().replace(/\s+/g, "-")}-${product._id}`;
    navigate(`/product/${slug}`);
  }, [navigate]);

  const handleViewAll = useCallback(() => {
    if (!categoryId) {
      toast.error("Category not found");
      return;
    }
    const name = categoryName || "category";
    const slug = `${name.toLowerCase().replace(/\s+/g, "-")}-${categoryId}`;
    navigate(`/${slug}/all-all`);
  }, [categoryId, categoryName, navigate]);

  const renderStars = useCallback((rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const validFullStars = Math.min(Math.max(fullStars, 0), 5);
    
    for (let i = 0; i < validFullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} className="text-accent text-xs" />);
    }
    
    for (let i = validFullStars; i < 5; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-border text-xs" />);
    }
    
    return stars;
  }, []);

  const applyFilters = useCallback(() => {
    let result = [...products];

    // Price filter
    result = result.filter(
      (product) => (product.price || 0) >= priceRange[0] && (product.price || 0) <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "discount":
        result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        result.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        break;
      default:
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setFilteredProducts(result);
  }, [products, sortBy, priceRange]);

  useEffect(() => {
    if (products.length > 0) {
      applyFilters();
    }
  }, [applyFilters, products.length]);

  const resetFilters = useCallback(() => {
    setSortBy("recommended");
    setPriceRange([0, maxPrice]);
    setShowFilters(false);
  }, [maxPrice]);

  // Memoized product card component to prevent unnecessary re-renders
  const ProductCard = useMemo(() => {
    return ({ product }) => {
      const isInCart = checkInCart(product._id);
      const isWishlisted = wishlistedProducts.has(product._id);
      const isOutOfStock = product.stock === 0;
      const discountPercent = product.discount > 0 
        ? Math.round(product.discount) 
        : 0;

      return (
        <div
          className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
        >
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden bg-bg-alt cursor-pointer">
            <img
              src={product.image?.[0] || "/placeholder.png"}
              alt={product.name || "Product"}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onClick={() => handleProductClick(product)}
              loading="lazy"
              onError={(e) => {
                e.target.src = "/placeholder.png";
              }}
            />

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {discountPercent > 0 && (
                <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  -{discountPercent}%
                </span>
              )}
              {product.stock > 0 && product.stock < 10 && (
                <span className="bg-warning text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  Only {product.stock} left
                </span>
              )}
              {isOutOfStock && (
                <span className="bg-gray-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Quick Actions */}
            <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={() => toggleWishlist(product._id)}
                className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all ${
                  isWishlisted
                    ? "bg-error text-white"
                    : "bg-white text-text-muted hover:bg-error hover:text-white"
                }`}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <FaHeart size={12} className={isWishlisted ? "fill-current" : ""} />
              </button>
              <button
                onClick={() => handleProductClick(product)}
                className="w-7 h-7 rounded-full bg-white text-text-muted flex items-center justify-center shadow-md hover:bg-primary hover:text-white transition-all"
                aria-label="View product"
              >
                <FaEye size={12} />
              </button>
            </div>

            {/* Quick Add to Cart Overlay */}
            {!isOutOfStock && (
              <button
                onClick={() => handleQuickAddToCart(product)}
                className={`absolute bottom-0 left-0 right-0 py-2 text-xs font-medium transition-all duration-300 transform translate-y-full group-hover:translate-y-0 ${
                  isInCart
                    ? "bg-success text-white"
                    : "bg-gradient-primary text-white"
                }`}
                aria-label={isInCart ? "Item in cart" : "Quick add to cart"}
              >
                {isInCart ? (
                  <span className="flex items-center justify-center gap-1">
                    <FaCheck size={10} />
                    In Cart
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1">
                    <FaShoppingCart size={10} />
                    Quick Add
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Product Info */}
          <div className="p-3">
            <h4
              className="text-xs md:text-sm font-semibold text-text line-clamp-2 min-h-[32px] md:min-h-[40px] cursor-pointer hover:text-primary transition-colors"
              onClick={() => handleProductClick(product)}
            >
              {product.name || "Unnamed Product"}
            </h4>

            {/* Rating */}
            <div className="flex items-center gap-1 mt-1">
              <div className="flex items-center gap-0.5">
                {renderStars(product.rating || 0)}
              </div>
              <span className="text-[10px] md:text-xs text-text-muted">
                ({product.reviewCount || 0})
              </span>
            </div>

            {/* Price */}
            <div className="mt-2">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-sm md:text-lg font-bold gradient-text">
                  ₹{(product.price || 0).toLocaleString()}
                </span>
                {product.originalPrice && product.originalPrice > (product.price || 0) && (
                  <span className="text-[10px] md:text-xs text-text-muted line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Free Delivery Badge */}
            <div className="flex items-center gap-1 mt-2 text-[10px] md:text-xs text-text-muted">
              <FaTruck size={10} />
              <span>Free Delivery</span>
            </div>
          </div>
        </div>
      );
    };
  }, [checkInCart, wishlistedProducts, handleProductClick, toggleWishlist, handleQuickAddToCart, renderStars]);

  if (loading) {
    return (
      <div className="py-6 md:py-8 px-4 md:px-0">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-primary to-accent"></div>
          <h2 className="text-lg md:text-xl font-display font-bold text-text">
            You May Also Like
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={`skeleton-${index}`} className="bg-card rounded-xl border border-border animate-pulse">
              <div className="aspect-square bg-bg-alt rounded-t-xl"></div>
              <div className="p-3 space-y-2">
                <div className="h-3 bg-bg-alt rounded w-3/4"></div>
                <div className="h-4 bg-bg-alt rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="py-6 md:py-8 px-4 md:px-0 fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 md:h-8 rounded-full bg-gradient-to-b from-primary to-accent" aria-hidden="true"></div>
          <div>
            <h2 className="text-xl md:text-2xl font-display font-bold text-text">
              {categoryName ? `More from ${categoryName}` : "You May Also Like"}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              {filteredProducts.length} products available
            </p>
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input py-2 pl-4 pr-8 text-sm cursor-pointer bg-card border-border rounded-lg focus:border-primary focus:outline-none"
            aria-label="Sort products"
          >
            <option value="recommended">Recommended</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="discount">Best Discount</option>
            <option value="rating">Top Rated</option>
            <option value="newest">Newest First</option>
          </select>

          {/* Filter Toggle Button (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-alt text-text-muted hover:text-primary transition-colors"
            aria-label="Toggle filters"
          >
            {showFilters ? <X size={16} /> : <Filter size={16} />}
            Filter
          </button>
        </div>
      </div>

      {/* Filter Section */}
      {(showFilters || !isMobile) && (
        <div className="mb-6 p-4 bg-bg-alt rounded-xl border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-primary" aria-hidden="true" />
              <h3 className="font-semibold text-text">Filter by Price</h3>
            </div>
            {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
              <button
                onClick={resetFilters}
                className="text-xs text-primary hover:underline"
                aria-label="Reset filters"
              >
                Reset
              </button>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">₹{priceRange[0].toLocaleString()}</span>
              <span className="text-text-muted">₹{priceRange[1].toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="0"
              max={maxPrice}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
              aria-label="Price range filter"
            />
          </div>
          
          <div className="mt-3 flex justify-between text-xs text-text-muted">
            <span>₹0</span>
            <span>₹{maxPrice.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-muted">No products match your filters</p>
          <button
            onClick={resetFilters}
            className="mt-4 btn-primary px-4 py-2 rounded-lg text-sm"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {filteredProducts.slice(0, 12).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* View More Button */}
      {filteredProducts.length > 12 && (
        <div className="text-center mt-8">
          <button
            onClick={handleViewAll}
            className="btn-outline px-4 md:px-6 py-2 rounded-lg flex items-center gap-2 mx-auto text-sm md:text-base"
            aria-label="View all products"
          >
            View All {filteredProducts.length} Products
            <FaArrowRight size={12} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductByCatOnProductPage;