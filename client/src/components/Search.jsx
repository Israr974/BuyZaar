import React from 'react'
import { CiSearch } from "react-icons/ci";
import { TypeAnimation } from 'react-type-animation';
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from 'react'
import useMobile from '../hooks/useMobile';
import { FaArrowLeft, FaTimes } from "react-icons/fa6";
import { Search as SearchIcon, Sparkles, TrendingUp, Clock, X } from "lucide-react";

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
        if (!isSearchPage) {
            const input = document.querySelector('input[name="search"]')
            input?.focus()
        }
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

    const clearRecentSearch = (term) => {
        // Implement clear recent search logic
        console.log("Clear recent search:", term)
    }

    return (
        <>
            {/* Desktop Search Bar */}
            <form 
                onSubmit={handleSubmit}
                className="relative w-full lg:max-w-2xl min-w-[300px] lg:min-w-[500px]"
            >
                <div 
                    className={`w-full h-12 lg:h-14 rounded-xl bg-card border transition-all duration-300 ${
                        isFocused 
                            ? 'border-primary shadow-lg shadow-primary/10' 
                            : 'border-border shadow-sm hover:shadow-md hover:border-primary/50'
                    } overflow-hidden flex items-center relative group`}
                >
                    {/* Search Icon / Back Button */}
                    <div className="h-full px-3 lg:px-4 flex items-center justify-center">
                        {isSearchPage && isMobile ? (
                            <Link 
                                to={"/"} 
                                className="p-2 rounded-lg hover:bg-bg-alt transition-colors text-text-muted hover:text-text"
                            >
                                <FaArrowLeft size={20} />
                            </Link>
                        ) : (
                            <button 
                                type="button"
                                onClick={returnToSearchPage}
                                className="p-2 rounded-lg hover:bg-bg-alt transition-colors text-text-muted hover:text-text"
                            >
                                <SearchIcon 
                                    size={20} 
                                    className={`transition-colors ${
                                        isFocused ? 'text-primary' : 'text-text-muted'
                                    }`}
                                />
                            </button>
                        )}
                    </div>

                    {/* Search Input Area */}
                    <div className="flex-1 h-full">
                        {!isSearchPage ? (
                            <div 
                                onClick={returnToSearchPage}
                                className="w-full h-full flex items-center cursor-pointer group"
                            >
                                <div className="relative">
                                    <TypeAnimation
                                        sequence={[
                                            'Search products...',
                                            2000,
                                            'Search smartphones',
                                            2000,
                                            'Search groceries',
                                            2000,
                                            'Search electronics',
                                            2000,
                                            'Search fashion',
                                            2000,
                                            'Search home decor',
                                            2000,
                                        ]}
                                        wrapper="span"
                                        speed={50}
                                        className="text-base lg:text-lg text-text-muted"
                                        repeat={Infinity}
                                    />
                                    <Sparkles 
                                        size={14} 
                                        className="absolute -top-1 -right-5 text-accent animate-pulse"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="h-full w-full flex items-center">
                                <input
                                    type="text"
                                    name="search"
                                    autoFocus={isMobile}
                                    placeholder={isMobile ? "Search..." : "Search for products, brands, and categories..."}
                                    value={searchValue}
                                    onChange={handleChange}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    className="w-full h-full bg-transparent outline-none text-text placeholder:text-text-muted/60 text-base lg:text-lg"
                                />
                                {searchValue && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="p-2 rounded-lg hover:bg-bg-alt transition-colors text-text-muted hover:text-text mr-2"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Search Button */}
                    {!isMobile && searchValue && (
                        <button
                            type="submit"
                            className="h-full px-4 lg:px-6 bg-gradient-primary text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                        >
                            <SearchIcon size={18} />
                            Search
                        </button>
                    )}
                </div>

                {/* Popular Searches Dropdown */}
                {isFocused && isSearchPage && searchValue.length === 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-xl border border-border z-50 overflow-hidden animate-fade-in">
                        <div className="p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <TrendingUp size={16} className="text-accent" />
                                <h3 className="font-semibold text-text">Popular Searches</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {popularSearches.map((term, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handlePopularSearch(term)}
                                        className="px-3 py-1.5 bg-bg-alt hover:bg-primary hover:text-white text-sm text-text rounded-lg transition-all duration-200 hover:scale-105"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Recent Searches */}
                        <div className="border-t border-border p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Clock size={16} className="text-primary" />
                                <h3 className="font-semibold text-text">Recent Searches</h3>
                            </div>
                            <div className="space-y-2">
                                {recentSearches.map((term, index) => (
                                    <div key={index} className="flex items-center justify-between group">
                                        <button
                                            type="button"
                                            onClick={() => handlePopularSearch(term)}
                                            className="flex-1 text-left p-2 rounded-lg hover:bg-bg-alt transition-colors text-text"
                                        >
                                            {term}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => clearRecentSearch(term)}
                                            className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-error"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Search Suggestions Dropdown */}
                {isFocused && isSearchPage && searchValue.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-xl border border-border z-50 overflow-hidden animate-fade-in">
                        <div className="p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <SearchIcon size={16} className="text-primary" />
                                <h3 className="font-semibold text-text">Suggestions for "{searchValue}"</h3>
                            </div>
                            <div className="space-y-2">
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
                                        className="w-full text-left p-2 rounded-lg hover:bg-bg-alt transition-colors text-text"
                                    >
                                        <div className="flex items-center gap-3">
                                            <SearchIcon size={16} className="text-text-muted" />
                                            <span>{suggestion}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </form>

            {/* Mobile Full-Screen Search */}
            {isSearchPage && isMobile && (
                <div className="fixed inset-0 bg-card z-50 flex flex-col animate-slide-in-up">
                    {/* Mobile Search Header */}
                    <div className="sticky top-0 bg-card border-b border-border p-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 rounded-lg hover:bg-bg-alt transition-colors"
                            >
                                <FaArrowLeft size={20} className="text-text" />
                            </button>
                            <form onSubmit={handleSubmit} className="flex-1">
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="mobile-search"
                                        autoFocus
                                        placeholder="Search for anything..."
                                        value={searchValue}
                                        onChange={handleChange}
                                        className="w-full h-12 pl-12 pr-4 bg-bg-alt rounded-xl outline-none text-text placeholder:text-text-muted"
                                    />
                                    <SearchIcon 
                                        size={20} 
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted"
                                    />
                                    {searchValue && (
                                        <button
                                            type="button"
                                            onClick={clearSearch}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-bg-alt transition-colors"
                                        >
                                            <X size={18} className="text-text-muted" />
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Mobile Search Content */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {searchValue.length === 0 ? (
                            <>
                                {/* Popular Categories */}
                                <div className="mb-6">
                                    <h3 className="font-semibold text-text mb-3 flex items-center gap-2">
                                        <Sparkles size={16} className="text-accent" />
                                        Popular Categories
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { name: "Electronics", icon: "📱", color: "from-blue-500 to-cyan-400" },
                                            { name: "Fashion", icon: "👕", color: "from-pink-500 to-rose-400" },
                                            { name: "Home & Kitchen", icon: "🏠", color: "from-green-500 to-emerald-400" },
                                            { name: "Beauty", icon: "💄", color: "from-purple-500 to-violet-400" },
                                            { name: "Sports", icon: "⚽", color: "from-orange-500 to-amber-400" },
                                            { name: "Books", icon: "📚", color: "from-indigo-500 to-blue-400" },
                                        ].map((category, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handlePopularSearch(category.name)}
                                                className={`bg-gradient-to-br ${category.color} text-white p-4 rounded-xl text-center font-medium hover:scale-105 transition-transform`}
                                            >
                                                <span className="text-2xl block mb-1">{category.icon}</span>
                                                {category.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Trending Searches */}
                                <div className="mb-6">
                                    <h3 className="font-semibold text-text mb-3 flex items-center gap-2">
                                        <TrendingUp size={16} className="text-accent" />
                                        Trending Now
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {popularSearches.slice(0, 6).map((term, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handlePopularSearch(term)}
                                                className="px-3 py-1.5 bg-bg-alt hover:bg-primary hover:text-white text-sm text-text rounded-full transition-all duration-200"
                                            >
                                                🔥 {term}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Recent Searches */}
                                <div>
                                    <h3 className="font-semibold text-text mb-3 flex items-center gap-2">
                                        <Clock size={16} className="text-primary" />
                                        Recent Searches
                                    </h3>
                                    <div className="space-y-2">
                                        {recentSearches.map((term, index) => (
                                            <div key={index} className="flex items-center justify-between group">
                                                <button
                                                    onClick={() => handlePopularSearch(term)}
                                                    className="flex-1 text-left p-3 rounded-lg hover:bg-bg-alt transition-colors flex items-center gap-3"
                                                >
                                                    <Clock size={14} className="text-text-muted" />
                                                    <span className="text-text">{term}</span>
                                                </button>
                                                <button
                                                    onClick={() => clearRecentSearch(term)}
                                                    className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-error"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-2">
                                <h3 className="font-semibold text-text mb-3 flex items-center gap-2">
                                    <SearchIcon size={16} className="text-primary" />
                                    Search Results for "{searchValue}"
                                </h3>

                                {/* Loading State */}
                                <div className="text-center py-12">
                                    <div className="spinner w-12 h-12 mx-auto mb-4"></div>
                                    <p className="text-text-muted">Searching for products...</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style jsx>{`
                .react-type-animation-cursor {
                    animation: blink 1s infinite;
                }
                
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }

                @keyframes slideInUp {
                    from {
                        transform: translateY(100%);
                    }
                    to {
                        transform: translateY(0);
                    }
                }

                .animate-slide-in-up {
                    animation: slideInUp 0.3s ease-out;
                }
            `}</style>
        </>
    )
}

export default Search