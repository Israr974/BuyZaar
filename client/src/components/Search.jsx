
import React from 'react'
import { CiSearch } from "react-icons/ci";
import { TypeAnimation } from 'react-type-animation';
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from 'react'
import useMobile from '../hooks/useMobile';
import { FaArrowLeft, FaTimes } from "react-icons/fa6";
import { Search as SearchIcon, Sparkles } from "lucide-react";

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

    const handlePopularSearch = (term) => {
        setSearchValue(term)
        const url = `/search?q=${encodeURIComponent(term)}`
        navigate(url)
    }

    return (
        <>
            
            <form 
                onSubmit={handleSubmit}
                className="relative w-full lg:max-w-2xl min-w-[300px] lg:min-w-[500px]"
            >
                <div 
                    className={`w-full h-12 lg:h-14 rounded-xl bg-white/90 backdrop-blur-sm border transition-all duration-300 ${
                        isFocused 
                            ? 'border-primary shadow-lg shadow-primary/10' 
                            : 'border-border shadow-sm hover:shadow-md hover:border-primary/50'
                    } overflow-hidden flex items-center relative group`}
                >
                    
                    <div className="h-full px-3 lg:px-4 flex items-center justify-center">
                        {isSearchPage && isMobile ? (
                            <Link 
                                to={"/"} 
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-text-muted hover:text-text"
                            >
                                <FaArrowLeft size={20} />
                            </Link>
                        ) : (
                            <button 
                                type="button"
                                onClick={returnToSearchPage}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-text-muted hover:text-text"
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
                                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-text-muted hover:text-text mr-2"
                                    >
                                        <FaTimes size={18} />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    
                    {!isMobile && searchValue && (
                        <button
                            type="submit"
                            className="h-full px-4 lg:px-6 bg-gradient-to-r from-primary to-accent text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                        >
                            <SearchIcon size={18} />
                            Search
                        </button>
                    )}
                </div>

                
                {isFocused && isSearchPage && searchValue.length === 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-border z-50 overflow-hidden animate-fade-in">
                        <div className="p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles size={16} className="text-accent" />
                                <h3 className="font-semibold text-text">Popular Searches</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {popularSearches.map((term, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handlePopularSearch(term)}
                                        className="px-3 py-1.5 bg-gray-100 hover:bg-primary hover:text-white text-sm text-text rounded-lg transition-all duration-200 hover:scale-105"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

               
                {isFocused && isSearchPage && searchValue.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-border z-50 overflow-hidden animate-fade-in">
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
                                    `${searchValue} under $500`
                                ].map((suggestion, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handlePopularSearch(suggestion)}
                                        className="w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors text-text"
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

            
            {isSearchPage && isMobile && (
                <div className="fixed inset-0 bg-white z-50 flex flex-col">
                  
                    <div className="p-4 border-b border-border">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <FaArrowLeft size={20} />
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
                                        className="w-full h-12 pl-12 pr-4 bg-gray-100 rounded-xl outline-none text-text placeholder:text-text-muted"
                                    />
                                    <SearchIcon 
                                        size={20} 
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted"
                                    />
                                    {searchValue && (
                                        <button
                                            type="button"
                                            onClick={clearSearch}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            <FaTimes size={18} className="text-text-muted" />
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    
                    <div className="flex-1 overflow-y-auto p-4">
                        {searchValue.length === 0 ? (
                            <>
                                <div className="mb-6">
                                    <h3 className="font-semibold text-text mb-3">Popular Categories</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { name: "Electronics", color: "from-blue-500 to-cyan-400" },
                                            { name: "Fashion", color: "from-pink-500 to-rose-400" },
                                            { name: "Home", color: "from-green-500 to-emerald-400" },
                                            { name: "Beauty", color: "from-purple-500 to-violet-400" },
                                        ].map((category, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handlePopularSearch(category.name)}
                                                className={`bg-gradient-to-br ${category.color} text-white p-4 rounded-xl text-center font-medium hover:scale-105 transition-transform`}
                                            >
                                                {category.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-text mb-3">Trending Searches</h3>
                                    <div className="space-y-2">
                                        {popularSearches.slice(0, 6).map((term, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handlePopularSearch(term)}
                                                className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between group"
                                            >
                                                <span className="text-text">{term}</span>
                                                <span className="text-text-muted text-sm group-hover:text-primary transition-colors">
                                                    →
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-2">
                                <h3 className="font-semibold text-text mb-3">Search Results</h3>


                                <div className="text-center py-8 text-text-muted">
                                    <SearchIcon size={48} className="mx-auto mb-4 text-gray-300" />
                                    <p>Searching for "{searchValue}"</p>
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
            `}</style>
        </>
    )
}

export default Search