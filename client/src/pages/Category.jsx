import React, { useEffect, useState } from "react";
import UploadCategoryModel from "../components/UploadCategoryModel";
import summaryApi from "../common/summartApi";
import Axios from "../utils/Axios";
import AxiosError from "../utils/AxiosToError";
import ConfirmBox from "../components/ConfirmBox";
import { useDispatch, useSelector } from "react-redux";
import { setAllCategory } from "../redux/productSlice";
import { 
  Plus, Edit2, Trash2, Grid3x3, Search, Filter, 
  Package, TrendingUp, FolderTree, X, AlertCircle,
  ChevronDown, ChevronUp, Calendar, Clock
} from "lucide-react";

const CategoryPage = () => {
  const [openUploadCategory, setOpenUploadCategory] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRangeFilter, setDateRangeFilter] = useState("all");
  const [productCountFilter, setProductCountFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [categoryProductsCount, setCategoryProductsCount] = useState({});
  const [totalProductsCount, setTotalProductsCount] = useState(0);

  const dispatch = useDispatch();
  const allCategory = useSelector((state) => state.product.allCategory);

  const dateRangeOptions = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" }
  ];

  const productCountOptions = [
    { value: "all", label: "All Categories" },
    { value: "empty", label: "No Products (0)" },
    { value: "low", label: "1-10 Products" },
    { value: "medium", label: "11-50 Products" },
    { value: "high", label: "50+ Products" }
  ];

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const catRes = await Axios({ ...summaryApi().getAllCategory });
      const categories = catRes.data?.data || [];
      dispatch(setAllCategory(categories));
      
      const productRes = await Axios({ 
        ...summaryApi().getProduct,
        params: { page: 1, limit: 1000 }
      });
      
      if (productRes.data?.success) {
        const products = productRes.data.data || [];
        const totalCount = productRes.data.totalCount || products.length;
        
        const counts = {};
        products.forEach(product => {
          const categoryId = product.category?._id || product.category;
          if (categoryId) {
            counts[categoryId] = (counts[categoryId] || 0) + 1;
          }
        });
        
        setCategoryProductsCount(counts);
        setTotalProductsCount(totalCount);
      }
    } catch (error) {
      AxiosError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeleteCategory = async (id) => {
    try {
      await Axios({ ...summaryApi().deleteCategory(id) });
      setDeleteCategoryId(null);
      fetchCategories();
    } catch (error) {
      AxiosError(error);
    }
  };

  const getProductCount = (categoryId) => {
    return categoryProductsCount[categoryId] || 0;
  };

  const isWithinDateRange = (createdAt) => {
    if (dateRangeFilter === "all") return true;
    
    const date = new Date(createdAt);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(today.getMonth() - 1);
    const yearAgo = new Date(today);
    yearAgo.setFullYear(today.getFullYear() - 1);

    switch (dateRangeFilter) {
      case "today": return date >= today;
      case "week": return date >= weekAgo;
      case "month": return date >= monthAgo;
      case "year": return date >= yearAgo;
      default: return true;
    }
  };

  const matchesProductCount = (categoryId) => {
    const count = getProductCount(categoryId);
    switch (productCountFilter) {
      case "empty": return count === 0;
      case "low": return count >= 1 && count <= 10;
      case "medium": return count >= 11 && count <= 50;
      case "high": return count > 50;
      default: return true;
    }
  };

  const getFilteredCategories = () => {
    let filtered = [...allCategory];
    
    if (searchTerm) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(category => 
        (category.status || "active") === statusFilter
      );
    }
    
    filtered = filtered.filter(category => isWithinDateRange(category.createdAt));
    filtered = filtered.filter(category => matchesProductCount(category._id));
    
    const sortMultiplier = sortOrder === "asc" ? 1 : -1;
    
    if (sortBy === "name") {
      filtered.sort((a, b) => sortMultiplier * a.name.localeCompare(b.name));
    } else if (sortBy === "products") {
      filtered.sort((a, b) => sortMultiplier * (getProductCount(b._id) - getProductCount(a._id)));
    } else if (sortBy === "newest") {
      filtered.sort((a, b) => sortMultiplier * (new Date(b.createdAt) - new Date(a.createdAt)));
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => sortMultiplier * (new Date(a.createdAt) - new Date(b.createdAt)));
    }
    
    return filtered;
  };

  const filteredCategories = getFilteredCategories();
  const activeCount = allCategory.filter(c => (c.status || "active") !== "inactive").length;
  const emptyCategoriesCount = allCategory.filter(c => getProductCount(c._id) === 0).length;

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateRangeFilter("all");
    setProductCountFilter("all");
    setSortBy("name");
    setSortOrder("asc");
    setShowMobileFilters(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (statusFilter !== "all") count++;
    if (dateRangeFilter !== "all") count++;
    if (productCountFilter !== "all") count++;
    if (sortBy !== "name") count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-bg p-3 md:p-6 fade-in">
      <div className="container-narrow">
        {/* Header Section */}
        <div className="mb-4 md:mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-6 md:h-8 rounded-full bg-gradient-to-b from-primary to-accent"></div>
            <h1 className="text-xl md:text-3xl font-display font-bold text-text">
              Category Management
            </h1>
          </div>
          <p className="text-text-muted text-sm ml-4">
            Organize your products with categories
          </p>
        </div>

        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="bg-card rounded-xl border border-border p-3 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-xs md:text-sm">Total Categories</p>
                <p className="text-lg md:text-2xl font-bold gradient-text">{allCategory.length}</p>
              </div>
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FolderTree className="w-4 h-4 md:w-6 md:h-6 text-primary" />
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-3 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-xs md:text-sm">Total Products</p>
                <p className="text-lg md:text-2xl font-bold gradient-text">{totalProductsCount}</p>
              </div>
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-success/10 flex items-center justify-center">
                <Package className="w-4 h-4 md:w-6 md:h-6 text-success" />
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-3 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-xs md:text-sm">Active</p>
                <p className="text-lg md:text-2xl font-bold gradient-text">{activeCount}</p>
              </div>
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-accent" />
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-3 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-xs md:text-sm">Empty</p>
                <p className="text-lg md:text-2xl font-bold gradient-text">{emptyCategoriesCount}</p>
              </div>
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-warning/10 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 md:w-6 md:h-6 text-warning" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar - Mobile Friendly */}
        <div className="bg-card rounded-xl border border-border p-3 md:p-5 mb-4 md:mb-6">
          <div className="flex flex-col gap-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" size={16} />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 pr-4 py-2 w-full text-sm"
              />
            </div>
            
            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {/* View Toggle */}
                <div className="flex items-center gap-1 p-1 bg-bg-alt rounded-lg">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg transition ${
                      viewMode === "grid" ? "bg-primary text-white" : "text-text-muted hover:text-text"
                    }`}
                  >
                    <Grid3x3 size={14} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-lg transition ${
                      viewMode === "list" ? "bg-primary text-white" : "text-text-muted hover:text-text"
                    }`}
                  >
                    <Package size={14} />
                  </button>
                </div>
                
                {/* Filter Button */}
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className={`btn-outline px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm ${
                    getActiveFiltersCount() > 0 ? "bg-primary/10 text-primary border-primary" : ""
                  }`}
                >
                  <Filter size={14} />
                  <span>Filter</span>
                  {getActiveFiltersCount() > 0 && (
                    <span className="text-xs bg-primary text-white px-1.5 py-0.5 rounded-full">
                      {getActiveFiltersCount()}
                    </span>
                  )}
                </button>
              </div>
              
              {/* Add Category Button */}
              <button
                onClick={() => setOpenUploadCategory(true)}
                className="btn-primary px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm"
              >
                <Plus size={14} />
                <span>Add</span>
              </button>
            </div>
            
            {/* Mobile Filter Panel */}
            {showMobileFilters && (
              <div className="mt-2 p-3 bg-bg-alt rounded-lg border border-border">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-text mb-1 block">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="input py-1.5 text-sm w-full"
                    >
                      <option value="all">All</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-text mb-1 block">Date Range</label>
                    <select
                      value={dateRangeFilter}
                      onChange={(e) => setDateRangeFilter(e.target.value)}
                      className="input py-1.5 text-sm w-full"
                    >
                      {dateRangeOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-text mb-1 block">Product Count</label>
                    <select
                      value={productCountFilter}
                      onChange={(e) => setProductCountFilter(e.target.value)}
                      className="input py-1.5 text-sm w-full"
                    >
                      {productCountOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-text mb-1 block">Sort By</label>
                    <div className="flex gap-2">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="input py-1.5 text-sm flex-1"
                      >
                        <option value="name">Name</option>
                        <option value="products">Product Count</option>
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                      </select>
                      <button
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                        className="btn-outline px-2 py-1 rounded-lg text-sm"
                      >
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </button>
                    </div>
                  </div>
                  
                  <button onClick={clearFilters} className="w-full btn btn-outline py-1.5 text-sm">
                    Clear All
                  </button>
                </div>
              </div>
            )}
            
            {/* Active Filters */}
            {getActiveFiltersCount() > 0 && (
              <div className="flex flex-wrap items-center gap-1 mt-1 pt-2 border-t border-border">
                <span className="text-xs text-text-muted">Active:</span>
                {searchTerm && (
                  <span className="badge bg-primary/10 text-primary px-2 py-0.5 text-xs rounded-full flex items-center gap-1">
                    "{searchTerm.slice(0,10)}"
                    <button onClick={() => setSearchTerm("")} className="hover:text-error">
                      <X size={10} />
                    </button>
                  </span>
                )}
                {statusFilter !== "all" && (
                  <span className="badge bg-primary/10 text-primary px-2 py-0.5 text-xs rounded-full">
                    {statusFilter}
                    <button onClick={() => setStatusFilter("all")} className="ml-1 hover:text-error">
                      <X size={10} />
                    </button>
                  </span>
                )}
                <button onClick={clearFilters} className="text-xs text-primary hover:underline">
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Categories Grid/List - Responsive */}
        <div className="bg-card rounded-xl border border-border p-3 md:p-5 overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 md:py-20">
              <div className="spinner w-8 h-8 md:w-12 md:h-12 mb-4"></div>
              <p className="text-text-muted text-sm">Loading categories...</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 md:py-16 text-center">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mb-4">
                <FolderTree className="w-8 h-8 md:w-12 md:h-12 text-primary/40" />
              </div>
              <h3 className="text-lg md:text-xl font-display font-semibold text-text mb-2">
                No categories found
              </h3>
              <button
                onClick={() => setOpenUploadCategory(true)}
                className="btn btn-primary mt-4 text-sm"
              >
                <Plus size={16} />
                Add Category
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
              {filteredCategories.map((category) => (
                <div
                  key={category._id}
                  className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative"
                >
                  <div className="relative h-32 md:h-48 overflow-hidden bg-bg-alt">
                    <img
                      src={category.image || "https://via.placeholder.com/300x200?text=Category"}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="p-2 md:p-4">
                    <h3 className="font-semibold text-text text-sm md:text-lg truncate group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2 md:mt-4">
                      <span className="text-xs text-text-muted bg-bg-alt px-2 py-1 rounded-full">
                        {getProductCount(category._id)} products
                      </span>
                      <div className="flex gap-1 md:gap-2">
                        <button
                          onClick={() => {
                            setEditCategory(category);
                            setOpenUploadCategory(true);
                          }}
                          className="p-1 md:p-1.5 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={12} className="md:w-4 md:h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteCategoryId(category._id)}
                          className="p-1 md:p-1.5 rounded-lg hover:bg-error/10 text-text-muted hover:text-error transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={12} className="md:w-4 md:h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {deleteCategoryId === category._id && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10 p-2">
                      <ConfirmBox
                        close={() => setDeleteCategoryId(null)}
                        cancel={() => setDeleteCategoryId(null)}
                        confirm={() => handleDeleteCategory(category._id)}
                        title="Delete Category"
                        message={`Delete "${category.name}"?`}
                        confirmText="Delete"
                        cancelText="Cancel"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2 md:space-y-3 overflow-x-auto">
              {filteredCategories.map((category) => (
                <div
                  key={category._id}
                  className="group flex items-center gap-2 md:gap-4 p-2 md:p-4 bg-card rounded-xl border border-border hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 md:w-16 md:h-16 rounded-lg overflow-hidden bg-bg-alt flex-shrink-0">
                    <img
                      src={category.image || "https://via.placeholder.com/64x64?text=Category"}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text text-sm md:text-base truncate">
                      {category.name}
                    </h3>
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs md:text-sm font-medium text-text">
                      {getProductCount(category._id)}
                    </span>
                  </div>
                  
                  <div className="flex gap-1 md:gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        setEditCategory(category);
                        setOpenUploadCategory(true);
                      }}
                      className="p-1 md:p-2 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-colors"
                    >
                      <Edit2 size={14} className="md:w-4 md:h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteCategoryId(category._id)}
                      className="p-1 md:p-2 rounded-lg hover:bg-error/10 text-text-muted hover:text-error transition-colors"
                    >
                      <Trash2 size={14} className="md:w-4 md:h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {openUploadCategory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-4">
          <UploadCategoryModel
            onClose={() => {
              setOpenUploadCategory(false);
              setEditCategory(null);
            }}
            editData={editCategory}
            onSuccess={() => {
              fetchCategories();
              setOpenUploadCategory(false);
              setEditCategory(null);
            }}
          />
        </div>
      )}

      {/* FAB for Mobile */}
      <button
        onClick={() => setOpenUploadCategory(true)}
        className="lg:hidden fixed bottom-6 right-6 bg-gradient-primary text-white p-3 md:p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-40"
        aria-label="Add category"
      >
        <Plus size={20} className="md:w-6 md:h-6" />
      </button>
    </div>
  );
};

export default CategoryPage;