import React, { useState, useEffect, useRef } from "react";
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

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...summaryApi().getProductByCategory,
        data: { id },
      });

      const { data: responseData } = response;
      if (responseData.success) setProducts(responseData.data);
      else setProducts([]);
    } catch (error) {
      AxiosError(error);
      setProducts([]);
    } finally {
      setLoading(false);
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
    if (id) fetchProducts();
  }, [id]);

  const subCategoryData = useSelector((state) => state.product.subCategory);

  const RedirectProductList = (id, cat) => {
    const subCategory = subCategoryData.find((sub) =>
      sub.category.some((c) => c._id === id)
    );
    return subCategory
      ? `/${validateUrlConverter(cat)}-${id}/${validateUrlConverter(
          subCategory.name
        )}-${subCategory._id}`
      : `/${validateUrlConverter(cat)}-${id}`;
  };

  const redirectUrl = RedirectProductList(id, name);

  return (
    <div className="mb-8 relative">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-5 px-2">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 rounded-full bg-gradient-to-b from-primary to-accent"></div>
          <h2 className="text-xl md:text-2xl font-display font-bold text-text">
            {name}
          </h2>
        </div>
        <Link
          to={redirectUrl}
          className="group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
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
      </div>

      {/* Products Slider */}
      <div className="relative px-2">
        {/* Scroll Buttons */}
        {(products.length > 4 || loading) && (
          <>
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card shadow-md flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:scale-110"
              style={{
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
              }}
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card shadow-md flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:scale-110"
              style={{
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
              }}
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Slider Container */}
        <div
          ref={sliderRef}
          className="flex overflow-x-auto gap-5 py-4 px-1 scroll-smooth hide-scrollbar"
        >
          {loading ? (
            Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[200px] md:w-[220px] lg:w-[250px]">
                  <CartLoading />
                </div>
              ))
          ) : products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="flex-shrink-0 w-[200px] md:w-[220px] lg:w-[250px] transition-all duration-300 hover:-translate-y-1"
              >
                <CardProduct product={product} />
              </div>
            ))
          ) : (
            <div className="w-full text-center py-12">
              <div className="flex flex-col items-center gap-3">
                <ShoppingBag size={48} style={{ color: "var(--color-text-muted)" }} />
                <p className="text-text-muted">
                  No products available in <span className="font-semibold text-primary">{name}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductByCategory;