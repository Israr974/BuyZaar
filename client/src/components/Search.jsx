// import React from 'react'
// import { Link, useLocation, useNavigate } from "react-router-dom"
// import { useEffect, useState } from 'react'
// import useMobile from '../hooks/useMobile';
// import { FaArrowLeft } from "react-icons/fa6";
// import { 
//   Search as SearchIcon, 
//   Sparkles, 
//   TrendingUp, 
//   Clock, 
//   X,
//   Smartphone,
//   Shirt,
//   Home,
//   Sparkle,
//   Bike,
//   BookOpen,
//   Tv,
//   Watch,
//   Headphones,
//   Gamepad2,
//   Sofa,
//   Dumbbell,
//   Coffee,
//   Heart,
//   Star,
//   Zap
// } from "lucide-react";

// const Search = () => {
//     const navigate = useNavigate()
//     const location = useLocation()
//     const [isSearchPage, setIsSearchPage] = useState(false)
//     const [searchValue, setSearchValue] = useState("")
//     const [isFocused, setIsFocused] = useState(false)
//     const query = new URLSearchParams(location.search).get('q') || ""

//     useEffect(() => {
//         const isSearch = location.pathname === "/search"
//         setIsSearchPage(isSearch)
//         setSearchValue(query)
//     }, [location, query])

//     const returnToSearchPage = () => {
//         navigate("/search")
//     }

//     const [isMobile] = useMobile();

//     const handleChange = (e) => {
//         const value = e.target.value
//         setSearchValue(value)
//         if (value.trim()) {
//             const url = `/search?q=${encodeURIComponent(value)}`
//             navigate(url, { replace: true })
//         } else {
//             navigate("/search", { replace: true })
//         }
//     }

//     const clearSearch = () => {
//         setSearchValue("")
//         navigate("/search", { replace: true })
//     }

//     const handleSubmit = (e) => {
//         e.preventDefault()
//         if (searchValue.trim()) {
//             const url = `/search?q=${encodeURIComponent(searchValue)}`
//             navigate(url)
//         }
//     }

//     const popularSearches = [
//         "Smartphones", "Laptops", "Headphones", "Smart Watches",
//         "Gaming", "Home Decor", "Fitness", "Kitchen Appliances"
//     ]

//     const recentSearches = [
//         "iPhone 15", "Gaming Laptop", "Wireless Earbuds", "Smart TV"
//     ]

//     const handlePopularSearch = (term) => {
//         setSearchValue(term)
//         const url = `/search?q=${encodeURIComponent(term)}`
//         navigate(url)
//     }

//     const clearRecentSearch = (term) => {
//         console.log("Clear recent search:", term)
//     }

//     const categories = [
//         { name: "Electronics", icon: Smartphone, color: "from-blue-500 to-cyan-400" },
//         { name: "Fashion", icon: Shirt, color: "from-pink-500 to-rose-400" },
//         { name: "Home & Kitchen", icon: Home, color: "from-green-500 to-emerald-400" },
//         { name: "Beauty", icon: Sparkle, color: "from-purple-500 to-violet-400" },
//         { name: "Sports", icon: Bike, color: "from-orange-500 to-amber-400" },
//         { name: "Books", icon: BookOpen, color: "from-indigo-500 to-blue-400" },
//     ]

//     const getCategoryIcon = (categoryName) => {
//         const icons = {
//             "Electronics": Tv,
//             "Fashion": Shirt,
//             "Home & Kitchen": Sofa,
//             "Beauty": Heart,
//             "Sports": Dumbbell,
//             "Books": BookOpen,
//             "Smartphones": Smartphone,
//             "Laptops": Tv,
//             "Headphones": Headphones,
//             "Smart Watches": Watch,
//             "Gaming": Gamepad2,
//             "Home Decor": Sofa,
//             "Fitness": Dumbbell,
//             "Kitchen Appliances": Coffee
//         }
//         const IconComponent = icons[categoryName] || Star
//         return <IconComponent size={20} />
//     }

//     return (
//         <>
//             {/* Desktop Search Bar */}
//             {!isMobile && (
//                 <form
//                     onSubmit={handleSubmit}
//                     className="relative w-full lg:max-w-2xl min-w-[280px] lg:min-w-[400px] xl:min-w-[500px]"
//                 >
//                     <div
//                         className={`w-full h-12 lg:h-14 rounded-xl bg-card border transition-all duration-300 ${
//                             isFocused 
//                                 ? 'border-primary shadow-lg shadow-primary/10' 
//                                 : 'border-border shadow-sm hover:shadow-md hover:border-primary/50'
//                         } overflow-hidden flex items-center relative group`}
//                     >
//                         {/* Search Icon */}
//                         <div className="flex-shrink-0 h-full px-2 sm:px-3 lg:px-4 flex items-center justify-center">
//                             <button
//                                 type="button"
//                                 onClick={returnToSearchPage}
//                                 className="p-1.5 sm:p-2 rounded-lg hover:bg-bg-alt transition-colors text-text-muted hover:text-text"
//                             >
//                                 <SearchIcon
//                                     size={18}
//                                     className={`sm:w-5 sm:h-5 transition-colors ${
//                                         isFocused ? 'text-primary' : 'text-text-muted'
//                                     }`}
//                                 />
//                             </button>
//                         </div>

//                         {/* Search Input Area */}
//                         <div className="flex-1 min-w-0 h-full">
//                             <div className="h-full w-full flex items-center">
//                                 <input
//                                     type="text"
//                                     name="search"
//                                     autoFocus={false}
//                                     placeholder="Search for products, brands, and categories..."
//                                     value={searchValue}
//                                     onChange={handleChange}
//                                     onFocus={() => setIsFocused(true)}
//                                     onBlur={() => setIsFocused(false)}
//                                     className="w-full h-full bg-transparent outline-none text-text placeholder:text-text-muted/60 text-sm sm:text-base lg:text-lg pl-2 pr-2"
//                                 />
//                             </div>
//                         </div>

//                         {/* Clear Button */}
//                         {searchValue && (
//                             <button
//                                 type="button"
//                                 onClick={clearSearch}
//                                 className="flex-shrink-0 p-1.5 sm:p-2 rounded-lg hover:bg-bg-alt transition-colors text-text-muted hover:text-text mr-1 sm:mr-2"
//                             >
//                                 <X size={16} className="sm:w-4.5 sm:h-4.5" />
//                             </button>
//                         )}

//                         {/* Search Button */}
//                         {!isMobile && (
//                             <button
//                                 type="submit"
//                                 className="flex-shrink-0 h-full px-4 lg:px-6 bg-gradient-primary text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2 text-sm lg:text-base"
//                             >
//                                 <SearchIcon size={16} className="lg:w-4.5 lg:h-4.5" />
//                                 <span className="hidden sm:inline">Search</span>
//                             </button>
//                         )}
//                     </div>

//                     {/* Popular Searches Dropdown */}
//                     {isFocused && isSearchPage && searchValue.length === 0 && (
//                         <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-xl border border-border z-50 overflow-hidden max-h-[80vh] overflow-y-auto">
//                             <div className="p-3 sm:p-4">
//                                 <div className="flex items-center gap-2 mb-3">
//                                     <TrendingUp size={14} className="text-accent" />
//                                     <h3 className="font-semibold text-text text-sm sm:text-base">Popular Searches</h3>
//                                 </div>
//                                 <div className="flex flex-wrap gap-1.5 sm:gap-2">
//                                     {popularSearches.map((term, index) => (
//                                         <button
//                                             key={index}
//                                             type="button"
//                                             onClick={() => handlePopularSearch(term)}
//                                             className="px-2 sm:px-3 py-1 sm:py-1.5 bg-bg-alt hover:bg-primary hover:text-white text-xs sm:text-sm text-text rounded-lg transition-all duration-200 hover:scale-105 flex items-center gap-1"
//                                         >
//                                             {getCategoryIcon(term)}
//                                             <span>{term}</span>
//                                         </button>
//                                     ))}
//                                 </div>
//                             </div>

