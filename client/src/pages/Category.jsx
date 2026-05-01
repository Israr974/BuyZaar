// import React, { useEffect, useState } from "react";
// import UploadCategoryModel from "../components/UploadCategoryModel";
// import summaryApi from "../common/summartApi";
// import Axios from "../utils/Axios";
// import ConfirmBox from "../components/ConfirmBox";
// import { useDispatch, useSelector } from "react-redux";
// import { setAllCategory } from "../redux/productSlice";
// import { 
//   Plus, Edit2, Trash2, Grid3x3, Search, 
//   Package, FolderTree, X, TrendingUp,
//   ChevronDown, ChevronUp, List
// } from "lucide-react";

// const CategoryPage = () => {
//   const [openUploadCategory, setOpenUploadCategory] = useState(false);
//   const [editCategory, setEditCategory] = useState(null);
//   const [deleteCategoryId, setDeleteCategoryId] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [viewMode, setViewMode] = useState("grid");
//   const [showFilters, setShowFilters] = useState(false);
//   const [sortBy, setSortBy] = useState("name");
//   const [sortOrder, setSortOrder] = useState("asc");
//   const [categoryProductsCount, setCategoryProductsCount] = useState({});

//   const dispatch = useDispatch();
//   const allCategory = useSelector((state) => state.product.allCategory);

//   const fetchCategories = async () => {
//     setIsLoading(true);
//     try {
//       const catRes = await Axios({ ...summaryApi().getAllCategory });
//       const categories = catRes.data?.data || [];
//       dispatch(setAllCategory(categories));
      
//       const productRes = await Axios({ 
//         ...summaryApi().getProduct,
//         params: { page: 1, limit: 1000 }
//       });
      
//       if (productRes.data?.success) {
//         const products = productRes.data.data || [];
//         const counts = {};
//         products.forEach(product => {
//           const categoryId = product.category?._id || product.category;
//           if (categoryId) {
//             counts[categoryId] = (counts[categoryId] || 0) + 1;
//           }
//         });
//         setCategoryProductsCount(counts);
//       }
//     } catch (error) {
//       console.error("Fetch error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const handleDeleteCategory = async (id) => {
//     try {
//       await Axios({ ...summaryApi().deleteCategory(id) });
//       setDeleteCategoryId(null);
//       fetchCategories();
//     } catch (error) {
//       console.error("Delete error:", error);
//     }
//   };

//   const getProductCount = (categoryId) => {
//     return categoryProductsCount[categoryId] || 0;
//   };

//   const getFilteredCategories = () => {
//     let filtered = [...allCategory];
    
//     if (searchTerm) {
//       filtered = filtered.filter(category =>
//         category.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }
    
//     const sortMultiplier = sortOrder === "asc" ? 1 : -1;
    
//     if (sortBy === "name") {
//       filtered.sort((a, b) => sortMultiplier * a.name.localeCompare(b.name));
//     } else if (sortBy === "products") {
//       filtered.sort((a, b) => sortMultiplier * (getProductCount(b._id) - getProductCount(a._id)));
//     } else if (sortBy === "newest") {
//       filtered.sort((a, b) => sortMultiplier * (new Date(b.createdAt) - new Date(a.createdAt)));
//     }
    
//     return filtered;
//   };

//   const filteredCategories = getFilteredCategories();
//   const totalProducts = Object.values(categoryProductsCount).reduce((a, b) => a + b, 0);
//   const categoriesWithProducts = allCategory.filter(c => getProductCount(c._id) > 0).length;

//   const clearFilters = () => {
//     setSearchTerm("");
//     setSortBy("name");
//     setSortOrder("asc");
//     setShowFilters(false);
//   };

//   const hasActiveFilters = searchTerm !== "" || sortBy !== "name";

