import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Search, User, ShoppingBag, Menu, Heart, ChevronDown, X,
  ChevronLeft, ChevronRight
} from "lucide-react";
import useMobile from "../hooks/useMobile";
import DisplayCart from "./DisplayCart";
import ShowMenu from "./ShowMenu";
import DarkModeToggle from "./DarkModeToggle";
import { formatINR } from "../utils/formatINR";
import { validateUrlConverter } from "../utils/validateUrl";
import logo from "../assets/logoBuyZaar.svg";
import { calculateDiscountedPrice } from "../utils/priceUtils";

const Header = () => {
  const [isMobile] = useMobile();
  const location = useLocation();
  const navigate = useNavigate();

  const [opencart, setOpencart] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const categoriesContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const [logoutTrigger, setLogoutTrigger] = useState(0);
  const user = useSelector((state) => state.user);
  const cartitems = useSelector((state) => state.cart?.cartitems || []);
  const wishlistCount = useSelector((state) => state.wishlist?.items?.length || 0);
  const allCategories = useSelector((state) => state.product.allCategory);

  useEffect(() => {
    if (!user?.id) setUserMenuOpen(false);
  }, [user]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setMobileSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && user?.id === undefined) {
      setLogoutTrigger(prev => prev + 1);
    }
  }, [user?.id]);

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
    (sum, item) => {
      const originalPrice = item.productId?.price || 0;
      const discount = item.productId?.discount || 0;
      const discountedPrice = originalPrice - (originalPrice * discount / 100);
      return sum + (discountedPrice * (item.quantity || 0));
    },
    0
  );

  const isSearchPage = location.pathname === "/search";

  if (isSearchPage) return null;

  const Logo = () => (
    <h1 className="text-xl md:text-2xl font-black tracking-wide flex items-center">
      <span className="px-4 py-1 rounded-2xl bg-blue-700 text-white shadow-xl">
        Buy
      </span>
      <span className="ml-2 text-orange-400 relative">
        Zaar
        <span className="absolute left-0 -bottom-1 h-[3px] w-full bg-orange-400 rounded-full"></span>
      </span>
    </h1>
  );

  const MobileLogo = () => (
    <h1 className="text-sm font-black tracking-wide flex items-center">
      <span className="px-2 py-0.5 rounded-xl bg-blue-700 text-white shadow-lg">
        Buy
      </span>
      <span className="ml-1.5 text-orange-400 relative">
        Zaar
        <span className="absolute left-0 -bottom-0.5 h-[2px] w-full bg-orange-400 rounded-full"></span>
      </span>
    </h1>
  );

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        {!isMobile ? (
          <div className="container-wide">
            <div className="flex items-center justify-between px-6 py-4 gap-4">
              <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
                <div className="rounded-full flex items-center justify-center shadow-md">
                  <img src={logo} alt="logo" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
                </div>
                <div>
                  <Logo />
                  <p className="text-xs text-gray-500 hidden lg:block">Just Buy It!</p>
                </div>
              </Link>

              <div className="flex-1 max-w-2xl mx-4 lg:mx-8">
                <form onSubmit={handleSearch} className="relative w-full">
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <Search className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products, brands, and categories..."
                      className="w-full h-12 pl-11 pr-28 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-800 placeholder:text-gray-400"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <button type="submit" className="bg-blue-600 text-white px-4 py-1.5 text-sm whitespace-nowrap rounded-lg hover:bg-blue-700 transition">
                        Search
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <DarkModeToggle />

                <button
                  onClick={() => navigate("/dashboard/wishlist")}
                  className="relative p-2 hover:bg-gray-100 rounded-lg transition group"
                >
                  <Heart className="w-5 h-5 text-gray-600" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                {user?.id ? (
                  <div key={logoutTrigger} className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-orange-500 flex items-center justify-center text-white font-semibold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-left hidden lg:block">
                        <p className="text-sm font-semibold">{user?.name?.split(' ')[0] || "Account"}</p>
                        <p className="text-xs text-gray-500">My Account</p>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
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
                  <button onClick={() => navigate("/login")} className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </button>
                )}

                <button
                  onClick={() => setOpencart(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition group relative"
                >
                  <div className="relative">
                    <ShoppingBag className="w-5 h-5 text-blue-600" />
                    {totalProducts > 0 && (
                      <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                        {totalProducts}
                      </span>
                    )}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-semibold">Cart</p>
                    <p className="text-xs text-gray-500">{formatINR(totalPrice)}</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg mt-2 mb-1">
              <div className="relative px-6 py-2.5">
                {showLeftArrow && (
                  <button
                    onClick={() => scrollCategories('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-blue-700 text-white p-1.5 rounded-full shadow-lg hover:bg-blue-800 transition-all"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft size={16} />
                  </button>
                )}

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

                {showRightArrow && (
                  <button
                    onClick={() => scrollCategories('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-blue-700 text-white p-1.5 rounded-full shadow-lg hover:bg-blue-800 transition-all"
                    aria-label="Scroll right"
                  >
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="px-3 py-2">
            <div className="flex items-center justify-between gap-2 mb-2">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-lg bg-gray-100 active:bg-gray-200 transition flex-shrink-0"
              >
                <Menu className="w-5 h-5 text-gray-700" />
              </button>

              <Link to="/" className="flex items-center gap-1.5 flex-shrink-0 min-w-0">
                <img src={logo} alt="logo" className="w-6 h-6 object-contain flex-shrink-0" />
                <MobileLogo />
              </Link>

              <div className="flex items-center gap-0.5 flex-shrink-0">
                <DarkModeToggle />

                <button
                  onClick={() => navigate("/dashboard/wishlist")}
                  className="relative p-1.5 rounded-lg active:bg-gray-200 transition"
                >
                  <Heart className="w-4 h-4 text-gray-600" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold">
                      {wishlistCount > 9 ? '9+' : wishlistCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setOpencart(true)}
                  className="relative p-1.5 rounded-lg active:bg-gray-200 transition"
                >
                  <ShoppingBag className="w-4 h-4 text-blue-600" />
                  {totalProducts > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold">
                      {totalProducts > 9 ? '9+' : totalProducts}
                    </span>
                  )}
                </button>

                {!user?.id && (
                  <button
                    onClick={() => navigate("/login")}
                    className="p-1.5 rounded-lg bg-blue-600 text-white active:bg-blue-700 transition"
                  >
                    <User className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="mt-2">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full h-10 pl-9 pr-3 rounded-lg bg-gray-100 border border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm text-gray-800 placeholder:text-gray-400"
                />
              </form>
            </div>

            <div className="mt-3 overflow-x-auto pb-2 hide-scrollbar">
              <div className="flex items-center gap-2 min-w-max bg-blue-600 rounded-lg px-2 py-1.5">
                <Link
                  to="/flash-sale"
                  className="px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold shadow-md"
                >
                  SALE
                </Link>
                {allCategories.slice(0, 8).map((category) => (
                  <Link
                    key={category._id}
                    to={`/${validateUrlConverter(category.name)}-${category._id}/all-all`}
                    className="px-3 py-1.5 rounded-full text-white text-xs font-medium whitespace-nowrap active:bg-blue-700 transition"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="fixed left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white z-50 shadow-2xl animate-slide-in-left overflow-y-auto">
              <ShowMenu
                user={user}
                onClose={() => setMobileMenuOpen(false)}
                isMobile={true}
                wishlistCount={wishlistCount}
              />
            </div>
          </>
        )}

        {mobileSearchOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
              onClick={() => setMobileSearchOpen(false)}
            />
            <div className="fixed top-0 left-0 right-0 bg-white z-50 p-4 shadow-lg animate-slide-in-down">
              <form onSubmit={handleSearch} className="relative w-full">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What are you looking for?"
                    className="w-full h-12 pl-10 pr-16 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-800"
                    autoFocus
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <button type="submit" className="bg-blue-600 text-white px-3 py-1.5 text-sm whitespace-nowrap rounded-lg">
                      Go
                    </button>
                  </div>
                </div>
              </form>
              <button
                onClick={() => setMobileSearchOpen(false)}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-800 transition-colors"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </>
        )}

        {opencart && <DisplayCart close={() => setOpencart(false)} />}
      </header>

      <style>{`
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