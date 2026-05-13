import React from "react";
import { ArrowRight } from "lucide-react";

const SectionHeader = ({ title, subtitle, viewAllLink, icon: Icon }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <div className="flex items-center gap-2">
          {Icon && <Icon size={24} className="text-blue-500" />}
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
        {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
      </div>
      {viewAllLink && (
        <a
          href={viewAllLink}
          className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 text-sm"
        >
          View All <ArrowRight size={16} />
        </a>
      )}
    </div>
  );
};

export default SectionHeader;