// import { useState, useEffect } from "react";

// /**
//  * Custom hook to sync state with localStorage
//  * @param {string} key - localStorage key
//  * @param {any} initialValue - Initial value if not found
//  * @returns {[any, Function]} - State and setter function
//  */
// const useLocalStorage = (key, initialValue) => {
//   // Get stored value
//   const readValue = () => {
//     try {
//       const item = localStorage.getItem(key);
//       return item ? JSON.parse(item) : initialValue;
//     } catch (error) {
//       console.error("Error reading localStorage key:", key, error);
//       return initialValue;
//     }
//   };

//   const [storedValue, setStoredValue] = useState(readValue);

//   // Update localStorage when state changes
//   const setValue = (value) => {
//     try {
//       const valueToStore = value instanceof Function ? value(storedValue) : value;
//       setStoredValue(valueToStore);
//       localStorage.setItem(key, JSON.stringify(valueToStore));
//     } catch (error) {
//       console.error("Error setting localStorage key:", key, error);
//     }
//   };

//   // Sync across tabs/windows
//   useEffect(() => {
//     const handleStorageChange = (e) => {
//       if (e.key === key) {
//         setStoredValue(JSON.parse(e.newValue));
//       }
//     };
    
//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, [key]);

//   return [storedValue, setValue];
// };

// export default useLocalStorage;

import { useState, useEffect } from "react";

const useLocalStorage = (key, initialValue) => {
  const readValue = () => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState(readValue);

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // Silent fail - no console log
    }
  };

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
};

export default useLocalStorage;