//   return (
//     <div className="min-h-screen bg-bg p-3 md:p-6">
//       <div className="container-narrow">
//         {/* Header */}
//         <div className="mb-4 md:mb-6">
//           <div className="flex items-center gap-3 mb-2">
//             <div className="w-1 h-6 md:h-8 rounded-full bg-gradient-to-b from-primary to-accent"></div>
//             <h1 className="text-xl md:text-3xl font-display font-bold text-text">
//               Categories
//             </h1>
//           </div>
//           <p className="text-text-muted text-sm ml-4">
//             Manage your product categories
//           </p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
//           <div className="bg-card rounded-xl border border-border p-3 md:p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-text-muted text-xs md:text-sm">Total</p>
//                 <p className="text-xl md:text-2xl font-bold gradient-text">{allCategory.length}</p>
//               </div>
//               <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center">
//                 <FolderTree className="w-4 h-4 md:w-5 md:h-5 text-primary" />
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-card rounded-xl border border-border p-3 md:p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-text-muted text-xs md:text-sm">Products</p>
//                 <p className="text-xl md:text-2xl font-bold gradient-text">{totalProducts}</p>
//               </div>
//               <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-success/10 flex items-center justify-center">
//                 <Package className="w-4 h-4 md:w-5 md:h-5 text-success" />
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-card rounded-xl border border-border p-3 md:p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-text-muted text-xs md:text-sm">With Products</p>
//                 <p className="text-xl md:text-2xl font-bold gradient-text">{categoriesWithProducts}</p>
//               </div>
//               <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-accent/10 flex items-center justify-center">
//                 <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-accent" />
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-card rounded-xl border border-border p-3 md:p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-text-muted text-xs md:text-sm">Empty</p>
//                 <p className="text-xl md:text-2xl font-bold gradient-text">{allCategory.length - categoriesWithProducts}</p>
//               </div>
//               <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center">
//                 <Package className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Search and Filter Bar */}
//         <div className="bg-card rounded-xl border border-border p-3 md:p-4 mb-4 md:mb-6">
//           <div className="flex flex-col gap-3">
//             {/* Search and Actions Row */}
//             <div className="flex flex-wrap items-center gap-2">
//               <div className="flex-1 relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" size={16} />
//                 <input
//                   type="text"
//                   placeholder="Search categories..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
//                 />
//               </div>
              
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => setShowFilters(!showFilters)}
//                   className={`p-2 rounded-lg border transition ${
//                     hasActiveFilters ? "bg-primary/10 text-primary border-primary" : "border-border text-text-muted hover:text-text"
//                   }`}
//                   title="Sort options"
//                 >
//                   {sortOrder === "asc" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//                 </button>
                
//                 <div className="flex items-center gap-1 p-1 bg-bg-alt rounded-lg">
//                   <button
//                     onClick={() => setViewMode("grid")}
//                     className={`p-1.5 rounded-lg transition ${
//                       viewMode === "grid" ? "bg-primary text-white" : "text-text-muted hover:text-text"
//                     }`}
//                     title="Grid view"
//                   >
//                     <Grid3x3 size={16} />
//                   </button>
//                   <button
//                     onClick={() => setViewMode("list")}
//                     className={`p-1.5 rounded-lg transition ${
//                       viewMode === "list" ? "bg-primary text-white" : "text-text-muted hover:text-text"
//                     }`}
//                     title="List view"
//                   >
//                     <List size={16} />
//                   </button>
//                 </div>
                
//                 <button
//                   onClick={() => setOpenUploadCategory(true)}
//                   className="bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition"
//                   title="Add category"
//                 >
//                   <Plus size={18} />
//                 </button>
//               </div>
//             </div>
            
//             {/* Filter Panel */}
//             {showFilters && (
//               <div className="mt-2 p-3 bg-bg-alt rounded-lg border border-border">
//                 <div className="flex flex-wrap items-end gap-3">
//                   <div className="flex-1 min-w-[150px]">
//                     <label className="text-xs font-medium text-text mb-1 block">Sort By</label>
//                     <select
//                       value={sortBy}
//                       onChange={(e) => setSortBy(e.target.value)}
//                       className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-text text-sm focus:outline-none"
//                     >
//                       <option value="name">Name (A-Z)</option>
//                       <option value="products">Product Count</option>
//                       <option value="newest">Newest First</option>
//                     </select>
//                   </div>
                  
