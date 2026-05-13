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
import { calculateDiscountedPrice, formatPrice } from "../utils/priceUtils";

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
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const limit = 8;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await Axios(summaryApi().getAllCategory);
        if (res.data?.success) {
          setCategories(res.data.data || []);
        }
      } catch (error) {
        AxiosError(error)
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

  const getProductDisplayPrice = (product) => {
    const originalPrice = product?.price || 0;
    const discount = product?.discount || 0;
    return calculateDiscountedPrice(originalPrice, discount);
  };

  const renderCategories = (category) => {
    if (!category) {
      return <span className="bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded-full">No category</span>;
    }
    
    if (Array.isArray(category)) {
      if (category.length === 0) {
        return <span className="bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded-full">No category</span>;
      }
      
      const displayCategories = category.slice(0, 2);
      const remainingCount = category.length - 2;
      
      return (
        <div className="flex flex-wrap gap-1">
          {displayCategories.map((cat, idx) => (
            <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded-full">
              {typeof cat === 'object' ? cat.name || cat._id || 'Category' : cat}
            </span>
          ))}
          {remainingCount > 0 && (
            <span className="bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded-full">
              +{remainingCount}
            </span>
          )}
        </div>
      );
    }
    
    if (typeof category === 'string') {
      return (
        <span className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded-full">
          {category}
        </span>
      );
    }
    
    if (typeof category === 'object') {
      return (
        <span className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded-full">
          {category.name || category.title || category._id || 'Category'}
        </span>
      );
    }
    
    return <span className="bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded-full">N/A</span>;
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
    setShowMobileFilters(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (search) count++;
    if (selectedStatus !== "all") count++;
    if (selectedCategory !== "all") count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-white p-3 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 md:mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-6 md:h-8 rounded-full bg-gradient-to-b from-blue-600 to-orange-500"></div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-800">
              Product Management
            </h1>
          </div>
          <p className="text-gray-500 text-sm ml-4">
            Manage your product catalog efficiently
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs md:text-sm">Total</p>
                <p className="text-base md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">{totalProducts.toLocaleString()}</p>
              </div>
              <div className="w-7 h-7 md:w-12 md:h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Package className="w-3.5 h-3.5 md:w-6 md:h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs md:text-sm">Page</p>
                <p className="text-base md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">{products.length}</p>
              </div>
              <div className="w-7 h-7 md:w-12 md:h-12 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 md:w-6 md:h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs md:text-sm">Value</p>
                <p className="text-base md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">{formatPrice(totalValue)}</p>
              </div>
              <div className="w-7 h-7 md:w-12 md:h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <DollarSign className="w-3.5 h-3.5 md:w-6 md:h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs md:text-sm">Rating</p>
                <p className="text-base md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">{averageRating.toFixed(1)}</p>
              </div>
              <div className="w-7 h-7 md:w-12 md:h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Star className="w-3.5 h-3.5 md:w-6 md:h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-5 mb-4 md:mb-6">
          <div className="flex flex-col gap-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 md:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
              />
            </div>
            
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1 rounded-lg transition ${
                      viewMode === "grid" ? "bg-blue-600 text-white" : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    <Grid3x3 size={12} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1 rounded-lg transition ${
                      viewMode === "list" ? "bg-blue-600 text-white" : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    <List size={12} />
                  </button>
                </div>

                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className={`border-2 px-2 py-1 rounded-lg flex items-center gap-1 text-xs ${
                    getActiveFiltersCount() > 0 ? "border-blue-600 text-blue-600 bg-blue-50" : "border-gray-300 text-gray-700"
                  }`}
                >
                  <FilterIcon size={12} />
                  <span>Filter</span>
                  {getActiveFiltersCount() > 0 && (
                    <span className="text-[10px] bg-blue-600 text-white px-1 py-0.5 rounded-full">
                      {getActiveFiltersCount()}
                    </span>
                  )}
                </button>
              </div>
              
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="border-2 border-gray-300 text-gray-700 px-2 py-1 rounded-lg flex items-center gap-1 text-xs hover:border-blue-600 hover:text-blue-600 transition"
              >
                <RefreshCw size={12} className={isRefreshing ? "animate-spin" : ""} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              
              <button
                onClick={() => navigate("/dashboard/uploadproduct")}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-2 py-1 rounded-lg flex items-center gap-1 text-xs"
              >
                <Plus size={12} />
                <span>Add</span>
              </button>
            </div>
            
            {showMobileFilters && (
              <div className="mt-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] font-medium text-gray-800 mb-1 block">Status</label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full py-1 px-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="all">All</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-medium text-gray-800 mb-1 block">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full py-1 px-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="all">All</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <button onClick={clearFilters} className="w-full border-2 border-gray-300 text-gray-700 py-1 text-xs rounded-lg hover:border-blue-600 hover:text-blue-600 transition">
                    Clear
                  </button>
                </div>
              </div>
            )}
            
            {getActiveFiltersCount() > 0 && (
              <div className="flex flex-wrap items-center gap-1 mt-1 pt-1 border-t border-gray-200">
                <span className="text-[10px] text-gray-500">Active:</span>
                {search && (
                  <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 text-[10px] rounded-full flex items-center gap-1">
                    "{search.slice(0,8)}"
                    <button onClick={() => setSearch("")} className="hover:text-red-600">
                      <X size={8} />
                    </button>
                  </span>
                )}
                <button onClick={clearFilters} className="text-[10px] text-blue-600 hover:underline">
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-5">
          {loading ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="animate-pulse">
                  <div className="h-28 md:h-48 bg-gray-100 rounded-lg mb-2"></div>
                  <div className="h-2 bg-gray-100 rounded w-3/4 mb-1"></div>
                  <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-12 h-12 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-blue-100 to-orange-100 flex items-center justify-center mb-3">
                <Package className="w-6 h-6 md:w-12 md:h-12 text-blue-400" />
              </div>
              <h3 className="text-sm md:text-xl font-semibold text-gray-800 mb-1">
                No products found
              </h3>
              <button
                onClick={() => navigate("/dashboard/uploadproduct")}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-3 py-1 rounded-lg text-xs mt-3"
              >
                <Plus size={12} className="inline mr-1" />
                Add Product
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
              {products.map((product) => {
                const displayPrice = getProductDisplayPrice(product);
                const hasDiscount = product.discount > 0;
                
                return (
                  <div
                    key={product._id}
                    className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all"
                  >
                    <div className="relative h-28 md:h-48 overflow-hidden bg-gray-100">
                      <img
                        src={product.image?.[0] || "/placeholder.png"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-1 right-1">
                        <span className={`px-1 py-0.5 rounded-full text-[8px] md:text-xs font-medium ${
                          product.status === "active" 
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {product.status === "active" ? "Active" : "Draft"}
                        </span>
                      </div>
                      {hasDiscount && (
                        <div className="absolute top-1 left-1">
                          <span className="bg-orange-500 text-white px-1 py-0.5 rounded-full text-[8px] md:text-xs font-bold">
                            -{product.discount}%
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-2 md:p-3">
                      <h3 className="font-semibold text-gray-800 text-xs md:text-sm line-clamp-2 min-h-[32px] md:min-h-[40px]">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center justify-between mt-1 md:mt-2">
                        <div>
                          <span className="text-sm md:text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            {formatPrice(displayPrice)}
                          </span>
                          {hasDiscount && (
                            <span className="text-[8px] md:text-xs text-gray-400 line-through ml-1">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-0.5">
                          <Star size={8} className="md:w-3 md:h-3 text-orange-500 fill-orange-500" />
                          <span className="text-[8px] md:text-xs text-gray-500">
                            {product.rating?.toFixed(1) || "0.0"}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 mt-1 md:mt-2">
                        <MdOutlineInventory size={10} className="md:w-3 md:h-3 text-gray-500" />
                        <span className={`text-[8px] md:text-xs ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {product.stock > 0 ? `${product.stock}` : 'Out'}
                        </span>
                      </div>

                      <div className="flex gap-1 mt-2 md:mt-3">
                        <button
                          onClick={() => handleEditProduct(product._id)}
                          className="flex-1 border-2 border-gray-300 text-gray-700 py-0.5 rounded text-[8px] md:text-xs flex items-center justify-center gap-0.5 hover:border-blue-600 hover:text-blue-600 transition"
                        >
                          <FaRegEdit size={8} className="md:w-3 md:h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => confirmDelete(product._id)}
                          className="flex-1 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white py-0.5 rounded text-[8px] md:text-xs flex items-center justify-center gap-0.5 transition-all"
                        >
                          <MdDelete size={8} className="md:w-3 md:h-3" />
                          Del
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {products.map((product) => {
                const displayPrice = getProductDisplayPrice(product);
                const hasDiscount = product.discount > 0;
                
                return (
                  <div
                    key={product._id}
                    className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-all"
                  >
                    <div className="w-10 h-10 md:w-16 md:h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={product.image?.[0] || "/placeholder.png"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 text-xs md:text-base truncate">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                        <span className="text-xs md:text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                          {formatPrice(displayPrice)}
                        </span>
                        {hasDiscount && (
                          <span className="text-[8px] md:text-xs text-gray-400 line-through">
                            {formatPrice(product.price)}
                          </span>
                        )}
                        <span className="text-[8px] md:text-xs text-gray-500 ml-1">
                          Stock: {product.stock}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditProduct(product._id)}
                        className="p-1 rounded-lg hover:bg-blue-100 text-gray-500 hover:text-blue-600 transition"
                      >
                        <FaRegEdit size={12} className="md:w-4 md:h-4" />
                      </button>
                      <button
                        onClick={() => confirmDelete(product._id)}
                        className="p-1 rounded-lg hover:bg-red-100 text-gray-500 hover:text-red-600 transition"
                      >
                        <MdDelete size={12} className="md:w-4 md:h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-2 mt-4 pt-3 border-t border-gray-200">
              <div className="text-[10px] md:text-sm text-gray-500">
                Page {page} of {totalPages}
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrev}
                  disabled={page === 1}
                  className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                    page === 1
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : "border-2 border-gray-300 text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600"
                  }`}
                >
                  <ChevronLeft size={12} />
                  Prev
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(3, totalPages) }).map((_, idx) => {
                    let pageNum;
                    if (totalPages <= 3) {
                      pageNum = idx + 1;
                    } else if (page <= 2) {
                      pageNum = idx + 1;
                    } else if (page >= totalPages - 1) {
                      pageNum = totalPages - 2 + idx;
                    } else {
                      pageNum = page - 1 + idx;
                    }
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => fetchProducts(pageNum, search)}
                        className={`h-6 w-6 md:h-8 md:w-8 rounded-lg text-xs font-medium transition-all ${
                          page === pageNum
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
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
                  className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                    page === totalPages || products.length === 0
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : "border-2 border-gray-300 text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600"
                  }`}
                >
                  Next
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {openConfirm && (
        <ConfirmBox
          confirm={handleDeleteProduct}
          cancel={() => setOpenConfirm(false)}
          close={() => setOpenConfirm(false)}
          title="Delete Product"
          message="Are you sure you want to delete this product?"
          confirmText="Delete"
          cancelText="Cancel"
          confirmColor="red"
        />
      )}

      {editingProductId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
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

      <button
        onClick={() => navigate("/dashboard/uploadproduct")}
        className="lg:hidden fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-40"
        aria-label="Add product"
      >
        <Plus size={18} />
      </button>
    </div>
  );
};

export default ProductAdmin;