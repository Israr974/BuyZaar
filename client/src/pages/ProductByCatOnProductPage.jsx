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
  FaSync
} from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";

const ProductByCatOnProductPage = ({ categoryId }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);
  const [wishlistedProducts, setWishlistedProducts] = useState(new Set());
  const [sortBy, setSortBy] = useState("recommended");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [filteredProducts, setFilteredProducts] = useState([]);

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
      toast.error("Failed to load products", {
        icon: "⚠️",
        className: "glass",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkInCart = (productId) => {
    return cartitems.some(item => item.productId?._id === productId);
  };

  const handleQuickAddToCart = async (product) => {
    if (!user?.token) {
      toast.error("Please login to add items to cart", {
        icon: "🔒",
        className: "glass",
      });
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
        toast.success("Added to cart!", {
          icon: "🛒",
          className: "glass",
          style: {
            background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
            color: "white",
          },
        });
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
      toast.success("Added to wishlist", {
        icon: "❤️",
        className: "glass",
      });
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
      stars.push(<FaRegStar key={i} className="text-gray-300 text-xs" />);
    }
    
    return stars;
  };

  const applyFilters = () => {
    let result = [...products];

    // Filter by price range
    result = result.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort products
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

  if (loading) {
    return (
      <div className="py-12">
        <h2 className="text-2xl font-bold gradient-text mb-8">
          Similar Products
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="card animate-pulse">
              <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl mb-4"></div>
              <div className="h-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded mb-3"></div>
              <div className="h-6 bg-gradient-to-r from-primary/20 to-accent/20 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="text-6xl mb-6 gradient-text">📦</div>
        <h3 className="text-2xl font-bold text-text mb-3">
          No Products Found
        </h3>
        <p className="text-text-muted mb-6">
          Check back later for products in this category
        </p>
        <button
          onClick={fetchProductsByCategory}
          className="btn btn-outline inline-flex items-center gap-2"
        >
          <FaSync />
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="py-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold gradient-text">
            {category ? `More from ${category.name}` : "Similar Products"}
          </h2>
          <p className="text-text-muted mt-2">
            {filteredProducts.length} products found
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input bg-white pl-10 pr-8 cursor-pointer min-w-[180px]"
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Best Discount</option>
              <option value="rating">Top Rated</option>
              <option value="newest">Newest First</option>
            </select>
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
          </div>

          <div className="flex items-center gap-3 bg-white border border-border rounded-lg px-4 py-2">
            <span className="text-text-muted text-sm">Price Range:</span>
            <input
              type="range"
              min="0"
              max="100000"
              step="1000"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
              className="w-32 accent-primary"
            />
            <span className="text-sm font-medium text-primary">
              ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {filteredProducts.map((product) => {
          const isInCart = checkInCart(product._id);
          const isWishlisted = wishlistedProducts.has(product._id);
          const isOutOfStock = product.stock === 0;

          return (
            <div
              key={product._id}
              className="card card-hover group relative overflow-hidden"
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
                <img
                  src={product.image?.[0] || "/placeholder.png"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onClick={() => handleProductClick(product)}
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.discount > 0 && (
                    <span className="badge badge-accent px-3 py-1 text-xs font-bold">
                      <FaPercent className="mr-1" />
                      {product.discount}% OFF
                    </span>
                  )}
                  {product.isFeatured && (
                    <span className="badge bg-gradient-to-r from-primary to-accent text-white px-3 py-1 text-xs font-bold">
                      <FaFire className="mr-1" />
                      Featured
                    </span>
                  )}
                  {isOutOfStock && (
                    <span className="badge bg-red-100 text-red-800 px-3 py-1 text-xs font-bold">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={() => toggleWishlist(product._id)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                      isWishlisted
                        ? "bg-red-500 text-white animate-pulse"
                        : "bg-white text-gray-700 hover:bg-red-50 hover:text-red-600"
                    }`}
                  >
                    <FaHeart className={isWishlisted ? "fill-current" : ""} />
                  </button>
                  <button
                    onClick={() => handleProductClick(product)}
                    className="w-9 h-9 rounded-full bg-white text-gray-700 flex items-center justify-center shadow-lg hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    <FaEye />
                  </button>
                </div>

                {/* Quick Add to Cart */}
                {!isOutOfStock && (
                  <button
                    onClick={() => handleQuickAddToCart(product)}
                    className={`absolute bottom-0 left-0 right-0 py-3 text-sm font-bold transition-all duration-300 transform translate-y-full group-hover:translate-y-0 ${
                      isInCart
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                        : "bg-gradient-to-r from-primary to-accent text-white"
                    }`}
                  >
                    {isInCart ? (
                      <span className="flex items-center justify-center gap-2">
                        <FaCheck />
                        In Cart
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <FaShoppingCart />
                        Quick Add
                      </span>
                    )}
                  </button>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h4
                  className="text-sm font-semibold text-text line-clamp-2 mb-3 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleProductClick(product)}
                  title={product.name}
                >
                  {product.name}
                </h4>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex items-center mr-2">
                    {renderStars(product.rating || 4.0)}
                  </div>
                  <span className="text-xs text-text-muted">
                    ({product.reviewCount || "0"} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-baseline">
                    <span className="text-xl font-bold gradient-text">
                      ₹{product.price?.toLocaleString() || "0"}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-text-muted line-through ml-3">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {product.discount > 0 && (
                    <div className="flex items-center text-xs font-medium text-green-600">
                      <GiReceiveMoney className="mr-2" />
                      Save ₹
                      {((product.originalPrice - product.price) || 0).toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Delivery Info */}
                <div className="flex items-center text-xs text-text-muted mb-3">
                  <FaTruck className="mr-2" />
                  <span>Free Delivery</span>
                </div>

                {/* Stock Status */}
                {product.stock > 0 && product.stock < 10 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-text-muted">Only {product.stock} left</span>
                      <span className="text-accent font-bold flex items-center">
                        <FaBolt className="mr-1" />
                        Hurry!
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-accent to-red-500 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min((product.stock / 10) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* View More Button */}
      {category && (
        <div className="text-center mt-12">
          <button
            onClick={() => navigate(`/category/${category.slug || category._id}`)}
            className="btn btn-primary px-10 py-3 text-lg font-semibold"
          >
            View All Products in {category.name}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductByCatOnProductPage;