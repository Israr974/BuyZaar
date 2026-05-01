// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { validateUrlConverter } from "../utils/validateUrl";
// import { useNavigate } from "react-router-dom";
// import ProductByCategory from "./ProductByCategory";
// import { ChevronRight,ShoppingBag, Tag, TrendingUp, Star } from "lucide-react";

// const Home = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);

//   const loadingCategory = useSelector(
//     (state) => state.product.loadingCategory
//   );
//   const categoryData = useSelector(
//     (state) => state.product.allCategory
//   );
//   const subCategoryData = useSelector(
//     (state) => state.product.subCategory
//   );

//   const navigate = useNavigate();

//   const sliderImages = categoryData.slice(0, 5).map((cat) => ({
//     url: cat.image || "/placeholder.png",
//     label: cat.name,
//   }));

//   useEffect(() => {
//     if (!sliderImages.length) return;

//     const interval = setInterval(() => {
//       setCurrentSlide((prev) =>
//         prev === sliderImages.length - 1 ? 0 : prev + 1
//       );
//     }, 4000);

//     return () => clearInterval(interval);
//   }, [sliderImages.length]);

//   const redirectToCategory = (catId, catName) => {
//     const subCategory = subCategoryData.find((sub) =>
//       sub.category.some((c) => c._id === catId)
//     );

//     const subName = subCategory ? subCategory.name : "all";

//     const url = `/${validateUrlConverter(catName)}-${catId}/${validateUrlConverter(
//       subName
//     )}-${subCategory?._id || "all"}`;

//     navigate(url);
//   };

//   // Featured deals data
//   const featuredDeals = [
//     { title: "Electronics Sale", discount: "40% OFF", color: "from-blue-500 to-cyan-500" },
//     { title: "Fashion Week", discount: "50% OFF", color: "from-pink-500 to-rose-500" },
//     { title: "Home Decor", discount: "30% OFF", color: "from-emerald-500 to-teal-500" },
//   ];

//   return (
//     <section
//       className="min-h-screen px-4 md:px-12 lg:px-16 py-8"
//       style={{ backgroundColor: "var(--color-bg)" }}
//     >
//       {/* Hero Slider */}
//       <div className="relative w-full h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-xl mb-12 group">
//         {sliderImages.map((slide, idx) => (
//           <div
//             key={idx}
//             className={`absolute inset-0 transition-all duration-1000 ease-in-out flex items-center justify-center
//               ${idx === currentSlide ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-105"}`}
//             style={{
//               backgroundImage: `url(${slide.url})`,
//               backgroundSize: "cover",
//               backgroundPosition: "center",
//             }}
//           >
//             {/* Dark Overlay for better text readability */}
//             <div className="absolute inset-0 bg-black/30"></div>
            

//           </div>
//         ))}

//         {/* Slider Dots */}
//         <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
//           {sliderImages.map((_, idx) => (
//             <button
//               key={idx}
//               onClick={() => setCurrentSlide(idx)}
//               className="transition-all duration-300 focus:outline-none"
//               style={{
//                 width: idx === currentSlide ? "24px" : "8px",
//                 height: "8px",
//                 borderRadius: "4px",
//                 backgroundColor: idx === currentSlide
//                   ? "var(--color-accent)"
//                   : "rgba(255,255,255,0.6)",
//               }}
//               aria-label={`Go to slide ${idx + 1}`}
//             />
//           ))}
//         </div>

//         {/* Navigation Arrows */}
//         {sliderImages.length > 1 && (
//           <>
//             <button
//               onClick={() => setCurrentSlide(prev => prev === 0 ? sliderImages.length - 1 : prev - 1)}
//               className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/40"
//               aria-label="Previous slide"
//             >
//               <ChevronRight className="w-5 h-5 text-white rotate-180" />
//             </button>
//             <button
//               onClick={() => setCurrentSlide(prev => prev === sliderImages.length - 1 ? 0 : prev + 1)}
//               className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/40"
//               aria-label="Next slide"
//             >
//               <ChevronRight className="w-5 h-5 text-white" />
//             </button>
//           </>
//         )}
//       </div>

//       {/* Featured Deals Banner */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
//         {featuredDeals.map((deal, idx) => (
//           <div
//             key={idx}
//             className={`relative overflow-hidden rounded-xl p-6 bg-gradient-to-r ${deal.color} cursor-pointer group transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
//             onClick={() => navigate("/sale")}
//           >
//             <div className="relative z-10">
//               <Tag className="w-8 h-8 text-white/80 mb-2" />
//               <h3 className="text-white text-xl font-bold">{deal.title}</h3>
//               <p className="text-white/90 text-2xl font-bold mt-1">{deal.discount}</p>
//               <button className="mt-3 text-white text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
//                 Shop Now <ChevronRight size={16} />
//               </button>
//             </div>
//             <div className="absolute inset-0 bg-white/10 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
//           </div>
//         ))}
//       </div>

//       {/* Shop by Category Section */}
//       <div className="mb-14">
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-3">
//             <div className="w-1 h-8 rounded-full bg-gradient-to-b from-primary to-accent"></div>
//             <h2
//               className="text-2xl md:text-3xl font-display font-bold"
//               style={{ color: "var(--color-text)" }}
//             >
//               Shop by Category
//             </h2>
//           </div>
//           <button
//             onClick={() => navigate("/categories")}
//             className="text-sm font-medium flex items-center gap-1 transition-colors hover:gap-2"
//             style={{ color: "var(--color-primary)" }}
//           >
//             View All Categories <ChevronRight size={16} />
//           </button>
//         </div>

//         {loadingCategory ? (
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
//             {Array.from({ length: 10 }).map((_, idx) => (
//               <div
//                 key={idx}
//                 className="h-56 rounded-xl animate-pulse"
//                 style={{ backgroundColor: "var(--color-bg-alt)" }}
//               />
//             ))}
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
//             {categoryData.map((cat) => (
//               <div
//                 key={cat._id}
//                 onClick={() => redirectToCategory(cat._id, cat.name)}
//                 className="group rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
//                 style={{
//                   backgroundColor: "var(--color-card)",
//                   border: "1px solid var(--color-border)",
//                 }}
//               >
//                 <div className="h-44 w-full overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
//                   <img
//                     src={cat.image || "/placeholder.png"}
//                     alt={cat.name}
//                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                     loading="lazy"
//                   />
//                 </div>

//                 <div className="p-4">
//                   <h3
//                     className="font-semibold text-center truncate group-hover:text-primary transition-colors"
//                     style={{ color: "var(--color-text)" }}
//                   >
//                     {cat.name}
//                   </h3>

//                   {cat.description && (
//                     <p
//                       className="text-xs text-center mt-1 line-clamp-2"
//                       style={{ color: "var(--color-text-muted)" }}
//                     >
//                       {cat.description}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Products by Category Section */}
//       {categoryData.length > 0 && (
//         <div className="space-y-14">
//           {categoryData.map((cat) => (
//             <ProductByCategory
//               key={cat._id}
//               id={cat._id}
//               name={cat.name}
//             />
//           ))}
//         </div>
//       )}

//       {/* Empty State */}
//       {!loadingCategory && categoryData.length === 0 && (
//         <div className="text-center py-16">
//           <div className="w-24 h-24 mx-auto rounded-full bg-bg-alt flex items-center justify-center mb-4">
//             <ShoppingBag size={48} style={{ color: "var(--color-text-muted)" }} />
//           </div>
//           <h3 className="text-xl font-semibold text-text mb-2">No Categories Found</h3>
//           <p className="text-text-muted">Categories will appear here once added.</p>
//         </div>
//       )}
//     </section>
//   );
// };

