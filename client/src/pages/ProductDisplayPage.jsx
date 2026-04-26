import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../utils/Axios";
import AxiosError from "../utils/AxiosToError";
import summaryApi from "../common/summartApi";
import useRecentlyViewed from "../hooks/useRecentlyViewed";
import RecentlyViewed from "../components/RecentlyViewed";
import ProductReviews from "../components/ProductReviews";
import Recommendations from "../components/Recommendations";
import toast from "react-hot-toast";
import { setCartItems } from "../redux/cartSlice";
import { addToWishlist, removeFromWishlist } from "../redux/wishlistSlice";
import ProductByCatOnProductPage from "./ProductByCatOnProductPage";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaHeart,
  FaShareAlt,
  FaCheck,
  FaShoppingCart,
  FaBolt,
  FaTag,
  FaPercent,
  FaCalendarCheck,
  FaBoxOpen,
  FaInfoCircle,
  FaChevronRight,
  FaExchangeAlt
} from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import { ChevronLeft, ShoppingBag, Eye, Clock, Sparkles, Heart } from "lucide-react";

const ProductDisplayPage = () => {
  const { addToRecentlyViewed } = useRecentlyViewed();
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const productId = params.product?.split("-").pop();

  const [product, setProduct] = useState(null);
  const [categoryId, setCategoryId] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [zoomImage, setZoomImage] = useState({ show: false, x: 0, y: 0 });
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);

  const user = useSelector((state) => state.user);
  const cartitems = useSelector((state) => state.cart.cartitems);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const cartItem = cartitems.find((item) => item.productId?._id === productId);
  const quantityInCart = cartItem?.quantity || 0;

  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  const fetchProduct = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await Axios({
        ...summaryApi().getProductById(),
        data: { productId },
      });

      if (res.data?.success) {
        setProduct(res.data.data || null);
        setCategoryId(res.data.data?.category?._id);
        setCurrentImage(res.data.data?.image?.[0] || "/placeholder.png");
      } else {
        setError(res.data?.message || "Product not found");
      }
    } catch (err) {
      AxiosError(err);
      setError("Failed to fetch product");
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await Axios(summaryApi().getCartProducts);
      if (response.data.success) {
        dispatch(setCartItems(response.data.data));
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  // Check if product is in wishlist when product loads
  useEffect(() => {
    if (product) {
      const inWishlist = wishlistItems.some(
        (item) => item.productId === product._id || item._id === product._id
      );
      setIsWishlisted(inWishlist);
    }
  }, [product, wishlistItems]);

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      toast.error("Please login to add items to cart!");
      navigate('/login', {
        state: {
          from: `/product/${params.product}`,
          productId: productId,
          productName: product?.name
        }
      });
      return;
    }

    if (product?.stock === 0) {
      toast.error("This product is out of stock!");
      return;
    }

    setAddingToCart(true);

    try {
      const res = await Axios({
        ...summaryApi().addToCart,
        data: {
          productId: productId,
          quantity: quantity,
          priceAtAddTime: product?.price
        },
      });

      if (res.data.success) {
        toast.success("Added to cart!");
        await fetchCart();
      } else {
        toast.error(res.data.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Add to cart error:", error);

      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem('token');
        navigate('/login');
      } else if (error.response?.status === 400) {
        toast.error(error.response.data?.message || "Bad request");
      } else {
        toast.error("Network error! Please check your connection.");
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlistToggle = async () => {
  if (!isAuthenticated()) {
    toast.error("Please login to add to wishlist");
    navigate('/login');
    return;
  }

  setAddingToWishlist(true);

  try {
    if (isWishlisted) {
      // Remove from wishlist
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
      // Add to wishlist
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
        // Product already in wishlist - update UI to match backend
        if (response.data?.message === "Product already in wishlist") {
          // Update local state to show it's in wishlist
          setIsWishlisted(true);
          // Also update Redux if needed
          dispatch(addToWishlist({ productId: product._id, product: product }));
          toast.success("Product already in wishlist");
        } else {
          toast.error(response.data?.message || "Failed to add to wishlist");
        }
      }
    }
  } catch (error) {
    console.error("Wishlist error:", error);
    
    // Check if error response says product already in wishlist
    if (error.response?.data?.message === "Product already in wishlist") {
      setIsWishlisted(true);
      dispatch(addToWishlist({ productId: product._id, product: product }));
      toast.success("Product already in wishlist");
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else if (error.response?.status === 401) {
      toast.error("Please login again");
      navigate('/login');
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  } finally {
    setAddingToWishlist(false);
  }
};

  const handleQuantityChange = (action) => {
    if (action === 'increase') {
      const maxQty = Math.min(product?.stock || 10, 10);
      if (quantity < maxQty) {
        setQuantity(prev => prev + 1);
      } else {
        toast.error(`Maximum ${maxQty} items allowed`);
      }
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleMouseMove = (e) => {
    if (!zoomImage.show) return;

    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomImage(prev => ({ ...prev, x, y }));
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating % 1) >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-accent text-sm" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-accent text-sm" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-border text-sm" />);
    }

    return stars;
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated()) {
      toast.error("Please login to proceed");
      navigate('/login');
      return;
    }

    if (product?.stock === 0) {
      toast.error("Product is out of stock");
      return;
    }

    await handleAddToCart();
    navigate('/checkout');
  };

  useEffect(() => {
    if (productId) fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (isAuthenticated()) {
      fetchCart();
    }
  }, []);

  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-12 h-12 mb-4"></div>
          <p className="text-text-muted">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4">
        <div className="bg-card rounded-2xl border border-border p-8 max-w-md text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-error/10 flex items-center justify-center mb-4">
            <FaInfoCircle className="w-10 h-10 text-error" />
          </div>
          <h2 className="text-2xl font-display font-bold text-text mb-2">Oops!</h2>
          <p className="text-text-muted mb-6">{error}</p>
          <button onClick={() => navigate(-1)} className="btn btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const discountPercent = product.discount > 0
    ? Math.round(product.discount )
    : 0;

  return (
    <div className="min-h-screen bg-bg fade-in">
      {/* Breadcrumb */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container-narrow px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-text-muted flex-wrap">
            <button onClick={() => navigate(-1)} className="hover:text-primary transition-colors flex items-center gap-1">
              <ChevronLeft size={14} />
              Back
            </button>
            <span>/</span>
            <a href="/" className="hover:text-primary transition-colors">Home</a>
            <FaChevronRight size={10} />
            <a href="/shop" className="hover:text-primary transition-colors">Shop</a>
            {product.category && (
              <>
                <FaChevronRight size={10} />
                <span className="text-text font-medium">{product.category.name}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="container-narrow px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div
              className="relative aspect-square bg-bg-alt rounded-2xl overflow-hidden cursor-zoom-in"
              onMouseEnter={() => setZoomImage(prev => ({ ...prev, show: true }))}
              onMouseLeave={() => setZoomImage(prev => ({ ...prev, show: false }))}
              onMouseMove={handleMouseMove}
            >
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-contain transition-transform duration-300"
                style={{
                  transform: zoomImage.show ? 'scale(1.5)' : 'scale(1)',
                  transformOrigin: `${zoomImage.x}% ${zoomImage.y}%`
                }}
              />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1">
                {product.discount > 0 && (
                  <span className="bg-accent text-white text-xs font-bold px-2 py-1 rounded-full">
                    -{discountPercent}%
                  </span>
                )}
                {product.stock === 0 && (
                  <span className="bg-error text-white text-xs font-bold px-2 py-1 rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {product.image?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.image.map((img, index) => (
                  <button
                    key={index}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${img === currentImage
                        ? 'border-primary shadow-md'
                        : 'border-border hover:border-primary/50'
                      }`}
                    onClick={() => setCurrentImage(img)}
                  >
                    <img src={img} alt={`Thumb ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Share Button */}
            <button className="w-full btn btn-outline py-2 rounded-xl flex items-center justify-center gap-2">
              <FaShareAlt size={14} />
              Share Product
            </button>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-5">
            {/* Title & Rating */}
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-text mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating || 4.5)}
                  <span className="text-sm font-medium text-text ml-1">
                    {product.rating?.toFixed(1) || '4.5'}
                  </span>
                </div>
                <span className="text-xs text-text-muted">
                  ({product.reviewCount || 0} reviews)
                </span>
                {product.stock > 0 && (
                  <span className="text-xs text-success bg-success/10 px-2 py-0.5 rounded-full">
                    In Stock
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="bg-bg-alt rounded-xl p-4">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-bold gradient-text">
                  ₹{product.price?.toLocaleString()}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-sm text-text-muted line-through">
                      ₹{product.originalPrice?.toLocaleString()}
                    </span>
                    <span className="text-xs text-success bg-success/10 px-2 py-0.5 rounded-full">
                      Save ₹{(product.originalPrice - product.price).toLocaleString()}
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-text-muted mt-2">Inclusive of all taxes</p>
            </div>

            {/* Offers */}
            <div className="bg-accent/5 rounded-xl p-4 border border-accent/20">
              <h3 className="font-semibold text-text mb-3 flex items-center gap-2 text-sm">
                <FaTag size={14} className="text-accent" />
                Available Offers
              </h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <GiReceiveMoney size={14} className="text-primary mt-0.5" />
                  <span className="text-text-muted">10% instant discount on Bank Cards</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Sparkles size={14} className="text-accent mt-0.5" />
                  <span className="text-text-muted">Free delivery on orders above ₹999</span>
                </div>
              </div>
            </div>

            {/* Service Highlights */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-bg-alt">
                <FaTruck className="text-primary" />
                <div>
                  <p className="text-xs font-medium text-text">Free Delivery</p>
                  <p className="text-xs text-text-muted">3-5 days</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-bg-alt">
                <FaUndo className="text-primary" />
                <div>
                  <p className="text-xs font-medium text-text">Easy Returns</p>
                  <p className="text-xs text-text-muted">10 days policy</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-bg-alt">
                <FaShieldAlt className="text-primary" />
                <div>
                  <p className="text-xs font-medium text-text">Warranty</p>
                  <p className="text-xs text-text-muted">1 year</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-bg-alt">
                <FaExchangeAlt className="text-primary" />
                <div>
                  <p className="text-xs font-medium text-text">COD Available</p>
                  <p className="text-xs text-text-muted">Pay on delivery</p>
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-text">Quantity:</span>
              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange('decrease')}
                  disabled={quantity <= 1}
                  className="w-8 h-8 rounded-l-lg border border-border bg-bg-alt disabled:opacity-50"
                >
                  -
                </button>
                <span className="w-12 h-8 border-y border-border flex items-center justify-center text-sm font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange('increase')}
                  disabled={quantity >= Math.min(product.stock, 10)}
                  className="w-8 h-8 rounded-r-lg border border-border bg-bg-alt disabled:opacity-50"
                >
                  +
                </button>
              </div>
              {quantityInCart > 0 && (
                <span className="text-xs text-success">
                  {quantityInCart} in cart
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addingToCart}
                className="flex-1 btn btn-primary py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {addingToCart ? (
                  <div className="spinner w-4 h-4"></div>
                ) : (
                  <>
                    <FaShoppingCart size={14} />
                    Add to Cart
                  </>
                )}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={handleWishlistToggle}
                disabled={addingToWishlist}
                className={`px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                  isWishlisted
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "btn btn-outline hover:bg-primary hover:text-white"
                }`}
              >
                <Heart size={18} className={isWishlisted ? "fill-white" : ""} />
                <span className="hidden sm:inline">{isWishlisted ? "Wishlisted" : "Wishlist"}</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 btn btn-secondary py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FaBolt size={14} />
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-10">
          <div className="border-b border-border flex gap-6">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium capitalize transition-colors ${activeTab === tab
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-text-muted hover:text-text'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="pt-6">
            {activeTab === 'description' && (
              <div className="prose prose-sm max-w-none">
                <p className="text-text-muted leading-relaxed">{product.description}</p>
                {product.more_details && (
                  <div className="mt-4 p-4 bg-bg-alt rounded-lg">
                    <h4 className="font-semibold text-text mb-2">Additional Details</h4>
                    <p className="text-text-muted text-sm">{product.more_details}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specifications' && (
              <div>
                {product.more_details ? (
                  <div className="bg-bg-alt rounded-lg p-4">
                    <p className="text-text-muted text-sm whitespace-pre-line">{product.more_details}</p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-text-muted">No specifications available</div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <ProductReviews productId={product._id} />
            )}
          </div>
        </div>

        {/* Similar Products */}
        {categoryId && (
          <div className="mt-12">
            <ProductByCatOnProductPage categoryId={categoryId} />
          </div>
        )}

        <Recommendations currentProductId={product._id} categoryId={product.category?._id} />
      </div>

      <RecentlyViewed />
    </div>
  );
};

export default ProductDisplayPage;