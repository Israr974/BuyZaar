import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import { useNavigate } from "react-router-dom";
import AxiosError from "../utils/AxiosToError";
import summaryApi from "../common/summartApi";
import toast from "react-hot-toast";
import { MdDelete, MdOutlineInventory } from "react-icons/md";
import { FaRegEdit, FaSearch, FaFilter } from "react-icons/fa";
import { 
  Package, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  TrendingUp,
  DollarSign,
  Star,
  AlertCircle,
  X,
  Filter as FilterIcon,
  Grid3x3,
  List
} from "lucide-react";
import UpdateProduct from "./UpdateProduct";
import ConfirmBox from "../components/ConfirmBox";

const ProductAdmin = () => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [search, setSearch] = useState("");
  const [editingProductId, setEditingProductId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const limit = 8;
  const navigate = useNavigate();

  // Fetch categories for filter
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await Axios(summaryApi().getAllCategory);
        if (res.data?.success) {
          setCategories(res.data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  const fetchProducts = async (pageNumber = 1, searchTerm = "", showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await Axios({
        ...summaryApi().getProduct,
        params: { 
          page: pageNumber, 
          limit, 
          search: searchTerm,
          status: selectedStatus !== "all" ? selectedStatus : undefined,
          category: selectedCategory !== "all" ? selectedCategory : undefined
        },
      });

      if (res.data.success) {
        setProducts(res.data.data || []);
        setTotalPages(res.data.totalNoPage || 1);
        setTotalProducts(res.data.totalCount || 0);
        setPage(pageNumber);
      }
    } catch (error) {
      AxiosError(error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchProducts(1, search, false);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts(1, search);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [search, selectedStatus, selectedCategory]);

  const handlePrev = () => page > 1 && fetchProducts(page - 1, search);
  const handleNext = () => page < totalPages && fetchProducts(page + 1, search);

  const handleEditProduct = (id) => setEditingProductId(id);

  const confirmDelete = (id) => {
    setDeleteProductId(id);
    setOpenConfirm(true);
  };

  const handleDeleteProduct = async () => {
    if (!deleteProductId) return;

    try {
      setLoading(true);
      const res = await Axios({
        ...summaryApi().deleteProduct,
        data: { id: deleteProductId },
      });

      if (res.data.success) {
        toast.success("Product deleted successfully!");
        fetchProducts(page, search, false);
      }
    } catch (error) {
      AxiosError(error);
      toast.error("Failed to delete product");
    } finally {
      setLoading(false);
      setOpenConfirm(false);
      setDeleteProductId(null);
    }
  };

  const renderCategories = (category) => {
    if (!category) {
      return <span className="badge bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded-full">No category</span>;
    }
    
    if (Array.isArray(category)) {
      if (category.length === 0) {
        return <span className="badge bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded-full">No category</span>;
      }
      
      const displayCategories = category.slice(0, 2);
      const remainingCount = category.length - 2;
      
      return (
        <div className="flex flex-wrap gap-1">
          {displayCategories.map((cat, idx) => (
            <span key={idx} className="badge bg-primary/10 text-primary px-2 py-1 text-xs rounded-full">
              {typeof cat === 'object' ? cat.name || cat._id || 'Category' : cat}
            </span>
          ))}
          {remainingCount > 0 && (
            <span className="badge bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded-full">
              +{remainingCount}
            </span>
          )}
        </div>
      );
    }
    
    if (typeof category === 'string') {
      return (
        <span className="badge bg-primary/10 text-primary px-2 py-1 text-xs rounded-full">
          {category}
        </span>
      );
    }
    
    if (typeof category === 'object') {
      return (
        <span className="badge bg-primary/10 text-primary px-2 py-1 text-xs rounded-full">
          {category.name || category.title || category._id || 'Category'}
        </span>
      );
    }
    
    return <span className="badge bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded-full">N/A</span>;
  };

  const totalValue = products.reduce((sum, product) => sum + (product.price || 0), 0);
  const averageRating = products.length > 0 
    ? products.reduce((sum, product) => sum + (product.rating || 0), 0) / products.length 
    : 0;

  const clearFilters = () => {
    setSearch("");
    setSelectedStatus("all");
    setSelectedCategory("all");
    setShowFilterDropdown(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (search) count++;
    if (selectedStatus !== "all") count++;
    if (selectedCategory !== "all") count++;
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
              Product Management
            </h1>
          </div>
          <p className="text-text-muted ml-4">
            Manage your product catalog efficiently
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Total Products</p>
                <p className="text-2xl font-bold gradient-text">{totalProducts.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Current Page</p>
                <p className="text-2xl font-bold gradient-text">{products.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Total Value</p>
                <p className="text-2xl font-bold gradient-text">₹{totalValue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-warning" />
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Avg. Rating</p>
                <p className="text-2xl font-bold gradient-text">{averageRating.toFixed(1)}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Star className="w-6 h-6 text-accent" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-xl border border-border p-5 mb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="relative flex-1 w-full lg:max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" size={16} />
              <input
                type="text"
                placeholder="Search products by name, category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                  title="Grid View"
                >
                  <Grid3x3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition ${
                    viewMode === "list" ? "bg-primary text-white" : "text-text-muted hover:text-text"
                  }`}
                  title="List View"
                >
                  <List size={16} />
                </button>
              </div>

              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className={`btn-outline px-4 py-2.5 rounded-lg flex items-center gap-2 ${
                    getActiveFiltersCount() > 0 ? "bg-primary/10 text-primary border-primary" : ""
                  }`}
                >
                  <FilterIcon size={16} />
                  Filter
                  {getActiveFiltersCount() > 0 && (
                    <span className="ml-1 text-xs bg-primary text-white px-1.5 py-0.5 rounded-full">
                      {getActiveFiltersCount()}
                    </span>
                  )}
                </button>
                
                {showFilterDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-card rounded-xl border border-border shadow-lg z-10 p-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-text mb-2 block">Status</label>
                        <select
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="input py-2 text-sm w-full"
                        >
                          <option value="all">All Status</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="draft">Draft</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-text mb-2 block">Category</label>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="input py-2 text-sm w-full"
                        >
                          <option value="all">All Categories</option>
                          {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      <button
                        onClick={clearFilters}
                        className="w-full btn btn-outline py-2 text-sm"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="btn-outline px-4 py-2.5 rounded-lg flex items-center gap-2"
              >
                <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
                Refresh
              </button>
              
              <button
                onClick={() => navigate("/dashboard/uploadproduct")}
                className="btn-primary px-5 py-2.5 rounded-lg flex items-center gap-2"
              >
                <Plus size={16} />
                Add Product
              </button>
            </div>
          </div>
          
          {/* Active Filters Display */}
          {getActiveFiltersCount() > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
              <span className="text-sm text-text-muted">Active filters:</span>
              {search && (
                <span className="badge bg-primary/10 text-primary px-3 py-1 text-sm rounded-full flex items-center gap-1">
                  Search: "{search}"
                  <button onClick={() => setSearch("")} className="hover:text-error">
                    <X size={12} />
                  </button>
                </span>
              )}
              {selectedStatus !== "all" && (
                <span className="badge bg-primary/10 text-primary px-3 py-1 text-sm rounded-full flex items-center gap-1">
                  Status: {selectedStatus}
                  <button onClick={() => setSelectedStatus("all")} className="hover:text-error">
                    <X size={12} />
                  </button>
                </span>
              )}
              {selectedCategory !== "all" && (
                <span className="badge bg-primary/10 text-primary px-3 py-1 text-sm rounded-full flex items-center gap-1">
                  Category: {categories.find(c => c._id === selectedCategory)?.name || selectedCategory}
                  <button onClick={() => setSelectedCategory("all")} className="hover:text-error">
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

        {/* Products Grid/List */}
        <div className="bg-card rounded-xl border border-border p-5">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {Array.from({ length: limit }).map((_, idx) => (
                <div key={idx} className="animate-pulse">
                  <div className="h-48 bg-bg-alt rounded-xl mb-3"></div>
                  <div className="h-4 bg-bg-alt rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-bg-alt rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
                <Package className="w-12 h-12 text-primary/40" />
              </div>
              <h3 className="text-xl font-semibold text-text mb-2">
                {search || selectedStatus !== "all" || selectedCategory !== "all"
                  ? "No matching products found"
                  : "No products yet"}
              </h3>
              <p className="text-text-muted mb-6 max-w-md">
                {search || selectedStatus !== "all" || selectedCategory !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Get started by adding your first product"}
              </p>
              {(search || selectedStatus !== "all" || selectedCategory !== "all") ? (
                <button onClick={clearFilters} className="btn btn-primary">
                  Clear Filters
                </button>
              ) : (
                <button
                  onClick={() => navigate("/dashboard/uploadproduct")}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <Plus size={18} />
                  Add First Product
                </button>
              )}
            </div>
          ) : viewMode === "grid" ? (
            // Grid View
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Product Image */}
                  <div className="relative h-48 overflow-hidden bg-bg-alt">
                    <img
                      src={product.image?.[0] || "/placeholder.png"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.status === "active" 
                          ? "bg-green-100 text-green-700"
                          : product.status === "draft"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {product.status || "active"}
                      </span>
                    </div>
                    {product.discount > 0 && (
                      <div className="absolute top-2 left-2">
                        <span className="bg-accent text-white px-2 py-1 rounded-full text-xs font-bold">
                          -{product.discount}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    <h3 className="font-semibold text-text text-sm line-clamp-2 min-h-[40px] mb-1">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-lg font-bold gradient-text">
                          ₹{product.price?.toLocaleString() || "0"}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xs text-text-muted line-through ml-1">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-0.5">
                        <Star size={12} className="text-accent fill-accent" />
                        <span className="text-xs text-text-muted">
                          {product.rating?.toFixed(1) || "0.0"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      {renderCategories(product.category)}
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center gap-1 mb-3">
                      <MdOutlineInventory size={12} className="text-text-muted" />
                      <span className={`text-xs ${product.stock > 0 ? 'text-success' : 'text-error'}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditProduct(product._id)}
                        className="flex-1 btn btn-secondary py-1.5 rounded-lg text-xs flex items-center justify-center gap-1"
                      >
                        <FaRegEdit size={12} />
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(product._id)}
                        className="flex-1 bg-error/10 text-error hover:bg-error hover:text-white py-1.5 rounded-lg text-xs flex items-center justify-center gap-1 transition-all"
                      >
                        <MdDelete size={12} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // List View
            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="group flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:shadow-md transition-all"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-bg-alt flex-shrink-0">
                    <img
                      src={product.image?.[0] || "/placeholder.png"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text">{product.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold gradient-text">
                        ₹{product.price?.toLocaleString()}
                      </span>
                      <span className="text-xs text-text-muted">
                        Stock: {product.stock}
                      </span>
                    </div>
                    <div className="mt-1">
                      {renderCategories(product.category)}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditProduct(product._id)}
                      className="p-2 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-colors"
                      title="Edit"
                    >
                      <FaRegEdit size={16} />
                    </button>
                    <button
                      onClick={() => confirmDelete(product._id)}
                      className="p-2 rounded-lg hover:bg-error/10 text-text-muted hover:text-error transition-colors"
                      title="Delete"
                    >
                      <MdDelete size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-border">
              <div className="text-sm text-text-muted">
                Showing <span className="font-semibold text-primary">{(page - 1) * limit + 1}</span>-
                <span className="font-semibold text-primary">
                  {Math.min(page * limit, totalProducts)}
                </span> of{" "}
                <span className="font-semibold text-primary">{totalProducts.toLocaleString()}</span> products
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  disabled={page === 1}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    page === 1
                      ? "bg-bg-alt text-text-muted cursor-not-allowed"
                      : "btn-outline hover:bg-primary hover:text-white"
                  }`}
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = idx + 1;
                    } else if (page <= 3) {
                      pageNum = idx + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + idx;
                    } else {
                      pageNum = page - 2 + idx;
                    }
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => fetchProducts(pageNum, search)}
                        className={`h-8 w-8 rounded-lg text-sm font-medium transition-all ${
                          page === pageNum
                            ? "bg-primary text-white shadow-sm"
                            : "bg-card text-text border border-border hover:bg-bg-alt"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={handleNext}
                  disabled={page === totalPages || products.length === 0}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    page === totalPages || products.length === 0
                      ? "bg-bg-alt text-text-muted cursor-not-allowed"
                      : "btn-outline hover:bg-primary hover:text-white"
                  }`}
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {openConfirm && (
        <ConfirmBox
          confirm={handleDeleteProduct}
          cancel={() => setOpenConfirm(false)}
          close={() => setOpenConfirm(false)}
          title="Delete Product"
          message="Are you sure you want to delete this product? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          confirmColor="red"
        />
      )}

      {/* Edit Product Modal */}
      {editingProductId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <UpdateProduct
              productId={editingProductId}
              onClose={() => setEditingProductId(null)}
              onSuccess={() => {
                setEditingProductId(null);
                fetchProducts(page, search, false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductAdmin;