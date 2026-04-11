import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Search, User, ShoppingBag, Menu, Heart, ChevronDown, Tag, X,
  ChevronLeft, ChevronRight
} from "lucide-react";
import useMobile from "../hooks/useMobile";
import DisplayCart from "./DisplayCart";
import ShowMenu from "./ShowMenu";
import DarkModeToggle from "./DarkModeToggle"; // ADD THIS IMPORT
import { formatINR } from "../utils/formatINR";
import { validateUrlConverter } from "../utils/validateUrl";
import logo from "../assets/logoBuyZaar.svg"

const Header = () => {
  const [isMobile] = useMobile();
  const location = useLocation();
  const navigate = useNavigate();

  const [opencart, setOpencart] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Refs for category scroll
  const categoriesContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const user = useSelector((state) => state.user);
  const cartitems = useSelector((state) => state.cart?.cartitems || []);
  const wishlistCount = useSelector((state) => state.wishlist?.items?.length || 0);
  const allCategories = useSelector((state) => state.product.allCategory);

  useEffect(() => {
    if (!user?.id) {
      setUserMenuOpen(false);
    }
  }, [user]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setMobileSearchOpen(false);
  }, [location.pathname]);

  // Check scroll position to show/hide arrows
  const checkScrollPosition = () => {
    if (categoriesContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoriesContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    const container = categoriesContainerRef.current;
    if (container) {
      checkScrollPosition();
      container.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, [allCategories]);

  const scrollCategories = (direction) => {
    if (categoriesContainerRef.current) {
      const scrollAmount = 200;
      const newScrollLeft = categoriesContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      categoriesContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileSearchOpen(false);
    }
  };

  const totalProducts = cartitems.length;
  const totalPrice = cartitems.reduce(
    (sum, item) => sum + (item.productId?.price || 0) * (item.quantity || 0),
    0
  );

  return (
    <>
      <header className="sticky top-0 z-50 bg-card shadow-sm border-b border-border">
        {!isMobile ? (
          /* ================= DESKTOP VIEW ================= */
          <div className="container-wide">
            <div className="flex items-center justify-between px-6 py-4">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
                <div className="rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <img src={logo} alt="image" className="w-20 h-20 object-contain" />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold">
                    <span className="text-blue-600 drop-shadow-[0_0_6px_rgba(37,99,235,0.8)]">
                      Buy
                    </span>
                    <span className="text-orange-500 drop-shadow-[0_0_6px_rgba(249,115,22,0.8)]">
                      Zaar
                    </span>
                  </h1>
                  <p className="text-xs text-text-muted hidden lg:block">Just Buy It!</p>
                </div>
              </Link>

              {/* Search Bar */}

              <div className="flex-1 max-w-2xl mx-8">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products, brands, and categories..."
                    className="input pl-12 pr-28 w-full"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 btn btn-primary px-4 py-1.5 text-sm"
                  >
                    Search
                  </button>
                </form>
              </div>
              {/* Actions */}
              <div className="flex items-center gap-4 flex-shrink-0">
                {/* ADD DARK MODE TOGGLE HERE */}
                <DarkModeToggle />

                <button
                  onClick={() => navigate("/dashboard/wishlist")}
                  className="relative p-2 hover:bg-primary/5 rounded-lg transition group"
                >
                  <Heart className="w-5 h-5 text-text-muted group-hover:text-primary" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                {/* Desktop User Menu */}
                {user?.id ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-primary/5 transition"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-left hidden lg:block">
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
                          isMobile={false}
                          wishlistCount={wishlistCount}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <button onClick={() => navigate("/login")} className="btn btn-primary px-6">
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </button>
                )}

                {/* Cart Button */}
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
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-semibold">Cart</p>
                    <p className="text-xs text-text-muted">{formatINR(totalPrice)}</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Categories Bar with Professional Scroll */}
            <div className="bg-gradient-primary border-t border-border/20 relative">
              <div className="relative px-6 py-3">
                {/* Left Scroll Arrow */}
                {showLeftArrow && (
                  <button
                    onClick={() => scrollCategories('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-primary text-white p-2 rounded-full shadow-lg hover:bg-white/20 transition-all"
                    style={{ transform: 'translateY(-50%)' }}
                  >
                    <ChevronLeft size={18} />
                  </button>
                )}

                {/* Categories Container */}
                <div
                  ref={categoriesContainerRef}
                  className="flex items-center gap-6 overflow-x-auto scroll-smooth hide-scrollbar"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {allCategories.map((category) => (
                    <Link
                      key={category._id}
                      to={`/${validateUrlConverter(category.name)}-${category._id}/all-all`}
                      className="text-sm font-medium text-white/90 hover:text-white transition whitespace-nowrap py-1"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>

                {/* Right Scroll Arrow */}
                {showRightArrow && (
                  <button
                    onClick={() => scrollCategories('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-primary text-white p-2 rounded-full shadow-lg hover:bg-white/20 transition-all"
                    style={{ transform: 'translateY(-50%)' }}
                  >
                    <ChevronRight size={18} />
                  </button>
                )}
              </div>

              {/* Sale Tag - Separate from scrollable area */}
{/*               
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 text-sm text-white/90 whitespace-nowrap bg-gradient-primary px-4 py-1 rounded-full">
                <Tag className="w-4 h-4 text-yellow-300" />
                <span className="font-medium text-yellow-300">Sale Live!</span>
                <span className="hidden md:inline">Up to 60% Off</span>
              </div> */}
            </div>
          </div>
        ) : (
          /* ================= MOBILE VIEW ================= */
          <div className="px-4 py-3">
            {/* Mobile Header Row 1 */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-lg hover:bg-primary/5"
              >
                <Menu className="w-6 h-6 text-text" />
              </button>

              <Link to="/" className="flex items-center gap-2">
                <img src={logo} alt="image" className="w-8 h-8 object-contain" />
                <h1 className="text-xl font-bold gradient-text">BuyZaar</h1>
              </Link>

              <div className="flex items-center gap-1">
                {/* ADD DARK MODE TOGGLE FOR MOBILE */}
                <DarkModeToggle />

                <button
                  onClick={() => setMobileSearchOpen(true)}
                  className="p-2 rounded-lg hover:bg-primary/5"
                >
                  <Search className="w-5 h-5 text-text-muted" />
                </button>
                <button
                  onClick={() => navigate("/wishlist")}
                  className="relative p-2 rounded-lg hover:bg-primary/5"
                >
                  <Heart className="w-5 h-5 text-text-muted" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setOpencart(true)}
                  className="relative p-2 rounded-lg hover:bg-primary/5"
                >
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  {totalProducts > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-bold">
                      {totalProducts}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Search Bar */}
            <div className="mt-3">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="input pl-9 pr-4 py-2 text-sm w-full"
                />
              </form>
            </div>

            {/* Quick Categories - Horizontal Scroll (Mobile) */}
            <div className="mt-3 overflow-x-auto pb-2 hide-scrollbar">
              <div className="flex items-center gap-2 min-w-max">
                <button className="px-3 py-1.5 rounded-full bg-gradient-primary text-white text-xs font-medium">
                  🔥 Sale!
                </button>
                {allCategories.map((category) => (
                  <Link
                    key={category._id}
                    to={`/${validateUrlConverter(category.name)}-${category._id}/all-all`}
                    className="px-3 py-1.5 rounded-full bg-bg-alt text-text-muted text-xs font-medium whitespace-nowrap hover:bg-primary hover:text-white transition"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="fixed left-0 top-0 bottom-0 w-[85%] max-w-sm bg-card z-50 shadow-2xl animate-slide-in-left overflow-y-auto">
              <ShowMenu
                user={user}
                onClose={() => setMobileMenuOpen(false)}
                isMobile={true}
                wishlistCount={wishlistCount}
              />
            </div>
          </>
        )}

        {/* Mobile Search Modal */}
        {mobileSearchOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setMobileSearchOpen(false)}
            />
            <div className="fixed top-0 left-0 right-0 bg-card z-50 p-4 shadow-lg animate-slide-in-down">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What are you looking for?"
                  className="input pl-10 pr-12 py-3 w-full"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 btn btn-primary px-3 py-1 text-sm"
                >
                  Go
                </button>
              </form>
              <button
                onClick={() => setMobileSearchOpen(false)}
                className="absolute right-4 top-4 text-text-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </>
        )}

        {opencart && <DisplayCart close={() => setOpencart(false)} />}
      </header>

      <style jsx>{`
        @keyframes slide-in-left {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes slide-in-down {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.3s ease-out;
        }
        .animate-slide-in-down {
          animation: slide-in-down 0.3s ease-out;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

export default Header;