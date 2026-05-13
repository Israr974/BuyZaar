
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import CardProduct from "../components/CardProduct";
import CartLoading from "../components/CartLoading";
import Axios from "../utils/Axios";
import summaryApi from "../common/summartApi";
import AxiosError from "../utils/AxiosToError";
import { validateUrlConverter } from "../utils/validateUrl";
import { useSelector } from "react-redux";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";

const ProductByCategory = ({ id, name }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const sliderRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  

  const abortControllerRef = useRef(null);

  const fetchProducts = async () => {
    if (!id) return;
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    try {
      setLoading(true);
      const response = await Axios({
        ...summaryApi().getProductByCategory,
        data: { id },
        signal: abortControllerRef.current.signal,
      });

      const { data: responseData } = response;
      if (responseData?.success && Array.isArray(responseData.data)) {
        const validProducts = responseData.data.filter(product => product && product._id);
        setProducts(validProducts);
      } else {
        setProducts([]);
      }
    } catch (error) {
      if (error.name !== 'AbortError' && error.code !== 'ERR_CANCELED') {
        AxiosError(error);
      }
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const checkScrollPosition = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 20);
    }
  };

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.offsetWidth * 0.75;
      sliderRef.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (id) {
      fetchProducts();
    }
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [id]);

  useEffect(() => {
    const container = sliderRef.current;
    if (container && products.length > 0) { 
      const timeoutId = setTimeout(() => {
        checkScrollPosition();
      }, 100);
      
      container.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
      
      return () => {
        clearTimeout(timeoutId);
        container.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, [products]);

  const subCategoryData = useSelector((state) => state.product.subCategory);

  const RedirectProductList = (id, cat) => {
    if (!subCategoryData || !Array.isArray(subCategoryData) || subCategoryData.length === 0) {
      return `/${validateUrlConverter(cat)}-${id}`;
    }
    
    const subCategory = subCategoryData.find((sub) =>
      sub?.category?.some((c) => c?._id === id)
    );
    return subCategory
      ? `/${validateUrlConverter(cat)}-${id}/${validateUrlConverter(
          subCategory.name
        )}-${subCategory._id}`
      : `/${validateUrlConverter(cat)}-${id}`;
  };

  const redirectUrl = RedirectProductList(id, name);
  const hasProducts = products.length > 0;
  const shouldShowArrows = products.length > 4 && hasProducts; 

  if (!id) {
    return null;
  }

  return (
    <div className="mb-12 relative">
      <div className="flex items-center justify-between mb-6 px-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 rounded-full bg-gradient-to-b from-primary to-accent" aria-hidden="true"></div>
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-text">
              {name || 'Products'}
            </h2>
            <p className="text-sm text-text-muted mt-1">
              {hasProducts ? `${products.length} products available` : "Explore our collection"}
            </p>
          </div>
        </div>
        
        {hasProducts && ( 
          <Link
            to={redirectUrl}
            className="group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-primary hover:text-white"
            style={{
              backgroundColor: "var(--color-bg-alt)",
              color: "var(--color-primary)",
            }}
          >
            <span>View All</span>
            <ChevronRight 
              size={16} 
              className="group-hover:translate-x-1 transition-transform" 
            />
          </Link>
        )}
      </div>

      <div className="relative px-4">
        {shouldShowArrows && showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card border border-border shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-primary hover:text-white hover:scale-110"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
        )}

        {shouldShowArrows && showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card border border-border shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-primary hover:text-white hover:scale-110"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        )}

        <div
          ref={sliderRef}
          className="flex overflow-x-auto gap-5 py-4 px-1 scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {loading ? (
            Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={`loading-skeleton-${i}`} className="flex-shrink-0 w-[180px] sm:w-[200px] md:w-[220px] lg:w-[250px]">
                  <CartLoading />
                </div>
              ))
          ) : hasProducts ? (
            products.map((product) => (
              <div
                key={product._id}
                className="flex-shrink-0 w-[180px] sm:w-[200px] md:w-[220px] lg:w-[250px] transition-all duration-300 hover:-translate-y-1"
              >
                <CardProduct product={product} />
              </div>
            ))
          ) : (
            <div className="w-full text-center py-16">
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <ShoppingBag size={48} className="text-primary/40" aria-hidden="true" />
                </div>
                <p className="text-text-muted text-lg">
                  No products available in <span className="font-semibold text-primary">{name || 'this category'}</span>
                </p>
                <p className="text-text-muted text-sm">
                  Check back later for new arrivals in this category
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

     
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ProductByCategory;