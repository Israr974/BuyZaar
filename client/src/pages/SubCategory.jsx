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
  PlusCircle, Search, Filter, Grid3x3, RefreshCw, Layers, X, FolderTree,
  ChevronDown, Calendar, Package, AlertCircle
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
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRangeFilter, setDateRangeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const dateRangeOptions = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" }
  ];

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

  const getFilteredData = () => {
    let filtered = [...data];
    
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategoryFilter !== "all") {
      filtered = filtered.filter(item =>
        item.category.some(cat => cat._id === selectedCategoryFilter)
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(item => 
        (item.status || "active") === statusFilter
      );
    }
    
    filtered = filtered.filter(item => isWithinDateRange(item.createdAt));
    
    const sortMultiplier = sortOrder === "asc" ? 1 : -1;
    
    if (sortBy === "name") {
      filtered.sort((a, b) => sortMultiplier * a.name.localeCompare(b.name));
    } else if (sortBy === "newest") {
      filtered.sort((a, b) => sortMultiplier * (new Date(b.createdAt) - new Date(a.createdAt)));
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => sortMultiplier * (new Date(a.createdAt) - new Date(b.createdAt)));
    } else if (sortBy === "categories") {
      filtered.sort((a, b) => sortMultiplier * (b.category.length - a.category.length));
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
    setDateRangeFilter("all");
    setSortBy("name");
    setSortOrder("asc");
    setShowMobileFilters(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedCategoryFilter !== "all") count++;
    if (statusFilter !== "all") count++;
    if (dateRangeFilter !== "all") count++;
    if (sortBy !== "name") count++;
    return count;
  };

  const column = [
    columnHelper.accessor("name", {
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 md:gap-3">
          <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
            <FolderTree size={14} className="md:w-5 md:h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-text text-sm md:text-base">{row.original.name}</p>
            <p className="text-xs text-text-muted">
              {row.original.category?.length || 0} parent categories
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
              src={row.original.image || "https://via.placeholder.com/48x48?text=No+Image"}
              alt={row.original.name}
              className="h-8 w-8 md:h-12 md:w-12 rounded-lg object-cover border border-border hover:border-primary transition-all duration-300 cursor-pointer group-hover:scale-110"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/48x48?text=No+Image";
              }}
            />
            <button
              onClick={() => setImageUrl(row.original.image)}
              className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              title="View Image"
            >
              <HiOutlineEye size={14} className="md:w-5 md:h-5 text-white" />
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
              key={`table-${c._id}`}
              className="badge bg-primary/10 text-primary px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-full text-[10px] md:text-xs"
            >
              {c.name}
            </span>
          ))}
          {row.original.category?.length > 2 && (
            <span className="badge bg-bg-alt text-text-muted px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-full text-[10px] md:text-xs">
              +{row.original.category.length - 2}
            </span>
          )}
        </div>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ row }) => (
        <span className={`inline-flex items-center px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-full text-[10px] md:text-xs font-medium ${
          (row.original.status || "active") === "active" 
            ? "bg-success/10 text-success"
            : "bg-error/10 text-error"
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
            className="p-1 md:p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-200"
            title="Edit Sub-category"
          >
            <HiOutlinePencilSquare size={14} className="md:w-4 md:h-4" />
          </button>
          <button
            onClick={() => {
              setOpenConfirm(true);
              setEditData(row.original);
            }}
            className="p-1 md:p-2 rounded-lg bg-error/10 text-error hover:bg-error hover:text-white transition-all duration-200"
            title="Delete Sub-category"
          >
            <MdOutlineDeleteOutline size={14} className="md:w-4 md:h-4" />
          </button>
        </div>
      ),
    }),
  ];

  return (
    <div className="min-h-screen bg-bg p-3 md:p-6 fade-in">
      <div className="container-narrow">
        {/* Header Section */}
        <div className="mb-4 md:mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-6 md:h-8 rounded-full bg-gradient-to-b from-primary to-accent"></div>
            <h1 className="text-xl md:text-3xl font-display font-bold text-text">
              Sub-Category Management
            </h1>
          </div>
          <p className="text-text-muted text-sm ml-4">
            Organize your products with sub-categories
          </p>
        </div>

        {/* Stats Cards - Fixed for mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="bg-card rounded-xl border border-border p-3 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-xs md:text-sm">Total</p>
                <p className="text-lg md:text-2xl font-bold gradient-text">{data.length}</p>
              </div>
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FolderTree className="w-4 h-4 md:w-6 md:h-6 text-primary" />
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-3 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-xs md:text-sm">Categories</p>
                <p className="text-lg md:text-2xl font-bold gradient-text">{uniqueCategories.length}</p>
              </div>
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Layers className="w-4 h-4 md:w-6 md:h-6 text-accent" />
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-3 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-xs md:text-sm">Active</p>
                <p className="text-lg md:text-2xl font-bold gradient-text">
                  {data.filter(c => (c.status || "active") !== "inactive").length}
                </p>
              </div>
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-success/10 flex items-center justify-center">
                <Grid3x3 className="w-4 h-4 md:w-6 md:h-6 text-success" />
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-3 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-xs md:text-sm">Multi-Cat</p>
                <p className="text-lg md:text-2xl font-bold gradient-text">
                  {data.filter(c => c.category?.length > 1).length}
                </p>
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
                placeholder="Search sub-categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 pr-4 py-2 w-full text-sm"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
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
                
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="btn-outline px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm"
                >
                  <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>
              
              <button
                onClick={() => setOpenSubCategory(true)}
                className="btn-primary px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm"
              >
                <PlusCircle size={14} />
                <span>Add</span>
              </button>
            </div>
            
            {/* Category Filter (Desktop) */}
            <div className="hidden md:block">
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="input py-2 text-sm w-full md:w-auto"
              >
                <option value="all">All Categories</option>
                {uniqueCategories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Mobile Filter Panel */}
            {showMobileFilters && (
              <div className="mt-2 p-3 bg-bg-alt rounded-lg border border-border">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-text mb-1 block">Category</label>
                    <select
                      value={selectedCategoryFilter}
                      onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                      className="input py-1.5 text-sm w-full"
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
                    <label className="text-xs font-medium text-text mb-1 block">Sort By</label>
                    <div className="flex gap-2">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="input py-1.5 text-sm flex-1"
                      >
                        <option value="name">Name</option>
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="categories">Categories Count</option>
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
                {selectedCategoryFilter !== "all" && (
                  <span className="badge bg-primary/10 text-primary px-2 py-0.5 text-xs rounded-full">
                    {uniqueCategories.find(c => c._id === selectedCategoryFilter)?.name}
                    <button onClick={() => setSelectedCategoryFilter("all")} className="ml-1 hover:text-error">
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

        {/* Table Section */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 md:py-20">
              <div className="spinner w-8 h-8 md:w-12 md:h-12 mb-4"></div>
              <p className="text-text-muted text-sm">Loading...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 md:py-16 text-center px-4">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mb-4">
                <FolderTree className="w-8 h-8 md:w-12 md:h-12 text-primary/40" />
              </div>
              <h3 className="text-lg md:text-xl font-display font-semibold text-text mb-2">
                No sub-categories found
              </h3>
              <button
                onClick={() => setOpenSubCategory(true)}
                className="btn btn-primary mt-4 text-sm"
              >
                <PlusCircle size={16} />
                Add Sub-Category
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <TableDisplay 
                data={filteredData} 
                columns={column}
                title={`Sub-Categories (${filteredData.length})`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
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

      {/* FAB for Mobile */}
      <button
        onClick={() => setOpenSubCategory(true)}
        className="lg:hidden fixed bottom-6 right-6 bg-gradient-primary text-white p-3 md:p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-40"
        aria-label="Add sub-category"
      >
        <PlusCircle size={20} className="md:w-6 md:h-6" />
      </button>
    </div>
  );
};

export default SubCategory;