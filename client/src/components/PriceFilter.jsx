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
        <DollarSign size={16} className="text-primary" />
        <h4 className="font-medium text-text">Price Range</h4>
      </div>
      
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-xs text-text-muted">Min</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted text-sm">₹</span>
            <input
              type="number"
              value={localMin}
              onChange={handleMinChange}
              min={minLimit}
              max={localMax}
              className="input pl-7 py-2 text-sm"
            />
          </div>
        </div>
        <div className="flex-1">
          <label className="text-xs text-text-muted">Max</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted text-sm">₹</span>
            <input
              type="number"
              value={localMax}
              onChange={handleMaxChange}
              min={localMin}
              max={maxLimit}
              className="input pl-7 py-2 text-sm"
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
          className="flex-1 accent-primary"
        />
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          value={localMax}
          onChange={handleMaxChange}
          className="flex-1 accent-primary"
        />
      </div>
      
      <div className="flex justify-between text-xs text-text-muted">
        <span>₹{localMin.toLocaleString()}</span>
        <span>₹{localMax.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default PriceFilter;