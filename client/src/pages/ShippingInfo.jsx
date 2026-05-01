// import React from "react";
// import { Link } from "react-router-dom";
// import { Truck, Clock, MapPin, Package, CreditCard, Globe } from "lucide-react";

// const ShippingInfo = () => {
//   const deliveryTimes = [
//     { location: "Metro Cities (Delhi, Mumbai, Bangalore, Chennai)", time: "2-3 business days" },
//     { location: "Tier 2 Cities (Pune, Ahmedabad, Jaipur, etc.)", time: "3-4 business days" },
//     { location: "Tier 3 Cities & Towns", time: "4-6 business days" },
//     { location: "Remote Areas", time: "6-8 business days" }
//   ];

//   const shippingRates = [
//     { amount: "Below ₹999", rate: "₹50" },
//     { amount: "₹999 and above", rate: "FREE" }
//   ];

//   return (
//     <div className="min-h-screen bg-bg fade-in">
//       <div className="container-narrow px-4 py-12">
//         {/* Header */}
//         <div className="text-center mb-10">
//           <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
//             <Truck className="w-8 h-8 text-primary" />
//           </div>
//           <h1 className="text-3xl md:text-4xl font-display font-bold gradient-text mb-3">
//             Shipping Information
//           </h1>
//           <p className="text-text-muted">
//             Learn about our shipping policies and delivery times
//           </p>
//         </div>

//         <div className="grid lg:grid-cols-2 gap-8">
//           {/* Left Column */}
//           <div className="space-y-6">
//             {/* Delivery Time */}
//             <div className="bg-card rounded-xl border border-border p-6">
//               <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
//                 <Clock size={20} className="text-primary" />
//                 Delivery Time
//               </h2>
//               <div className="space-y-3">
//                 {deliveryTimes.map((item, index) => (
//                   <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
//                     <span className="text-text-muted text-sm">{item.location}</span>
//                     <span className="font-medium text-text text-sm">{item.time}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Shipping Rates */}
//             <div className="bg-card rounded-xl border border-border p-6">
//               <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
//                 <CreditCard size={20} className="text-primary" />
//                 Shipping Rates
//               </h2>
//               <div className="space-y-3">
//                 {shippingRates.map((item, index) => (
//                   <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
//                     <span className="text-text-muted text-sm">Order {item.amount}</span>
//                     <span className="font-medium text-text text-sm">{item.rate}</span>
//                   </div>
//                 ))}
//               </div>
//               <p className="text-xs text-text-muted mt-4">
//                 * Free shipping automatically applied at checkout
//               </p>
//             </div>
//           </div>

//           {/* Right Column */}
//           <div className="space-y-6">
//             {/* Order Processing */}
//             <div className="bg-card rounded-xl border border-border p-6">
//               <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
//                 <Package size={20} className="text-primary" />
//                 Order Processing
//               </h2>
//               <p className="text-text-muted mb-3">
//                 Orders are processed within 24 hours of confirmation. You'll receive:
//               </p>
//               <ul className="space-y-2 text-text-muted text-sm">
//                 <li className="flex items-center gap-2">
//                   <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
//                   Order confirmation email immediately
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
//                   Shipping confirmation with tracking number
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
//                   Delivery updates via SMS/Email
//                 </li>
//               </ul>
//             </div>

//             {/* Shipping Partners */}
//             <div className="bg-card rounded-xl border border-border p-6">
//               <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
//                 <Globe size={20} className="text-primary" />
//                 Our Shipping Partners
//               </h2>
//               <div className="flex flex-wrap gap-3">
//                 {["Delhivery", "Blue Dart", "DTDC", "Ecom Express", "India Post", "XpressBees"].map((partner) => (
//                   <span key={partner} className="px-3 py-1.5 bg-bg-alt rounded-lg text-text-muted text-sm">
//                     {partner}
//                   </span>
//                 ))}
//               </div>
//             </div>

//             {/* International Shipping */}
//             <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-6 border border-border">
//               <h3 className="font-semibold text-text mb-2 flex items-center gap-2">
//                 <Globe size={18} className="text-primary" />
//                 International Shipping
//               </h3>
//               <p className="text-sm text-text-muted">
//                 Currently, we ship only within India. International shipping will be available soon!
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Track Order */}
//         <div className="mt-8 text-center">
//           <p className="text-text-muted">
//             Already placed an order?{" "}
//             <Link to="/dashboard/myorder" className="text-primary hover:underline">
//               Track your order here
//             </Link>
//           </p>
//           <Link to="/" className="btn btn-outline mt-6 inline-flex">
//             Back to Home
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShippingInfo;

import React from "react";
import { Link } from "react-router-dom";
import { Truck, Clock, MapPin, Package, CreditCard, Globe, CheckCircle, ShieldCheck } from "lucide-react";

