import React, { useState } from "react";
import { DollarSign } from "lucide-react";

const PriceFilter = ({ minPrice, maxPrice, onPriceChange, minLimit = 0, maxLimit = 100000 }) => {
  const [localMin, setLocalMin] = useState(minPrice || minLimit);
  const [localMax, setLocalMax] = useState(maxPrice || maxLimit);

  const handleMinChange = (e) => {
    const value = parseInt(e.target.value) || minLimit;
    setLocalMin(value);
    if (onPriceChange) onPriceChange(value, localMax);
  };

  const handleMaxChange = (e) => {
    const value = parseInt(e.target.value) || maxLimit;
    setLocalMax(value);
    if (onPriceChange) onPriceChange(localMin, value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <DollarSign size={16} className="text-blue-600" />
        <h4 className="font-medium text-gray-800">Price Range</h4>
      </div>
      
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-xs text-gray-500">Min</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₹</span>
            <input
              type="number"
              value={localMin}
              onChange={handleMinChange}
              min={minLimit}
              max={localMax}
              className="w-full px-4 py-2 pl-7 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-500">Max</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₹</span>
            <input
              type="number"
              value={localMax}
              onChange={handleMaxChange}
              min={localMin}
              max={maxLimit}
              className="w-full px-4 py-2 pl-7 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
        </div>
      </div>
      
      <div className="flex gap-2">
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          value={localMin}
          onChange={handleMinChange}
          className="flex-1 accent-blue-600"
        />
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          value={localMax}
          onChange={handleMaxChange}
          className="flex-1 accent-blue-600"
        />
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>₹{localMin.toLocaleString()}</span>
        <span>₹{localMax.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default PriceFilter;