import React, { useEffect } from 'react'
import { X } from 'lucide-react';

const ViewImage = ({ url, close, alt = "Full screen image" }) => {
  // Handle escape key to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        close();
      }
    };
    window.addEventListener('keydown', handleEsc);
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [close]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center fade-in"
      onClick={close}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-5xl max-h-[90vh] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={close}
          className="absolute -top-12 right-0 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110 z-10"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {/* Image */}
        <div className="relative w-full h-[70vh] md:h-[80vh] flex items-center justify-center">
          <img
            src={url}
            alt={alt}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            draggable={false}
          />
        </div>

        {/* Footer Info */}
        <div className="absolute -bottom-12 left-0 right-0 flex justify-center">
          <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 text-white/70 text-sm">
            ⌨️ Press ESC to close
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewImage;