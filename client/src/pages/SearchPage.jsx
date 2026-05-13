import React, { useRef, useEffect, useState, useCallback } from "react";
import Axios from "../utils/Axios";
import AxiosError from "../utils/AxiosToError";
import summaryApi from "../common/summartApi";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { 
  Search, 
  Filter, 
  X, 
  ChevronLeft, 
  Package,
  Star,
  DollarSign,
  TrendingUp,
  Loader,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import CardProduct from "../components/CardProduct";
import CartLoading from "../components/CartLoading";
import { CheckCircle } from "lucide-react";

const SearchPage = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: "relevance",
    category: "",
    minPrice: "",
    maxPrice: "",
    rating: "",
    inStock: false
  });
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [expandedFilters, setExpandedFilters] = useState({
    sort: true,
    price: true,
    category: true,
    stock: true
  });
  const [inputValue, setInputValue] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const typingTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);
  const isMounted = useRef(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchterm = searchParams.get("q") || "";

  const LIMIT = 12;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setInputValue(searchterm);
  }, [searchterm]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await Axios({ 
          ...summaryApi().getAllCategory,
          method: 'GET'
        });
        if (isMounted.current && res.data?.success) {
          setCategories(res.data.data || []);
        }
      } catch (error) {
        if (isMounted.current) {
          console.error('Failed to fetch categories:', error);
        }
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setPage(1);
    setInitialLoad(true);
  }, [searchterm, filters.sortBy, filters.category, filters.minPrice, filters.maxPrice, filters.inStock]);

  const fetchData = useCallback(async (pageNum = 1, isLoadMore = false) => {
    if (!searchterm && pageNum === 1 && !filters.category) {
      if (isMounted.current) {
        setData([]);
        setTotalResults(0);
        setHasMore(false);
        setLoading(false);
        setLoadingMore(false);
      }
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();

    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const params = {
        search: searchterm,
        page: pageNum,
        limit: LIMIT,
      };
      
      if (filters.category && filters.category !== '') {
        params.category = filters.category;
      }
      if (filters.sortBy && filters.sortBy !== 'relevance') {
        params.sortBy = filters.sortBy;
      }
      if (filters.minPrice && filters.minPrice !== '') {
        params.minPrice = Number(filters.minPrice);
      }
      if (filters.maxPrice && filters.maxPrice !== '') {
        params.maxPrice = Number(filters.maxPrice);
      }
      if (filters.inStock) {
        params.inStock = 'true';
      }

      const res = await Axios({
        ...summaryApi().searchProduct,
        method: 'GET',
        params,
        signal: abortControllerRef.current.signal,
      });

      if (!isMounted.current) return;

      const { data: resData } = res;

      if (resData?.success) {
        const items = resData.data || [];
        const total = resData.total || resData.totalProducts || items.length;
        
        if (pageNum === 1) {
          setData(items);
        } else {
          setData((prev) => [...prev, ...items]);
        }

        setTotalResults(total);
        
        const apiLimit = resData.limit || LIMIT;
        const totalPages = resData.totalNoPage || Math.ceil(total / apiLimit);
        const newHasMore = pageNum < totalPages;
        setHasMore(newHasMore);
        
        if (initialLoad) setInitialLoad(false);
      } else {
        if (pageNum === 1) {
          setData([]);
          setTotalResults(0);
        }
        setHasMore(false);
        if (resData?.message && isMounted.current) {
          toast.error(resData.message);
        }
      }
    } catch (error) {
      if (!isMounted.current) return;
      
      if (error.name !== 'AbortError' && error.code !== 'ERR_CANCELED') {
        console.error("Search API Error:", error);

        if (error.code === 'ERR_NETWORK') {
          toast.error("Cannot connect to server. Please check your connection.");
        } else if (error.response?.status === 404) {
          toast.error("Search service unavailable. Please try again later.");
        } else if (error.response?.status === 500) {
          toast.error("Server error. Please try again.");
        } else {
          AxiosError(error);
        }
      }
      
      setHasMore(false);
      if (pageNum === 1) {
        setData([]);
        setTotalResults(0);
      }
    } finally {
      if (isMounted.current) {
        if (isLoadMore) {
          setLoadingMore(false);
        } else {
          setLoading(false);
        }
      }
    }
  }, [searchterm, filters, LIMIT, initialLoad]);

  useEffect(() => {
    if (initialLoad && !searchterm && !filters.category) return;
    
    const timer = setTimeout(() => {
      if (isMounted.current) {
        fetchData(1, false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchterm, filters.sortBy, filters.category, filters.minPrice, filters.maxPrice, filters.inStock, fetchData, initialLoad]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      sortBy: "relevance",
      category: "",
      minPrice: "",
      maxPrice: "",
      rating: "",
      inStock: false
    });
    setShowFilters(false);
  };

  const fetchMoreData = () => {
    if (!hasMore || loading || loadingMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchData(nextPage, true);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      if (isMounted.current) {
        navigate(`/search?q=${encodeURIComponent(value)}`, { replace: true });
      }
    }, 500);
  };

  const handleClearSearch = () => {
    setInputValue("");
    navigate('/search', { replace: true });
  };

  const toggleFilterSection = (section) => {
    setExpandedFilters(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const sortOptions = [
    { value: "relevance", label: "Relevance", icon: TrendingUp },
    { value: "price-low", label: "Price: Low to High", icon: DollarSign },
    { value: "price-high", label: "Price: High to Low", icon: DollarSign },
    { value: "rating", label: "Top Rated", icon: Star },
    { value: "newest", label: "Newest", icon: Sparkles }
  ];

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'sortBy' && value === 'relevance') return false;
    if (key === 'inStock') return value === true;
    if (key === 'rating') return value !== '' && value !== null;
    return value !== '' && value !== null && value !== false;
  }).length;

  const isLoading = loading && data.length === 0;
  const hasNoResults = !isLoading && data.length === 0 && !initialLoad;

  return (
    <div className="min-h-screen bg-bg fade-in">
      <div className="sticky top-0 z-40 bg-card border-b border-border backdrop-blur-sm bg-card/95">
        <div className="container-wide px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 rounded-lg hover:bg-bg-alt transition-colors text-text-muted hover:text-text"
              aria-label="Go back"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={handleSearchInputChange}
                placeholder="Search for products, brands, and categories..."
                className="input pl-10 pr-12 py-2.5 w-full"
                autoFocus
                aria-label="Search products"
              />
              {inputValue && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
                showFilters || activeFiltersCount > 0
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-bg-alt text-text hover:bg-primary/10'
              }`}
              aria-label="Toggle filters"
            >
              <SlidersHorizontal size={18} />
              <span className="hidden sm:inline">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="ml-1 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="container-wide px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {(showFilters || !isMobile) && (
            <div className="lg:w-72 flex-shrink-0">
              <div className="bg-card rounded-xl border border-border p-5 sticky top-24">
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-border">
                  <h3 className="font-semibold text-text flex items-center gap-2">
                    <Filter size={18} className="text-primary" />
                    Filters
                  </h3>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-primary hover:underline"
                      aria-label="Clear all filters"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="space-y-5">
                  <div>
                    <button
                      onClick={() => toggleFilterSection('sort')}
                      className="w-full flex items-center justify-between py-2"
                      aria-label="Toggle sort options"
                    >
                      <h4 className="font-medium text-text">Sort By</h4>
                      {expandedFilters.sort ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {expandedFilters.sort && (
                      <div className="space-y-2 mt-2">
                        {sortOptions.map((option) => {
                          const Icon = option.icon;
                          const isActive = filters.sortBy === option.value;
                          return (
                            <button
                              key={option.value}
                              onClick={() => handleFilterChange('sortBy', option.value)}
                              className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-all ${
                                isActive
                                  ? 'bg-primary text-white'
                                  : 'hover:bg-bg-alt text-text-muted hover:text-text'
                              }`}
                              aria-label={`Sort by ${option.label}`}
                            >
                              <Icon size={14} />
                              <span className="text-sm">{option.label}</span>
                              {isActive && <CheckCircle size={12} className="ml-auto" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div>
                    <button
                      onClick={() => toggleFilterSection('price')}
                      className="w-full flex items-center justify-between py-2"
                      aria-label="Toggle price range"
                    >
                      <h4 className="font-medium text-text">Price Range (₹)</h4>
                      {expandedFilters.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {expandedFilters.price && (
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={filters.minPrice}
                          onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                          className="input py-2 text-sm"
                          aria-label="Minimum price"
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={filters.maxPrice}
                          onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                          className="input py-2 text-sm"
                          aria-label="Maximum price"
                        />
                      </div>
                    )}
                  </div>

                  {categories.length > 0 && (
                    <div>
                      <button
                        onClick={() => toggleFilterSection('category')}
                        className="w-full flex items-center justify-between py-2"
                        aria-label="Toggle categories"
                      >
                        <h4 className="font-medium text-text">Category</h4>
                        {expandedFilters.category ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      {expandedFilters.category && (
                        <select
                          value={filters.category}
                          onChange={(e) => handleFilterChange('category', e.target.value)}
                          className="input mt-2 text-sm"
                          aria-label="Select category"
                        >
                          <option value="">All Categories</option>
                          {categories.map(category => (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}

                  <div>
                    <button
                      onClick={() => toggleFilterSection('stock')}
                      className="w-full flex items-center justify-between py-2"
                      aria-label="Toggle stock filter"
                    >
                      <h4 className="font-medium text-text">Availability</h4>
                      {expandedFilters.stock ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {expandedFilters.stock && (
                      <label className="flex items-center gap-3 mt-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.inStock}
                          onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                          className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-2"
                          aria-label="Show in stock only"
                        />
                        <span className="text-sm text-text-muted">In Stock Only</span>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1">
            <div className="mb-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h1 className="text-2xl font-display font-bold text-text">
                    {searchterm ? `"${searchterm}"` : "All Products"}
                  </h1>
                  <p className="text-text-muted text-sm mt-1">
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader size={14} className="animate-spin" />
                        Searching...
                      </span>
                    ) : (
                      `${totalResults.toLocaleString()} ${totalResults === 1 ? 'result' : 'results'} found`
                    )}
                  </p>
                </div>
                
                {!showFilters && isMobile && (
                  <button
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden btn-outline py-2 px-4 text-sm flex items-center gap-2"
                    aria-label="Open filters"
                  >
                    <Filter size={14} />
                    Filters
                    {activeFiltersCount > 0 && (
                      <span className="bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>
                )}
              </div>

              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {filters.sortBy !== 'relevance' && (
                    <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 text-sm rounded-full">
                      Sort: {sortOptions.find(o => o.value === filters.sortBy)?.label}
                      <button 
                        onClick={() => handleFilterChange('sortBy', 'relevance')} 
                        className="hover:text-error transition-colors"
                        aria-label="Remove sort filter"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {filters.category && categories.find(c => c._id === filters.category) && (
                    <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 text-sm rounded-full">
                      Category: {categories.find(c => c._id === filters.category)?.name}
                      <button 
                        onClick={() => handleFilterChange('category', '')} 
                        className="hover:text-error transition-colors"
                        aria-label="Remove category filter"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {filters.minPrice && (
                    <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 text-sm rounded-full">
                      Min: ₹{Number(filters.minPrice).toLocaleString()}
                      <button 
                        onClick={() => handleFilterChange('minPrice', '')} 
                        className="hover:text-error transition-colors"
                        aria-label="Remove min price filter"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {filters.maxPrice && (
                    <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 text-sm rounded-full">
                      Max: ₹{Number(filters.maxPrice).toLocaleString()}
                      <button 
                        onClick={() => handleFilterChange('maxPrice', '')} 
                        className="hover:text-error transition-colors"
                        aria-label="Remove max price filter"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {filters.inStock && (
                    <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 text-sm rounded-full">
                      In Stock Only
                      <button 
                        onClick={() => handleFilterChange('inStock', false)} 
                        className="hover:text-error transition-colors"
                        aria-label="Remove stock filter"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {Array(8).fill(null).map((_, i) => (
                  <CartLoading key={`loading-${i}`} />
                ))}
              </div>
            ) : hasNoResults ? (
              <div className="text-center py-16 bg-card rounded-xl border border-border">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={48} className="text-primary/40" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-display font-semibold text-text mb-2">
                  {searchterm ? "No products found" : "No products available"}
                </h3>
                <p className="text-text-muted mb-6 max-w-md mx-auto">
                  {searchterm 
                    ? "Try adjusting your search or filter criteria"
                    : "Check back later for new products"}
                </p>
                {searchterm && (
                  <button
                    onClick={handleClearSearch}
                    className="btn-primary px-6 py-2 rounded-lg"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                  {data.map((item) => (
                    <CardProduct key={item._id} product={item} />
                  ))}
                </div>

                {hasMore && (
                  <div className="text-center mt-10">
                    <button
                      onClick={fetchMoreData}
                      disabled={loadingMore}
                      className="btn-outline px-8 py-3 rounded-xl flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Load more products"
                    >
                      {loadingMore ? (
                        <>
                          <Loader size={18} className="animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <Package size={18} />
                          Load More Products
                        </>
                      )}
                    </button>
                  </div>
                )}

                {!hasMore && data.length > 5 && (
                  <div className="text-center py-8 border-t border-border mt-8">
                    <p className="text-text-muted text-sm">
                       You've seen all {totalResults} products
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;