// export default Home;
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { validateUrlConverter } from "../utils/validateUrl";
import { useNavigate } from "react-router-dom";
import ProductByCategory from "./ProductByCategory";
import { ChevronRight, ShoppingBag, Tag, TrendingUp, Star } from "lucide-react";

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

  const featuredDeals = [
    { title: "Electronics Sale", discount: "40% OFF", color: "from-blue-500 to-cyan-500" },
    { title: "Fashion Week", discount: "50% OFF", color: "from-pink-500 to-rose-500" },
    { title: "Home Decor", discount: "30% OFF", color: "from-emerald-500 to-teal-500" },
  ];

  return (
    <section className="min-h-screen px-4 md:px-12 lg:px-16 py-8 bg-white">
      {/* Hero Slider */}
      <div className="relative w-full h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-xl mb-12 group">
        {sliderImages.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out flex items-center justify-center
              ${idx === currentSlide ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-105"}`}
            style={{
              backgroundImage: `url(${slide.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
        ))}

        {/* Slider Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {sliderImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className="transition-all duration-300 focus:outline-none"
              style={{
                width: idx === currentSlide ? "24px" : "8px",
                height: "8px",
                borderRadius: "4px",
                backgroundColor: idx === currentSlide
                  ? "#F97316"
                  : "rgba(255,255,255,0.6)",
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        {sliderImages.length > 1 && (
          <>
            <button
              onClick={() => setCurrentSlide(prev => prev === 0 ? sliderImages.length - 1 : prev - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/40"
              aria-label="Previous slide"
            >
              <ChevronRight className="w-5 h-5 text-white rotate-180" />
            </button>
            <button
              onClick={() => setCurrentSlide(prev => prev === sliderImages.length - 1 ? 0 : prev + 1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/40"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </>
        )}
      </div>

      {/* Featured Deals Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {featuredDeals.map((deal, idx) => (
          <div
            key={idx}
            className={`relative overflow-hidden rounded-xl p-6 bg-gradient-to-r ${deal.color} cursor-pointer group transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
            onClick={() => navigate("/sale")}
          >
            <div className="relative z-10">
              <Tag className="w-8 h-8 text-white/80 mb-2" />
              <h3 className="text-white text-xl font-bold">{deal.title}</h3>
              <p className="text-white/90 text-2xl font-bold mt-1">{deal.discount}</p>
              <button className="mt-3 text-white text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                Shop Now <ChevronRight size={16} />
              </button>
            </div>
            <div className="absolute inset-0 bg-white/10 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
          </div>
        ))}
      </div>

      {/* Shop by Category Section */}
      <div className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-blue-600 to-orange-500"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Shop by Category
            </h2>
          </div>
          <button
            onClick={() => navigate("/categories")}
            className="text-sm font-medium flex items-center gap-1 text-blue-600 hover:gap-2 transition-all"
          >
            View All Categories <ChevronRight size={16} />
          </button>
        </div>

        {loadingCategory ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div
                key={idx}
                className="h-56 rounded-xl animate-pulse bg-gray-100"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {categoryData.map((cat) => (
              <div
                key={cat._id}
                onClick={() => redirectToCategory(cat._id, cat.name)}
                className="group rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl bg-white border border-gray-200"
              >
                <div className="h-44 w-full overflow-hidden bg-gradient-to-br from-blue-100 to-orange-100">
                  <img
                    src={cat.image || "/placeholder.png"}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-center truncate text-gray-800 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>

                  {cat.description && (
                    <p className="text-xs text-center mt-1 line-clamp-2 text-gray-500">
                      {cat.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Products by Category Section */}
      {categoryData.length > 0 && (
        <div className="space-y-14">
          {categoryData.map((cat) => (
            <ProductByCategory
              key={cat._id}
              id={cat._id}
              name={cat.name}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loadingCategory && categoryData.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <ShoppingBag size={48} className="text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Categories Found</h3>
          <p className="text-gray-500">Categories will appear here once added.</p>
        </div>
      )}
    </section>
  );
};

export default Home;