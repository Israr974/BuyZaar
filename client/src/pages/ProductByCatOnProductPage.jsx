import React, { useEffect, useState } from "react";
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
  FaBolt,
  FaFire,
  FaPercent,
  FaTag,
  FaFilter,
  FaSync,
  FaArrowRight
} from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import { ShoppingBag, TrendingUp, Sparkles, Clock } from "lucide-react";

const ProductByCatOnProductPage = ({ categoryId }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);
  const [wishlistedProducts, setWishlistedProducts] = useState(new Set());
  const [sortBy, setSortBy] = useState("recommended");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const user = useSelector((state) => state.user);
  const cartitems = useSelector((state) => state.cart.cartitems);

  const fetchProductsByCategory = async () => {
    if (!categoryId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await Axios({
        ...summaryApi().getProductByCategory,
        data: { id: categoryId },
      });

      if (res.data.success) {
        setProducts(res.data.data || []);
        setFilteredProducts(res.data.data || []);
        if (res.data.category) {
          setCategory(res.data.category);
        } else if (res.data.data?.[0]?.category) {
          setCategory(res.data.data[0].category);
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const checkInCart = (productId) => {
    return cartitems.some(item => item.productId?._id === productId);
  };

  const handleQuickAddToCart = async (product) => {
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

      if (response.data.success) {
        toast.success("Added to cart!");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Failed to add to cart");
    }
  };

  const toggleWishlist = (productId) => {
    const newWishlisted = new Set(wishlistedProducts);
    if (newWishlisted.has(productId)) {
      newWishlisted.delete(productId);
      toast.success("Removed from wishlist");
    } else {
      newWishlisted.add(productId);
      toast.success("Added to wishlist");
    }
    setWishlistedProducts(newWishlisted);
  };

  const handleProductClick = (product) => {
    const slug = `${product.name.toLowerCase().replace(/\s+/g, "-")}-${product._id}`;
    navigate(`/product/${slug}`);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-accent text-xs" />);
    }
    
    for (let i = fullStars; i < 5; i++) {
      stars.push(<FaRegStar key={i} className="text-border text-xs" />);
    }
    
    return stars;
  };

  const applyFilters = () => {
    let result = [...products];

    result = result.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "discount":
        result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      default:
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setFilteredProducts(result);
  };

  useEffect(() => {
    if (categoryId) {
      fetchProductsByCategory();
    }
  }, [categoryId]);

  useEffect(() => {
    applyFilters();
  }, [sortBy, priceRange, products]);

  const getPriceRangeText = () => {
    if (priceRange[1] >= 100000) return `₹${priceRange[0].toLocaleString()}+`;
    return `₹${priceRange[0].toLocaleString()} - ₹${priceRange[1].toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-primary to-accent"></div>
          <h2 className="text-xl font-display font-bold text-text">
            You May Also Like
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-card rounded-xl border border-border animate-pulse">
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
    <div className="py-8 fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-primary to-accent"></div>
          <div>
            <h2 className="text-xl font-display font-bold text-text">
              {category ? `More from ${category.name}` : "You May Also Like"}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              {filteredProducts.length} products available
            </p>
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input py-2 pl-10 pr-8 text-sm cursor-pointer"
          >
            <option value="recommended">Recommended</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="discount">Best Discount</option>
            <option value="rating">Top Rated</option>
            <option value="newest">Newest First</option>
          </select>
          <TrendingUp size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {filteredProducts.slice(0, 12).map((product) => {
          const isInCart = checkInCart(product._id);
          const isWishlisted = wishlistedProducts.has(product._id);
          const isOutOfStock = product.stock === 0;
          const discountPercent = product.discount > 0 
            ? Math.round((product.discount / product.originalPrice) * 100) 
            : 0;

          return (
            <div
              key={product._id}
              className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden bg-bg-alt cursor-pointer">
                <img
                  src={product.image?.[0] || "/placeholder.png"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onClick={() => handleProductClick(product)}
                />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.discount > 0 && (
                    <span className="bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      -{discountPercent}%
                    </span>
                  )}
                  {product.stock > 0 && product.stock < 10 && (
                    <span className="bg-warning text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      Only {product.stock} left
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
                  >
                    <FaHeart size={12} className={isWishlisted ? "fill-current" : ""} />
                  </button>
                  <button
                    onClick={() => handleProductClick(product)}
                    className="w-7 h-7 rounded-full bg-white text-text-muted flex items-center justify-center shadow-md hover:bg-primary hover:text-white transition-all"
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
                  className="text-sm font-semibold text-text line-clamp-2 min-h-[40px] cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleProductClick(product)}
                >
                  {product.name}
                </h4>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex items-center gap-0.5">
                    {renderStars(product.rating || 4)}
                  </div>
                  <span className="text-xs text-text-muted">
                    ({product.reviewCount || 0})
                  </span>
                </div>

                {/* Price */}
                <div className="mt-2">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-lg font-bold gradient-text">
                      ₹{product.price?.toLocaleString()}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-xs text-text-muted line-through">
                        ₹{product.originalPrice?.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Free Delivery Badge */}
                <div className="flex items-center gap-1 mt-2 text-xs text-text-muted">
                  <FaTruck size={10} />
                  <span>Free Delivery</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View More Button */}
      {filteredProducts.length > 12 && category && (
        <div className="text-center mt-8">
          <button
            onClick={() => navigate(`/category/${category.slug || category._id}`)}
            className="btn btn-outline px-6 py-2 rounded-lg flex items-center gap-2 mx-auto"
          >
            View All {filteredProducts.length} Products
            <FaArrowRight size={12} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductByCatOnProductPage;