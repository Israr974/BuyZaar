import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const Breadcrumb = ({ items, customItems }) => {
  const location = useLocation();
  
  const generateFromPath = () => {
    const paths = location.pathname.split("/").filter(Boolean);
    return paths.map((path, index) => {
      const url = "/" + paths.slice(0, index + 1).join("/");
      const name = path.split("-").slice(0, -1).join("-") || path;
      return { name: decodeURIComponent(name), url, isLast: index === paths.length - 1 };
    });
  };

  const breadcrumbItems = customItems || items || generateFromPath();

  if (!breadcrumbItems.length) return null;

  const BreadcrumbItem = ({ item, index, isLast }) => (
    <>
      <ChevronRight size={12} />
      {isLast ? (
        <span className="text-text font-medium">{item.name}</span>
      ) : (
        <Link to={item.url} className="hover:text-primary transition-colors">
          {item.name}
        </Link>
      )}
    </>
  );

  return (
    <nav className="flex items-center gap-2 text-sm text-text-muted flex-wrap">
      <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
        <Home size={14} />
        <span>Home</span>
      </Link>
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          <BreadcrumbItem 
            item={item} 
            index={index} 
            isLast={item.isLast || index === breadcrumbItems.length - 1} 
          />
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;