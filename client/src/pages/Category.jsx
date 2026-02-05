import React, { useEffect, useState } from "react";
import UploadCategoryModel from "../components/UploadCategoryModel";
import summaryApi from "../common/summartApi";
import Axios from "../utils/Axios";
import AxiosError from "../utils/AxiosToError";
import ConfirmBox from "../components/ConfirmBox";
import { useDispatch, useSelector } from "react-redux";
import { setAllCategory } from "../redux/productSlice";
import { Plus, Edit2, Trash2, Grid3x3, Search, Filter } from "lucide-react";

const CategoryPage = () => {
  const [openUploadCategory, setOpenUploadCategory] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const allCategory = useSelector((state) => state.product.allCategory);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await Axios({ ...summaryApi().getAllCategory });
      dispatch(setAllCategory(res.data?.data || []));
    } catch (error) {
      AxiosError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!allCategory.length) {
      fetchCategories();
    }
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

  const filteredCategories = allCategory.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50/50 to-primary/5 p-6">
      
      <div className="glass rounded-2xl p-6 mb-8 shadow-lg fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Category Management
            </h2>
            <p className="text-text-muted mt-2">
              Organize your products with categories
            </p>
          </div>
          
          <button
            onClick={() => setOpenUploadCategory(true)}
            className="btn-primary flex items-center gap-3 px-6 py-3 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            Add New Category
          </button>
        </div>

        
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-6 border-t border-border">
          <div className="relative w-full sm:w-auto mb-4 sm:mb-0">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted" size={18} />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-12 pr-4 py-3 rounded-xl w-full sm:w-80"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-text-muted">
              <Grid3x3 size={18} />
              <span className="font-medium">{allCategory.length} Categories</span>
            </div>
            <button className="btn-outline flex items-center gap-2 rounded-xl px-4 py-2.5">
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>
      </div>

     
      <div className="glass rounded-2xl p-6 shadow-lg">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="spinner mb-4 border-primary"></div>
            <p className="text-text-muted">Loading categories...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mb-6">
              <Grid3x3 size={48} className="text-primary/40" />
            </div>
            <h3 className="text-xl font-semibold text-text mb-2">
              {searchTerm ? "No matching categories found" : "No categories yet"}
            </h3>
            <p className="text-text-muted mb-6 max-w-md">
              {searchTerm
                ? "Try a different search term"
                : "Get started by creating your first category"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setOpenUploadCategory(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={18} />
                Create First Category
              </button>
            )}
          </div>
        ) : (
          <>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 max-h-[65vh] overflow-y-auto pr-3 pb-3">
              {filteredCategories.map((category) => (
                <div
                  key={category._id}
                  className="card card-hover group relative overflow-hidden rounded-xl bg-white border border-border hover:border-primary/30 transition-all duration-300"
                >
                  
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x200?text=Category+Image";
                      }}
                    />
                    
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    
                    <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <h3 className="text-white font-semibold text-lg truncate">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-white/80 text-sm truncate mt-1">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </div>

                  
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="badge-primary px-3 py-1 rounded-full text-xs">
                          {category.productCount || 0} products
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditCategory(category);
                            setOpenUploadCategory(true);
                          }}
                          className="p-2 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition-colors duration-200 hover:scale-105"
                          aria-label="Edit category"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteCategoryId(category._id)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200 hover:scale-105"
                          aria-label="Delete category"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  
                  {deleteCategoryId === category._id && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
                      <ConfirmBox
                        close={() => setDeleteCategoryId(null)}
                        cancel={() => setDeleteCategoryId(null)}
                        confirm={() => handleDeleteCategory(category._id)}
                
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            
            {searchTerm && (
              <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                <p className="text-text-muted text-sm">
                  Found <span className="font-semibold text-primary">{filteredCategories.length}</span> categories matching "<span className="font-medium">{searchTerm}</span>"
                </p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-sm text-primary hover:text-primary-dark transition-colors"
                >
                  Clear search
                </button>
              </div>
            )}
          </>
        )}
      </div>

      
      {openUploadCategory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="">
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
        </div>
      )}

      
      <button
        onClick={() => setOpenUploadCategory(true)}
        className="md:hidden fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-40"
        aria-label="Add category"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default CategoryPage;