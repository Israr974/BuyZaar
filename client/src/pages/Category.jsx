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
  const [showSortMenu, setShowSortMenu] = useState(false);
  
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

  // Date range options
  const dateRangeOptions = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" }
  ];

  // Product count filter options
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
    
    // Fetch ALL products by increasing limit
    const productRes = await Axios({ 
      ...summaryApi().getProduct,
      params: { 
        page: 1, 
        limit: 1000  
      }
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

  // Check if date is within range
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
      case "today":
        return date >= today;
      case "week":
        return date >= weekAgo;
      case "month":
        return date >= monthAgo;
      case "year":
        return date >= yearAgo;
      default:
        return true;
    }
  };

  // Check product count filter
  const matchesProductCount = (categoryId) => {
    const count = getProductCount(categoryId);
    switch (productCountFilter) {
      case "empty":
        return count === 0;
      case "low":
        return count >= 1 && count <= 10;
      case "medium":
        return count >= 11 && count <= 50;
      case "high":
        return count > 50;
      default:
        return true;
    }
  };

  // Filter and sort categories
  const getFilteredCategories = () => {
    let filtered = [...allCategory];
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(category => 
        (category.status || "active") === statusFilter
      );
    }
    
    // Date range filter
    filtered = filtered.filter(category => 
      isWithinDateRange(category.createdAt)
    );
    
    // Product count filter
    filtered = filtered.filter(category => 
      matchesProductCount(category._id)
    );
    
    // Sorting
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
    <div className="min-h-screen bg-bg p-4 md:p-6 fade-in">
      <div className="container-narrow">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-primary to-accent"></div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-text">
              Category Management
            </h1>
          </div>
          <p className="text-text-muted ml-4">
            Organize your products with categories
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Total Categories</p>
                <p className="text-2xl font-bold gradient-text">{allCategory.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FolderTree className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Total Products</p>
                <p className="text-2xl font-bold gradient-text">{totalProductsCount}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Active Categories</p>
                <p className="text-2xl font-bold gradient-text">{activeCount}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Empty Categories</p>
                <p className="text-2xl font-bold gradient-text">{emptyCategoriesCount}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-warning" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-card rounded-xl border border-border p-5 mb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="relative flex-1 w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" size={18} />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 pr-4 py-2.5 w-full"
              />
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center gap-1 p-1 bg-bg-alt rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition ${
                    viewMode === "grid" ? "bg-primary text-white" : "text-text-muted hover:text-text"
                  }`}
                >
                  <Grid3x3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition ${
                    viewMode === "list" ? "bg-primary text-white" : "text-text-muted hover:text-text"
                  }`}
                >
                  <Package size={16} />
                </button>
              </div>
              
              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className={`btn-outline px-4 py-2.5 rounded-lg flex items-center gap-2 ${
                    getActiveFiltersCount() > 0 ? "bg-primary/10 text-primary border-primary" : ""
                  }`}
                >
                  <Filter size={16} />
                  Filter
                  {getActiveFiltersCount() > 0 && (
                    <span className="ml-1 text-xs bg-primary text-white px-1.5 py-0.5 rounded-full">
                      {getActiveFiltersCount()}
                    </span>
                  )}
                  <ChevronDown size={14} className={`transition-transform ${showFilterMenu ? 'rotate-180' : ''}`} />
                </button>
                
                {showFilterMenu && (
                  <div className="absolute right-0 mt-2 w-80 bg-card rounded-xl border border-border shadow-lg z-10 p-4">
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      <div>
                        <label className="text-sm font-medium text-text mb-2 block">Status</label>
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="input py-2 text-sm w-full"
                        >
                          <option value="all">All Categories</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-text mb-2 block flex items-center gap-2">
                          <Calendar size={14} />
                          Date Range
                        </label>
                        <select
                          value={dateRangeFilter}
                          onChange={(e) => setDateRangeFilter(e.target.value)}
                          className="input py-2 text-sm w-full"
                        >
                          {dateRangeOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-text mb-2 block flex items-center gap-2">
                          <Package size={14} />
                          Product Count
                        </label>
                        <select
                          value={productCountFilter}
                          onChange={(e) => setProductCountFilter(e.target.value)}
                          className="input py-2 text-sm w-full"
                        >
                          {productCountOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="border-t border-border pt-3">
                        <label className="text-sm font-medium text-text mb-2 block">Sort By</label>
                        <div className="flex gap-2">
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="input py-2 text-sm flex-1"
                          >
                            <option value="name">Name</option>
                            <option value="products">Product Count</option>
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                          </select>
                          <button
                            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                            className="btn-outline px-3 py-2 rounded-lg"
                          >
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </button>
                        </div>
                      </div>
                      
                      <button
                        onClick={clearFilters}
                        className="w-full btn btn-outline py-2 text-sm mt-2"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            
              <button
                onClick={() => setOpenUploadCategory(true)}
                className="btn-primary px-5 py-2.5 rounded-lg flex items-center gap-2"
              >
                <Plus size={16} />
                Add Category
              </button>
            </div>
          </div>
          
          {/* Active Filters Display */}
          {getActiveFiltersCount() > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
              <span className="text-sm text-text-muted">Active filters:</span>
              {searchTerm && (
                <span className="badge bg-primary/10 text-primary px-3 py-1 text-sm rounded-full flex items-center gap-1">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm("")} className="hover:text-error">
                    <X size={12} />
                  </button>
                </span>
              )}
              {statusFilter !== "all" && (
                <span className="badge bg-primary/10 text-primary px-3 py-1 text-sm rounded-full flex items-center gap-1">
                  Status: {statusFilter}
                  <button onClick={() => setStatusFilter("all")} className="hover:text-error">
                    <X size={12} />
                  </button>
                </span>
              )}
              {dateRangeFilter !== "all" && (
                <span className="badge bg-primary/10 text-primary px-3 py-1 text-sm rounded-full flex items-center gap-1">
                  Date: {dateRangeOptions.find(d => d.value === dateRangeFilter)?.label}
                  <button onClick={() => setDateRangeFilter("all")} className="hover:text-error">
                    <X size={12} />
                  </button>
                </span>
              )}
              {productCountFilter !== "all" && (
                <span className="badge bg-primary/10 text-primary px-3 py-1 text-sm rounded-full flex items-center gap-1">
                  Products: {productCountOptions.find(p => p.value === productCountFilter)?.label}
                  <button onClick={() => setProductCountFilter("all")} className="hover:text-error">
                    <X size={12} />
                  </button>
                </span>
              )}
              {sortBy !== "name" && (
                <span className="badge bg-primary/10 text-primary px-3 py-1 text-sm rounded-full flex items-center gap-1">
                  Sort: {sortBy === "products" ? "Product Count" : sortBy === "newest" ? "Newest First" : "Oldest First"}
                  <button onClick={() => setSortBy("name")} className="hover:text-error">
                    <X size={12} />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-primary hover:underline ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Categories Grid/List - Same as before */}
        <div className="bg-card rounded-xl border border-border p-5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="spinner w-12 h-12 mb-4"></div>
              <p className="text-text-muted">Loading categories...</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mb-4">
                <FolderTree className="w-12 h-12 text-primary/40" />
              </div>
              <h3 className="text-xl font-display font-semibold text-text mb-2">
                {searchTerm || statusFilter !== "all" || dateRangeFilter !== "all" || productCountFilter !== "all" 
                  ? "No matching categories found" 
                  : "No categories yet"}
              </h3>
              <p className="text-text-muted mb-6 max-w-md">
                {searchTerm || statusFilter !== "all" || dateRangeFilter !== "all" || productCountFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Get started by creating your first category"}
              </p>
              {!searchTerm && statusFilter === "all" && dateRangeFilter === "all" && productCountFilter === "all" && (
                <button
                  onClick={() => setOpenUploadCategory(true)}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <Plus size={18} />
                  Create First Category
                </button>
              )}
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredCategories.map((category) => (
                <div
                  key={category._id}
                  className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative"
                >
                  <div className="relative h-48 overflow-hidden bg-bg-alt">
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

                  <div className="p-4">
                    <h3 className="font-semibold text-text text-lg truncate group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-text-muted text-sm mt-1 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-text-muted bg-bg-alt px-2 py-1 rounded-full">
                        {getProductCount(category._id)} products
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditCategory(category);
                            setOpenUploadCategory(true);
                          }}
                          className="p-1.5 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteCategoryId(category._id)}
                          className="p-1.5 rounded-lg hover:bg-error/10 text-text-muted hover:text-error transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {deleteCategoryId === category._id && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10">
                      <ConfirmBox
                        close={() => setDeleteCategoryId(null)}
                        cancel={() => setDeleteCategoryId(null)}
                        confirm={() => handleDeleteCategory(category._id)}
                        title="Delete Category"
                        message={`Are you sure you want to delete "${category.name}"?`}
                        confirmText="Delete"
                        cancelText="Cancel"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCategories.map((category) => (
                <div
                  key={category._id}
                  className="group flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:shadow-md transition-all"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-bg-alt flex-shrink-0">
                    <img
                      src={category.image || "https://via.placeholder.com/64x64?text=Category"}
                      alt={category.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/64x64?text=No+Image";
                      }}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-text-muted text-sm truncate">
                        {category.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <span className="text-sm font-medium text-text">
                      {getProductCount(category._id)} products
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditCategory(category);
                        setOpenUploadCategory(true);
                      }}
                      className="p-2 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteCategoryId(category._id)}
                      className="p-2 rounded-lg hover:bg-error/10 text-text-muted hover:text-error transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {openUploadCategory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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

      <button
        onClick={() => setOpenUploadCategory(true)}
        className="lg:hidden fixed bottom-6 right-6 bg-gradient-primary text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-40"
        aria-label="Add category"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default CategoryPage;