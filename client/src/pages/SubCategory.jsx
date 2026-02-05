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
import { PlusCircle, Search, Filter, Grid3x3, RefreshCw, Layers } from "lucide-react";

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
        fetchSubCategories(false);
        setOpenConfirm(false);
      }
    } catch (error) {
      AxiosError(error);
    }
  };

  
  const filteredData = data.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategoryFilter === "all" || 
      item.category.some(cat => cat._id === selectedCategoryFilter);
    return matchesSearch && matchesCategory;
  });

  
  const uniqueCategories = Array.from(
    new Map(data.flatMap(item => 
      item.category?.map(cat => [cat._id, cat]) || []
    ).filter(Boolean)).values()
  );

 
  const column = [
    columnHelper.accessor("name", {
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
            <Layers size={18} className="text-primary" />
          </div>
          <div>
            <p className="font-medium text-text">{row.original.name}</p>
            <p className="text-xs text-text-muted">
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
              src={row.original.image}
              alt={row.original.name}
              className="h-12 w-12 rounded-lg object-cover border border-border hover:border-primary transition-all duration-300 cursor-pointer group-hover:scale-110"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/48x48?text=Sub+Cat";
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
              className="badge-primary px-2.5 py-1 rounded-full text-xs"
            >
              {c.name}
            </span>
          ))}
          {row.original.category?.length > 3 && (
            <span className="badge px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
              +{row.original.category.length - 3} more
            </span>
          )}
        </div>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ row }) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          row.original.status === "active" 
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}>
          {row.original.status || "active"}
        </span>
      ),
    }),
    columnHelper.accessor("_id", {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => {
              setOpenEdit(true);
              setEditData(row.original);
            }}
            className="p-2 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition-all duration-200 hover:scale-105 hover:shadow-sm"
            title="Edit Sub-category"
          >
            <HiOutlinePencilSquare size={18} />
          </button>
          <button
            onClick={() => {
              setOpenConfirm(true);
              setEditData(row.original);
            }}
            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 hover:scale-105 hover:shadow-sm"
            title="Delete Sub-category"
          >
            <MdOutlineDeleteOutline size={18} />
          </button>
        </div>
      ),
    }),
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50/50 to-primary/5 p-6">
 
      <div className="glass rounded-2xl p-6 mb-8 shadow-lg fade-in">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Sub-Category Management
            </h2>
            <p className="text-text-muted mt-2">
              Organize your products with sub-categories under parent categories
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="btn-outline flex items-center gap-2 px-4 py-2.5 rounded-xl hover:shadow-sm transition-all disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
            <button
              onClick={() => setOpenSubCategory(true)}
              className="btn-primary flex items-center gap-3 px-6 py-3 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              <PlusCircle size={20} />
              Add Sub-Category
            </button>
          </div>
        </div>

        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-6 pt-6 border-t border-border">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted" size={18} />
              <input
                type="text"
                placeholder="Search sub-categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-12 pr-4 py-3 rounded-xl w-full"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-text-muted" />
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="input py-3 rounded-xl min-w-[180px]"
              >
                <option value="all">All Categories</option>
                {uniqueCategories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-text-muted">
              <Grid3x3 size={18} />
              <span className="font-medium">
                {filteredData.length} of {data.length} Sub-categories
              </span>
            </div>
          </div>
        </div>
      </div>

      
      <div className="glass rounded-2xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="spinner mb-4 border-primary"></div>
            <p className="text-text-muted">Loading sub-categories...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mb-6">
              <Layers size={48} className="text-primary/40" />
            </div>
            <h3 className="text-xl font-semibold text-text mb-2">
              {searchTerm || selectedCategoryFilter !== "all" 
                ? "No matching sub-categories found" 
                : "No sub-categories yet"}
            </h3>
            <p className="text-text-muted mb-6 max-w-md">
              {searchTerm || selectedCategoryFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Start by creating your first sub-category"}
            </p>
            {(searchTerm || selectedCategoryFilter !== "all") ? (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategoryFilter("all");
                }}
                className="btn-primary flex items-center gap-2"
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={() => setOpenSubCategory(true)}
                className="btn-primary flex items-center gap-2"
              >
                <PlusCircle size={18} />
                Create First Sub-category
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="max-h-[60vh] overflow-y-auto">
              <TableDisplay 
                data={filteredData} 
                column={column} 
                className="min-w-full"
              />
            </div>
            
            
            {(searchTerm || selectedCategoryFilter !== "all") && (
              <div className="border-t border-border p-4 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <p className="text-text-muted text-sm">
                    Showing <span className="font-semibold text-primary">{filteredData.length}</span> of{" "}
                    <span className="font-semibold">{data.length}</span> sub-categories
                    {searchTerm && (
                      <> matching "<span className="font-medium">{searchTerm}</span>"</>
                    )}
                    {selectedCategoryFilter !== "all" && (
                      <> in selected category</>
                    )}
                  </p>
                  {(searchTerm || selectedCategoryFilter !== "all") && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategoryFilter("all");
                      }}
                      className="text-sm text-primary hover:text-primary-dark transition-colors"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      
      {openSubCategory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="">
            <UploadSubCategory
              onClose={() => setOpenSubCategory(false)}
              fetchSubCategories={fetchSubCategories}
              onSuccess={() => {
                setOpenSubCategory(false);
              }}
            />
          </div>
        </div>
      )}

      {imageUrl && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <ViewImage url={imageUrl} close={() => setImageUrl("")} />
        </div>
      )}

      {openEdit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="">
            <EditSubCategory
              editData={editData}
              onClose={() => setOpenEdit(false)}
              onSuccess={() => {
                setOpenEdit(false);
                fetchSubCategories(false);
              }}
            />
          </div>
        </div>
      )}

      {openConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="">
            <ConfirmBox
              confirm={handleDelete}
              close={() => setOpenConfirm(false)}
              cancel={() => setOpenConfirm(false)}
              title="Delete Sub-category"
              message="Are you sure you want to delete this sub-category? This will affect all associated products."
              confirmText="Delete"
              cancelText="Cancel"
              confirmColor="red"
            />
          </div>
        </div>
      )}

      
      <button
        onClick={() => setOpenSubCategory(true)}
        className="md:hidden fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-40"
        aria-label="Add sub-category"
      >
        <PlusCircle size={24} />
      </button>
    </div>
  );
};

export default SubCategory;