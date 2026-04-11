// components/RecentlyViewed.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Clock, Trash2 } from "lucide-react";
import useRecentlyViewed from "../hooks/useRecentlyViewed";

const RecentlyViewed = ({ maxItems = 6 }) => {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();

  if (recentlyViewed.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-primary to-accent"></div>
          <h2 className="text-xl font-display font-bold text-text">
            Recently Viewed
          </h2>
          <Clock size={18} className="text-text-muted" />
        </div>
        <button
          onClick={clearRecentlyViewed}
          className="text-sm text-text-muted hover:text-error transition-colors flex items-center gap-1"
        >
          <Trash2 size={14} />
          Clear
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {recentlyViewed.slice(0, maxItems).map((product) => (
          <Link
            key={product._id}
            to={`/product/${product.name?.toLowerCase().replace(/\s+/g, "-")}-${product._id}`}
            className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-all hover:-translate-y-1"
          >
            <div className="aspect-square overflow-hidden bg-bg-alt">
              <img
                src={product.image?.[0] || "/placeholder.png"}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium text-text line-clamp-1 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <p className="text-xs font-bold gradient-text mt-1">
                ₹{product.price?.toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;