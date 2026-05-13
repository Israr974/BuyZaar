import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import HeroBanner from "../components/HeroBanner";
import FeaturesBar from "../components/FeaturesBar";
import CategorySection from "../components/CategorySection";
import FlashSale from "../components/FlashSale";
import TrendingSection from "../components/TrendingSection";
import BrandsSection from "../components/BrandsSection";
import TestimonialsSection from "../components/TestimonialsSection";
import AppDownloadBanner from "../components/AppDownloadBanner";
import GallerySection from "../components/GallerySection";
import NewsletterSignup from "../components/NewsletterSignup";
import IsAdmin from "../utils/IsAdmin";
import RecentlyViewed from "../components/RecentlyViewed";
import NewArrivalsSection from "../components/NewArrivalsSection"
import BestSellersSection from "../components/BestSellersSection"
import useMobile from "../hooks/useMobile";
const Home = () => {
  const user = useSelector(state => state.user);
  const isAdmin = IsAdmin(user?.role);
  const allProducts = useSelector((state) => state.product.products) || [];
  const [isMobile] = useMobile(768);
 const categoryData = useSelector((state) => state.product.allCategory) || [];
 const loadingCategory = useSelector((state) => state.product.loadingCategory);
  const flashSaleProducts = useMemo(() => {
    return [...allProducts]
      .filter(p => (p.discount || 0) >= 30 && (p.stock || 0) > 0)
      .sort((a, b) => (b.discount || 0) - (a.discount || 0))
      .slice(0, isMobile ? 4 : 10);
  }, [allProducts, isMobile]);

  const trendingProducts = useMemo(() => {
    return [...allProducts]
      .filter(p => (p.rating || 0) >= 4 && (p.stock || 0) > 0)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, isMobile ? 4 : 10);
  }, [allProducts, isMobile]);


  const newArrivals = useMemo(() => {
    return [...allProducts]
      .filter(product => product.stock > 0)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);
  }, [allProducts]);

  const bestSellers = useMemo(() => {
    return [...allProducts]
      .filter(product => product.stock > 0 && (product.soldCount || 0) > 0)
      .sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
      .slice(0, 5);
  }, [allProducts]);


  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-orange-50 min-h-screen">
      <div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <HeroBanner 
          isAdmin={isAdmin} 
          autoPlay={!isMobile} 
          interval={5000} 
        />
        <FeaturesBar />
        <RecentlyViewed />
       <CategorySection categories={categoryData} loading={loadingCategory} />
        {flashSaleProducts.length > 0 && (
          <FlashSale 
            products={flashSaleProducts} 
            loading={false}
            mobileView={isMobile}
          />
        )}
        {trendingProducts.length > 0 && (
          <TrendingSection 
            products={trendingProducts}
            mobileView={isMobile}
            initialLimit={10}
          />
        )}

         <NewArrivalsSection products={newArrivals} />

       <BestSellersSection products={bestSellers} />
        <BrandsSection mobileView={isMobile} />
        <TestimonialsSection 
          limit={isMobile ? 2 : 3} 
          mobileView={isMobile}
        />
        <AppDownloadBanner mobileView={isMobile} />
        <GallerySection mobileView={isMobile} />
        <NewsletterSignup mobileView={isMobile} />
      </div>
    </div>
  );
};

export default Home;