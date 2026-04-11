import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Axios from "../utils/Axios";
import AxiosError from "../utils/AxiosToError";
import summaryApi from "../common/summartApi";
import CardProduct from "../components/CardProduct";
import { validateUrlConverter } from "../utils/validateUrl";
import { toast } from "react-hot-toast";
import { Filter, X, Menu, ChevronLeft,Package } from "lucide-react";

const ProductList = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [displaySubCategory, setDisplaySubCategory] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const params = useParams();
  const allSubCategory = useSelector((state) => state.product.subCategory);

  const categoryId = params.category?.split("-").slice(-1)[0];
  const subcategoryId = params.subcategory?.split("-").slice(-1)[0];
  const subcategorySlug = params.subcategory || "";
  const subcategoryName = subcategorySlug.split("-").slice(0, -1).join("-");
  const categoryName = params.category?.split("-").slice(0, -1).join("-") || "";

  // Fetch products based on selected subcategory
  const fetchProductData = useCallback(async () => {
    if (!categoryId) {
      return;
    }

    setLoading(true);
    try {
      const payload = {
        categoryId,
        page,
        limit: 10,
      };
      
      if (selectedSubCategory && selectedSubCategory !== 'all') {
        payload.subCategoryId = selectedSubCategory;
      }
      
      const res = await Axios({
        ...summaryApi().getProductByCategoryAndSubcategory,
        data: payload,
      });

      if (res.data?.success) {
        setData(res.data.data || []);
        setTotalPage(res.data.totalPages || 1);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("API Error:", error);
      AxiosError(error);
      toast.error("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [categoryId, selectedSubCategory, page]);

  // Get all subcategories for this category
  useEffect(() => {
    if (allSubCategory.length > 0 && categoryId) {
      const sub = allSubCategory.filter((s) =>
        s.category?.some((el) => el._id === categoryId)
      );
      setDisplaySubCategory(sub);
    }
  }, [categoryId, allSubCategory]);

  // Set selected subcategory from URL params
  useEffect(() => {
    if (subcategoryId && subcategoryId !== 'all') {
      setSelectedSubCategory(subcategoryId);
    } else {
      setSelectedSubCategory(null);
    }
  }, [subcategoryId]);

  // Fetch products when selected subcategory changes
  useEffect(() => {
    if (categoryId) {
      fetchProductData();
    }
  }, [categoryId, selectedSubCategory, page, fetchProductData]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPage) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubCategoryClick = (subId) => {
    setSelectedSubCategory(subId);
    setPage(1);
    const sub = displaySubCategory.find(s => s._id === subId);
    if (sub) {
      const newUrl = `/${validateUrlConverter(categoryName)}-${categoryId}/${validateUrlConverter(sub.name)}-${sub._id}`;
      window.history.pushState({}, '', newUrl);
    }
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const handleAllProductsClick = () => {
    setSelectedSubCategory(null);
    setPage(1);
    const newUrl = `/${validateUrlConverter(categoryName)}-${categoryId}/all-all`;
    window.history.pushState({}, '', newUrl);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  return (
    <section className="w-full py-4 px-4 md:px-6">
      <div className="w-full flex gap-4 relative">
        
        {/* Mobile Filter Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 z-40 bg-primary text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
          <Filter size={20} />
        </button>

        {/* Sidebar - Sub Categories (Desktop) */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-card rounded-xl border border-border p-4 sticky top-24">
            <h2 className="mb-4 font-semibold text-text text-lg flex items-center gap-2">
              <Filter size={18} className="text-primary" />
              Sub Categories
            </h2>
            <div className="flex flex-col gap-2">
              {/* All Products Link */}
              <button
                onClick={handleAllProductsClick}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  !selectedSubCategory
                    ? "bg-primary text-white shadow-md"
                    : "hover:bg-bg-alt text-text"
                }`}
              >
                
                <span className="font-medium">All Products</span>
              </button>
              
              {/* Subcategory List */}
              {displaySubCategory.length > 0 ? (
                displaySubCategory.map((s) => {
                  if (!s?.category?.[0]) return null;
                  
                  return (
                    <button
                      key={s._id}
                      onClick={() => handleSubCategoryClick(s._id)}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                        selectedSubCategory === s._id
                          ? "bg-primary text-white shadow-md"
                          : "hover:bg-bg-alt text-text"
                      }`}
                    >
                      <img
                        src={s.image?.[0] || "/placeholder.png"}
                        alt={s.name}
                        className="w-8 h-8 object-cover rounded"
                        onError={(e) => {
                          e.target.src = "/placeholder.png";
                        }}
                      />
                      <span className="text-sm">{s.name}</span>
                    </button>
                  );
                })
              ) : (
                <p className="text-text-muted text-sm text-center py-4">
                  No subcategories found
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Sidebar (Drawer) */}
        {sidebarOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed left-0 top-0 bottom-0 w-80 bg-card z-50 shadow-2xl animate-slide-in-left overflow-y-auto">
              <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
                <h2 className="font-semibold text-text text-lg flex items-center gap-2">
                  <Filter size={18} className="text-primary" />
                  Sub Categories
                </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-bg-alt transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-4">
                {/* All Products Link */}
                <button
                  onClick={handleAllProductsClick}
                  className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all ${
                    !selectedSubCategory
                      ? "bg-primary text-white shadow-md"
                      : "hover:bg-bg-alt text-text"
                  }`}
                >
                  <span className="text-lg">📦</span>
                  <span className="font-medium">All Products</span>
                </button>
                
                <div className="h-px bg-border my-3"></div>
                
                {/* Subcategory List */}
                {displaySubCategory.length > 0 ? (
                  <div className="space-y-2">
                    {displaySubCategory.map((s) => {
                      if (!s?.category?.[0]) return null;
                      
                      return (
                        <button
                          key={s._id}
                          onClick={() => handleSubCategoryClick(s._id)}
                          className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all ${
                            selectedSubCategory === s._id
                              ? "bg-primary text-white shadow-md"
                              : "hover:bg-bg-alt text-text"
                          }`}
                        >
                          <img
                            src={s.image?.[0] || "/placeholder.png"}
                            alt={s.name}
                            className="w-10 h-10 object-cover rounded"
                            onError={(e) => {
                              e.target.src = "/placeholder.png";
                            }}
                          />
                          <span className="text-sm">{s.name}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-text-muted text-sm text-center py-8">
                    No subcategories found
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Main Content - Products */}
        <div className="flex-1">
          {/* Header with Filter Button for Mobile */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2 capitalize">
                {!selectedSubCategory 
                  ? `${categoryName} - All Products`
                  : displaySubCategory.find(s => s._id === selectedSubCategory)?.name || "Products"}
              </h1>
              <p className="text-text-muted">
                {data.length > 0 ? `${data.length} products found` : "No products found"}
              </p>
            </div>
            
            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition"
            >
              <Filter size={16} />
              <span className="text-sm">Filter</span>
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[60vh]">
              <div className="spinner w-12 h-12"></div>
            </div>
          ) : data.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {data.map((product) => (
                  <CardProduct key={product._id} product={product} />
                ))}
              </div>

              {totalPage > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                    className={`px-4 py-2 rounded-lg transition ${
                      page <= 1
                        ? "bg-bg-alt text-text-muted cursor-not-allowed"
                        : "btn btn-primary"
                    }`}
                  >
                    Previous
                  </button>
                  <span className="text-text-muted">
                    Page {page} of {totalPage}
                  </span>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPage}
                    className={`px-4 py-2 rounded-lg transition ${
                      page >= totalPage
                        ? "bg-bg-alt text-text-muted cursor-not-allowed"
                        : "btn btn-primary"
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="w-24 h-24 rounded-full bg-bg-alt flex items-center justify-center mb-4">
                <Package className="w-12 h-12 text-text-muted" />
              </div>
              <p className="text-text-muted text-lg mb-4">
                {!selectedSubCategory 
                  ? "No products found in this category."
                  : `No products found in ${displaySubCategory.find(s => s._id === selectedSubCategory)?.name}.`}
              </p>
              <Link
                to="/"
                className="btn btn-primary px-6 py-2.5"
              >
                Continue Shopping
              </Link>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-left {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};

export default ProductList;