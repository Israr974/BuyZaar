
import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import {useNavigate} from "react-router-dom"
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
  Star
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

  const limit = 8;
const navigate=useNavigate();

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
        toast.success(" Product deleted successfully");
        fetchProducts(page, search, false);
      }
    } catch (error) {
      AxiosError(error);
      toast.error(" Failed to delete product");
    } finally {
      setLoading(false);
      setOpenConfirm(false);
      setDeleteProductId(null);
    }
  };

  
  const renderCategories = (category) => {
    if (!category) {
      return <span className="badge px-2 py-1 text-xs bg-gray-100 text-gray-600">No category</span>;
    }
    
    
    if (Array.isArray(category)) {
      if (category.length === 0) {
        return <span className="badge px-2 py-1 text-xs bg-gray-100 text-gray-600">No category</span>;
      }
      
      const displayCategories = category.slice(0, 2);
      const remainingCount = category.length - 2;
      
      return (
        <>
          {displayCategories.map((cat, idx) => (
            <span key={idx} className="badge-primary px-2 py-1 text-xs">
              {typeof cat === 'object' ? cat.name || cat._id || 'Category' : cat}
            </span>
          ))}
          {remainingCount > 0 && (
            <span className="badge px-2 py-1 text-xs bg-gray-100 text-gray-600">
              +{remainingCount}
            </span>
          )}
        </>
      );
    }
    
    
    if (typeof category === 'string') {
      return (
        <span className="badge-primary px-2 py-1 text-xs">
          {category}
        </span>
      );
    }
    
   
    if (typeof category === 'object') {
      return (
        <span className="badge-primary px-2 py-1 text-xs">
          {category.name || category.title || category._id || 'Category'}
        </span>
      );
    }
    
   
    return <span className="badge px-2 py-1 text-xs bg-gray-100 text-gray-600">N/A</span>;
  };


  const totalValue = products.reduce((sum, product) => sum + (product.price || 0), 0);
  const averageRating = products.length > 0 
    ? products.reduce((sum, product) => sum + (product.rating || 0), 0) / products.length 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/50 to-primary/5 p-6">
     
      <div className="glass rounded-2xl p-6 mb-8 shadow-lg fade-in">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Product Management
            </h1>
            <p className="text-text-muted mt-2">
              Manage your product catalog efficiently
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="btn-outline flex items-center gap-2 px-4 py-2.5 rounded-xl hover:shadow-sm transition-all disabled:opacity-50"
              title="Refresh products"
            >
              <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
            <button
              onClick={() => {navigate("/dashboard/uploadproduct")}}
              className="btn-primary flex items-center gap-3 px-6 py-3 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              <Plus size={20} />
              Add Product
            </button>
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="card p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Package className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-text-muted text-sm">Total Products</p>
              <p className="text-2xl font-bold text-text">{totalProducts}</p>
            </div>
          </div>
          
          <div className="card p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-text-muted text-sm">Showing</p>
              <p className="text-2xl font-bold text-text">{products.length}</p>
            </div>
          </div>
          
          <div className="card p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <DollarSign className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-text-muted text-sm">Total Value</p>
              <p className="text-2xl font-bold text-text">${totalValue.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="card p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center">
              <Star className="text-amber-600" size={24} />
            </div>
            <div>
              <p className="text-text-muted text-sm">Avg. Rating</p>
              <p className="text-2xl font-bold text-text">{averageRating.toFixed(1)}</p>
            </div>
          </div>
        </div>

        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 pt-6 border-t border-border">
          <div className="relative flex-1 md:w-96">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted" size={16} />
            <input
              type="text"
              placeholder="Search products by name, category, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-12 pr-4 py-3 rounded-xl w-full"
            />
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2 flex-1 md:flex-none">
              <FaFilter size={14} className="text-text-muted" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="input py-3 rounded-xl min-w-[140px]"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input py-3 rounded-xl min-w-[160px]"
            >
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="books">Books</option>
              <option value="home">Home & Garden</option>
            </select>
          </div>
        </div>
      </div>

      
      <div className="glass rounded-2xl shadow-lg p-6">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {Array.from({ length: limit }).map((_, idx) => (
              <div
                key={idx}
                className="card animate-pulse h-64 rounded-xl"
              >
                <div className="h-40 bg-gray-200 rounded-t-xl"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mb-6">
              <Package size={48} className="text-primary/40" />
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
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedStatus("all");
                  setSelectedCategory("all");
                }}
                className="btn-primary flex items-center gap-2"
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={() => {/* Add product */}}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={18} />
                Add First Product
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="card card-hover group relative overflow-hidden rounded-xl"
                >
                 
                  <div className="relative h-48 overflow-hidden rounded-t-xl">
                    <img
                      src={product.image?.[0] || "/placeholder.png"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.status === "active" 
                          ? "bg-green-100 text-green-800"
                          : product.status === "draft"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {product.status || "active"}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                 
                  <div className="p-4">
                    <h3 className="font-semibold text-text truncate mb-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-primary">
                        ${product.price?.toLocaleString() || "0.00"}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-amber-500 fill-amber-500" />
                        <span className="text-sm text-text-muted">
                          {product.rating?.toFixed(1) || "0.0"}
                        </span>
                      </div>
                    </div>
                    
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {renderCategories(product.category)}
                    </div>

                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditProduct(product._id)}
                        className="btn-secondary flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm"
                      >
                        <FaRegEdit size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(product._id)}
                        className="btn-accent flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm"
                      >
                        <MdDelete size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-border">
              <div className="text-text-muted text-sm">
                Showing <span className="font-semibold text-primary">{(page - 1) * limit + 1}</span>-
                <span className="font-semibold text-primary">
                  {Math.min(page * limit, totalProducts)}
                </span> of{" "}
                <span className="font-semibold">{totalProducts}</span> products
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  disabled={page === 1}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    page === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-primary border border-border hover:bg-primary hover:text-white"
                  }`}
                >
                  <ChevronLeft size={18} />
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
                        className={`h-10 w-10 rounded-lg font-medium transition-all ${
                          page === pageNum
                            ? "bg-primary text-white shadow-md"
                            : "bg-white text-text border border-border hover:bg-gray-50"
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
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    page === totalPages || products.length === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-primary border border-border hover:bg-primary hover:text-white"
                  }`}
                >
                  Next
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      
      {openConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="">
            <ConfirmBox
              confirm={handleDeleteProduct}
              cancel={() => setOpenConfirm(false)}
              close={() => setOpenConfirm(false)}
              
            />
          </div>
        </div>
      )}

      
      {editingProductId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden ">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Edit Product
                </h3>
                <button
                  onClick={() => setEditingProductId(null)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-text-muted hover:text-text"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
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
        </div>
      )}
    </div>
  );
};

export default ProductAdmin;