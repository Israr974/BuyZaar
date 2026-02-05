

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { validateUrlConverter } from "../utils/validateUrl";
import { useNavigate } from "react-router-dom";
import ProductByCategory from "./ProductByCategory";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const loadingCategory = useSelector(
    (state) => state.product.loadingCategory
  );
  const categoryData = useSelector(
    (state) => state.product.allCategory
  );
  const subCategoryData = useSelector(
    (state) => state.product.subCategory
  );

  const navigate = useNavigate();

  const sliderImages = categoryData.slice(0, 5).map((cat) => ({
    url: cat.image || "/placeholder.png",
    label: cat.name,
  }));

  useEffect(() => {
    if (!sliderImages.length) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === sliderImages.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [sliderImages.length]);

  const redirectToCategory = (catId, catName) => {
    const subCategory = subCategoryData.find((sub) =>
      sub.category.some((c) => c._id === catId)
    );

    const subName = subCategory ? subCategory.name : "all";

    const url = `/${validateUrlConverter(catName)}-${catId}/${validateUrlConverter(
      subName
    )}-${subCategory?._id || "all"}`;

    navigate(url);
  };

  return (
    <section
      className="px-4 md:px-12 lg:px-16 py-8"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      
      <div className="relative w-full h-96 md:h-[420px] rounded-2xl overflow-hidden shadow-lg mb-12">
        {sliderImages.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 flex items-center justify-center
              ${idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}
            style={{
              backgroundImage: `url(${slide.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div
              className="px-6 py-3 rounded-xl text-white text-3xl md:text-5xl font-bold backdrop-blur-sm"
              style={{ backgroundColor: "rgba(91,45,139,0.6)" }}
            >
              {slide.label}
            </div>
          </div>
        ))}

        
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          {sliderImages.map((_, idx) => (
            <span
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className="w-3 h-3 rounded-full cursor-pointer transition-all"
              style={{
                backgroundColor:
                  idx === currentSlide
                    ? "var(--color-accent)"
                    : "rgba(255,255,255,0.6)",
                transform:
                  idx === currentSlide ? "scale(1.2)" : "scale(1)",
              }}
            />
          ))}
        </div>
      </div>

      
      <div>
        <h2
          className="text-2xl font-bold mb-6"
          style={{ color: "var(--color-text)" }}
        >
          Shop by Category
        </h2>

        {loadingCategory ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div
                key={idx}
                className="h-48 rounded-xl animate-pulse"
                style={{ backgroundColor: "#EDE9F6" }}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {categoryData.map((cat) => (
              <div
                key={cat._id}
                onClick={() => redirectToCategory(cat._id, cat.name)}
                className="rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div className="h-40 w-full overflow-hidden">
                  <img
                    src={cat.image || "/placeholder.png"}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>

                <div className="p-3">
                  <h3
                    className="font-semibold text-center truncate"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {cat.name}
                  </h3>

                  {cat.description && (
                    <p
                      className="text-sm text-center mt-1 line-clamp-2"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {cat.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      
      <div className="mt-14 space-y-14">
        {categoryData.map((cat) => (
          <ProductByCategory
            key={cat._id}
            id={cat._id}
            name={cat.name}
          />
        ))}
      </div>
    </section>
  );
};

export default Home;
