import React, { useEffect, useState } from "react";
import UploadSubCategory from "../components/UploadSubCategory";
import EditSubCategory from "../components/EditSubCategory";
import summaryApi from "../common/summartApi";
import Axios from "../utils/Axios";
import AxiosError from "../utils/AxiosToError";
import TableDisplay from "../components/TableDisplay";
import { createColumnHelper } from "@tanstack/react-table";
import ViewImage from "../components/ViewImage";
import ConfirmBox from "../components/ConfirmBox";
import { HiOutlinePencilSquare, HiOutlineEye } from "react-icons/hi2";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { 
  PlusCircle, Search, Filter, RefreshCw, Layers, X, FolderTree,
  ChevronDown, Package, AlertCircle, ChevronUp
} from "lucide-react";
import toast from "react-hot-toast";

const SubCategory = () => {
  const [openSubCategory, setOpenSubCategory] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const columnHelper = createColumnHelper();

  const [imageUrl, setImageUrl] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [minProductsCount, setMinProductsCount] = useState("");
  const [maxProductsCount, setMaxProductsCount] = useState("");

  const fetchSubCategories = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await Axios({ ...summaryApi().getSubcategory });
      if (res.data.success) {
        setData(res.data.data || []);
      } else {
        setData([]);
      }
    } catch (error) {
      AxiosError(error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchSubCategories(false);
  };

  useEffect(() => {
    fetchSubCategories();
  }, []);

  const handleDelete = async () => {
    try {
      const res = await Axios({
        ...summaryApi().deleteSubCategory(editData._id),
      });
      if (res.data.success) {
        toast.success("Sub-category deleted successfully!");
        fetchSubCategories(false);
        setOpenConfirm(false);
      }
    } catch (error) {
      AxiosError(error);
      toast.error("Failed to delete sub-category");
    }
  };

  const getFilteredData = () => {
    let filtered = [...data];
    
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategoryFilter !== "all") {
      filtered = filtered.filter(item =>
        item.category && item.category.some(cat => cat._id === selectedCategoryFilter)
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(item => 
        (item.status || "active") === statusFilter
      );
    }
    
    if (minProductsCount) {
      filtered = filtered.filter(item => 
        (item.productsCount || 0) >= parseInt(minProductsCount)
      );
    }
    
    if (maxProductsCount) {
      filtered = filtered.filter(item => 
        (item.productsCount || 0) <= parseInt(maxProductsCount)
      );
    }
    
    return filtered;
  };

  const filteredData = getFilteredData();

  const uniqueCategories = Array.from(
    new Map(data.flatMap(item => 
      item.category?.map(cat => [cat._id, cat]) || []
    ).filter(Boolean)).values()
  );

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategoryFilter("all");
    setStatusFilter("all");
    setMinProductsCount("");
    setMaxProductsCount("");
    setShowMobileFilters(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedCategoryFilter !== "all") count++;
    if (statusFilter !== "all") count++;
    if (minProductsCount) count++;
    if (maxProductsCount) count++;
    return count;
  };

  const column = [
    columnHelper.accessor("name", {
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 md:gap-3">
          <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-gradient-to-br from-blue-100 to-orange-100 flex items-center justify-center">
            <FolderTree size={16} className="md:w-5 md:h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-800 text-xs md:text-sm">{row.original.name}</p>
            <p className="text-[10px] md:text-xs text-gray-500">
              {row.original.category?.length || 0} categories
            </p>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor("image", {
      header: "Image",
      cell: ({ row }) => (
        <div className="flex justify-center">
          <div className="relative group">
            <img
              src={row.original.image || "/placeholder.png"}
              alt={row.original.name}
              className="h-10 w-10 md:h-12 md:w-12 rounded-lg object-cover border border-gray-200 hover:border-blue-600 transition-all cursor-pointer group-hover:scale-110"
              onError={(e) => {
                e.target.src = "/placeholder.png";
              }}
            />
            <button
              onClick={() => setImageUrl(row.original.image)}
              className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition"
            >
              <HiOutlineEye size={14} className="md:w-4 md:h-4 text-white" />
            </button>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor("category", {
      header: "Parent Categories",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.category?.slice(0, 2).map((c) => (
            <span
              key={c._id}
              className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full text-[10px] md:text-xs"
            >
              {c.name}
            </span>
          ))}
          {row.original.category?.length > 2 && (
            <span className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full text-[10px] md:text-xs">
              +{row.original.category.length - 2}
            </span>
          )}
        </div>
      ),
    }),
    columnHelper.accessor("productsCount", {
      header: "Products",
      cell: ({ row }) => (
        <div className="text-center">
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 md:px-2 md:py-1 rounded-lg bg-blue-50 text-blue-600 font-medium text-[10px] md:text-sm">
            <Package size={12} className="md:w-3.5 md:h-3.5" />
            {row.original.productsCount || 0}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ row }) => (
        <span className={`inline-flex items-center px-1.5 py-0.5 md:px-2 md:py-1 rounded-full text-[10px] md:text-xs font-medium ${
          (row.original.status || "active") === "active" 
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}>
          {row.original.status || "active"}
        </span>
      ),
    }),
    columnHelper.accessor("_id", {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-1 md:gap-2">
          <button
            onClick={() => {
              setOpenEdit(true);
              setEditData(row.original);
            }}
            className="p-1 md:p-1.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition"
            title="Edit"
          >
            <HiOutlinePencilSquare size={14} className="md:w-4 md:h-4" />
          </button>
          <button
            onClick={() => {
              setOpenConfirm(true);
              setEditData(row.original);
            }}
            className="p-1 md:p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition"
            title="Delete"
          >
            <MdOutlineDeleteOutline size={14} className="md:w-4 md:h-4" />
          </button>
        </div>
      ),
    }),
  ];

  return (
    <div className="min-h-screen bg-white p-3 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 md:mb-6">
          <div className="flex items-center gap-2 md:gap-3 mb-2">
            <div className="w-1 h-6 md:h-8 rounded-full bg-gradient-to-b from-blue-600 to-orange-500"></div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-800">
              Sub-Categories
            </h1>
          </div>
          <p className="text-gray-500 text-sm ml-4">
            Organize your products with sub-categories
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs md:text-sm">Total</p>
                <p className="text-base md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">{data.length}</p>
              </div>
              <div className="w-7 h-7 md:w-12 md:h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <FolderTree className="w-3.5 h-3.5 md:w-6 md:h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs md:text-sm">Categories</p>
                <p className="text-base md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">{uniqueCategories.length}</p>
              </div>
              <div className="w-7 h-7 md:w-12 md:h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Layers className="w-3.5 h-3.5 md:w-6 md:h-6 text-orange-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs md:text-sm">Active</p>
                <p className="text-base md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  {data.filter(c => (c.status || "active") !== "inactive").length}
                </p>
              </div>
              <div className="w-7 h-7 md:w-12 md:h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Package className="w-3.5 h-3.5 md:w-6 md:h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs md:text-sm">Products</p>
                <p className="text-base md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  {data.reduce((sum, c) => sum + (c.productsCount || 0), 0)}
                </p>
              </div>
              <div className="w-7 h-7 md:w-12 md:h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <AlertCircle className="w-3.5 h-3.5 md:w-6 md:h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-5 mb-4 md:mb-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={14} />
                <input
                  type="text"
                  placeholder="Search sub-categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 md:py-2 rounded-lg border border-gray-200 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className={`border-2 px-2 py-1.5 md:px-3 md:py-2 rounded-lg flex items-center gap-1 text-xs md:text-sm ${
                    getActiveFiltersCount() > 0 
                      ? "border-blue-600 text-blue-600 bg-blue-50" 
                      : "border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600"
                  }`}
                >
                  <Filter size={14} />
                  <span>Filter</span>
                  {getActiveFiltersCount() > 0 && (
                    <span className="text-[10px] bg-blue-600 text-white px-1 py-0.5 rounded-full">
                      {getActiveFiltersCount()}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="border-2 border-gray-300 text-gray-700 px-2 py-1.5 md:px-3 md:py-2 rounded-lg flex items-center gap-1 text-xs md:text-sm hover:border-blue-600 hover:text-blue-600 transition disabled:opacity-50"
                >
                  <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                
                <button
                  onClick={() => setOpenSubCategory(true)}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-2 py-1.5 md:px-3 md:py-2 rounded-lg flex items-center gap-1 text-xs md:text-sm hover:shadow-lg transition"
                >
                  <PlusCircle size={14} />
                  <span className="hidden sm:inline">Add</span>
                </button>
              </div>
            </div>
            
            {showMobileFilters && (
              <div className="mt-2 p-3 bg-gray-100 rounded-lg border border-gray-200">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-800 mb-1 block">Category</label>
                    <select
                      value={selectedCategoryFilter}
                      onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                      <option value="all">All Categories</option>
                      {uniqueCategories.map(category => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-gray-800 mb-1 block">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-gray-800 mb-1 block">Products Count</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={minProductsCount}
                        onChange={(e) => setMinProductsCount(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxProductsCount}
                        onChange={(e) => setMaxProductsCount(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                  </div>
                  
                  <button onClick={clearFilters} className="w-full border-2 border-gray-300 text-gray-700 py-1.5 text-sm rounded-lg hover:border-blue-600 hover:text-blue-600 transition">
                    Clear All
                  </button>
                </div>
              </div>
            )}
            
            {getActiveFiltersCount() > 0 && (
              <div className="flex flex-wrap items-center gap-1 mt-1 pt-2 border-t border-gray-200">
                <span className="text-[10px] md:text-xs text-gray-500">Active:</span>
                {searchTerm && (
                  <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 text-[10px] rounded-full flex items-center gap-1">
                    "{searchTerm.slice(0,8)}"
                    <button onClick={() => setSearchTerm("")} className="hover:text-red-600">
                      <X size={10} />
                    </button>
                  </span>
                )}
                {selectedCategoryFilter !== "all" && (
                  <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 text-[10px] rounded-full">
                    {uniqueCategories.find(c => c._id === selectedCategoryFilter)?.name}
                    <button onClick={() => setSelectedCategoryFilter("all")} className="ml-1 hover:text-red-600">
                      <X size={10} />
                    </button>
                  </span>
                )}
                <button onClick={clearFilters} className="text-[10px] md:text-xs text-blue-600 hover:underline ml-1">
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 md:py-20">
              <div className="w-8 h-8 md:w-12 md:h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 text-sm mt-4">Loading...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 md:py-16 text-center">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-blue-100 to-orange-100 rounded-full flex items-center justify-center mb-4">
                <FolderTree className="w-8 h-8 md:w-12 md:h-12 text-blue-400" />
              </div>
              <h3 className="text-base md:text-xl font-semibold text-gray-800 mb-2">
                No sub-categories found
              </h3>
              <p className="text-gray-500 text-xs md:text-sm mb-4">
                {searchTerm || selectedCategoryFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Get started by adding your first sub-category"}
              </p>
              <button
                onClick={() => setOpenSubCategory(true)}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg flex items-center gap-1 text-sm hover:shadow-lg transition"
              >
                <PlusCircle size={14} />
                Add Sub-Category
              </button>
            </div>
          ) : (
            <TableDisplay 
              data={filteredData} 
              columns={column}
              title={`Sub-Categories (${filteredData.length})`}
            />
          )}
        </div>
      </div>

      {openSubCategory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-4">
          <UploadSubCategory
            onClose={() => setOpenSubCategory(false)}
            onSuccess={() => {
              setOpenSubCategory(false);
              fetchSubCategories(false);
            }}
          />
        </div>
      )}

      {imageUrl && <ViewImage url={imageUrl} close={() => setImageUrl("")} />}

      {openEdit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-4">
          <EditSubCategory
            editData={editData}
            onClose={() => setOpenEdit(false)}
            onSuccess={() => {
              setOpenEdit(false);
              fetchSubCategories(false);
            }}
          />
        </div>
      )}

      {openConfirm && (
        <ConfirmBox
          confirm={handleDelete}
          close={() => setOpenConfirm(false)}
          cancel={() => setOpenConfirm(false)}
          title="Delete Sub-category"
          message={`Delete "${editData?.name}"?`}
          confirmText="Delete"
          cancelText="Cancel"
          confirmColor="red"
        />
      )}
    </div>
  );
};

export default SubCategory;