// // import React, { useState, useEffect, useCallback } from "react";
// // import { Link, useParams } from "react-router-dom";
// // import { useSelector } from "react-redux";
// // import Axios from "../utils/Axios";
// // import AxiosError from "../utils/AxiosToError";
// // import summaryApi from "../common/summartApi";
// // import CardProduct from "../components/CardProduct";
// // import { validateUrlConverter } from "../utils/validateUrl";
// // import { toast } from "react-hot-toast";
// // import { Filter, X, Menu, ChevronLeft,Package } from "lucide-react";

// // const ProductList = () => {
// //   const [data, setData] = useState([]);
// //   const [page, setPage] = useState(1);
// //   const [totalPage, setTotalPage] = useState(1);
// //   const [loading, setLoading] = useState(false);
// //   const [displaySubCategory, setDisplaySubCategory] = useState([]);
// //   const [selectedSubCategory, setSelectedSubCategory] = useState(null);
// //   const [sidebarOpen, setSidebarOpen] = useState(false);

// //   const params = useParams();
// //   const allSubCategory = useSelector((state) => state.product.subCategory);

// //   const categoryId = params.category?.split("-").slice(-1)[0];
// //   const subcategoryId = params.subcategory?.split("-").slice(-1)[0];
// //   const subcategorySlug = params.subcategory || "";
// //   const subcategoryName = subcategorySlug.split("-").slice(0, -1).join("-");
// //   const categoryName = params.category?.split("-").slice(0, -1).join("-") || "";

// //   // Fetch products based on selected subcategory
// //   const fetchProductData = useCallback(async () => {
// //     if (!categoryId) {
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       const payload = {
// //         categoryId,
// //         page,
// //         limit: 10,
// //       };
      
// //       if (selectedSubCategory && selectedSubCategory !== 'all') {
// //         payload.subCategoryId = selectedSubCategory;
// //       }
      
// //       const res = await Axios({
// //         ...summaryApi().getProductByCategoryAndSubcategory,
// //         data: payload,
// //       });

// //       if (res.data?.success) {
// //         setData(res.data.data || []);
// //         setTotalPage(res.data.totalPages || 1);
// //       } else {
// //         setData([]);
// //       }
// //     } catch (error) {
// //       console.error("API Error:", error);
// //       AxiosError(error);
// //       toast.error("Failed to fetch products. Please try again.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [categoryId, selectedSubCategory, page]);

// //   // Get all subcategories for this category
// //   useEffect(() => {
// //     if (allSubCategory.length > 0 && categoryId) {
// //       const sub = allSubCategory.filter((s) =>
// //         s.category?.some((el) => el._id === categoryId)
// //       );
// //       setDisplaySubCategory(sub);
// //     }
// //   }, [categoryId, allSubCategory]);

// //   // Set selected subcategory from URL params
// //   useEffect(() => {
// //     if (subcategoryId && subcategoryId !== 'all') {
// //       setSelectedSubCategory(subcategoryId);
// //     } else {
// //       setSelectedSubCategory(null);
// //     }
// //   }, [subcategoryId]);

// //   // Fetch products when selected subcategory changes
// //   useEffect(() => {
// //     if (categoryId) {
// //       fetchProductData();
// //     }
// //   }, [categoryId, selectedSubCategory, page, fetchProductData]);

// //   const handlePageChange = (newPage) => {
// //     if (newPage >= 1 && newPage <= totalPage) {
// //       setPage(newPage);
// //       window.scrollTo({ top: 0, behavior: "smooth" });
// //     }
// //   };

// //   const handleSubCategoryClick = (subId) => {
// //     setSelectedSubCategory(subId);
// //     setPage(1);
// //     const sub = displaySubCategory.find(s => s._id === subId);
// //     if (sub) {
// //       const newUrl = `/${validateUrlConverter(categoryName)}-${categoryId}/${validateUrlConverter(sub.name)}-${sub._id}`;
// //       window.history.pushState({}, '', newUrl);
// //     }
// //     setSidebarOpen(false); // Close sidebar on mobile after selection
// //   };

// //   const handleAllProductsClick = () => {
// //     setSelectedSubCategory(null);
// //     setPage(1);
// //     const newUrl = `/${validateUrlConverter(categoryName)}-${categoryId}/all-all`;
// //     window.history.pushState({}, '', newUrl);
// //     setSidebarOpen(false); // Close sidebar on mobile after selection
// //   };

// //   return (
// //     <section className="w-full py-4 px-4 md:px-6">
// //       <div className="w-full flex gap-4 relative">
        
// //         {/* Mobile Filter Button */}
// //         <button
// //           onClick={() => setSidebarOpen(true)}
// //           className="lg:hidden fixed bottom-6 right-6 z-40 bg-primary text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
// //         >
// //           <Filter size={20} />
// //         </button>

// //         {/* Sidebar - Sub Categories (Desktop) */}
// //         <div className="hidden lg:block w-64 flex-shrink-0">
// //           <div className="bg-card rounded-xl border border-border p-4 sticky top-24">
// //             <h2 className="mb-4 font-semibold text-text text-lg flex items-center gap-2">
// //               <Filter size={18} className="text-primary" />
// //               Sub Categories
// //             </h2>
// //             <div className="flex flex-col gap-2">
// //               {/* All Products Link */}
// //               <button
// //                 onClick={handleAllProductsClick}
// //                 className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
// //                   !selectedSubCategory
// //                     ? "bg-primary text-white shadow-md"
// //                     : "hover:bg-bg-alt text-text"
// //                 }`}
// //               >
                
// //                 <span className="font-medium">All Products</span>
// //               </button>
              
// //               {/* Subcategory List */}
// //               {displaySubCategory.length > 0 ? (
// //                 displaySubCategory.map((s) => {
// //                   if (!s?.category?.[0]) return null;
                  
// //                   return (
// //                     <button
// //                       key={s._id}
// //                       onClick={() => handleSubCategoryClick(s._id)}
// //                       className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
// //                         selectedSubCategory === s._id
// //                           ? "bg-primary text-white shadow-md"
// //                           : "hover:bg-bg-alt text-text"
// //                       }`}
// //                     >
// //                       <img
// //                         src={s.image?.[0] || "/placeholder.png"}
// //                         alt={s.name}
// //                         className="w-8 h-8 object-cover rounded"
// //                         onError={(e) => {
// //                           e.target.src = "/placeholder.png";
// //                         }}
// //                       />
// //                       <span className="text-sm">{s.name}</span>
// //                     </button>
// //                   );
// //                 })
// //               ) : (
// //                 <p className="text-text-muted text-sm text-center py-4">
// //                   No subcategories found
// //                 </p>
// //               )}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Mobile Sidebar (Drawer) */}
// //         {sidebarOpen && (
// //           <>
// //             <div 
// //               className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm lg:hidden"
// //               onClick={() => setSidebarOpen(false)}
// //             />
// //             <div className="fixed left-0 top-0 bottom-0 w-80 bg-card z-50 shadow-2xl animate-slide-in-left overflow-y-auto">
// //               <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
// //                 <h2 className="font-semibold text-text text-lg flex items-center gap-2">
// //                   <Filter size={18} className="text-primary" />
// //                   Sub Categories
// //                 </h2>
// //                 <button
// //                   onClick={() => setSidebarOpen(false)}
// //                   className="p-2 rounded-lg hover:bg-bg-alt transition-colors"
// //                 >
// //                   <X size={20} />
// //                 </button>
// //               </div>
              
// //               <div className="p-4">
// //                 {/* All Products Link */}
// //                 <button
// //                   onClick={handleAllProductsClick}
// //                   className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all ${
// //                     !selectedSubCategory
// //                       ? "bg-primary text-white shadow-md"
// //                       : "hover:bg-bg-alt text-text"
// //                   }`}
// //                 >
// //                   <span className="text-lg">📦</span>
// //                   <span className="font-medium">All Products</span>
// //                 </button>
                
// //                 <div className="h-px bg-border my-3"></div>
                
// //                 {/* Subcategory List */}
// //                 {displaySubCategory.length > 0 ? (
// //                   <div className="space-y-2">
// //                     {displaySubCategory.map((s) => {
// //                       if (!s?.category?.[0]) return null;
                      
// //                       return (
// //                         <button
// //                           key={s._id}
// //                           onClick={() => handleSubCategoryClick(s._id)}
// //                           className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all ${
// //                             selectedSubCategory === s._id
// //                               ? "bg-primary text-white shadow-md"
// //                               : "hover:bg-bg-alt text-text"
// //                           }`}
// //                         >
// //                           <img
// //                             src={s.image?.[0] || "/placeholder.png"}
// //                             alt={s.name}
// //                             className="w-10 h-10 object-cover rounded"
// //                             onError={(e) => {
// //                               e.target.src = "/placeholder.png";
// //                             }}
// //                           />
// //                           <span className="text-sm">{s.name}</span>
// //                         </button>
// //                       );
// //                     })}
// //                   </div>
// //                 ) : (
// //                   <p className="text-text-muted text-sm text-center py-8">
// //                     No subcategories found
// //                   </p>
// //                 )}
// //               </div>
// //             </div>
// //           </>
// //         )}

// //         {/* Main Content - Products */}
// //         <div className="flex-1">
// //           {/* Header with Filter Button for Mobile */}
// //           <div className="mb-6 flex items-center justify-between">
// //             <div>
// //               <h1 className="text-2xl font-bold mb-2 capitalize">
// //                 {!selectedSubCategory 
// //                   ? `${categoryName} - All Products`
// //                   : displaySubCategory.find(s => s._id === selectedSubCategory)?.name || "Products"}
// //               </h1>
// //               <p className="text-text-muted">
// //                 {data.length > 0 ? `${data.length} products found` : "No products found"}
// //               </p>
// //             </div>
            
// //             {/* Mobile Filter Trigger */}
// //             <button
// //               onClick={() => setSidebarOpen(true)}
// //               className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition"
// //             >
// //               <Filter size={16} />
// //               <span className="text-sm">Filter</span>
// //             </button>
// //           </div>

// //           {loading ? (
// //             <div className="flex justify-center items-center min-h-[60vh]">
// //               <div className="spinner w-12 h-12"></div>
// //             </div>
// //           ) : data.length > 0 ? (
// //             <>
// //               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
// //                 {data.map((product) => (
// //                   <CardProduct key={product._id} product={product} />
// //                 ))}
// //               </div>

// //               {totalPage > 1 && (
// //                 <div className="flex justify-center items-center gap-4 mt-8">
// //                   <button
// //                     onClick={() => handlePageChange(page - 1)}
// //                     disabled={page <= 1}
// //                     className={`px-4 py-2 rounded-lg transition ${
// //                       page <= 1
// //                         ? "bg-bg-alt text-text-muted cursor-not-allowed"
// //                         : "btn btn-primary"
// //                     }`}
// //                   >
// //                     Previous
// //                   </button>
// //                   <span className="text-text-muted">
// //                     Page {page} of {totalPage}
// //                   </span>
// //                   <button
// //                     onClick={() => handlePageChange(page + 1)}
// //                     disabled={page >= totalPage}
// //                     className={`px-4 py-2 rounded-lg transition ${
// //                       page >= totalPage
// //                         ? "bg-bg-alt text-text-muted cursor-not-allowed"
// //                         : "btn btn-primary"
// //                     }`}
// //                   >
// //                     Next
// //                   </button>
// //                 </div>
// //               )}
// //             </>
// //           ) : (
// //             <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
// //               <div className="w-24 h-24 rounded-full bg-bg-alt flex items-center justify-center mb-4">
// //                 <Package className="w-12 h-12 text-text-muted" />
// //               </div>
// //               <p className="text-text-muted text-lg mb-4">
// //                 {!selectedSubCategory 
// //                   ? "No products found in this category."
// //                   : `No products found in ${displaySubCategory.find(s => s._id === selectedSubCategory)?.name}.`}
// //               </p>
// //               <Link
// //                 to="/"
// //                 className="btn btn-primary px-6 py-2.5"
// //               >
// //                 Continue Shopping
// //               </Link>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       <style jsx>{`
// //         @keyframes slide-in-left {
// //           from {
// //             transform: translateX(-100%);
// //           }
// //           to {
// //             transform: translateX(0);
// //           }
// //         }
// //         .animate-slide-in-left {
// //           animation: slide-in-left 0.3s ease-out;
// //         }
// //       `}</style>
// //     </section>
// //   );
// // };

// // export default ProductList;

// import React, { useState, useEffect, useCallback } from "react";
// import { Link, useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import Axios from "../utils/Axios";
// import summaryApi from "../common/summartApi";
// import CardProduct from "../components/CardProduct";
// import { validateUrlConverter } from "../utils/validateUrl";
// import { Filter, X, Package, ChevronDown, ChevronUp, DollarSign, Star } from "lucide-react";

// const ProductList = () => {
//   const [products, setProducts] = useState([]);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [subCategories, setSubCategories] = useState([]);
//   const [selectedSubCategory, setSelectedSubCategory] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [sortBy, setSortBy] = useState("default");
//   const [priceRange, setPriceRange] = useState({ min: "", max: "" });
//   const [showSortMenu, setShowSortMenu] = useState(false);

//   const params = useParams();
//   const allSubCategory = useSelector((state) => state.product.subCategory);

//   const categoryId = params.category?.split("-").slice(-1)[0];
//   const subcategoryId = params.subcategory?.split("-").slice(-1)[0];
//   const categoryName = params.category?.split("-").slice(0, -1).join("-") || "";

//   // Get all subcategories for this category
//   useEffect(() => {
//     if (allSubCategory.length > 0 && categoryId) {
//       const filtered = allSubCategory.filter((s) =>
//         s.category?.some((el) => el._id === categoryId)
//       );
//       setSubCategories(filtered);
//     }
//   }, [categoryId, allSubCategory]);

//   // Set selected subcategory from URL
//   useEffect(() => {
//     if (subcategoryId && subcategoryId !== 'all') {
//       setSelectedSubCategory(subcategoryId);
//     } else {
//       setSelectedSubCategory(null);
//     }
//   }, [subcategoryId]);

//   // Fetch products
//   const fetchProducts = useCallback(async () => {
//     if (!categoryId) return;

//     setLoading(true);
//     try {
//       const payload = {
//         categoryId,
//         page,
//         limit: 12,
//         sortBy,
//         ...(selectedSubCategory && { subCategoryId: selectedSubCategory }),
//         ...(priceRange.min && { minPrice: priceRange.min }),
//         ...(priceRange.max && { maxPrice: priceRange.max }),
//       };
      
//       const res = await Axios({
//         ...summaryApi().getProductByCategoryAndSubcategory,
//         data: payload,
//       });

//       if (res.data?.success) {
//         let productsData = res.data.data || [];
        
//         // Apply sorting (if not handled by backend)
//         if (sortBy === "price-asc") {
//           productsData.sort((a, b) => (a.price || 0) - (b.price || 0));
//         } else if (sortBy === "price-desc") {
//           productsData.sort((a, b) => (b.price || 0) - (a.price || 0));
//         } else if (sortBy === "rating") {
//           productsData.sort((a, b) => (b.rating || 0) - (a.rating || 0));
//         } else if (sortBy === "newest") {
//           productsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//         }
        
//         setProducts(productsData);
//         setTotalPages(res.data.totalPages || 1);
//       } else {
//         setProducts([]);
//       }
//     } catch (error) {
//       console.error("Fetch error:", error);
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [categoryId, selectedSubCategory, page, sortBy, priceRange]);

//   useEffect(() => {
//     fetchProducts();
//   }, [fetchProducts]);

//   const handleSubCategorySelect = (subId) => {
//     setSelectedSubCategory(subId);
//     setPage(1);
//     const sub = subCategories.find(s => s._id === subId);
//     if (sub) {
//       const newUrl = `/${validateUrlConverter(categoryName)}-${categoryId}/${validateUrlConverter(sub.name)}-${sub._id}`;
//       window.history.pushState({}, '', newUrl);
//     }
//     setSidebarOpen(false);
//   };

//   const handleAllProducts = () => {
//     setSelectedSubCategory(null);
//     setPage(1);
//     const newUrl = `/${validateUrlConverter(categoryName)}-${categoryId}/all-all`;
//     window.history.pushState({}, '', newUrl);
//     setSidebarOpen(false);
//   };

//   const handleSortChange = (value) => {
//     setSortBy(value);
//     setPage(1);
//     setShowSortMenu(false);
//   };

//   const handlePriceFilter = () => {
//     setPage(1);
//     setSidebarOpen(false);
//     fetchProducts();
//   };

//   const clearPriceFilter = () => {
//     setPriceRange({ min: "", max: "" });
//     setPage(1);
//   };

//   const sortOptions = [
//     { value: "default", label: "Default", icon: null },
//     { value: "price-asc", label: "Price: Low to High", icon: DollarSign },
//     { value: "price-desc", label: "Price: High to Low", icon: DollarSign },
//     { value: "rating", label: "Top Rated", icon: Star },
//     { value: "newest", label: "Newest First", icon: null },
//   ];

//   return (
//     <div className="min-h-screen bg-bg py-4 px-4 md:px-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex gap-6 relative">
        
//           {/* Sidebar - Sub Categories & Filters (Desktop) */}
//           <div className="hidden lg:block w-72 flex-shrink-0">
//             <div className="bg-card rounded-xl border border-border p-5 sticky top-24">
//               <h2 className="font-semibold text-text text-lg mb-4 flex items-center gap-2">
//                 <Filter size={18} className="text-primary" />
//                 Filters
//               </h2>
              
//               {/* Categories Section */}
//               <div className="mb-6">
//                 <h3 className="text-sm font-medium text-text mb-3">Categories</h3>
//                 <button
//                   onClick={handleAllProducts}
//                   className={`w-full text-left px-3 py-2 rounded-lg transition mb-1 ${
//                     !selectedSubCategory
//                       ? "bg-primary text-white"
//                       : "hover:bg-bg-alt text-text"
//                   }`}
//                 >
//                   All Products
//                 </button>
//                 {subCategories.map((sub) => (
//                   <button
//                     key={sub._id}
//                     onClick={() => handleSubCategorySelect(sub._id)}
//                     className={`w-full text-left px-3 py-2 rounded-lg transition mb-1 ${
//                       selectedSubCategory === sub._id
//                         ? "bg-primary text-white"
//                         : "hover:bg-bg-alt text-text"
//                     }`}
//                   >
//                     {sub.name}
//                   </button>
//                 ))}
//               </div>

//               {/* Price Filter */}
//               <div className="mb-6">
//                 <h3 className="text-sm font-medium text-text mb-3">Price Range</h3>
//                 <div className="flex gap-2">
//                   <input
//                     type="number"
//                     placeholder="Min"
//                     value={priceRange.min}
//                     onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
//                     className="w-full px-3 py-2 rounded-lg border border-border bg-card text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
//                   />
//                   <input
//                     type="number"
//                     placeholder="Max"
//                     value={priceRange.max}
//                     onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
//                     className="w-full px-3 py-2 rounded-lg border border-border bg-card text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
//                   />
//                 </div>
//                 <div className="flex gap-2 mt-3">
//                   <button
//                     onClick={handlePriceFilter}
//                     className="flex-1 bg-primary text-white px-3 py-1.5 rounded-lg text-sm hover:bg-primary-dark transition"
//                   >
//                     Apply
//                   </button>
//                   {(priceRange.min || priceRange.max) && (
//                     <button
//                       onClick={clearPriceFilter}
//                       className="px-3 py-1.5 rounded-lg border border-border text-text-muted hover:text-text transition text-sm"
//                     >
//                       Clear
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Mobile Sidebar (Drawer) */}
//           {sidebarOpen && (
//             <>
//               <div 
//                 className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm lg:hidden"
//                 onClick={() => setSidebarOpen(false)}
//               />
//               <div className="fixed left-0 top-0 bottom-0 w-80 bg-card z-50 shadow-2xl animate-slide-in-left overflow-y-auto">
//                 <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
//                   <h2 className="font-semibold text-text text-lg flex items-center gap-2">
//                     <Filter size={18} className="text-primary" />
//                     Filters
//                   </h2>
//                   <button
//                     onClick={() => setSidebarOpen(false)}
//                     className="p-2 rounded-lg hover:bg-bg-alt transition"
//                   >
//                     <X size={20} />
//                   </button>
//                 </div>
                