//                             {/* Recent Searches */}
//                             <div className="border-t border-border p-3 sm:p-4">
//                                 <div className="flex items-center gap-2 mb-3">
//                                     <Clock size={14} className="text-primary" />
//                                     <h3 className="font-semibold text-text text-sm sm:text-base">Recent Searches</h3>
//                                 </div>
//                                 <div className="space-y-1 sm:space-y-2">
//                                     {recentSearches.map((term, index) => (
//                                         <div key={index} className="flex items-center justify-between group">
//                                             <button
//                                                 type="button"
//                                                 onClick={() => handlePopularSearch(term)}
//                                                 className="flex-1 text-left p-1.5 sm:p-2 rounded-lg hover:bg-bg-alt transition-colors text-text text-sm sm:text-base flex items-center gap-2"
//                                             >
//                                                 <Clock size={12} className="text-text-muted" />
//                                                 {term}
//                                             </button>
//                                             <button
//                                                 type="button"
//                                                 onClick={() => clearRecentSearch(term)}
//                                                 className="p-1.5 sm:p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-error"
//                                             >
//                                                 <X size={12} />
//                                             </button>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* Search Suggestions Dropdown */}
//                     {isFocused && isSearchPage && searchValue.length > 0 && (
//                         <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-xl border border-border z-50 overflow-hidden">
//                             <div className="p-3 sm:p-4">
//                                 <div className="flex items-center gap-2 mb-3">
//                                     <SearchIcon size={14} className="text-primary" />
//                                     <h3 className="font-semibold text-text text-sm sm:text-base truncate">
//                                         Suggestions for "{searchValue}"
//                                     </h3>
//                                 </div>
//                                 <div className="space-y-1 sm:space-y-2">
//                                     {[
//                                         `${searchValue} smartphones`,
//                                         `${searchValue} deals`,
//                                         `${searchValue} accessories`,
//                                         `Best ${searchValue}`,
//                                         `${searchValue} under ₹50000`
//                                     ].map((suggestion, index) => (
//                                         <button
//                                             key={index}
//                                             type="button"
//                                             onClick={() => handlePopularSearch(suggestion)}
//                                             className="w-full text-left p-2 sm:p-2.5 rounded-lg hover:bg-bg-alt transition-colors text-text"
//                                         >
//                                             <div className="flex items-center gap-2 sm:gap-3">
//                                                 <SearchIcon size={14} className="text-text-muted flex-shrink-0" />
//                                                 <span className="text-sm sm:text-base truncate">{suggestion}</span>
//                                             </div>
//                                         </button>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </form>
//             )}

//             {/* Mobile Full-Screen Search */}
//             {isSearchPage && isMobile && (
//                 <div className="fixed inset-0 bg-card z-50 flex flex-col animate-slide-in-up">
//                     {/* Mobile Search Header */}
//                     <div className="sticky top-0 bg-card border-b border-border p-3 sm:p-4">
//                         <div className="flex items-center gap-3 sm:gap-4">
//                             <button
//                                 onClick={() => navigate(-1)}
//                                 className="flex-shrink-0 p-2 rounded-lg hover:bg-bg-alt transition-colors"
//                             >
//                                 <FaArrowLeft size={18} className="text-text" />
//                             </button>
//                             <form onSubmit={handleSubmit} className="flex-1 min-w-0">
//                                 <div className="relative">
//                                     <SearchIcon 
//                                         size={18} 
//                                         className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted pointer-events-none"
//                                     />
//                                     <input
//                                         type="text"
//                                         name="mobile-search"
//                                         autoFocus
//                                         placeholder="Search for anything..."
//                                         value={searchValue}
//                                         onChange={handleChange}
//                                         className="w-full h-11 pl-10 pr-10 bg-bg-alt rounded-xl outline-none text-text placeholder:text-text-muted text-sm"
//                                     />
//                                     {searchValue && (
//                                         <button
//                                             type="button"
//                                             onClick={clearSearch}
//                                             className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-bg-alt transition-colors"
//                                         >
//                                             <X size={16} className="text-text-muted" />
//                                         </button>
//                                     )}
//                                 </div>
//                             </form>
//                         </div>
//                     </div>

