


import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
  Search, User, ShoppingBag, Menu, Heart, ChevronDown, Tag
} from "lucide-react";
import useMobile from "../hooks/useMobile";
import DisplayCart from "./DisplayCart";
import ShowMenu from "./ShowMenu"; 
import { formatINR } from "../utils/formatINR";

const Header = () => {
  const [isMobile] = useMobile();
  const location = useLocation();
  const navigate = useNavigate();

  const [opencart, setOpencart] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const user = useSelector((state) => state.user);
  const cartitems = useSelector((state) => state.cart?.cartitems || []);
  const wishlistCount = useSelector((state) => state.wishlist?.items?.length || 0);

  
  useEffect(() => {
    if (!user?.id) {
      setUserMenuOpen(false); 
    }
  }, [user]);

  
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const totalProducts = cartitems.length;
  const totalPrice = cartitems.reduce(
    (sum, item) => sum + (item.productId?.price || 0) * (item.quantity || 0),
    0
  );

  const categories = [
    { name: "Electronics", path: "#" },
    { name: "Fashion", path: "#" },
    { name: "Home & Kitchen", path: "#"  },
    { name: "Beauty", path: "#"  },
    { name: "Sports",path: "#"  },
    { name: "Books", path: "#"  },
  ];

  return (
    <>
      
      <div className="bg-gradient-to-r from-primary to-accent text-white text-sm py-2 px-4 text-center">
        <div className="container-wide flex items-center justify-center gap-4">
          <span className="hidden md:inline"> Flash Sale Live! Up to 60% OFF</span>
          <span className="hidden sm:inline">•</span>
          <span> Free Shipping on Orders Over ₹499</span>
        </div>
      </div>

      
      <header className="sticky top-0 z-50 bg-card shadow-sm border-b border-border">
        {!isMobile ? (
          <div className="container-wide">
            
            <div className="flex items-center justify-between px-6 py-4">
              
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold gradient-text">BuyZaar</h1>
                  <p className="text-xs text-text-muted">Premium Shopping Experience</p>
                </div>
              </Link>

              
              <div className="flex-1 max-w-2xl mx-8">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="        Search products, brands, and categories..."
                    className="input pl-12  pr-4 w-full "
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 btn btn-primary px-4 py-1.5 text-sm"
                  >
                    Search
                  </button>
                </form>
              </div>

            
              <div className="flex items-center gap-4">
                
                <button
                  onClick={() => navigate("/wishlist")}
                  className="relative p-2 hover:bg-primary/5 rounded-lg transition group"
                >
                  <Heart className="w-5 h-5 text-text-muted group-hover:text-primary" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 badge badge-primary">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                
                {user?.id ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-primary/5 transition"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold">{user?.name || "Account"}</p>
                        <p className="text-xs text-text-muted">My Account</p>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 top-12 z-50 fade-in">
                        <ShowMenu 
                          user={user} 
                          onClose={() => setUserMenuOpen(false)} 
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => navigate("/login")}
                    className="btn btn-primary px-6"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </button>
                )}

                
                <button
                  onClick={() => setOpencart(true)}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg bg-primary/5 hover:bg-primary/10 transition group relative"
                >
                  <div className="relative">
                    <ShoppingBag className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                    {totalProducts > 0 && (
                      <span className="absolute -top-2 -right-2 bg-accent text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                        {totalProducts}
                      </span>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold">Cart</p>
                    <p className="text-xs text-text-muted">{formatINR(totalPrice)}</p>
                  </div>
                </button>
              </div>
            </div>

           
            <div className="flex items-center justify-between px-6 py-3 border-t border-border">
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/5 hover:bg-primary/10 transition">
                  <Menu className="w-4 h-4" />
                  <span className="font-medium">All Categories</span>
                </button>
                {categories.map((category) => (
                  <Link
                    key={category.path}
                    to={category.path}
                    className="text-sm font-medium text-text-muted hover:text-primary transition flex items-center gap-2"
                  >
                    <span>{category.icon}</span>
                    {category.name}
                  </Link>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <Tag className="w-4 h-4 text-accent" />
                <span className="font-medium text-accent">Sale Live!</span>
                <span>Up to 60% Off</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-4">
            
          </div>
        )}

        {opencart && <DisplayCart close={() => setOpencart(false)} />}
      </header>
    </>
  );
};

export default Header;
