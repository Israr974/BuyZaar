import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const Breadcrumb = ({ items, customItems }) => {
  const location = useLocation();
  
  // Generate breadcrumb from current path if no custom items
  const generateFromPath = () => {
    const paths = location.pathname.split("/").filter(Boolean);
    const breadcrumbs = paths.map((path, index) => {
      const url = "/" + paths.slice(0, index + 1).join("/");
      const name = path.split("-").slice(0, -1).join("-") || path;
      return { name: decodeURIComponent(name), url, isLast: index === paths.length - 1 };
    });
    return breadcrumbs;
  };

  const breadcrumbItems = customItems || (items ? items : generateFromPath());

  if (breadcrumbItems.length === 0) return null;

  return (
    <nav className="flex items-center gap-2 text-sm text-text-muted flex-wrap">
      <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
        <Home size={14} />
        Home
      </Link>
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={12} />
          {item.isLast || (index === breadcrumbItems.length - 1) ? (
            <span className="text-text font-medium">{item.name}</span>
          ) : (
            <Link to={item.url} className="hover:text-primary transition-colors">
              {item.name}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;