//                     {/* Mobile Search Content */}
//                     <div className="flex-1 overflow-y-auto p-3 sm:p-4 pb-20">
//                         {searchValue.length === 0 ? (
//                             <>
//                                 {/* Popular Categories */}
//                                 <div className="mb-6">
//                                     <h3 className="font-semibold text-text mb-3 flex items-center gap-2 text-sm">
//                                         <Sparkles size={14} className="text-accent" />
//                                         Popular Categories
//                                     </h3>
//                                     <div className="grid grid-cols-2 gap-2 sm:gap-3">
//                                         {categories.map((category, index) => {
//                                             const Icon = category.icon
//                                             return (
//                                                 <button
//                                                     key={index}
//                                                     onClick={() => handlePopularSearch(category.name)}
//                                                     className={`bg-gradient-to-br ${category.color} text-white p-3 sm:p-4 rounded-xl text-center font-medium hover:scale-105 transition-transform text-sm flex flex-col items-center gap-2`}
//                                                 >
//                                                     <Icon size={28} className="text-white" />
//                                                     <span className="text-xs sm:text-sm">{category.name}</span>
//                                                 </button>
//                                             )
//                                         })}
//                                     </div>
//                                 </div>

//                                 {/* Trending Searches */}
//                                 <div className="mb-6">
//                                     <h3 className="font-semibold text-text mb-3 flex items-center gap-2 text-sm">
//                                         <TrendingUp size={14} className="text-accent" />
//                                         Trending Now
//                                     </h3>
//                                     <div className="flex flex-wrap gap-1.5 sm:gap-2">
//                                         {popularSearches.slice(0, 6).map((term, index) => (
//                                             <button
//                                                 key={index}
//                                                 onClick={() => handlePopularSearch(term)}
//                                                 className="px-2.5 sm:px-3 py-1.5 bg-bg-alt hover:bg-primary hover:text-white text-xs sm:text-sm text-text rounded-full transition-all duration-200 flex items-center gap-1"
//                                             >
//                                                 <Zap size={12} />
//                                                 {term}
//                                             </button>
//                                         ))}
//                                     </div>
//                                 </div>

//                                 {/* Recent Searches */}
//                                 <div>
//                                     <h3 className="font-semibold text-text mb-3 flex items-center gap-2 text-sm">
//                                         <Clock size={14} className="text-primary" />
//                                         Recent Searches
//                                     </h3>
//                                     <div className="space-y-1 sm:space-y-2">
//                                         {recentSearches.map((term, index) => (
//                                             <div key={index} className="flex items-center justify-between group">
//                                                 <button
//                                                     onClick={() => handlePopularSearch(term)}
//                                                     className="flex-1 text-left p-2 sm:p-3 rounded-lg hover:bg-bg-alt transition-colors flex items-center gap-2 sm:gap-3"
//                                                 >
//                                                     <Clock size={12} className="text-text-muted flex-shrink-0" />
//                                                     <span className="text-text text-sm sm:text-base truncate">{term}</span>
//                                                 </button>
//                                                 <button
//                                                     onClick={() => clearRecentSearch(term)}
//                                                     className="p-1.5 sm:p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-error"
//                                                 >
//                                                     <X size={12} />
//                                                 </button>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </>
//                         ) : (
//                             <div className="space-y-2">
//                                 <h3 className="font-semibold text-text mb-3 flex items-center gap-2 text-sm">
//                                     <SearchIcon size={14} className="text-primary" />
//                                     Searching for "{searchValue}"
//                                 </h3>
//                                 <div className="text-center py-12">
//                                     <div className="spinner w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4"></div>
//                                     <p className="text-text-muted text-sm">Searching for products...</p>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}

//             <style jsx>{`
//                 @keyframes slideInUp {
//                     from { transform: translateY(100%); }
//                     to { transform: translateY(0); }
//                 }
//                 .animate-slide-in-up {
//                     animation: slideInUp 0.3s ease-out;
//                 }
//                 .truncate {
//                     overflow: hidden;
//                     text-overflow: ellipsis;
//                     white-space: nowrap;
//                 }
//                 .spinner {
//                     width: 40px;
//                     height: 40px;
//                     border: 2px solid var(--border, #e5e7eb);
//                     border-top-color: var(--primary, #3b82f6);
//                     border-radius: 50%;
//                     animation: spin 1s linear infinite;
//                 }
//                 @keyframes spin {
//                     from { transform: rotate(0deg); }
//                     to { transform: rotate(360deg); }
//                 }
//             `}</style>
//         </>
//     )
// }

