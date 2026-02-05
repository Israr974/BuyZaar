import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import CardProduct from "../components/CardProduct";
import CartLoading from "../components/CartLoading";
import Axios from "../utils/Axios";
import summaryApi from "../common/summartApi";
import AxiosError from "../utils/AxiosToError";
import { validateUrlConverter } from "../utils/validateUrl";
import { useSelector } from "react-redux";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react"; // clean icons

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
    <div className="p-6 relative">
      
      <div className="bg-gradient-to-r from-blue-50 to-white border border-gray-200 rounded-xl p-5 shadow-sm mb-4 flex justify-between items-center">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800">
          <ShoppingBag className="w-5 h-5 text-blue-600" />
          {name}
        </h2>
        <Link
          to={redirectUrl}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
        >
          View All
        </Link>
      </div>

      
      <div className="relative">
        {(products.length > 6 || loading) && (
          <>
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-100 transition"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-100 transition"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        <div
          ref={sliderRef}
          className="flex overflow-x-auto hide-scrollbar gap-5 py-4 px-1"
        >
          {loading ? (
            Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex-shrink-0 w-48">
                  <CartLoading />
                </div>
              ))
          ) : products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="flex-shrink-0 w-48 transform hover:scale-105 transition-transform duration-300"
              >
                <CardProduct product={product} />
              </div>
            ))
          ) : (
            <div className="w-full text-center text-gray-500 py-10">
              No products available in <span className="font-semibold">{name}</span>
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