//                 <div className="p-4">
//                   {/* Categories */}
//                   <div className="mb-6">
//                     <h3 className="text-sm font-medium text-text mb-3">Categories</h3>
//                     <button
//                       onClick={handleAllProducts}
//                       className={`w-full text-left px-3 py-2 rounded-lg transition mb-1 ${
//                         !selectedSubCategory
//                           ? "bg-primary text-white"
//                           : "hover:bg-bg-alt text-text"
//                       }`}
//                     >
//                       All Products
//                     </button>
//                     {subCategories.map((sub) => (
//                       <button
//                         key={sub._id}
//                         onClick={() => handleSubCategorySelect(sub._id)}
//                         className={`w-full text-left px-3 py-2 rounded-lg transition mb-1 ${
//                           selectedSubCategory === sub._id
//                             ? "bg-primary text-white"
//                             : "hover:bg-bg-alt text-text"
//                         }`}
//                       >
//                         {sub.name}
//                       </button>
//                     ))}
//                   </div>

//                   {/* Price Filter */}
//                   <div className="mb-6">
//                     <h3 className="text-sm font-medium text-text mb-3">Price Range</h3>
//                     <div className="flex gap-2">
//                       <input
//                         type="number"
//                         placeholder="Min"
//                         value={priceRange.min}
//                         onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
//                         className="w-full px-3 py-2 rounded-lg border border-border bg-card text-text text-sm focus:outline-none"
//                       />
//                       <input
//                         type="number"
//                         placeholder="Max"
//                         value={priceRange.max}
//                         onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
//                         className="w-full px-3 py-2 rounded-lg border border-border bg-card text-text text-sm focus:outline-none"
//                       />
//                     </div>
//                     <div className="flex gap-2 mt-3">
//                       <button
//                         onClick={handlePriceFilter}
//                         className="flex-1 bg-primary text-white px-3 py-1.5 rounded-lg text-sm hover:bg-primary-dark transition"
//                       >
//                         Apply
//                       </button>
//                       {(priceRange.min || priceRange.max) && (
//                         <button
//                           onClick={clearPriceFilter}
//                           className="px-3 py-1.5 rounded-lg border border-border text-text-muted hover:text-text transition text-sm"
//                         >
//                           Clear
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}

//           {/* Main Content */}
//           <div className="flex-1">
//             {/* Header */}
//             <div className="mb-6">
//               <div className="flex flex-wrap items-center justify-between gap-4">
//                 <div>
//                   <h1 className="text-2xl font-bold text-text capitalize">
//                     {!selectedSubCategory 
//                       ? categoryName
//                       : subCategories.find(s => s._id === selectedSubCategory)?.name || "Products"}
//                   </h1>
//                   <p className="text-text-muted text-sm mt-1">
//                     {products.length} {products.length === 1 ? 'product' : 'products'} found
//                   </p>
//                 </div>
                
//                 {/* Sort Dropdown */}
//                 <div className="relative">
//                   <button
//                     onClick={() => setShowSortMenu(!showSortMenu)}
//                     className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-text hover:bg-bg-alt transition"
//                   >
//                     <span className="text-sm">Sort: {sortOptions.find(o => o.value === sortBy)?.label}</span>
//                     {showSortMenu ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//                   </button>
                  
//                   {showSortMenu && (
//                     <div className="absolute right-0 top-full mt-2 w-48 bg-card rounded-xl border border-border shadow-lg z-10 overflow-hidden">
//                       {sortOptions.map((option) => {
//                         const Icon = option.icon;
//                         return (
//                           <button
//                             key={option.value}
//                             onClick={() => handleSortChange(option.value)}
//                             className={`w-full text-left px-4 py-2 text-sm hover:bg-bg-alt transition flex items-center gap-2 ${
//                               sortBy === option.value ? "text-primary bg-primary/5" : "text-text"
//                             }`}
//                           >
//                             {Icon && <Icon size={14} />}
//                             {option.label}
//                           </button>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Active Filters */}
//               {(selectedSubCategory || priceRange.min || priceRange.max) && (
//                 <div className="flex flex-wrap gap-2 mt-4">
//                   {selectedSubCategory && (
//                     <span className="bg-primary/10 text-primary px-3 py-1 text-sm rounded-full flex items-center gap-1">
//                       {subCategories.find(s => s._id === selectedSubCategory)?.name}
//                       <button onClick={handleAllProducts} className="hover:text-error">
//                         <X size={14} />
//                       </button>
//                     </span>
//                   )}
//                   {priceRange.min && (
//                     <span className="bg-primary/10 text-primary px-3 py-1 text-sm rounded-full flex items-center gap-1">
//                       Min: ₹{parseInt(priceRange.min).toLocaleString()}
//                       <button onClick={() => setPriceRange({ ...priceRange, min: "" })} className="hover:text-error">
//                         <X size={14} />
//                       </button>
//                     </span>
//                   )}
//                   {priceRange.max && (
//                     <span className="bg-primary/10 text-primary px-3 py-1 text-sm rounded-full flex items-center gap-1">
//                       Max: ₹{parseInt(priceRange.max).toLocaleString()}
//                       <button onClick={() => setPriceRange({ ...priceRange, max: "" })} className="hover:text-error">
//                         <X size={14} />
//                       </button>
//                     </span>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Mobile Filter Button */}
//             <button
//               onClick={() => setSidebarOpen(true)}
//               className="lg:hidden fixed bottom-6 right-6 z-40 bg-primary text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
//             >
//               <Filter size={20} />
//             </button>

//             {/* Products Grid */}
//             {loading ? (
//               <div className="flex justify-center items-center min-h-[400px]">
//                 <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
//               </div>
//             ) : products.length > 0 ? (
//               <>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
//                   {products.map((product) => (
//                     <CardProduct key={product._id} product={product} />
//                   ))}
//                 </div>

//                 {/* Pagination */}
//                 {totalPages > 1 && (
//                   <div className="flex justify-center items-center gap-3 mt-10">
//                     <button
//                       onClick={() => setPage(p => Math.max(1, p - 1))}
//                       disabled={page <= 1}
//                       className={`px-4 py-2 rounded-lg transition ${
//                         page <= 1
//                           ? "bg-bg-alt text-text-muted cursor-not-allowed"
//                           : "bg-primary text-white hover:bg-primary-dark"
//                       }`}
//                     >
//                       Previous
//                     </button>
//                     <span className="text-text-muted text-sm">
//                       Page {page} of {totalPages}
//                     </span>
//                     <button
//                       onClick={() => setPage(p => Math.min(totalPages, p + 1))}
//                       disabled={page >= totalPages}
//                       className={`px-4 py-2 rounded-lg transition ${
//                         page >= totalPages
//                           ? "bg-bg-alt text-text-muted cursor-not-allowed"
//                           : "bg-primary text-white hover:bg-primary-dark"
//                       }`}
//                     >
//                       Next
//                     </button>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
//                 <div className="w-20 h-20 rounded-full bg-bg-alt flex items-center justify-center mb-4">
//                   <Package className="w-10 h-10 text-text-muted" />
//                 </div>
//                 <p className="text-text-muted mb-4">
//                   No products found in this category.
//                 </p>
//                 <Link to="/" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition">
//                   Continue Shopping
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes slide-in-left {
//           from { transform: translateX(-100%); }
//           to { transform: translateX(0); }
//         }
//         .animate-slide-in-left {
//           animation: slide-in-left 0.3s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ProductList;

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Axios from "../utils/Axios";
import summaryApi from "../common/summartApi";
import CardProduct from "../components/CardProduct";
import { validateUrlConverter } from "../utils/validateUrl";
import { Filter, X, Package, ChevronDown, ChevronUp, DollarSign, Star } from "lucide-react";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const params = useParams();
  const navigate = useNavigate();
  const allSubCategory = useSelector((state) => state.product.subCategory);
  
  // Ref for abort controller
  const abortControllerRef = useRef(null);

  // Extract IDs from params
  const categoryId = params.category?.split("-").slice(-1)[0];
  const subcategoryId = params.subcategory?.split("-").slice(-1)[0];
  const categoryName = params.category?.split("-").slice(0, -1).join("-") || "";

  // Check mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get all subcategories for this category
  useEffect(() => {
    if (allSubCategory?.length > 0 && categoryId) {
      const filtered = allSubCategory.filter((s) =>
        s.category?.some((el) => el?._id === categoryId)
      );
      setSubCategories(filtered);
    }
  }, [categoryId, allSubCategory]);

  // Set selected subcategory from URL
  useEffect(() => {
    if (subcategoryId && subcategoryId !== 'all' && subcategoryId !== 'undefined') {
      setSelectedSubCategory(subcategoryId);
    } else {
      setSelectedSubCategory(null);
    }
  }, [subcategoryId]);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    if (!categoryId) return;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();

    setLoading(true);
    try {
      const payload = {
        categoryId,
        page,
        limit: 12,
        ...(sortBy !== "default" && { sortBy }),
        ...(selectedSubCategory && { subCategoryId: selectedSubCategory }),
        ...(priceRange.min && { minPrice: Number(priceRange.min) }),
        ...(priceRange.max && { maxPrice: Number(priceRange.max) }),
      };
      
      const res = await Axios({
        ...summaryApi().getProductByCategoryAndSubcategory,
        data: payload,
        signal: abortControllerRef.current.signal,
      });

      if (res.data?.success) {
        let productsData = res.data.data || [];
        
        // Client-side sorting if backend doesn't support all options
        const sortKey = sortBy;
        if (sortKey === "price-asc") {
          productsData = [...productsData].sort((a, b) => (a.price || 0) - (b.price || 0));
        } else if (sortKey === "price-desc") {
          productsData = [...productsData].sort((a, b) => (b.price || 0) - (a.price || 0));
        } else if (sortKey === "rating") {
          productsData = [...productsData].sort((a, b) => (b.avgRating || b.rating || 0) - (a.avgRating || a.rating || 0));
        } else if (sortKey === "newest") {
          productsData = [...productsData].sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          });
        }
        
        setProducts(productsData);
        setTotalPages(res.data.totalPages || 1);
      } else {
        setProducts([]);
      }
    } catch (error) {
      if (error.name !== 'AbortError' && error.code !== 'ERR_CANCELED') {
        console.error("Fetch error:", error);
      }
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [categoryId, selectedSubCategory, page, sortBy, priceRange.min, priceRange.max]);

  useEffect(() => {
    fetchProducts();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchProducts]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedSubCategory, sortBy, priceRange.min, priceRange.max]);

  const handleSubCategorySelect = useCallback((subId) => {
    setSelectedSubCategory(subId);
    const sub = subCategories.find(s => s._id === subId);
    if (sub && categoryId && categoryName) {
      const newUrl = `/${validateUrlConverter(categoryName)}-${categoryId}/${validateUrlConverter(sub.name)}-${sub._id}`;
      navigate(newUrl, { replace: true });
    }
    setSidebarOpen(false);
  }, [subCategories, categoryId, categoryName, navigate]);

  const handleAllProducts = useCallback(() => {
    setSelectedSubCategory(null);
    if (categoryId && categoryName) {
      const newUrl = `/${validateUrlConverter(categoryName)}-${categoryId}/all-all`;
      navigate(newUrl, { replace: true });
    }
    setSidebarOpen(false);
  }, [categoryId, categoryName, navigate]);

  const handleSortChange = useCallback((value) => {
    setSortBy(value);
    setShowSortMenu(false);
  }, []);

  const handlePriceFilter = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const clearPriceFilter = useCallback(() => {
    setPriceRange({ min: "", max: "" });
  }, []);

  const clearAllFilters = useCallback(() => {
    setSelectedSubCategory(null);
    setPriceRange({ min: "", max: "" });
    setSortBy("default");
    if (categoryId && categoryName) {
      const newUrl = `/${validateUrlConverter(categoryName)}-${categoryId}/all-all`;
      navigate(newUrl, { replace: true });
    }
    setSidebarOpen(false);
  }, [categoryId, categoryName, navigate]);

  const sortOptions = [
    { value: "default", label: "Default", icon: null },
    { value: "price-asc", label: "Price: Low to High", icon: DollarSign },
    { value: "price-desc", label: "Price: High to Low", icon: DollarSign },
    { value: "rating", label: "Top Rated", icon: Star },
    { value: "newest", label: "Newest First", icon: null },
  ];

  const activeFiltersCount = (selectedSubCategory ? 1 : 0) + 
    (priceRange.min ? 1 : 0) + 
    (priceRange.max ? 1 : 0);

  const currentSortLabel = sortOptions.find(o => o.value === sortBy)?.label || "Default";

  return (
    <div className="min-h-screen bg-bg py-4 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-6 relative">
        
          {/* Sidebar - Sub Categories & Filters (Desktop) */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-card rounded-xl border border-border p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-text text-lg flex items-center gap-2">
                  <Filter size={18} className="text-primary" />
                  Filters
                </h2>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-primary hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              {/* Categories Section */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-text mb-3">Categories</h3>
                <button
                  onClick={handleAllProducts}
                  className={`w-full text-left px-3 py-2 rounded-lg transition mb-1 ${
                    !selectedSubCategory
                      ? "bg-primary text-white"
                      : "hover:bg-bg-alt text-text"
                  }`}
                  aria-label="View all products"
                >
                  All Products
                </button>
                {subCategories.map((sub) => (
                  <button
                    key={sub._id}
                    onClick={() => handleSubCategorySelect(sub._id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition mb-1 ${
                      selectedSubCategory === sub._id
                        ? "bg-primary text-white"
                        : "hover:bg-bg-alt text-text"
                    }`}
                    aria-label={`Filter by ${sub.name}`}
                  >
                    {sub.name}
                  </button>
                ))}
                {subCategories.length === 0 && (
                  <p className="text-text-muted text-sm text-center py-4">
                    No subcategories available
                  </p>
                )}
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="text-sm font-medium text-text mb-3">Price Range (₹)</h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-card text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    aria-label="Minimum price"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-card text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    aria-label="Maximum price"
                  />
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handlePriceFilter}
                    className="flex-1 bg-primary text-white px-3 py-1.5 rounded-lg text-sm hover:bg-primary-dark transition"
                    aria-label="Apply price filter"
                  >
                    Apply
                  </button>
                  {(priceRange.min || priceRange.max) && (
                    <button
                      onClick={clearPriceFilter}
                      className="px-3 py-1.5 rounded-lg border border-border text-text-muted hover:text-text transition text-sm"
                      aria-label="Clear price filter"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Sidebar (Drawer) */}
          {sidebarOpen && (
            <>
              <div 
                className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm lg:hidden"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              />
              <div className="fixed left-0 top-0 bottom-0 w-80 bg-card z-50 shadow-2xl overflow-y-auto">
                <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
                  <h2 className="font-semibold text-text text-lg flex items-center gap-2">
                    <Filter size={18} className="text-primary" />
                    Filters
                  </h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 rounded-lg hover:bg-bg-alt transition"
                    aria-label="Close filters"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="p-4">
                  {/* Categories */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-text">Categories</h3>
                      {activeFiltersCount > 0 && (
                        <button
                          onClick={clearAllFilters}
                          className="text-xs text-primary hover:underline"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                    <button
                      onClick={handleAllProducts}
                      className={`w-full text-left px-3 py-2 rounded-lg transition mb-1 ${
                        !selectedSubCategory
                          ? "bg-primary text-white"
                          : "hover:bg-bg-alt text-text"
                      }`}
                    >
                      All Products
                    </button>
                    {subCategories.map((sub) => (
                      <button
                        key={sub._id}
                        onClick={() => handleSubCategorySelect(sub._id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition mb-1 ${
                          selectedSubCategory === sub._id
                            ? "bg-primary text-white"
                            : "hover:bg-bg-alt text-text"
                        }`}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>

                  {/* Price Filter */}
                  <div>
                    <h3 className="text-sm font-medium text-text mb-3">Price Range (₹)</h3>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-card text-text text-sm focus:outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-card text-text text-sm focus:outline-none"
                      />
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={handlePriceFilter}
                        className="flex-1 bg-primary text-white px-3 py-1.5 rounded-lg text-sm hover:bg-primary-dark transition"
                      >
                        Apply
                      </button>
                      {(priceRange.min || priceRange.max) && (
                        <button
                          onClick={clearPriceFilter}
                          className="px-3 py-1.5 rounded-lg border border-border text-text-muted hover:text-text transition text-sm"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-text capitalize">
                    {!selectedSubCategory 
                      ? (categoryName || "Products")
                      : (subCategories.find(s => s._id === selectedSubCategory)?.name || "Products")}
                  </h1>
                  <p className="text-text-muted text-sm mt-1">
                    {products.length} {products.length === 1 ? 'product' : 'products'} found
                  </p>
                </div>
                
                {/* Sort Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowSortMenu(!showSortMenu)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-text hover:bg-bg-alt transition"
                    aria-label="Sort products"
                  >
                    <span className="text-sm">Sort: {currentSortLabel}</span>
                    {showSortMenu ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  
                  {showSortMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-card rounded-xl border border-border shadow-lg z-10 overflow-hidden">
                      {sortOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.value}
                            onClick={() => handleSortChange(option.value)}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-bg-alt transition flex items-center gap-2 ${
                              sortBy === option.value ? "text-primary bg-primary/5" : "text-text"
                            }`}
                            aria-label={`Sort by ${option.label}`}
                          >
                            {Icon && <Icon size={14} />}
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Active Filters */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedSubCategory && (
                    <span className="bg-primary/10 text-primary px-3 py-1 text-sm rounded-full flex items-center gap-1">
                      {subCategories.find(s => s._id === selectedSubCategory)?.name}
                      <button onClick={handleAllProducts} className="hover:text-error" aria-label="Remove category filter">
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  {priceRange.min && (
                    <span className="bg-primary/10 text-primary px-3 py-1 text-sm rounded-full flex items-center gap-1">
                      Min: ₹{Number(priceRange.min).toLocaleString()}
                      <button onClick={() => setPriceRange({ ...priceRange, min: "" })} className="hover:text-error" aria-label="Remove min price filter">
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  {priceRange.max && (
                    <span className="bg-primary/10 text-primary px-3 py-1 text-sm rounded-full flex items-center gap-1">
                      Max: ₹{Number(priceRange.max).toLocaleString()}
                      <button onClick={() => setPriceRange({ ...priceRange, max: "" })} className="hover:text-error" aria-label="Remove max price filter">
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-text-muted hover:text-primary underline"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Filter Button */}
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="fixed bottom-6 right-6 z-40 bg-primary text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
                aria-label="Open filters"
              >
                <Filter size={20} />
              </button>
            )}

            {/* Products Grid */}
            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" aria-label="Loading..."></div>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                  {products.map((product) => (
                    <CardProduct key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-3 mt-10">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className={`px-4 py-2 rounded-lg transition ${
                        page <= 1
                          ? "bg-bg-alt text-text-muted cursor-not-allowed"
                          : "bg-primary text-white hover:bg-primary-dark"
                      }`}
                      aria-label="Previous page"
                    >
                      Previous
                    </button>
                    <span className="text-text-muted text-sm">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className={`px-4 py-2 rounded-lg transition ${
                        page >= totalPages
                          ? "bg-bg-alt text-text-muted cursor-not-allowed"
                          : "bg-primary text-white hover:bg-primary-dark"
                      }`}
                      aria-label="Next page"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="w-20 h-20 rounded-full bg-bg-alt flex items-center justify-center mb-4">
                  <Package className="w-10 h-10 text-text-muted" aria-hidden="true" />
                </div>
                <p className="text-text-muted mb-4">
                  No products found {selectedSubCategory ? `in ${subCategories.find(s => s._id === selectedSubCategory)?.name || 'this category'}` : 'in this category'}.
                </p>
                {activeFiltersCount > 0 ? (
                  <button onClick={clearAllFilters} className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition">
                    Clear Filters
                  </button>
                ) : (
                  <Link to="/" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition">
                    Continue Shopping
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;