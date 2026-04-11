import React, { useEffect, useState, useCallback } from "react";
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
  Grid,
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

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchterm = searchParams.get("q") || "";

  const LIMIT = 12;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await Axios({ 
          ...summaryApi().getAllCategory,
          method: 'GET'
        });
        if (res.data?.success) {
          setCategories(res.data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const fetchData = useCallback(async (pageNum = 1, reset = false) => {
    try {
      setLoading(true);

      const res = await Axios({
        ...summaryApi().searchProduct,
        data: {
          search: searchterm,
          page: pageNum,
          limit: LIMIT,
          ...(filters.category && { category: filters.category }),
          ...(filters.sortBy !== 'relevance' && { sortBy: filters.sortBy }),
          ...(filters.minPrice && { minPrice: filters.minPrice }),
          ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
          ...(filters.inStock && { inStock: 'true' })
        }
      });

      const { data: resData } = res;

      if (resData?.success) {
        const items = resData.data || [];
        const total = resData.total || resData.totalProducts || items.length;
        
        if (reset || pageNum === 1) {
          setData(items);
        } else {
          setData((prev) => [...prev, ...items]);
        }

        setTotalResults(total);
        
        const apiLimit = resData.limit || LIMIT;
        const totalPages = resData.totalNoPage || Math.ceil(total / apiLimit);
        setHasMore(pageNum < totalPages);
      } else {
        if (pageNum === 1) {
          setData([]);
          setTotalResults(0);
        }
        setHasMore(false);
        toast.error(resData?.message || "No results found");
      }
    } catch (error) {
      console.error("Search API Error:", error);

      if (error.code === 'ERR_NETWORK') {
        toast.error("Cannot connect to server. Make sure backend is running");
      } else if (error.response?.status === 404) {
        toast.error("Search endpoint not found. Check backend routes.");
      } else if (error.response?.status === 500) {
        toast.error("Server error. Check backend logs.");
      } else {
        AxiosError(error);
      }
      
      setHasMore(false);
      if (pageNum === 1) {
        setData([]);
        setTotalResults(0);
      }
    } finally {
      setLoading(false);
    }
  }, [searchterm, filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchData(1, true);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchterm, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
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
  };

  const fetchMoreData = () => {
    if (!hasMore || loading) return;
    const next = page + 1;
    setPage(next);
    fetchData(next);
  };

  const handleBack = () => {
    navigate(-1);
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
    return value !== '' && value !== null;
  }).length;

  return (
    <div className="min-h-screen bg-bg fade-in">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border backdrop-blur-sm bg-card/95">
        <div className="container-wide px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 rounded-lg hover:bg-bg-alt transition-colors text-text-muted hover:text-text"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted" size={18} />
              <input
                type="text"
                value={searchterm}
                onChange={(e) => {
                  navigate(`/search?q=${encodeURIComponent(e.target.value)}`);
                }}
                placeholder="Search for products, brands, and categories..."
                className="input pl-11 pr-12 py-2.5 w-full"
                autoFocus
              />
              {searchterm && (
                <button
                  onClick={() => navigate('/search')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text"
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
          {/* Filters Sidebar */}
          {(showFilters || window.innerWidth >= 1024) && (
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
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="space-y-5">
                  {/* Sort By Section */}
                  <div>
                    <button
                      onClick={() => toggleFilterSection('sort')}
                      className="w-full flex items-center justify-between py-2"
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

                  {/* Price Range Section */}
                  <div>
                    <button
                      onClick={() => toggleFilterSection('price')}
                      className="w-full flex items-center justify-between py-2"
                    >
                      <h4 className="font-medium text-text">Price Range</h4>
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
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={filters.maxPrice}
                          onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                          className="input py-2 text-sm"
                        />
                      </div>
                    )}
                  </div>

                  {/* Category Section */}
                  {categories.length > 0 && (
                    <div>
                      <button
                        onClick={() => toggleFilterSection('category')}
                        className="w-full flex items-center justify-between py-2"
                      >
                        <h4 className="font-medium text-text">Category</h4>
                        {expandedFilters.category ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      {expandedFilters.category && (
                        <select
                          value={filters.category}
                          onChange={(e) => handleFilterChange('category', e.target.value)}
                          className="input mt-2 text-sm"
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

                  {/* Stock Section */}
                  <div>
                    <button
                      onClick={() => toggleFilterSection('stock')}
                      className="w-full flex items-center justify-between py-2"
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
                          className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-text-muted">In Stock Only</span>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results Section */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h1 className="text-2xl font-display font-bold text-text">
                    {searchterm ? `"${searchterm}"` : "All Products"}
                  </h1>
                  <p className="text-text-muted text-sm mt-1">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader size={14} className="animate-spin" />
                        Searching...
                      </span>
                    ) : (
                      `${totalResults.toLocaleString()} ${totalResults === 1 ? 'result' : 'results'} found`
                    )}
                  </p>
                </div>
                
                {!showFilters && (
                  <button
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden btn btn-outline py-2 px-4 text-sm flex items-center gap-2"
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

              {/* Active Filters Chips */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {filters.sortBy !== 'relevance' && (
                    <span className="badge bg-primary/10 text-primary px-3 py-1 text-sm rounded-full flex items-center gap-1">
                      Sort: {sortOptions.find(o => o.value === filters.sortBy)?.label}
                      <button onClick={() => handleFilterChange('sortBy', 'relevance')} className="hover:text-error">
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {filters.category && categories.find(c => c._id === filters.category) && (
                    <span className="badge bg-primary/10 text-primary px-3 py-1 text-sm rounded-full flex items-center gap-1">
                      Category: {categories.find(c => c._id === filters.category)?.name}
                      <button onClick={() => handleFilterChange('category', '')} className="hover:text-error">
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {filters.minPrice && (
                    <span className="badge bg-primary/10 text-primary px-3 py-1 text-sm rounded-full flex items-center gap-1">
                      Min: ₹{parseInt(filters.minPrice).toLocaleString()}
                      <button onClick={() => handleFilterChange('minPrice', '')} className="hover:text-error">
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {filters.maxPrice && (
                    <span className="badge bg-primary/10 text-primary px-3 py-1 text-sm rounded-full flex items-center gap-1">
                      Max: ₹{parseInt(filters.maxPrice).toLocaleString()}
                      <button onClick={() => handleFilterChange('maxPrice', '')} className="hover:text-error">
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {filters.inStock && (
                    <span className="badge bg-primary/10 text-primary px-3 py-1 text-sm rounded-full flex items-center gap-1">
                      In Stock Only
                      <button onClick={() => handleFilterChange('inStock', false)} className="hover:text-error">
                        <X size={12} />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Results Grid */}
            {loading && data.length === 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {Array(8).fill(null).map((_, i) => (
                  <CartLoading key={`loading-${i}`} />
                ))}
              </div>
            ) : data.length === 0 && !loading ? (
              <div className="text-center py-16 bg-card rounded-xl border border-border">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={48} className="text-primary/40" />
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
                    onClick={() => navigate('/search')}
                    className="btn btn-primary"
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

                {/* Load More */}
                {hasMore && (
                  <div className="text-center mt-10">
                    <button
                      onClick={fetchMoreData}
                      disabled={loading}
                      className="btn btn-outline px-8 py-3 rounded-xl flex items-center gap-2 mx-auto"
                    >
                      {loading ? (
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

                {/* End Message */}
                {!hasMore && data.length > 0 && (
                  <div className="text-center py-8 border-t border-border mt-8">
                    <p className="text-text-muted text-sm">
                      🎉 You've seen all {totalResults} products
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