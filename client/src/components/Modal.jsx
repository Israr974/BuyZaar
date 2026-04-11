import React, { useEffect } from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, size = "md", showClose = true }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[90vw]"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={`relative bg-card rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-hidden animate-zoom-in`}>
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-5 flex items-center justify-between">
          <h2 className="text-xl font-display font-bold text-text">{title}</h2>
          {showClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-bg-alt transition-colors text-text-muted hover:text-text"
            >
              <X size={20} />
            </button>
          )}
        </div>
        
        {/* Body */}
        <div className="overflow-y-auto p-5 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;