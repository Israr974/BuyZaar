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
  Sparkles
} from "lucide-react";
import CardProduct from "../components/CardProduct";
import CartLoading from "../components/CartLoading";

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
      toast.error("Cannot connect to server. Make sure backend is running on port 3030");
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

 
  const sortOptions = [
    { value: "relevance", label: "Relevance", icon: TrendingUp },
    { value: "price-low", label: "Price: Low to High", icon: DollarSign },
    { value: "price-high", label: "Price: High to Low", icon: DollarSign },
    { value: "rating", label: "Top Rated", icon: Star },
    { value: "newest", label: "Newest", icon: Sparkles }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/50 to-primary/5">
      
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-text-muted hover:text-text transition-colors p-2 rounded-lg hover:bg-gray-100"
            >
              <ChevronLeft size={20} />
              <span className="hidden sm:inline">Back</span>
            </button>
            
            <div className="flex-1 max-w-2xl mx-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted" size={20} />
                <input
                  type="text"
                  value={searchterm}
                  onChange={(e) => {
                    navigate(`/search?q=${encodeURIComponent(e.target.value)}`);
                  }}
                  placeholder="Search products..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white"
                  autoFocus
                />
                {searchterm && (
                  <button
                    onClick={() => navigate('/search')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
                showFilters 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-text hover:bg-gray-200'
              }`}
            >
              <Filter size={18} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
         
          {showFilters && (
            <div className="lg:w-64">
              <div className="card p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-text">Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary hover:text-primary-dark"
                  >
                    Clear all
                  </button>
                </div>

                <div className="space-y-6">
                 
                  <div>
                    <h4 className="font-medium text-text mb-3">Sort By</h4>
                    <div className="space-y-2">
                      {sortOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.value}
                            onClick={() => handleFilterChange('sortBy', option.value)}
                            className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-all ${
                              filters.sortBy === option.value
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-text'
                            }`}
                          >
                            <Icon size={16} />
                            <span>{option.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  
                  <div>
                    <h4 className="font-medium text-text mb-3">Price Range</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        className="input text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        className="input text-sm"
                      />
                    </div>
                  </div>

                  
                  {categories.length > 0 && (
                    <div>
                      <h4 className="font-medium text-text mb-3">Category</h4>
                      <select
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="input"
                      >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="inStock"
                      checked={filters.inStock}
                      onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                      className="h-4 w-4 text-primary rounded"
                    />
                    <label htmlFor="inStock" className="text-text">
                      In Stock Only
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          
          <div className={`flex-1 ${showFilters ? 'lg:ml-0' : ''}`}>
            
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-text">
                    {searchterm ? `"${searchterm}"` : "All Products"}
                  </h1>
                  <p className="text-text-muted mt-2">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader size={16} className="animate-spin" />
                        Searching...
                      </span>
                    ) : (
                      `${totalResults.toLocaleString()} results found`
                    )}
                  </p>
                </div>
                
                {!showFilters && (
                  <button
                    onClick={() => setShowFilters(true)}
                    className="btn-outline flex items-center gap-2 lg:hidden"
                  >
                    <Filter size={16} />
                    Filters
                  </button>
                )}
              </div>

              
              <div className="flex flex-wrap gap-2">
                {sortOptions.slice(1).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange('sortBy', option.value)}
                    className={`badge ${filters.sortBy === option.value ? 'badge-primary' : 'badge'}`}
                  >
                    <option.icon size={12} />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

           
            {loading && data.length === 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array(8).fill(null).map((_, i) => (
                  <CartLoading key={`loading-${i}`} />
                ))}
              </div>
            ) : data.length === 0 && !loading ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={48} className="text-primary/40" />
                </div>
                <h3 className="text-xl font-semibold text-text mb-2">
                  {searchterm ? "No products found" : "No products available"}
                </h3>
                <p className="text-text-muted mb-6">
                  {searchterm 
                    ? "Try adjusting your search or filters"
                    : "Check back later for new products"}
                </p>
                {searchterm && (
                  <button
                    onClick={() => navigate('/search')}
                    className="btn-primary"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {data.map((item) => (
                  <CardProduct 
                    key={item._id} 
                    product={item}
                    className="card-hover"
                  />
                ))}
              </div>
            )}

            
            {data.length > 0 && hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={fetchMoreData}
                  disabled={loading}
                  className="btn-primary flex items-center gap-2 mx-auto"
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

            
            {data.length > 0 && !hasMore && (
              <div className="text-center py-12 border-t border-border mt-8">
                <p className="text-text-muted">
                  🎉 You've seen all {totalResults} products
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;