const ShippingInfo = () => {
  const deliveryTimes = [
    { location: "Metro Cities (Delhi, Mumbai, Bangalore, Chennai)", time: "2-3 business days", icon: Clock },
    { location: "Tier 2 Cities (Pune, Ahmedabad, Jaipur, etc.)", time: "3-4 business days", icon: Clock },
    { location: "Tier 3 Cities & Towns", time: "4-6 business days", icon: Clock },
    { location: "Remote Areas", time: "6-8 business days", icon: Clock }
  ];

  const shippingRates = [
    { amount: "Below ₹999", rate: "₹50", free: false },
    { amount: "₹999 and above", rate: "FREE", free: true }
  ];

  const processingSteps = [
    { step: "Order Confirmation", description: "Email sent immediately after purchase", icon: CheckCircle },
    { step: "Processing", description: "Within 24 hours of order confirmation", icon: Package },
    { step: "Shipping", description: "Tracking number provided via email", icon: Truck },
    { step: "Delivery", description: "Updates via SMS/Email", icon: Clock }
  ];

  const shippingPartners = [
    { name: "Delhivery", color: "bg-orange-50 text-orange-700" },
    { name: "Blue Dart", color: "bg-blue-50 text-blue-700" },
    { name: "DTDC", color: "bg-green-50 text-green-700" },
    { name: "Ecom Express", color: "bg-purple-50 text-purple-700" },
    { name: "India Post", color: "bg-red-50 text-red-700" },
    { name: "XpressBees", color: "bg-yellow-50 text-yellow-700" }
  ];

  return (
    <div className="min-h-screen bg-bg fade-in">
      <div className="container-narrow px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 mb-4 animate-float">
            <Truck className="w-10 h-10 text-primary" aria-hidden="true" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold gradient-text mb-3">
            Shipping Information
          </h1>
          <p className="text-text-muted max-w-md mx-auto">
            Fast, reliable delivery across India with real-time tracking
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Delivery Time */}
            <div className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow duration-300">
              <h2 className="text-xl font-semibold text-text mb-5 flex items-center gap-2">
                <Clock size={20} className="text-primary" aria-hidden="true" />
                Delivery Time
              </h2>
              <div className="space-y-1">
                {deliveryTimes.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={index} 
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 border-b border-border last:border-0 gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <Icon size={14} className="text-text-muted" aria-hidden="true" />
                        <span className="text-text-muted text-sm">{item.location}</span>
                      </div>
                      <span className="font-semibold text-primary text-sm ml-0 sm:ml-4">
                        {item.time}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipping Rates */}
            <div className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow duration-300">
              <h2 className="text-xl font-semibold text-text mb-5 flex items-center gap-2">
                <CreditCard size={20} className="text-primary" aria-hidden="true" />
                Shipping Rates
              </h2>
              <div className="space-y-3">
                {shippingRates.map((item, index) => (
                  <div 
                    key={index} 
                    className={`flex justify-between items-center py-3 px-4 rounded-lg transition-all ${
                      item.free ? 'bg-success/5 border border-success/20' : 'bg-bg-alt'
                    }`}
                  >
                    <span className="text-text-muted text-sm">Order {item.amount}</span>
                    <span className={`font-bold text-sm ${
                      item.free ? 'text-success' : 'text-text'
                    }`}>
                      {item.rate}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
                <p className="text-xs text-text-muted flex items-center gap-1">
                  <ShieldCheck size={12} className="text-primary" />
                  Free shipping automatically applied at checkout for eligible orders
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Order Processing */}
            <div className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow duration-300">
              <h2 className="text-xl font-semibold text-text mb-5 flex items-center gap-2">
                <Package size={20} className="text-primary" aria-hidden="true" />
                Order Processing
              </h2>
              <div className="space-y-4">
                {processingSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon size={14} className="text-primary" />
                        </div>
                        {index < processingSteps.length - 1 && (
                          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-border" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-text text-sm">{step.step}</h4>
                        <p className="text-xs text-text-muted">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipping Partners */}
            <div className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow duration-300">
              <h2 className="text-xl font-semibold text-text mb-5 flex items-center gap-2">
                <Globe size={20} className="text-primary" aria-hidden="true" />
                Our Shipping Partners
              </h2>
              <div className="flex flex-wrap gap-3">
                {shippingPartners.map((partner) => (
                  <span 
                    key={partner.name} 
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:scale-105 ${partner.color}`}
                  >
                    {partner.name}
                  </span>
                ))}
              </div>
              <p className="text-xs text-text-muted mt-4 flex items-center gap-1">
                <CheckCircle size={12} className="text-success" />
                All partners are verified and trusted
              </p>
            </div>

            {/* International Shipping Notice */}
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-6 border border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-2xl"></div>
              <h3 className="font-semibold text-text mb-2 flex items-center gap-2">
                <Globe size={18} className="text-primary" aria-hidden="true" />
                International Shipping
              </h3>
              <p className="text-sm text-text-muted mb-3">
                Currently, we ship only within India. We're expanding globally!
              </p>
              <div className="flex items-center gap-2 text-xs text-primary">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                International shipping coming soon
              </div>
            </div>
          </div>
        </div>

        {/* Track Order Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="bg-bg-alt rounded-xl p-6 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <h3 className="font-semibold text-text mb-1">Already placed an order?</h3>
                <p className="text-sm text-text-muted">Track your order status in real-time</p>
              </div>
              <div className="flex gap-3">
                <Link 
                  to="/dashboard/myorder" 
                  className="btn-primary px-5 py-2 rounded-lg flex items-center gap-2 text-sm"
                >
                  <MapPin size={16} />
                  Track Order
                </Link>
                <Link 
                  to="/" 
                  className="btn-outline px-5 py-2 rounded-lg text-sm"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Hint */}
        <div className="mt-6 text-center">
          <p className="text-xs text-text-muted">
            Have questions? Visit our <Link to="/contact" className="text-primary hover:underline">Contact Us</Link> page
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;