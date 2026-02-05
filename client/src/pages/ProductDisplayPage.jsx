import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../utils/Axios";
import AxiosError from "../utils/AxiosToError";
import summaryApi from "../common/summartApi";
import toast from "react-hot-toast";
import { setCartItems } from "../redux/cartSlice";
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
  FaChevronRight
} from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";

const ProductDisplayPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const productId = params.product.split("-").pop();

  const [product, setProduct] = useState(null);
  const [categoryId,setCategoryId]=useState()
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [zoomImage, setZoomImage] = useState({ show: false, x: 0, y: 0 });

  const user = useSelector((state) => state.user);
  const cartitems = useSelector((state) => state.cart.cartitems);
  const cartItem = cartitems.find((item) => item.productId?._id === productId);
  const quantityInCart = cartItem?.quantity || 0;

  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    return !!(token && storedUser);
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
        setCategoryId(res.data.data.category._id)
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

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      toast.error("Please login to add items to cart!", {
        icon: "🔒",
        duration: 3000,
        className: 'glass',
        style: {
          background: 'var(--color-primary)',
          color: 'white',
        }
      });
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
        toast.success("Added to cart!", {
          icon: "🛒",
          duration: 2000,
          className: 'glass',
          style: {
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
            color: 'white',
          },
        });
        await fetchCart();
      } else {
        toast.error(res.data.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("❌ Add to cart error:", error);
      
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else if (error.response?.status === 404) {
        toast.error("Product not found or API endpoint not available");
      } else if (error.response?.status === 400) {
        toast.error(error.response.data?.message || "Bad request");
      } else {
        toast.error("Network error! Please check your connection.");
      }
    } finally {
      setAddingToCart(false);
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
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-accent text-sm" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-accent text-sm" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300 text-sm" />);
    }
    
    return stars;
  };

  const handleBuyNow = () => {
    if (!isAuthenticated()) {
      toast.error("Please login to proceed");
      navigate('/login');
      return;
    }
    
    if (product?.stock === 0) {
      toast.error("Product is out of stock");
      return;
    }
    
    handleAddToCart().then(() => {
      navigate('/checkout');
    });
  };

  useEffect(() => {
    if (productId) fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (isAuthenticated()) {
      fetchCart();
    }
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-bg via-white to-primary/5">
        <div className="text-center">
          <div className="spinner h-12 w-12 border-3 border-primary border-t-accent mx-auto mb-4"></div>
          <p className="gradient-text font-display text-xl font-bold">Loading Product...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-bg via-white to-primary/5">
        <div className="card p-8 max-w-md text-center">
          <div className="text-6xl mb-4 gradient-text">⚠️</div>
          <h2 className="text-2xl font-bold text-text mb-2">Oops!</h2>
          <p className="text-text-muted mb-6">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="btn btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="card p-8 text-center">
          <p className="text-text-muted">No product found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-primary/5">
      {/* Breadcrumb */}
      <div className="bg-card border-b border-border">
        <div className="container-narrow px-6 py-3">
          <nav className="flex items-center text-sm text-text-muted">
            <a href="/" className="hover:text-primary transition-colors">Home</a>
            <FaChevronRight className="mx-2 text-xs" />
            <a href="/category" className="hover:text-primary transition-colors">Category</a>
            {product.category && (
              <>
                <FaChevronRight className="mx-2 text-xs" />
                <a href={`/category/${product.category.slug}`} className="hover:text-primary transition-colors">
                  {product.category.name}
                </a>
              </>
            )}
            <FaChevronRight className="mx-2 text-xs" />
            <span className="text-primary font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-narrow px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div className="space-y-6">
            {/* Main Image with Zoom */}
            <div className="card overflow-hidden">
              <div 
                className="relative h-[500px] flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 cursor-zoom-in"
                onMouseEnter={() => setZoomImage(prev => ({ ...prev, show: true }))}
                onMouseLeave={() => setZoomImage(prev => ({ ...prev, show: false }))}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={currentImage}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain transition-transform duration-300"
                  style={{
                    transform: zoomImage.show ? 'scale(1.5)' : 'scale(1)',
                    transformOrigin: `${zoomImage.x}% ${zoomImage.y}%`
                  }}
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.discount > 0 && (
                    <span className="badge badge-accent">
                      <FaPercent className="mr-1" />
                      {product.discount}% OFF
                    </span>
                  )}
                  {product.stock === 0 && (
                    <span className="badge bg-red-100 text-red-800">
                      <FaBoxOpen className="mr-1" />
                      Out of Stock
                    </span>
                  )}
                  {product.isFeatured && (
                    <span className="badge bg-gradient-to-r from-primary to-accent text-white">
                      <FaStar className="mr-1" />
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Thumbnails */}
            {product.image?.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {product.image.map((img, index) => (
                  <button
                    key={index}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      img === currentImage 
                        ? 'border-primary shadow-lg scale-105' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setCurrentImage(img)}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
            
              <button className="flex-1 btn btn-outline flex items-center justify-center space-x-2">
                <FaShareAlt />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Product Title */}
            <div>
              <h1 className="text-3xl font-bold text-text mb-3 gradient-text">
                {product.name}
              </h1>
              <div className="flex items-center space-x-6 mb-4">
                <div className="flex items-center">
                  <div className="flex items-center bg-gradient-to-r from-primary/10 to-accent/10 px-3 py-1 rounded-full">
                    {renderStars(product.rating || 4.5)}
                    <span className="ml-2 font-bold text-text">
                      {product.rating?.toFixed(1) || '4.5'}
                    </span>
                  </div>
                  <span className="ml-3 text-text-muted text-sm">
                    ({product.reviewCount || '10K'} Ratings & {product.reviewCount || '2K'} Reviews)
                  </span>
                </div>
                <div className="h-4 w-px bg-border"></div>
                <div className="badge badge-success">
                  <GiReceiveMoney className="mr-1" />
                  Best Seller
                </div>
              </div>
            </div>

            {/* Price Section */}
            <div className="card p-6 bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="flex items-baseline mb-2">
                <span className="price-tag text-4xl font-bold gradient-text">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="original-price text-xl">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="badge badge-accent ml-3 text-sm">
                      Save ₹{(product.originalPrice - product.price).toLocaleString()}
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center text-text-muted text-sm">
                <FaPercent className="mr-2" />
                <span>Inclusive of all taxes</span>
                {product.taxIncluded && (
                  <span className="ml-2 text-green-600">
                    <FaCheck className="inline mr-1" />
                    Tax Included
                  </span>
                )}
              </div>
            </div>

            {/* Offers */}
            <div className="card p-6 border-2 border-accent/20">
              <h3 className="font-bold text-lg mb-4 flex items-center text-accent">
                <FaTag className="mr-2" />
                Available Offers
              </h3>
              <div className="space-y-3">
                <div className="flex items-start p-3 bg-gradient-to-r from-primary/5 to-transparent rounded-lg">
                  <GiReceiveMoney className="text-primary mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-primary">Bank Offer</span>
                    <p className="text-sm text-text-muted mt-1">
                      10% instant discount on ABC Bank Credit Cards
                    </p>
                  </div>
                </div>
                <div className="flex items-start p-3 bg-gradient-to-r from-accent/5 to-transparent rounded-lg">
                  <GiReceiveMoney className="text-accent mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-accent">Partner Offer</span>
                    <p className="text-sm text-text-muted mt-1">
                      Get 5% cashback on first purchase
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Highlights */}
            <div className="grid grid-cols-2 gap-4">
              <div className="card p-4 text-center hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 flex items-center justify-center">
                  <FaTruck className="text-primary text-xl" />
                </div>
                <p className="font-medium text-text">Free Delivery</p>
                <p className="text-xs text-text-muted">3-5 Days</p>
              </div>
              
              <div className="card p-4 text-center hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 flex items-center justify-center">
                  <FaUndo className="text-primary text-xl" />
                </div>
                <p className="font-medium text-text">Easy Returns</p>
                <p className="text-xs text-text-muted">10 Days Policy</p>
              </div>
              
              <div className="card p-4 text-center hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 flex items-center justify-center">
                  <FaShieldAlt className="text-primary text-xl" />
                </div>
                <p className="font-medium text-text">Warranty</p>
                <p className="text-xs text-text-muted">1 Year</p>
              </div>
              
              <div className="card p-4 text-center hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 flex items-center justify-center">
                  <FaCalendarCheck className="text-primary text-xl" />
                </div>
                <p className="font-medium text-text">COD Available</p>
                <p className="text-xs text-text-muted">Pay on Delivery</p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="card p-6">
              <p className="font-medium text-text mb-4">Select Quantity</p>
              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange('decrease')}
                  disabled={quantity <= 1}
                  className="w-12 h-12 rounded-l-lg border border-r-0 border-border flex items-center justify-center text-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/5"
                >
                  −
                </button>
                <div className="w-16 h-12 border-y border-border flex items-center justify-center font-bold text-lg gradient-text">
                  {quantity}
                </div>
                <button
                  onClick={() => handleQuantityChange('increase')}
                  disabled={quantity >= Math.min(product.stock, 10)}
                  className="w-12 h-12 rounded-r-lg border border-l-0 border-border flex items-center justify-center text-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/5"
                >
                  +
                </button>
                <div className="ml-6">
                  {product.stock > 0 ? (
                    <div className="flex items-center text-green-600">
                      <FaCheck className="mr-2" />
                      <span className="font-medium">
                        {product.stock} items in stock
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <FaInfoCircle className="mr-2" />
                      <span className="font-medium">Out of Stock</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-card border-t border-border py-4 space-y-4 -mx-6 px-6">
              {quantityInCart > 0 && (
                <div className="card p-4 bg-gradient-to-r from-primary/5 to-accent/5">
                  <div className="flex items-center">
                    <FaShoppingCart className="text-primary mr-3 text-xl" />
                    <div>
                      <p className="font-medium text-text">
                        {quantityInCart} item{quantityInCart > 1 ? 's' : ''} in cart
                      </p>
                      <p className="text-sm text-text-muted">
                        Total: ₹{(product.price * quantityInCart).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || addingToCart}
                  className={`btn flex items-center justify-center space-x-3 h-14 text-lg ${
                    product.stock === 0
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : quantityInCart > 0
                      ? 'btn-accent'
                      : 'btn-primary'
                  }`}
                >
                  {addingToCart ? (
                    <>
                      <div className="spinner h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Adding...</span>
                    </>
                  ) : product.stock === 0 ? (
                    'Out of Stock'
                  ) : quantityInCart > 0 ? (
                    <>
                      <FaShoppingCart />
                      <span>Add More to Cart</span>
                    </>
                  ) : (
                    <>
                      <FaShoppingCart />
                      <span>ADD TO CART</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className={`btn flex items-center justify-center space-x-3 h-14 text-lg ${
                    product.stock === 0
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-amber-600 text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  <FaBolt />
                  <span>BUY NOW</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="card mt-8">
          <div className="border-b border-border">
            <nav className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab("description")}
                className={`flex items-center px-6 py-4 font-medium whitespace-nowrap ${
                  activeTab === "description"
                    ? "text-primary border-b-2 border-primary"
                    : "text-text-muted hover:text-text"
                }`}
              >
                <FaInfoCircle className="mr-2" />
                Description
              </button>
              <button
                onClick={() => setActiveTab("specifications")}
                className={`flex items-center px-6 py-4 font-medium whitespace-nowrap ${
                  activeTab === "specifications"
                    ? "text-primary border-b-2 border-primary"
                    : "text-text-muted hover:text-text"
                }`}
              >
                <FaShieldAlt className="mr-2" />
                Specifications
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`flex items-center px-6 py-4 font-medium whitespace-nowrap ${
                  activeTab === "reviews"
                    ? "text-primary border-b-2 border-primary"
                    : "text-text-muted hover:text-text"
                }`}
              >
                <FaStar className="mr-2" />
                Reviews ({product.reviewCount || '0'})
              </button>
              <button
                onClick={() => setActiveTab("qna")}
                className={`flex items-center px-6 py-4 font-medium whitespace-nowrap ${
                  activeTab === "qna"
                    ? "text-primary border-b-2 border-primary"
                    : "text-text-muted hover:text-text"
                }`}
              >
                <FaBoxOpen className="mr-2" />
                Q&A
              </button>
            </nav>
          </div>

          <div className="p-8">
            {activeTab === "description" && (
              <div className="prose prose-lg max-w-none">
                <h3 className="text-2xl font-bold gradient-text mb-6">Product Description</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-text leading-relaxed">{product.description}</p>
                    
                    {product.features && (
                      <div className="mt-8">
                        <h4 className="font-bold text-lg mb-4">Key Features</h4>
                        <ul className="space-y-3">
                          {product.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                              <span className="text-text-muted">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div className="card p-6">
                    <h4 className="font-bold text-lg mb-4">Product Details</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="font-medium text-text-muted">Brand</span>
                        <span className="font-medium">{product.name || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="font-medium text-text-muted">Model</span>
                        <span className="font-medium">{product.model || 'Standard'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="font-medium text-text-muted">Weight</span>
                        <span className="font-medium">{product.weight || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="font-medium text-text-muted">Dimensions</span>
                        <span className="font-medium">{product.dimensions || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
{/*             
            {activeTab === "specifications" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold gradient-text">Technical Specifications</h3>
                {product.specifications ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {Object.entries(product.specifications ).map(([key, value], index) => (
                      <div key={index} className="card p-4 hover:scale-105 transition-transform duration-300">
                        <span className="font-medium text-primary block mb-2">{key}</span>
                        <span className="text-text">{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 card">
                    <FaInfoCircle className="text-4xl text-text-muted mx-auto mb-4" />
                    <p className="text-text-muted">No specifications available for this product.</p>
                  </div>
                )}
              </div>
            )}
             */}
             {activeTab === "specifications" && (
  <div className="space-y-6">
    <h3 className="text-2xl font-bold gradient-text">Technical Specifications</h3>

    {product?.more_details ? (
      <div className="card p-4 whitespace-pre-line text-text">
        {product.more_details}
      </div>
    ) : (
      <div className="text-center py-12 card">
        <FaInfoCircle className="text-4xl text-text-muted mx-auto mb-4" />
        <p className="text-text-muted">No specifications available for this product.</p>
      </div>
    )}
  </div>
)}

            {activeTab === "reviews" && (
              <div>
                <h3 className="text-2xl font-bold gradient-text mb-6">Customer Reviews</h3>
                <div className="text-center py-12 card">
                  <FaStar className="text-6xl text-accent/50 mx-auto mb-4" />
                  <p className="text-text-muted text-lg mb-2">No reviews yet</p>
                  <p className="text-text-muted">Be the first to review this product!</p>
                  <button className="btn btn-primary mt-6">
                    Write a Review
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === "qna" && (
              <div>
                <h3 className="text-2xl font-bold gradient-text mb-6">Questions & Answers</h3>
                <div className="text-center py-12 card">
                  <FaBoxOpen className="text-6xl text-primary/50 mx-auto mb-4" />
                  <p className="text-text-muted text-lg mb-2">No questions yet</p>
                  <p className="text-text-muted">Ask the first question about this product!</p>
                  <button className="btn btn-outline mt-6">
                    Ask a Question
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar Products Component */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold gradient-text mb-6">Similar Products</h2>
          <ProductByCatOnProductPage categoryId={categoryId}/>
        </div>

        {/* Recently Viewed (Optional) */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold gradient-text mb-6">Recently Viewed</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="card card-hover p-3">
                <div className="aspect-square mb-3 rounded-lg overflow-hidden">
                  <img 
                    src="https://via.placeholder.com/150" 
                    alt="Recently viewed" 
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <p className="text-sm text-text line-clamp-2 mb-2 font-medium">
                  Similar Product Name
                </p>
                <p className="font-bold gradient-text">₹{Math.floor(Math.random() * 10000)}</p>
                <div className="flex items-center mt-2">
                  {renderStars(4)}
                  <span className="text-xs text-text-muted ml-2">(24)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDisplayPage;