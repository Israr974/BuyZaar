// // import React, { useState } from "react";
// // import { 
// //   HelpCircle, Package, CreditCard, Truck, RefreshCw, 
// //   User, MessageCircle, Phone, Mail, ChevronRight,
// //   Search, Clock, Shield, Star, ThumbsUp, Facebook,
// //   Twitter, Youtube, Instagram, Headphones, FileText,
// //   ChevronDown, ChevronUp, AlertCircle, CheckCircle,
// //   Globe, Lock, Smartphone, ShoppingBag, MapPin
// // } from "lucide-react";

// // const HelpCenter = () => {
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [expandedFaq, setExpandedFaq] = useState(null);
// //   const [activeCategory, setActiveCategory] = useState("all");

// //   const categories = [
// //     { id: "all", name: "All Topics", icon: HelpCircle, color: "primary" },
// //     { id: "orders", name: "Orders", icon: Package, color: "blue" },
// //     { id: "payments", name: "Payments", icon: CreditCard, color: "green" },
// //     { id: "delivery", name: "Delivery", icon: Truck, color: "orange" },
// //     { id: "returns", name: "Returns", icon: RefreshCw, color: "red" },
// //     { id: "account", name: "Account", icon: User, color: "purple" },
// //   ];

// //   const faqs = [
// //     {
// //       id: 1,
// //       category: "orders",
// //       question: "How do I track my order?",
// //       answer: "You can track your order from 'My Orders' section in your account dashboard. You'll also receive tracking updates via email and SMS. Once your order is shipped, you'll get a tracking number that you can use to track your package in real-time.",
// //     },
// //     {
// //       id: 2,
// //       category: "orders",
// //       question: "Can I cancel my order after placing it?",
// //       answer: "Yes, you can cancel your order within 1 hour of placing it. Go to 'My Orders', find the order, and click 'Cancel Order'. If the order has already been shipped, you'll need to initiate a return instead.",
// //     },
// //     {
// //       id: 3,
// //       category: "orders",
// //       question: "How do I modify my order?",
// //       answer: "Order modifications are only possible within 30 minutes of placing the order. You can change shipping address, add/remove items, or update payment method. After 30 minutes, please cancel and place a new order.",
// //     },
// //     {
// //       id: 4,
// //       category: "payments",
// //       question: "What payment methods do you accept?",
// //       answer: "We accept Credit/Debit cards (Visa, Mastercard, RuPay), UPI (Google Pay, PhonePe, Paytm), Net Banking (all major banks), Wallets (Paytm, Amazon Pay), and Cash on Delivery (COD).",
// //     },
// //     {
// //       id: 5,
// //       category: "payments",
// //       question: "Is it safe to use my credit card on your site?",
// //       answer: "Yes, all payments are processed through secure payment gateways with 128-bit SSL encryption. We never store your card details on our servers. Our website is PCI-DSS compliant for maximum security.",
// //     },
// //     {
// //       id: 6,
// //       category: "payments",
// //       question: "My payment failed but money is deducted. What to do?",
// //       answer: "If money is deducted but order is not confirmed, the amount will be automatically refunded within 5-7 business days. If not, please contact our support team with the order details and transaction ID.",
// //     },
// //     {
// //       id: 7,
// //       category: "delivery",
// //       question: "How long does delivery take?",
// //       answer: "Standard delivery takes 3-5 business days. Express delivery takes 1-2 business days. Same-day delivery is available in select cities for orders placed before 12 PM.",
// //     },
// //     {
// //       id: 8,
// //       category: "delivery",
// //       question: "Do you charge for delivery?",
// //       answer: "Free delivery on all orders above ₹499. A nominal shipping fee of ₹40 is charged for orders below ₹499. Express delivery has an additional charge of ₹99.",
// //     },
// //     {
// //       id: 9,
// //       category: "delivery",
// //       question: "Can I change my delivery address?",
// //       answer: "Yes, you can change delivery address within 30 minutes of placing the order. After that, please contact our support team or redirect the package through the courier partner's portal.",
// //     },
// //     {
// //       id: 10,
// //       category: "returns",
// //       question: "What is your return policy?",
// //       answer: "You can return products within 7 days of delivery for a full refund. Products must be unused, in original packaging, with all tags attached. Some products like innerwear, personal care items are non-returnable.",
// //     },
// //     {
// //       id: 11,
// //       category: "returns",
// //       question: "How do I initiate a return?",
// //       answer: "Go to 'My Orders', select the order you want to return, click 'Return Item', select the reason, and schedule a pickup. Our courier partner will collect the item within 2-3 business days.",
// //     },
// //     {
// //       id: 12,
// //       category: "returns",
// //       question: "How long does refund take?",
// //       answer: "Refunds are processed within 5-7 business days after the returned item is verified. For COD orders, refund is credited to your bank account. For prepaid orders, refund goes to original payment method.",
// //     },
// //     {
// //       id: 13,
// //       category: "account",
// //       question: "How do I reset my password?",
// //       answer: "Click on 'Forgot Password' on the login page. Enter your registered email address, and we'll send you a password reset link. Click the link and set a new password.",
// //     },
// //     {
// //       id: 14,
// //       category: "account",
// //       question: "How do I delete my account?",
// //       answer: "Go to Settings > Privacy & Data > Delete Account. Please note that this action is permanent and will delete all your order history, saved addresses, and wishlist items.",
// //     },
// //     {
// //       id: 15,
// //       category: "account",
// //       question: "How do I update my profile information?",
// //       answer: "Go to Settings > Account Information. You can update your name, email address, and phone number. Changes will reflect across all your orders and communications.",
// //     },
// //   ];

// //   const filteredFaqs = faqs.filter(faq => 
// //     (activeCategory === "all" || faq.category === activeCategory) &&
// //     (faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
// //   );

// //   const toggleFaq = (id) => {
// //     setExpandedFaq(expandedFaq === id ? null : id);
// //   };

// //   return (
// //     <div className="min-h-screen bg-bg p-4 md:p-6 lg:p-8">
// //       <div className="container-narrow max-w-4xl mx-auto">
// //         {/* Header */}
// //         <div className="mb-8 text-center">
// //           <div className="flex items-center justify-center gap-3 mb-2">
// //             <div className="w-1 h-8 rounded-full bg-gradient-to-b from-primary to-accent"></div>
// //             <h1 className="text-3xl md:text-4xl font-display font-bold text-text">
// //               Help Center
// //             </h1>
// //           </div>
// //           <p className="text-text-muted">
// //             Find answers, get support, and learn how to use BuyZaar
// //           </p>
// //         </div>

// //         {/* Search Bar */}
// //         <div className="relative max-w-2xl mx-auto mb-10">
// //           <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted" size={20} />
// //           <input
// //             type="text"
// //             placeholder="Search for help..."
// //             value={searchQuery}
// //             onChange={(e) => setSearchQuery(e.target.value)}
// //             className="w-full h-12 pl-12 pr-4 rounded-xl border border-border bg-card text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
// //           />
// //         </div>

// //         {/* Quick Contact Cards */}
// //         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
// //           <div className="bg-card rounded-xl border border-border p-4 text-center hover:shadow-md transition">
// //             <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3">
// //               <Headphones size={24} className="text-primary" />
// //             </div>
// //             <h3 className="font-semibold text-text">24/7 Support</h3>
// //             <p className="text-xs text-text-muted">Always here to help</p>
// //           </div>
// //           <div className="bg-card rounded-xl border border-border p-4 text-center hover:shadow-md transition">
// //             <div className="w-12 h-12 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-3">
// //               <MessageCircle size={24} className="text-green-600" />
// //             </div>
// //             <h3 className="font-semibold text-text">Live Chat</h3>
// //             <p className="text-xs text-text-muted">Instant response</p>
// //           </div>
// //           <div className="bg-card rounded-xl border border-border p-4 text-center hover:shadow-md transition">
// //             <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-3">
// //               <Phone size={24} className="text-blue-600" />
// //             </div>
// //             <h3 className="font-semibold text-text">Call Us</h3>
// //             <p className="text-xs text-text-muted">1800-123-4567</p>
// //           </div>
// //           <div className="bg-card rounded-xl border border-border p-4 text-center hover:shadow-md transition">
// //             <div className="w-12 h-12 mx-auto rounded-full bg-purple-100 flex items-center justify-center mb-3">
// //               <Mail size={24} className="text-purple-600" />
// //             </div>
// //             <h3 className="font-semibold text-text">Email</h3>
// //             <p className="text-xs text-text-muted">support@buyzaar.com</p>
// //           </div>
// //         </div>

// //         {/* Categories */}
// //         <div className="mb-8">
// //           <div className="flex flex-wrap justify-center gap-3">
// //             {categories.map((cat) => {
// //               const Icon = cat.icon;
// //               return (
// //                 <button
// //                   key={cat.id}
// //                   onClick={() => setActiveCategory(cat.id)}
// //                   className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
// //                     activeCategory === cat.id
// //                       ? "bg-primary text-white shadow-md"
// //                       : "bg-card border border-border text-text-muted hover:border-primary hover:text-primary"
// //                   }`}
// //                 >
// //                   <Icon size={16} />
// //                   <span className="text-sm">{cat.name}</span>
// //                 </button>
// //               );
// //             })}
// //           </div>
// //         </div>

// //         {/* FAQ Section */}
// //         <div className="bg-card rounded-xl border border-border overflow-hidden">
// //           <div className="px-6 py-4 border-b border-border bg-bg-alt">
// //             <div className="flex items-center gap-3">
// //               <HelpCircle size={20} className="text-primary" />
// //               <h2 className="font-semibold text-text">Frequently Asked Questions</h2>
// //             </div>
// //             <p className="text-sm text-text-muted mt-1">
// //               {filteredFaqs.length} {filteredFaqs.length === 1 ? "answer" : "answers"} found
// //             </p>
// //           </div>

// //           <div className="divide-y divide-border">
// //             {filteredFaqs.map((faq) => (
// //               <div key={faq.id}>
// //                 <button
// //                   onClick={() => toggleFaq(faq.id)}
// //                   className="w-full px-6 py-4 flex items-center justify-between hover:bg-bg-alt transition text-left"
// //                 >
// //                   <span className="font-medium text-text">{faq.question}</span>
// //                   {expandedFaq === faq.id ? (
// //                     <ChevronUp size={18} className="text-text-muted flex-shrink-0" />
// //                   ) : (
// //                     <ChevronDown size={18} className="text-text-muted flex-shrink-0" />
// //                   )}
// //                 </button>
// //                 {expandedFaq === faq.id && (
// //                   <div className="px-6 pb-4 pt-0">
// //                     <p className="text-text-muted text-sm leading-relaxed">
// //                       {faq.answer}
// //                     </p>
// //                     <div className="flex items-center gap-4 mt-3">
// //                       <button className="text-xs text-text-muted hover:text-primary transition flex items-center gap-1">
// //                         <ThumbsUp size={12} />
// //                         Helpful
// //                       </button>
// //                       <button className="text-xs text-text-muted hover:text-primary transition flex items-center gap-1">
// //                         Need more info
// //                       </button>
// //                     </div>
// //                   </div>
// //                 )}
// //               </div>
// //             ))}
// //           </div>

// //           {filteredFaqs.length === 0 && (
// //             <div className="p-12 text-center">
// //               <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
// //                 <Search size={32} className="text-primary/60" />
// //               </div>
// //               <h3 className="text-lg font-semibold text-text mb-2">No results found</h3>
// //               <p className="text-text-muted text-sm">
// //                 We couldn't find any matches for "{searchQuery}". Try a different search term or contact our support.
// //               </p>
// //             </div>
// //           )}
// //         </div>

// //         {/* Still Need Help */}
// //         <div className="mt-10 p-8 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-border text-center">
// //           <div className="flex flex-col items-center">
// //             <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
// //               <Headphones size={28} className="text-primary" />
// //             </div>
// //             <h3 className="text-xl font-semibold text-text mb-2">Still Need Help?</h3>
// //             <p className="text-text-muted mb-6 max-w-md">
// //               Can't find what you're looking for? Our support team is here to help.
// //             </p>
// //             <div className="flex flex-wrap justify-center gap-4">
// //               <button className="btn btn-primary px-6 py-2 flex items-center gap-2">
// //                 <MessageCircle size={16} />
// //                 Start Live Chat
// //               </button>
// //               <button className="btn btn-outline px-6 py-2 flex items-center gap-2">
// //                 <Mail size={16} />
// //                 Email Support
// //               </button>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Contact Info Footer */}
// //         <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm">
// //           <div className="flex items-center justify-center gap-2 text-text-muted">
// //             <Clock size={14} />
// //             <span>Support: 24/7, All Days</span>
// //           </div>
// //           <div className="flex items-center justify-center gap-2 text-text-muted">
// //             <Phone size={14} />
// //             <span>Toll Free: 1800-123-4567</span>
// //           </div>
// //           <div className="flex items-center justify-center gap-2 text-text-muted">
// //             <Mail size={14} />
// //             <span>Email: support@buyzaar.com</span>
// //           </div>
// //         </div>

// //         {/* Social Links */}
// //         <div className="mt-6 pt-6 border-t border-border text-center">
// //           <p className="text-sm text-text-muted mb-3">Follow us for updates</p>
// //           <div className="flex justify-center gap-4">
// //             <button className="p-2 rounded-full hover:bg-primary/10 transition">
// //               <Facebook size={18} className="text-text-muted hover:text-primary" />
// //             </button>
// //             <button className="p-2 rounded-full hover:bg-primary/10 transition">
// //               <Twitter size={18} className="text-text-muted hover:text-primary" />
// //             </button>
// //             <button className="p-2 rounded-full hover:bg-primary/10 transition">
// //               <Instagram size={18} className="text-text-muted hover:text-primary" />
// //             </button>
// //             <button className="p-2 rounded-full hover:bg-primary/10 transition">
// //               <Youtube size={18} className="text-text-muted hover:text-primary" />
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default HelpCenter;

// import React, { useState } from "react";
// import { 
//   HelpCircle, Package, CreditCard, Truck, RefreshCw, 
//   User, MessageCircle, Phone, Mail, Search,
//   Clock, Headphones, ChevronDown, ChevronUp, ThumbsUp
// } from "lucide-react";

// const HelpCenter = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [expandedFaq, setExpandedFaq] = useState(null);
//   const [activeCategory, setActiveCategory] = useState("all");
//   const [showMobileMenu, setShowMobileMenu] = useState(false);

//   const categories = [
//     { id: "all", name: "All", icon: HelpCircle },
//     { id: "orders", name: "Orders", icon: Package },
//     { id: "payments", name: "Payments", icon: CreditCard },
//     { id: "delivery", name: "Delivery", icon: Truck },
//     { id: "returns", name: "Returns", icon: RefreshCw },
//     { id: "account", name: "Account", icon: User },
//   ];

//   const faqs = [
//     {
//       id: 1,
//       category: "orders",
//       question: "How do I track my order?",
//       answer: "You can track your order from 'My Orders' section in your account dashboard. You'll also receive tracking updates via email and SMS.",
//     },
//     {
//       id: 2,
//       category: "orders",
//       question: "Can I cancel my order?",
//       answer: "Yes, you can cancel your order within 1 hour of placing it. Go to 'My Orders' and click 'Cancel Order'.",
//     },
//     {
//       id: 3,
//       category: "payments",
//       question: "What payment methods do you accept?",
//       answer: "We accept Credit/Debit cards, UPI, Net Banking, Wallets, and Cash on Delivery.",
//     },
//     {
//       id: 4,
//       category: "delivery",
//       question: "How long does delivery take?",
//       answer: "Standard delivery takes 3-5 business days. Express delivery takes 1-2 business days.",
//     },
//     {
//       id: 5,
//       category: "returns",
//       question: "What is your return policy?",
//       answer: "You can return products within 7 days of delivery for a full refund.",
//     },
//     {
//       id: 6,
//       category: "account",
//       question: "How do I reset my password?",
//       answer: "Click on 'Forgot Password' on the login page and follow the instructions.",
//     },
//   ];

//   const filteredFaqs = faqs.filter(faq => 
//     (activeCategory === "all" || faq.category === activeCategory) &&
//     (faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
//      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
//   );

//   const toggleFaq = (id) => {
//     setExpandedFaq(expandedFaq === id ? null : id);
//   };

//   const activeCategoryData = categories.find(c => c.id === activeCategory);
//   const ActiveIcon = activeCategoryData?.icon;

//   return (
//     <div className="min-h-screen bg-bg p-3 md:p-6">
//       <div className="container-narrow max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="mb-6 md:mb-8 text-center">
//           <div className="flex items-center justify-center gap-2 md:gap-3 mb-2">
//             <div className="w-1 h-6 md:h-8 rounded-full bg-gradient-to-b from-primary to-accent"></div>
//             <h1 className="text-xl md:text-3xl font-display font-bold text-text">
//               Help Center
//             </h1>
//           </div>
//           <p className="text-text-muted text-sm">
//             Find answers, get support, and learn how to use BuyZaar
//           </p>
//         </div>

//         {/* Search Bar */}
//         <div className="relative max-w-2xl mx-auto mb-6 md:mb-8">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" size={16} />
//           <input
//             type="text"
//             placeholder="Search for help..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full h-10 md:h-12 pl-9 md:pl-12 pr-4 rounded-xl border border-border bg-card text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
//           />
//         </div>

//         {/* Quick Contact Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-12">
//           <div className="bg-card rounded-xl border border-border p-3 md:p-4 text-center hover:shadow-md transition">
//             <div className="w-10 h-10 md:w-12 md:h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-2 md:mb-3">
//               <Headphones size={18} className="md:w-6 md:h-6 text-primary" />
//             </div>
//             <h3 className="font-semibold text-text text-xs md:text-sm">24/7 Support</h3>
//             <p className="text-[10px] md:text-xs text-text-muted">Always here</p>
//           </div>
//           <div className="bg-card rounded-xl border border-border p-3 md:p-4 text-center hover:shadow-md transition">
//             <div className="w-10 h-10 md:w-12 md:h-12 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-2 md:mb-3">
//               <MessageCircle size={18} className="md:w-6 md:h-6 text-green-600" />
//             </div>
//             <h3 className="font-semibold text-text text-xs md:text-sm">Live Chat</h3>
//             <p className="text-[10px] md:text-xs text-text-muted">Instant reply</p>
//           </div>
//           <div className="bg-card rounded-xl border border-border p-3 md:p-4 text-center hover:shadow-md transition">
//             <div className="w-10 h-10 md:w-12 md:h-12 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-2 md:mb-3">
//               <Phone size={18} className="md:w-6 md:h-6 text-blue-600" />
//             </div>
//             <h3 className="font-semibold text-text text-xs md:text-sm">Call Us</h3>
//             <p className="text-[10px] md:text-xs text-text-muted">1800-123-4567</p>
//           </div>
//           <div className="bg-card rounded-xl border border-border p-3 md:p-4 text-center hover:shadow-md transition">
//             <div className="w-10 h-10 md:w-12 md:h-12 mx-auto rounded-full bg-purple-100 flex items-center justify-center mb-2 md:mb-3">
//               <Mail size={18} className="md:w-6 md:h-6 text-purple-600" />
//             </div>
//             <h3 className="font-semibold text-text text-xs md:text-sm">Email Us</h3>
//             <p className="text-[10px] md:text-xs text-text-muted">support@buyzaar.com</p>
//           </div>
//         </div>

//         {/* Categories - Desktop */}
//         <div className="hidden md:flex flex-wrap justify-center gap-2 md:gap-3 mb-6 md:mb-8">
//           {categories.map((cat) => {
//             const Icon = cat.icon;
//             return (
//               <button
//                 key={cat.id}
//                 onClick={() => setActiveCategory(cat.id)}
//                 className={`flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full transition-all text-xs md:text-sm ${
//                   activeCategory === cat.id
//                     ? "bg-primary text-white shadow-md"
//                     : "bg-card border border-border text-text-muted hover:border-primary hover:text-primary"
//                 }`}
//               >
//                 <Icon size={14} className="md:w-4 md:h-4" />
//                 <span>{cat.name}</span>
//               </button>
//             );
//           })}
//         </div>

//         {/* Categories - Mobile Dropdown */}
//         <div className="md:hidden mb-4">
//           <button
//             onClick={() => setShowMobileMenu(!showMobileMenu)}
//             className="w-full flex items-center justify-between p-3 bg-card rounded-xl border border-border"
//           >
//             <span className="flex items-center gap-2">
//               {ActiveIcon && <ActiveIcon size={16} className="text-primary" />}
//               <span className="text-sm">{activeCategoryData?.name}</span>
//             </span>
//             <span>{showMobileMenu ? "▲" : "▼"}</span>
//           </button>
          
//           {showMobileMenu && (
//             <div className="mt-2 bg-card rounded-xl border border-border overflow-hidden">
//               {categories.map((cat) => {
//                 const Icon = cat.icon;
//                 return (
//                   <button
//                     key={cat.id}
//                     onClick={() => {
//                       setActiveCategory(cat.id);
//                       setShowMobileMenu(false);
//                     }}
//                     className={`w-full flex items-center gap-3 px-4 py-3 transition ${
//                       activeCategory === cat.id
//                         ? "bg-primary/10 text-primary"
//                         : "text-text-muted hover:bg-bg-alt"
//                     }`}
//                   >
//                     <Icon size={16} />
//                     <span className="text-sm">{cat.name}</span>
//                   </button>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         {/* FAQ Section */}
//         <div className="bg-card rounded-xl border border-border overflow-hidden">
//           <div className="px-4 md:px-6 py-3 md:py-4 border-b border-border bg-bg-alt">
//             <div className="flex items-center gap-2 md:gap-3">
//               <HelpCircle size={18} className="text-primary" />
//               <h2 className="font-semibold text-text text-sm md:text-base">Frequently Asked Questions</h2>
//             </div>
//             <p className="text-xs text-text-muted mt-1">
//               {filteredFaqs.length} {filteredFaqs.length === 1 ? "answer" : "answers"} found
//             </p>
//           </div>

//           <div className="divide-y divide-border">
//             {filteredFaqs.map((faq) => (
//               <div key={faq.id}>
//                 <button
//                   onClick={() => toggleFaq(faq.id)}
//                   className="w-full px-4 md:px-6 py-3 md:py-4 flex items-center justify-between hover:bg-bg-alt transition text-left"
//                 >
//                   <span className="font-medium text-text text-sm">{faq.question}</span>
//                   {expandedFaq === faq.id ? (
//                     <ChevronUp size={16} className="text-text-muted flex-shrink-0" />
//                   ) : (
//                     <ChevronDown size={16} className="text-text-muted flex-shrink-0" />
//                   )}
//                 </button>
//                 {expandedFaq === faq.id && (
//                   <div className="px-4 md:px-6 pb-4 pt-0">
//                     <p className="text-text-muted text-xs md:text-sm leading-relaxed">
//                       {faq.answer}
//                     </p>
//                     <div className="flex items-center gap-4 mt-3">
//                       <button className="text-xs text-text-muted hover:text-primary transition flex items-center gap-1">
//                         <ThumbsUp size={12} />
//                         Helpful
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>

//           {filteredFaqs.length === 0 && (
//             <div className="p-8 md:p-12 text-center">
//               <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
//                 <Search size={24} className="md:w-8 md:h-8 text-primary/60" />
//               </div>
//               <h3 className="text-base md:text-lg font-semibold text-text mb-2">No results found</h3>
//               <p className="text-text-muted text-xs md:text-sm">
//                 We couldn't find any matches for "{searchQuery}".
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Still Need Help */}
//         <div className="mt-8 md:mt-10 p-6 md:p-8 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-border text-center">
//           <div className="flex flex-col items-center">
//             <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3 md:mb-4">
//               <Headphones size={20} className="md:w-7 md:h-7 text-primary" />
//             </div>
//             <h3 className="text-base md:text-xl font-semibold text-text mb-2">Still Need Help?</h3>
//             <p className="text-text-muted text-xs md:text-sm mb-4 md:mb-6 max-w-md">
//               Can't find what you're looking for? Our support team is here to help.
//             </p>
//             <div className="flex flex-wrap justify-center gap-3 md:gap-4">
//               <button className="btn btn-primary px-4 md:px-6 py-1.5 md:py-2 text-sm flex items-center gap-1 md:gap-2">
//                 <MessageCircle size={14} />
//                 Live Chat
//               </button>
//               <button className="btn btn-outline px-4 md:px-6 py-1.5 md:py-2 text-sm flex items-center gap-1 md:gap-2">
//                 <Mail size={14} />
//                 Email Support
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Contact Info Footer */}
//         <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 text-center text-xs md:text-sm">
//           <div className="flex items-center justify-center gap-1 md:gap-2 text-text-muted">
//             <Clock size={12} className="md:w-3.5 md:h-3.5" />
//             <span>24/7 Support</span>
//           </div>
//           <div className="flex items-center justify-center gap-1 md:gap-2 text-text-muted">
//             <Phone size={12} className="md:w-3.5 md:h-3.5" />
//             <span>Toll Free: 1800-123-4567</span>
//           </div>
//           <div className="flex items-center justify-center gap-1 md:gap-2 text-text-muted">
//             <Mail size={12} className="md:w-3.5 md:h-3.5" />
//             <span>support@buyzaar.com</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HelpCenter;

import React, { useState } from "react";
import { 
  HelpCircle, Package, CreditCard, Truck, RefreshCw, 
  User, MessageCircle, Phone, Mail, Search,
  Clock, Headphones, ChevronDown, ChevronUp, ThumbsUp
} from "lucide-react";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const categories = [
    { id: "all", name: "All", icon: HelpCircle },
    { id: "orders", name: "Orders", icon: Package },
    { id: "payments", name: "Payments", icon: CreditCard },
    { id: "delivery", name: "Delivery", icon: Truck },
    { id: "returns", name: "Returns", icon: RefreshCw },
    { id: "account", name: "Account", icon: User },
  ];

  const faqs = [
    {
      id: 1,
      category: "orders",
      question: "How do I track my order?",
      answer: "You can track your order from 'My Orders' section in your account dashboard. You'll also receive tracking updates via email and SMS.",
    },
    {
      id: 2,
      category: "orders",
      question: "Can I cancel my order?",
      answer: "Yes, you can cancel your order within 1 hour of placing it. Go to 'My Orders' and click 'Cancel Order'.",
    },
    {
      id: 3,
      category: "payments",
      question: "What payment methods do you accept?",
      answer: "We accept Credit/Debit cards, UPI, Net Banking, Wallets, and Cash on Delivery.",
    },
    {
      id: 4,
      category: "delivery",
      question: "How long does delivery take?",
      answer: "Standard delivery takes 3-5 business days. Express delivery takes 1-2 business days.",
    },
    {
      id: 5,
      category: "returns",
      question: "What is your return policy?",
      answer: "You can return products within 7 days of delivery for a full refund.",
    },
    {
      id: 6,
      category: "account",
      question: "How do I reset my password?",
      answer: "Click on 'Forgot Password' on the login page and follow the instructions.",
    },
  ];

  const filteredFaqs = faqs.filter(faq => 
    (activeCategory === "all" || faq.category === activeCategory) &&
    (faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
     faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const activeCategoryData = categories.find(c => c.id === activeCategory);
  const ActiveIcon = activeCategoryData?.icon;

  return (
    <div className="min-h-screen bg-bg p-3 md:p-6">
      <div className="container-narrow max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8 text-center">
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-2">
            <div className="w-1 h-6 md:h-8 rounded-full bg-gradient-to-b from-primary to-accent"></div>
            <h1 className="text-xl md:text-3xl font-display font-bold text-text">
              Help Center
            </h1>
          </div>
          <p className="text-text-muted text-sm">
            Find answers, get support, and learn how to use BuyZaar
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-6 md:mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" size={16} />
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 md:h-12 pl-9 md:pl-12 pr-4 rounded-xl border border-border bg-card text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-12">
          <div className="bg-card rounded-xl border border-border p-3 md:p-4 text-center hover:shadow-md transition">
            <div className="w-10 h-10 md:w-12 md:h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-2 md:mb-3">
              <Headphones size={18} className="md:w-6 md:h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-text text-xs md:text-sm">24/7 Support</h3>
            <p className="text-[10px] md:text-xs text-text-muted">Always here</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-3 md:p-4 text-center hover:shadow-md transition">
            <div className="w-10 h-10 md:w-12 md:h-12 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-2 md:mb-3">
              <MessageCircle size={18} className="md:w-6 md:h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-text text-xs md:text-sm">Live Chat</h3>
            <p className="text-[10px] md:text-xs text-text-muted">Instant reply</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-3 md:p-4 text-center hover:shadow-md transition">
            <div className="w-10 h-10 md:w-12 md:h-12 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-2 md:mb-3">
              <Phone size={18} className="md:w-6 md:h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-text text-xs md:text-sm">Call Us</h3>
            <p className="text-[10px] md:text-xs text-text-muted">1800-123-4567</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-3 md:p-4 text-center hover:shadow-md transition">
            <div className="w-10 h-10 md:w-12 md:h-12 mx-auto rounded-full bg-purple-100 flex items-center justify-center mb-2 md:mb-3">
              <Mail size={18} className="md:w-6 md:h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-text text-xs md:text-sm">Email Us</h3>
            <p className="text-[10px] md:text-xs text-text-muted">support@buyzaar.com</p>
          </div>
        </div>

        {/* Categories - Desktop */}
        <div className="hidden md:flex flex-wrap justify-center gap-2 md:gap-3 mb-6 md:mb-8">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full transition-all text-xs md:text-sm ${
                  activeCategory === cat.id
                    ? "bg-primary text-white shadow-md"
                    : "bg-card border border-border text-text-muted hover:border-primary hover:text-primary"
                }`}
              >
                <Icon size={14} className="md:w-4 md:h-4" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Categories - Mobile Dropdown */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="w-full flex items-center justify-between p-3 bg-card rounded-xl border border-border"
          >
            <span className="flex items-center gap-2">
              {ActiveIcon && <ActiveIcon size={16} className="text-primary" />}
              <span className="text-sm">{activeCategoryData?.name}</span>
            </span>
            <span>{showMobileMenu ? "▲" : "▼"}</span>
          </button>
          
          {showMobileMenu && (
            <div className="mt-2 bg-card rounded-xl border border-border overflow-hidden">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setShowMobileMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition ${
                      activeCategory === cat.id
                        ? "bg-primary/10 text-primary"
                        : "text-text-muted hover:bg-bg-alt"
                    }`}
                  >
                    <Icon size={16} />
                    <span className="text-sm">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-4 md:px-6 py-3 md:py-4 border-b border-border bg-bg-alt">
            <div className="flex items-center gap-2 md:gap-3">
              <HelpCircle size={18} className="text-primary" />
              <h2 className="font-semibold text-text text-sm md:text-base">Frequently Asked Questions</h2>
            </div>
            <p className="text-xs text-text-muted mt-1">
              {filteredFaqs.length} {filteredFaqs.length === 1 ? "answer" : "answers"} found
            </p>
          </div>

          <div className="divide-y divide-border">
            {filteredFaqs.map((faq) => (
              <div key={faq.id}>
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-4 md:px-6 py-3 md:py-4 flex items-center justify-between hover:bg-bg-alt transition text-left"
                >
                  <span className="font-medium text-text text-sm">{faq.question}</span>
                  {expandedFaq === faq.id ? (
                    <ChevronUp size={16} className="text-text-muted flex-shrink-0" />
                  ) : (
                    <ChevronDown size={16} className="text-text-muted flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === faq.id && (
                  <div className="px-4 md:px-6 pb-4 pt-0">
                    <p className="text-text-muted text-xs md:text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      <button className="text-xs text-text-muted hover:text-primary transition flex items-center gap-1">
                        <ThumbsUp size={12} />
                        Helpful
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="p-8 md:p-12 text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Search size={24} className="md:w-8 md:h-8 text-primary/60" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-text mb-2">No results found</h3>
              <p className="text-text-muted text-xs md:text-sm">
                We couldn't find any matches for "{searchQuery}".
              </p>
            </div>
          )}
        </div>

        {/* Still Need Help */}
        <div className="mt-8 md:mt-10 p-6 md:p-8 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-border text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3 md:mb-4">
              <Headphones size={20} className="md:w-7 md:h-7 text-primary" />
            </div>
            <h3 className="text-base md:text-xl font-semibold text-text mb-2">Still Need Help?</h3>
            <p className="text-text-muted text-xs md:text-sm mb-4 md:mb-6 max-w-md">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              <button className="btn btn-primary px-4 md:px-6 py-1.5 md:py-2 text-sm flex items-center gap-1 md:gap-2">
                <MessageCircle size={14} />
                Live Chat
              </button>
              <button className="btn btn-outline px-4 md:px-6 py-1.5 md:py-2 text-sm flex items-center gap-1 md:gap-2">
                <Mail size={14} />
                Email Support
              </button>
            </div>
          </div>
        </div>

        {/* Contact Info Footer */}
        <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 text-center text-xs md:text-sm">
          <div className="flex items-center justify-center gap-1 md:gap-2 text-text-muted">
            <Clock size={12} className="md:w-3.5 md:h-3.5" />
            <span>24/7 Support</span>
          </div>
          <div className="flex items-center justify-center gap-1 md:gap-2 text-text-muted">
            <Phone size={12} className="md:w-3.5 md:h-3.5" />
            <span>Toll Free: 1800-123-4567</span>
          </div>
          <div className="flex items-center justify-center gap-1 md:gap-2 text-text-muted">
            <Mail size={12} className="md:w-3.5 md:h-3.5" />
            <span>support@buyzaar.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;