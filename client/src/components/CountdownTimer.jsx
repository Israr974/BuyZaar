// import React, { useState, useEffect } from "react";

// const CountdownTimer = ({ targetDate }) => {
//   const [timeLeft, setTimeLeft] = useState({
//     days: 0,
//     hours: 0,
//     minutes: 0,
//     seconds: 0
//   });

//   useEffect(() => {
//     const timer = setInterval(() => {
//       const now = new Date().getTime();
//       const target = new Date(targetDate).getTime();
//       const difference = target - now;

//       if (difference <= 0) {
//         clearInterval(timer);
//         setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
//         return;
//       }

//       setTimeLeft({
//         days: Math.floor(difference / (1000 * 60 * 60 * 24)),
//         hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
//         minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
//         seconds: Math.floor((difference % (1000 * 60)) / 1000)
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [targetDate]);

//   return (
//     <div className="flex gap-2">
//       <div className="text-center">
//         <div className="bg-gray-900 text-white px-2 py-1 rounded-md min-w-[40px]">
//           <span className="text-lg font-bold">{timeLeft.days}</span>
//         </div>
//         <p className="text-xs text-gray-500 mt-1">Days</p>
//       </div>
//       <div className="text-center">
//         <div className="bg-gray-900 text-white px-2 py-1 rounded-md min-w-[40px]">
//           <span className="text-lg font-bold">{timeLeft.hours}</span>
//         </div>
//         <p className="text-xs text-gray-500 mt-1">Hours</p>
//       </div>
//       <div className="text-center">
//         <div className="bg-gray-900 text-white px-2 py-1 rounded-md min-w-[40px]">
//           <span className="text-lg font-bold">{timeLeft.minutes}</span>
//         </div>
//         <p className="text-xs text-gray-500 mt-1">Mins</p>
//       </div>
//       <div className="text-center">
//         <div className="bg-gray-900 text-white px-2 py-1 rounded-md min-w-[40px]">
//           <span className="text-lg font-bold">{timeLeft.seconds}</span>
//         </div>
//         <p className="text-xs text-gray-500 mt-1">Secs</p>
//       </div>
//     </div>
//   );
// };

// export default CountdownTimer;