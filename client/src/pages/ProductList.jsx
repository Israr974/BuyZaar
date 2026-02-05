import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Axios from "../utils/Axios";
import AxiosError from "../utils/AxiosToError";
import summaryApi from "../common/summartApi";
import CardProduct from "../components/CardProduct";
import { validateUrlConverter } from "../utils/validateUrl";
import { toast } from "react-hot-toast"; 

const ProductList = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [displaySubCategory, setDisplaySubCategory] = useState([]);

  const params = useParams();
  const allSubCategory = useSelector((state) => state.product.subCategory);

  const categoryId = params.category?.split("-").slice(-1)[0];
  const subcategoryId = params.subcategory?.split("-").slice(-1)[0];
  const subcategorySlug = params.subcategory || "";
  const subcategoryName = subcategorySlug.split("-").slice(0, -1).join("-");

  
  const fetchProductData = useCallback(async () => {
    if (!categoryId || !subcategoryId) {
      return;
    }

    setLoading(true);
    try {
      
      const res = await Axios({
        ...summaryApi().getProductByCategoryAndSubcategory,
        data: {
          categoryId,
          subCategoryId: subcategoryId,
          page,
          limit: 10,
        },
      });

      
      setData(res.data?.data || []);
      setTotalPage(res.data?.totalPages || 1);
    } catch (error) {
      console.error(" API Error:", error);
      AxiosError(error);
      toast.error("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [categoryId, subcategoryId, page]);

 

  
  useEffect(() => {
    if (allSubCategory.length > 0 && categoryId) {
      const sub = allSubCategory.filter((s) =>
        s.category?.some((el) => el._id === categoryId)
      );
      setDisplaySubCategory(sub);
    }
  }, [categoryId, allSubCategory]);

 
  useEffect(() => {
    if (categoryId && subcategoryId) {
      fetchProductData();
      
    }
  }, [categoryId, subcategoryId, page, fetchProductData]);

  
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPage) {
      setPage(newPage);
    }
  };

  return (
    <section className="w-full py-4">
      <div className="w-full flex gap-4">
     
        <div className="w-60 border min-h-[80vh] p-4 sticky top-4">
          <h2 className="mb-4 font-semibold text-lg">Sub Categories</h2>
          <div className="flex flex-col gap-3">
            {displaySubCategory.length > 0 ? (
              displaySubCategory.map((s) => {
                if (!s?.category?.[0]) return null;
                
                const link = `/${validateUrlConverter(s.category[0].name)}-${
                  s.category[0]._id
                }/${validateUrlConverter(s.name)}-${s._id}`;
                
                return (
                  <Link
                    key={s._id}
                    to={link}
                    className={`flex items-center gap-2 p-2 rounded-lg transition ${
                      subcategoryId === s._id
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-100"
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
                    <span>{s.name}</span>
                  </Link>
                );
              })
            ) : (
              <p className="text-gray-500">No subcategories found</p>
            )}
          </div>
        </div>

        
        <div className="flex-1">
         
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2 capitalize">
              {subcategoryName || "Products"}
            </h1>
            <p className="text-gray-600">
              {data.length > 0 ? `${data.length} products found` : "No products found"}
            </p>
          </div>

          
          {loading ? (
            <div className="flex justify-center items-center min-h-[60vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : data.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {data.map((product) => (
                  <CardProduct key={product._id} product={product} />
                ))}
              </div>

              
              {totalPage > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                    className={`px-4 py-2 rounded ${
                      page <= 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    Previous
                  </button>
                  <span className="text-gray-700">
                    Page {page} of {totalPage}
                  </span>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPage}
                    className={`px-4 py-2 rounded ${
                      page >= totalPage
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <p className="text-gray-500 text-lg mb-4">
                No products found in this category.
              </p>
              <Link
                to="/"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Back to Home
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductList;