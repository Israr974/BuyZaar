import React from "react";
import {
  Truck,
  Shield,
  RotateCcw,
  Clock,
  Headphones,
  Award,
} from "lucide-react";
import useMobile from "../hooks/useMobile";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over ₹999",
    color: "text-blue-500",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% secure",
    color: "text-green-500",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "30 days policy",
    color: "text-orange-500",
  },
  {
    icon: Clock,
    title: "Fast Delivery",
    description: "Pan India",
    color: "text-purple-500",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated care",
    color: "text-red-500",
  },
  {
    icon: Award,
    title: "Best Price",
    description: "Quality assured",
    color: "text-yellow-500",
  },
];

const FeaturesBar = () => {
  const isMobile = useMobile(768);

  return (
    <div className="py-3 sm:py-4 md:py-5 lg:py-6">
      <div className="px-2 sm:px-3 md:px-4 lg:px-6">
        
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-2 sm:p-3 md:p-4">
          
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-lg sm:rounded-xl p-2 sm:p-3 text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm cursor-pointer bg-gray-50/60"
                >
                  
                  <div className="relative z-10">
                
                    <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12 sm:w-14 sm:h-14'} mx-auto mb-2 sm:mb-3 rounded-xl sm:rounded-2xl flex items-center justify-center bg-gray-100 group-hover:scale-105 transition-transform duration-300`}>
                      <Icon className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6 sm:w-7 sm:h-7'} ${feature.color}`} />
                    </div>

                    
                    <h3 className={`font-semibold text-gray-800 mb-0.5 sm:mb-1 ${isMobile ? 'text-[11px]' : 'text-xs sm:text-sm md:text-base'}`}>
                      {feature.title}
                    </h3>

                    
                    <p className={`text-gray-500 leading-relaxed ${isMobile ? 'text-[9px]' : 'text-[10px] sm:text-xs md:text-sm'}`}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesBar;