import { useEffect } from "react";

/**
 * Custom hook to detect clicks outside a referenced element
 * @param {React.RefObject} ref - Ref of the element to detect outside clicks
 * @param {Function} callback - Function to call when click outside occurs
 */
const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};

export default useClickOutside;