//                   <div>
//                     <label className="text-xs font-medium text-text mb-1 block">Order</label>
//                     <button
//                       onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
//                       className="px-4 py-1.5 rounded-lg border border-border bg-card hover:bg-bg-alt transition text-sm"
//                     >
//                       {sortOrder === "asc" ? "Ascending ↑" : "Descending ↓"}
//                     </button>
//                   </div>
                  
//                   {hasActiveFilters && (
//                     <button onClick={clearFilters} className="text-sm text-primary hover:underline">
//                       Clear all
//                     </button>
//                   )}
//                 </div>
//               </div>
//             )}
            
//             {/* Active Search Filter */}
//             {searchTerm && (
//               <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
//                 <span className="bg-primary/10 text-primary px-2 py-1 text-xs rounded-full flex items-center gap-1">
//                   Search: "{searchTerm}"
//                   <button onClick={() => setSearchTerm("")} className="hover:text-error">
//                     <X size={12} />
//                   </button>
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Categories List */}
//         <div className="bg-card rounded-xl border border-border p-3 md:p-5">
//           {isLoading ? (
//             <div className="flex flex-col items-center justify-center py-10 md:py-20">
//               <div className="w-8 h-8 md:w-12 md:h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
//               <p className="text-text-muted text-sm mt-4">Loading categories...</p>
//             </div>
//           ) : filteredCategories.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-10 md:py-16 text-center">
//               <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
//                 <FolderTree className="w-8 h-8 md:w-12 md:h-12 text-primary/40" />
//               </div>
//               <h3 className="text-lg md:text-xl font-semibold text-text mb-2">No categories found</h3>
//               <p className="text-text-muted text-sm mb-4">
//                 {searchTerm ? "Try a different search term" : "Get started by adding your first category"}
//               </p>
//               <button
//                 onClick={() => setOpenUploadCategory(true)}
//                 className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary-dark transition text-sm"
//               >
//                 <Plus size={16} className="inline mr-1" />
//                 Add Category
//               </button>
//             </div>
//           ) : viewMode === "grid" ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
//               {filteredCategories.map((category) => (
//                 <div
//                   key={category._id}
//                   className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 relative"
//                 >
//                   <div className="relative h-32 md:h-40 overflow-hidden bg-bg-alt">
//                     <img
//                       src={category.image || "/placeholder-category.png"}
//                       alt={category.name}
//                       className="w-full h-full object-cover transition-transform group-hover:scale-110"
//                       onError={(e) => { e.target.src = "/placeholder-category.png"; }}
//                     />
//                     <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
//                       <span className="text-white text-xs font-medium">
//                         {getProductCount(category._id)} products
//                       </span>
//                     </div>
//                   </div>
//                   <div className="p-3 md:p-4">
//                     <h3 className="font-semibold text-text text-sm md:text-base truncate group-hover:text-primary transition">
//                       {category.name}
//                     </h3>
//                     <div className="flex items-center justify-between mt-2 md:mt-3">
//                       <div className="flex gap-1">
//                         <button
//                           onClick={() => {
//                             setEditCategory(category);
//                             setOpenUploadCategory(true);
//                           }}
//                           className="p-1.5 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition"
//                           title="Edit"
//                         >
//                           <Edit2 size={14} />
//                         </button>
//                         <button
//                           onClick={() => setDeleteCategoryId(category._id)}
//                           className="p-1.5 rounded-lg hover:bg-error/10 text-text-muted hover:text-error transition"
//                           title="Delete"
//                         >
//                           <Trash2 size={14} />
//                         </button>
//                       </div>
//                     </div>
//                   </div>

//                   {deleteCategoryId === category._id && (
//                     <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10 p-2">
//                       <ConfirmBox
//                         close={() => setDeleteCategoryId(null)}
//                         cancel={() => setDeleteCategoryId(null)}
//                         confirm={() => handleDeleteCategory(category._id)}
//                         title="Delete Category"
//                         message={`Delete "${category.name}"?`}
//                         confirmText="Delete"
//                         cancelText="Cancel"
//                       />
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="space-y-2">
//               {filteredCategories.map((category) => (
//                 <div
//                   key={category._id}
//                   className="flex items-center justify-between p-3 bg-card rounded-xl border border-border hover:shadow-md transition"
//                 >
//                   <div className="flex items-center gap-3 min-w-0 flex-1">
//                     <div className="w-10 h-10 rounded-lg overflow-hidden bg-bg-alt flex-shrink-0">
//                       <img
//                         src={category.image || "/placeholder-category.png"}
//                         alt={category.name}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                     <div className="min-w-0 flex-1">
//                       <h3 className="font-semibold text-text truncate">{category.name}</h3>
//                       <p className="text-xs text-text-muted">{getProductCount(category._id)} products</p>
//                     </div>
//                   </div>
                  
//                   <div className="flex gap-1 flex-shrink-0">
//                     <button
//                       onClick={() => {
//                         setEditCategory(category);
//                         setOpenUploadCategory(true);
//                       }}
//                       className="p-1.5 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition"
//                       title="Edit"
//                     >
//                       <Edit2 size={14} />
//                     </button>
//                     <button
//                       onClick={() => setDeleteCategoryId(category._id)}
//                       className="p-1.5 rounded-lg hover:bg-error/10 text-text-muted hover:text-error transition"
//                       title="Delete"
//                     >
//                       <Trash2 size={14} />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Add/Edit Modal */}
//       {openUploadCategory && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-4">
//           <UploadCategoryModel
//             onClose={() => {
//               setOpenUploadCategory(false);
//               setEditCategory(null);
//             }}
//             editData={editCategory}
//             onSuccess={() => {
//               fetchCategories();
//               setOpenUploadCategory(false);
//               setEditCategory(null);
//             }}
//           />
//         </div>
//       )}

//       {/* Mobile FAB */}
//       <button
//         onClick={() => setOpenUploadCategory(true)}
//         className="lg:hidden fixed bottom-6 right-6 bg-primary text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all z-40"
//       >
//         <Plus size={20} />
//       </button>
//     </div>
//   );
// };

// export default CategoryPage;

import React, { useEffect, useState } from "react";
import UploadCategoryModel from "../components/UploadCategoryModel";
import summaryApi from "../common/summartApi";
import Axios from "../utils/Axios";
import ConfirmBox from "../components/ConfirmBox";
import { useDispatch, useSelector } from "react-redux";
import { setAllCategory } from "../redux/productSlice";
import { 
  Plus, Edit2, Trash2, Grid3x3, Search, 
  Package, FolderTree, X, TrendingUp,
  ChevronDown, ChevronUp, List
} from "lucide-react";

const CategoryPage = () => {
  const [openUploadCategory, setOpenUploadCategory] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [categoryProductsCount, setCategoryProductsCount] = useState({});

  const dispatch = useDispatch();
  const allCategory = useSelector((state) => state.product.allCategory);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const catRes = await Axios({ ...summaryApi().getAllCategory });
      const categories = catRes.data?.data || [];
      dispatch(setAllCategory(categories));
      
      const productRes = await Axios({ 
        ...summaryApi().getProduct,
        params: { page: 1, limit: 1000 }
      });
      
      if (productRes.data?.success) {
        const products = productRes.data.data || [];
        const counts = {};
        products.forEach(product => {
          const categoryId = product.category?._id || product.category;
          if (categoryId) {
            counts[categoryId] = (counts[categoryId] || 0) + 1;
          }
        });
        setCategoryProductsCount(counts);
      }
    } catch {
      // Silent fail
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeleteCategory = async (id) => {
    try {
      await Axios({ ...summaryApi().deleteCategory(id) });
      setDeleteCategoryId(null);
      fetchCategories();
    } catch {
      // Silent fail
    }
  };

  const getProductCount = (categoryId) => {
    return categoryProductsCount[categoryId] || 0;
  };

  const getFilteredCategories = () => {
    let filtered = [...allCategory];
    
    if (searchTerm) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    const sortMultiplier = sortOrder === "asc" ? 1 : -1;
    
    if (sortBy === "name") {
      filtered.sort((a, b) => sortMultiplier * a.name.localeCompare(b.name));
    } else if (sortBy === "products") {
      filtered.sort((a, b) => sortMultiplier * (getProductCount(b._id) - getProductCount(a._id)));
    } else if (sortBy === "newest") {
      filtered.sort((a, b) => sortMultiplier * (new Date(b.createdAt) - new Date(a.createdAt)));
    }
    
    return filtered;
  };

  const filteredCategories = getFilteredCategories();
  const totalProducts = Object.values(categoryProductsCount).reduce((a, b) => a + b, 0);
  const categoriesWithProducts = allCategory.filter(c => getProductCount(c._id) > 0).length;

  const clearFilters = () => {
    setSearchTerm("");
    setSortBy("name");
    setSortOrder("asc");
    setShowFilters(false);
  };

  const hasActiveFilters = searchTerm !== "" || sortBy !== "name";

  return (
    <div className="min-h-screen bg-bg p-3 md:p-6">
      <div className="container-narrow">
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-6 md:h-8 rounded-full bg-gradient-to-b from-primary to-accent"></div>
            <h1 className="text-xl md:text-3xl font-display font-bold text-text">
              Categories
            </h1>
          </div>
          <p className="text-text-muted text-sm ml-4">
            Manage your product categories
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="bg-card rounded-xl border border-border p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-xs md:text-sm">Total</p>
                <p className="text-xl md:text-2xl font-bold gradient-text">{allCategory.length}</p>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FolderTree className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-xs md:text-sm">Products</p>
                <p className="text-xl md:text-2xl font-bold gradient-text">{totalProducts}</p>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-success/10 flex items-center justify-center">
                <Package className="w-4 h-4 md:w-5 md:h-5 text-success" />
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-xs md:text-sm">With Products</p>
                <p className="text-xl md:text-2xl font-bold gradient-text">{categoriesWithProducts}</p>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-accent" />
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-xs md:text-sm">Empty</p>
                <p className="text-xl md:text-2xl font-bold gradient-text">{allCategory.length - categoriesWithProducts}</p>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Package className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-card rounded-xl border border-border p-3 md:p-4 mb-4 md:mb-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" size={16} />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 rounded-lg border transition ${
                    hasActiveFilters ? "bg-primary/10 text-primary border-primary" : "border-border text-text-muted hover:text-text"
                  }`}
                  title="Sort options"
                >
                  {sortOrder === "asc" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                
                <div className="flex items-center gap-1 p-1 bg-bg-alt rounded-lg">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg transition ${
                      viewMode === "grid" ? "bg-primary text-white" : "text-text-muted hover:text-text"
                    }`}
                    title="Grid view"
                  >
                    <Grid3x3 size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-lg transition ${
                      viewMode === "list" ? "bg-primary text-white" : "text-text-muted hover:text-text"
                    }`}
                    title="List view"
                  >
                    <List size={16} />
                  </button>
                </div>
                
                <button
                  onClick={() => setOpenUploadCategory(true)}
                  className="bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition"
                  title="Add category"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
            
            {showFilters && (
              <div className="mt-2 p-3 bg-bg-alt rounded-lg border border-border">
                <div className="flex flex-wrap items-end gap-3">
                  <div className="flex-1 min-w-[150px]">
                    <label className="text-xs font-medium text-text mb-1 block">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-text text-sm focus:outline-none"
                    >
                      <option value="name">Name (A-Z)</option>
                      <option value="products">Product Count</option>
                      <option value="newest">Newest First</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-text mb-1 block">Order</label>
                    <button
                      onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                      className="px-4 py-1.5 rounded-lg border border-border bg-card hover:bg-bg-alt transition text-sm"
                    >
                      {sortOrder === "asc" ? "Ascending ↑" : "Descending ↓"}
                    </button>
                  </div>
                  
                  {hasActiveFilters && (
                    <button onClick={clearFilters} className="text-sm text-primary hover:underline">
                      Clear all
                    </button>
                  )}
                </div>
              </div>
            )}
            
            {searchTerm && (
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
                <span className="bg-primary/10 text-primary px-2 py-1 text-xs rounded-full flex items-center gap-1">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm("")} className="hover:text-error">
                    <X size={12} />
                  </button>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Categories List */}
        <div className="bg-card rounded-xl border border-border p-3 md:p-5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 md:py-20">
              <div className="w-8 h-8 md:w-12 md:h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-text-muted text-sm mt-4">Loading categories...</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 md:py-16 text-center">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
                <FolderTree className="w-8 h-8 md:w-12 md:h-12 text-primary/40" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-text mb-2">No categories found</h3>
              <p className="text-text-muted text-sm mb-4">
                {searchTerm ? "Try a different search term" : "Get started by adding your first category"}
              </p>
              <button
                onClick={() => setOpenUploadCategory(true)}
                className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary-dark transition text-sm"
              >
                <Plus size={16} className="inline mr-1" />
                Add Category
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
              {filteredCategories.map((category) => (
                <div
                  key={category._id}
                  className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 relative"
                >
                  <div className="relative h-32 md:h-40 overflow-hidden bg-bg-alt">
                    <img
                      src={category.image || "/placeholder-category.png"}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      onError={(e) => { e.target.src = "/placeholder-category.png"; }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <span className="text-white text-xs font-medium">
                        {getProductCount(category._id)} products
                      </span>
                    </div>
                  </div>
                  <div className="p-3 md:p-4">
                    <h3 className="font-semibold text-text text-sm md:text-base truncate group-hover:text-primary transition">
                      {category.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2 md:mt-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setEditCategory(category);
                            setOpenUploadCategory(true);
                          }}
                          className="p-1.5 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteCategoryId(category._id)}
                          className="p-1.5 rounded-lg hover:bg-error/10 text-text-muted hover:text-error transition"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {deleteCategoryId === category._id && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10 p-2">
                      <ConfirmBox
                        close={() => setDeleteCategoryId(null)}
                        cancel={() => setDeleteCategoryId(null)}
                        confirm={() => handleDeleteCategory(category._id)}
                        title="Delete Category"
                        message={`Delete "${category.name}"?`}
                        confirmText="Delete"
                        cancelText="Cancel"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredCategories.map((category) => (
                <div
                  key={category._id}
                  className="flex items-center justify-between p-3 bg-card rounded-xl border border-border hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-bg-alt flex-shrink-0">
                      <img
                        src={category.image || "/placeholder-category.png"}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-text truncate">{category.name}</h3>
                      <p className="text-xs text-text-muted">{getProductCount(category._id)} products</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => {
                        setEditCategory(category);
                        setOpenUploadCategory(true);
                      }}
                      className="p-1.5 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteCategoryId(category._id)}
                      className="p-1.5 rounded-lg hover:bg-error/10 text-text-muted hover:text-error transition"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {openUploadCategory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-4">
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
      )}

      {/* Mobile FAB */}
      <button
        onClick={() => setOpenUploadCategory(true)}
        className="lg:hidden fixed bottom-6 right-6 bg-primary text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all z-40"
      >
        <Plus size={20} />
      </button>
    </div>
  );
};

export default CategoryPage;