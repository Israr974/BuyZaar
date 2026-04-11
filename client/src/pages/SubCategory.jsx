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
  
  // New filters
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
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
            <FolderTree size={18} className="text-primary" />
          </div>
          <div>
            <p className="font-medium text-text">{row.original.name}</p>
            <p className="text-xs text-text-muted">
              {row.original.category?.length || 0} parent {row.original.category?.length === 1 ? 'category' : 'categories'}
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
              className="h-12 w-12 rounded-lg object-cover border border-border hover:border-primary transition-all duration-300 cursor-pointer group-hover:scale-110"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/48x48?text=No+Image";
              }}
            />
            <button
              onClick={() => setImageUrl(row.original.image)}
              className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              title="View Image"
            >
              <HiOutlineEye size={20} className="text-white" />
            </button>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor("category", {
      header: "Parent Categories",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1.5">
          {row.original.category?.slice(0, 3).map((c) => (
            <span
              key={`table-${c._id}`}
              className="badge bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs"
            >
              {c.name}
            </span>
          ))}
          {row.original.category?.length > 3 && (
            <span className="badge bg-bg-alt text-text-muted px-2.5 py-1 rounded-full text-xs">
              +{row.original.category.length - 3}
            </span>
          )}
        </div>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ row }) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
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
        <div className="flex gap-2">
          <button
            onClick={() => {
              setOpenEdit(true);
              setEditData(row.original);
            }}
            className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-200"
            title="Edit Sub-category"
          >
            <HiOutlinePencilSquare size={16} />
          </button>
          <button
            onClick={() => {
              setOpenConfirm(true);
              setEditData(row.original);
            }}
            className="p-2 rounded-lg bg-error/10 text-error hover:bg-error hover:text-white transition-all duration-200"
            title="Delete Sub-category"
          >
            <MdOutlineDeleteOutline size={16} />
          </button>
        </div>
      ),
    }),
  ];

  return (
    <div className="min-h-screen bg-bg p-4 md:p-6 fade-in">
      <div className="container-narrow">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-primary to-accent"></div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-text">
              Sub-Category Management
            </h1>
          </div>
          <p className="text-text-muted ml-4">
            Organize your products with sub-categories under parent categories
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Total Sub-Categories</p>
                <p className="text-2xl font-bold gradient-text">{data.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FolderTree className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Parent Categories</p>
                <p className="text-2xl font-bold gradient-text">{uniqueCategories.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Layers className="w-6 h-6 text-accent" />
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Active</p>
                <p className="text-2xl font-bold gradient-text">
                  {data.filter(c => (c.status || "active") !== "inactive").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <Grid3x3 className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Multi-Category</p>
                <p className="text-2xl font-bold gradient-text">
                  {data.filter(c => c.category?.length > 1).length}
                </p>
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
                placeholder="Search sub-categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 pr-4 py-2.5 w-full"
              />
            </div>
            
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-text-muted" />
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="input py-2.5 rounded-lg text-sm min-w-[160px]"
                >
                  <option value="all">All Categories</option>
                  {uniqueCategories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
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
                          <option value="all">All</option>
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
                      
                      <div className="border-t border-border pt-3">
                        <label className="text-sm font-medium text-text mb-2 block">Sort By</label>
                        <div className="flex gap-2">
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="input py-2 text-sm flex-1"
                          >
                            <option value="name">Name</option>
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="categories">Categories Count</option>
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
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="btn-outline px-4 py-2.5 rounded-lg flex items-center gap-2"
              >
                <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
                Refresh
              </button>
              
              <button
                onClick={() => setOpenSubCategory(true)}
                className="btn-primary px-5 py-2.5 rounded-lg flex items-center gap-2"
              >
                <PlusCircle size={16} />
                Add Sub-Category
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
              {selectedCategoryFilter !== "all" && (
                <span className="badge bg-primary/10 text-primary px-3 py-1 text-sm rounded-full flex items-center gap-1">
                  Category: {uniqueCategories.find(c => c._id === selectedCategoryFilter)?.name}
                  <button onClick={() => setSelectedCategoryFilter("all")} className="hover:text-error">
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
              {sortBy !== "name" && (
                <span className="badge bg-primary/10 text-primary px-3 py-1 text-sm rounded-full flex items-center gap-1">
                  Sort: {sortBy === "newest" ? "Newest First" : sortBy === "oldest" ? "Oldest First" : "By Categories"}
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

        {/* Table Section */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="spinner w-12 h-12 mb-4"></div>
              <p className="text-text-muted">Loading sub-categories...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mb-4">
                <FolderTree className="w-12 h-12 text-primary/40" />
              </div>
              <h3 className="text-xl font-display font-semibold text-text mb-2">
                {getActiveFiltersCount() > 0 ? "No matching sub-categories found" : "No sub-categories yet"}
              </h3>
              <p className="text-text-muted mb-6 max-w-md">
                {getActiveFiltersCount() > 0
                  ? "Try adjusting your search or filter criteria"
                  : "Start by creating your first sub-category"}
              </p>
              {getActiveFiltersCount() > 0 ? (
                <button onClick={clearFilters} className="btn btn-primary">
                  Clear Filters
                </button>
              ) : (
                <button
                  onClick={() => setOpenSubCategory(true)}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <PlusCircle size={18} />
                  Create First Sub-category
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <TableDisplay 
                  data={filteredData} 
                  columns={column}
                  title={`Sub-Categories (${filteredData.length})`}
                />
              </div>
              
              {/* Results Info */}
              {getActiveFiltersCount() > 0 && (
                <div className="border-t border-border p-4 bg-bg-alt">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <p className="text-text-muted text-sm">
                      Showing <span className="font-semibold text-primary">{filteredData.length}</span> of{" "}
                      <span className="font-semibold">{data.length}</span> sub-categories
                    </p>
                    <button
                      onClick={clearFilters}
                      className="text-sm text-primary hover:underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals - Same as before */}
      {openSubCategory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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
          message={`Are you sure you want to delete "${editData?.name}"? This will affect all associated products.`}
          confirmText="Delete"
          cancelText="Cancel"
          confirmColor="red"
        />
      )}

      <button
        onClick={() => setOpenSubCategory(true)}
        className="lg:hidden fixed bottom-6 right-6 bg-gradient-primary text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-40"
        aria-label="Add sub-category"
      >
        <PlusCircle size={24} />
      </button>
    </div>
  );
};

export default SubCategory;