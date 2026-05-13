
import React from "react";
import { ArrowUpDown, TrendingUp, DollarSign, Star, Sparkles } from "lucide-react";

const sortOptions = [
  { value: "newest", label: "Newest First", icon: Sparkles },
  { value: "price_low", label: "Price: Low to High", icon: DollarSign },
  { value: "price_high", label: "Price: High to Low", icon: DollarSign },
  { value: "rating", label: "Top Rated", icon: Star },
  { value: "popular", label: "Most Popular", icon: TrendingUp }
];

const SortDropdown = ({ value, onChange, className = "" }) => {
  const selectedOption = sortOptions.find(opt => opt.value === value) || sortOptions[0];
  const SelectedIcon = selectedOption.icon;

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full pl-10 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent appearance-none cursor-pointer ${className}`}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <SelectedIcon size={14} className="text-blue-600" />
      </div>
      <ArrowUpDown size={14} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
    </div>
  );
};

export default SortDropdown;