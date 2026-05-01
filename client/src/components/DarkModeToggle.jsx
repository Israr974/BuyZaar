// // components/DarkModeToggle.jsx
// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Sun, Moon } from "lucide-react";
// import { toggleTheme } from "../redux/uiSlice";

// const DarkModeToggle = () => {
//   const dispatch = useDispatch();
//   const theme = useSelector((state) => state.ui.theme);

//   useEffect(() => {
//     // Apply theme on mount and when it changes
//     if (theme === "dark") {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//   }, [theme]);

//   return (
//     <button
//       onClick={() => dispatch(toggleTheme())}
//       className="relative p-2 rounded-lg hover:bg-bg-alt transition-all duration-300 group"
//       aria-label="Toggle dark mode"
//     >
//       <div className="relative w-5 h-5">
//         <Sun 
//           size={20} 
//           className={`absolute inset-0 transition-all duration-300 ${
//             theme === "light" 
//               ? "opacity-100 rotate-0 scale-100 text-accent" 
//               : "opacity-0 rotate-90 scale-0"
//           }`}
//         />
//         <Moon 
//           size={20} 
//           className={`absolute inset-0 transition-all duration-300 ${
//             theme === "dark" 
//               ? "opacity-100 rotate-0 scale-100 text-primary-light" 
//               : "opacity-0 -rotate-90 scale-0"
//           }`}
//         />
//       </div>
//     </button>
//   );
// };

// export default DarkModeToggle;


import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Sun, Moon } from "lucide-react";
import { toggleTheme } from "../redux/uiSlice";

const DarkModeToggle = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const isLight = theme === "light";
  const isDark = theme === "dark";

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="relative p-2 rounded-lg hover:bg-bg-alt transition-all duration-300"
      aria-label="Toggle dark mode"
    >
      <div className="relative w-5 h-5">
        <Sun 
          size={20} 
          className={`absolute inset-0 transition-all duration-300 ${
            isLight ? "opacity-100 rotate-0 scale-100 text-accent" : "opacity-0 rotate-90 scale-0"
          }`}
        />
        <Moon 
          size={20} 
          className={`absolute inset-0 transition-all duration-300 ${
            isDark ? "opacity-100 rotate-0 scale-100 text-primary-light" : "opacity-0 -rotate-90 scale-0"
          }`}
        />
      </div>
    </button>
  );
};

export default DarkModeToggle;