// export default Search

import React from 'react'
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from 'react'
import useMobile from '../hooks/useMobile';
import { FaArrowLeft } from "react-icons/fa6";
import { 
  Search as SearchIcon, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  X,
  Smartphone,
  Shirt,
  Home,
  Sparkle,
  Bike,
  BookOpen,
  Tv,
  Watch,
  Headphones,
  Gamepad2,
  Sofa,
  Dumbbell,
  Coffee,
  Heart,
  Star,
  Zap
} from "lucide-react";

const Search = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [isSearchPage, setIsSearchPage] = useState(false)
    const [searchValue, setSearchValue] = useState("")
    const [isFocused, setIsFocused] = useState(false)
    const query = new URLSearchParams(location.search).get('q') || ""

    useEffect(() => {
        const isSearch = location.pathname === "/search"
        setIsSearchPage(isSearch)
        setSearchValue(query)
    }, [location, query])

    const returnToSearchPage = () => {
        navigate("/search")
    }

    const [isMobile] = useMobile();

    const handleChange = (e) => {
        const value = e.target.value
        setSearchValue(value)
        if (value.trim()) {
            const url = `/search?q=${encodeURIComponent(value)}`
            navigate(url, { replace: true })
        } else {
            navigate("/search", { replace: true })
        }
    }

    const clearSearch = () => {
        setSearchValue("")
        navigate("/search", { replace: true })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (searchValue.trim()) {
            const url = `/search?q=${encodeURIComponent(searchValue)}`
            navigate(url)
        }
    }

    const popularSearches = [
        "Smartphones", "Laptops", "Headphones", "Smart Watches",
        "Gaming", "Home Decor", "Fitness", "Kitchen Appliances"
    ]

    const recentSearches = [
        "iPhone 15", "Gaming Laptop", "Wireless Earbuds", "Smart TV"
    ]

    const handlePopularSearch = (term) => {
        setSearchValue(term)
        const url = `/search?q=${encodeURIComponent(term)}`
        navigate(url)
    }

    const categories = [
        { name: "Electronics", icon: Smartphone, color: "from-blue-500 to-cyan-400" },
        { name: "Fashion", icon: Shirt, color: "from-pink-500 to-rose-400" },
        { name: "Home & Kitchen", icon: Home, color: "from-green-500 to-emerald-400" },
        { name: "Beauty", icon: Sparkle, color: "from-purple-500 to-violet-400" },
        { name: "Sports", icon: Bike, color: "from-orange-500 to-amber-400" },
        { name: "Books", icon: BookOpen, color: "from-indigo-500 to-blue-400" },
    ]

    const getCategoryIcon = (categoryName) => {
        const icons = {
            "Electronics": Tv,
            "Fashion": Shirt,
            "Home & Kitchen": Sofa,
            "Beauty": Heart,
            "Sports": Dumbbell,
            "Books": BookOpen,
            "Smartphones": Smartphone,
            "Laptops": Tv,
            "Headphones": Headphones,
            "Smart Watches": Watch,
            "Gaming": Gamepad2,
            "Home Decor": Sofa,
            "Fitness": Dumbbell,
            "Kitchen Appliances": Coffee
        }
        const IconComponent = icons[categoryName] || Star
        return <IconComponent size={20} />
    }

    return (
        <>
            {/* Desktop Search Bar */}
            {!isMobile && (
                <form
                    onSubmit={handleSubmit}
                    className="relative w-full lg:max-w-2xl min-w-[280px] lg:min-w-[400px] xl:min-w-[500px]"
                >
                    <div
                        className={`w-full h-12 lg:h-14 rounded-xl bg-card border transition-all duration-300 ${
                            isFocused 
                                ? 'border-primary shadow-lg shadow-primary/10' 
                                : 'border-border shadow-sm hover:shadow-md hover:border-primary/50'
                        } overflow-hidden flex items-center relative group`}
                    >
                        {/* Search Icon */}
                        <div className="flex-shrink-0 h-full px-2 sm:px-3 lg:px-4 flex items-center justify-center">
                            <button
                                type="button"
                                onClick={returnToSearchPage}
                                className="p-1.5 sm:p-2 rounded-lg hover:bg-bg-alt transition-colors text-text-muted hover:text-text"
                            >
                                <SearchIcon
                                    size={18}
                                    className={`sm:w-5 sm:h-5 transition-colors ${
                                        isFocused ? 'text-primary' : 'text-text-muted'
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Search Input Area */}
                        <div className="flex-1 min-w-0 h-full">
                            <div className="h-full w-full flex items-center">
                                <input
                                    type="text"
                                    name="search"
                                    autoFocus={false}
                                    placeholder="Search for products, brands, and categories..."
                                    value={searchValue}
                                    onChange={handleChange}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    className="w-full h-full bg-transparent outline-none text-text placeholder:text-text-muted/60 text-sm sm:text-base lg:text-lg pl-2 pr-2"
                                />
                            </div>
                        </div>

                        {/* Clear Button */}
                        {searchValue && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="flex-shrink-0 p-1.5 sm:p-2 rounded-lg hover:bg-bg-alt transition-colors text-text-muted hover:text-text mr-1 sm:mr-2"
                            >
                                <X size={16} className="sm:w-4.5 sm:h-4.5" />
                            </button>
                        )}

                        {/* Search Button */}
                        {!isMobile && (
                            <button
                                type="submit"
                                className="flex-shrink-0 h-full px-4 lg:px-6 bg-gradient-primary text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2 text-sm lg:text-base"
                            >
                                <SearchIcon size={16} className="lg:w-4.5 lg:h-4.5" />
                                <span className="hidden sm:inline">Search</span>
                            </button>
                        )}
                    </div>

                    {/* Popular Searches Dropdown */}
                    {isFocused && isSearchPage && searchValue.length === 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-xl border border-border z-50 overflow-hidden max-h-[80vh] overflow-y-auto">
                            <div className="p-3 sm:p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <TrendingUp size={14} className="text-accent" />
                                    <h3 className="font-semibold text-text text-sm sm:text-base">Popular Searches</h3>
                                </div>
                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                    {popularSearches.map((term, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => handlePopularSearch(term)}
                                            className="px-2 sm:px-3 py-1 sm:py-1.5 bg-bg-alt hover:bg-primary hover:text-white text-xs sm:text-sm text-text rounded-lg transition-all duration-200 hover:scale-105 flex items-center gap-1"
                                        >
                                            {getCategoryIcon(term)}
                                            <span>{term}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Searches */}
                            <div className="border-t border-border p-3 sm:p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Clock size={14} className="text-primary" />
                                    <h3 className="font-semibold text-text text-sm sm:text-base">Recent Searches</h3>
                                </div>
                                <div className="space-y-1 sm:space-y-2">
                                    {recentSearches.map((term, index) => (
                                        <div key={index} className="flex items-center justify-between group">
                                            <button
                                                type="button"
                                                onClick={() => handlePopularSearch(term)}
                                                className="flex-1 text-left p-1.5 sm:p-2 rounded-lg hover:bg-bg-alt transition-colors text-text text-sm sm:text-base flex items-center gap-2"
                                            >
                                                <Clock size={12} className="text-text-muted" />
                                                {term}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => clearRecentSearch(term)}
                                                className="p-1.5 sm:p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-error"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Search Suggestions Dropdown */}
                    {isFocused && isSearchPage && searchValue.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-xl border border-border z-50 overflow-hidden">
                            <div className="p-3 sm:p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <SearchIcon size={14} className="text-primary" />
                                    <h3 className="font-semibold text-text text-sm sm:text-base truncate">
                                        Suggestions for "{searchValue}"
                                    </h3>
                                </div>
                                <div className="space-y-1 sm:space-y-2">
                                    {[
                                        `${searchValue} smartphones`,
                                        `${searchValue} deals`,
                                        `${searchValue} accessories`,
                                        `Best ${searchValue}`,
                                        `${searchValue} under ₹50000`
                                    ].map((suggestion, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => handlePopularSearch(suggestion)}
                                            className="w-full text-left p-2 sm:p-2.5 rounded-lg hover:bg-bg-alt transition-colors text-text"
                                        >
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <SearchIcon size={14} className="text-text-muted flex-shrink-0" />
                                                <span className="text-sm sm:text-base truncate">{suggestion}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </form>
            )}

            {/* Mobile Full-Screen Search */}
            {isSearchPage && isMobile && (
                <div className="fixed inset-0 bg-card z-50 flex flex-col animate-slide-in-up">
                    <div className="sticky top-0 bg-card border-b border-border p-3 sm:p-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex-shrink-0 p-2 rounded-lg hover:bg-bg-alt transition-colors"
                            >
                                <FaArrowLeft size={18} className="text-text" />
                            </button>
                            <form onSubmit={handleSubmit} className="flex-1 min-w-0">
                                <div className="relative">
                                    <SearchIcon 
                                        size={18} 
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted pointer-events-none"
                                    />
                                    <input
                                        type="text"
                                        name="mobile-search"
                                        autoFocus
                                        placeholder="Search for anything..."
                                        value={searchValue}
                                        onChange={handleChange}
                                        className="w-full h-11 pl-10 pr-10 bg-bg-alt rounded-xl outline-none text-text placeholder:text-text-muted text-sm"
                                    />
                                    {searchValue && (
                                        <button
                                            type="button"
                                            onClick={clearSearch}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-bg-alt transition-colors"
                                        >
                                            <X size={16} className="text-text-muted" />
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 sm:p-4 pb-20">
                        {searchValue.length === 0 ? (
                            <>
                                <div className="mb-6">
                                    <h3 className="font-semibold text-text mb-3 flex items-center gap-2 text-sm">
                                        <Sparkles size={14} className="text-accent" />
                                        Popular Categories
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                        {categories.map((category, index) => {
                                            const Icon = category.icon
                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() => handlePopularSearch(category.name)}
                                                    className={`bg-gradient-to-br ${category.color} text-white p-3 sm:p-4 rounded-xl text-center font-medium hover:scale-105 transition-transform text-sm flex flex-col items-center gap-2`}
                                                >
                                                    <Icon size={28} className="text-white" />
                                                    <span className="text-xs sm:text-sm">{category.name}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="font-semibold text-text mb-3 flex items-center gap-2 text-sm">
                                        <TrendingUp size={14} className="text-accent" />
                                        Trending Now
                                    </h3>
                                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                        {popularSearches.slice(0, 6).map((term, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handlePopularSearch(term)}
                                                className="px-2.5 sm:px-3 py-1.5 bg-bg-alt hover:bg-primary hover:text-white text-xs sm:text-sm text-text rounded-full transition-all duration-200 flex items-center gap-1"
                                            >
                                                <Zap size={12} />
                                                {term}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-text mb-3 flex items-center gap-2 text-sm">
                                        <Clock size={14} className="text-primary" />
                                        Recent Searches
                                    </h3>
                                    <div className="space-y-1 sm:space-y-2">
                                        {recentSearches.map((term, index) => (
                                            <div key={index} className="flex items-center justify-between group">
                                                <button
                                                    onClick={() => handlePopularSearch(term)}
                                                    className="flex-1 text-left p-2 sm:p-3 rounded-lg hover:bg-bg-alt transition-colors flex items-center gap-2 sm:gap-3"
                                                >
                                                    <Clock size={12} className="text-text-muted flex-shrink-0" />
                                                    <span className="text-text text-sm sm:text-base truncate">{term}</span>
                                                </button>
                                                <button
                                                    onClick={() => clearRecentSearch(term)}
                                                    className="p-1.5 sm:p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-error"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-2">
                                <h3 className="font-semibold text-text mb-3 flex items-center gap-2 text-sm">
                                    <SearchIcon size={14} className="text-primary" />
                                    Searching for "{searchValue}"
                                </h3>
                                <div className="text-center py-12">
                                    <div className="spinner w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4"></div>
                                    <p className="text-text-muted text-sm">Searching for products...</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes slideInUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-in-up {
                    animation: slideInUp 0.3s ease-out;
                }
                .truncate {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 2px solid var(--border, #e5e7eb);
                    border-top-color: var(--primary, #3b82f6);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </>
    )
}

export default Search