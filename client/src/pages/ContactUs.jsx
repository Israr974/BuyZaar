// import React, { useState } from "react";
// import { Mail,Link, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";
// import toast from "react-hot-toast";

// const ContactUs = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     subject: "",
//     message: ""
//   });
//   const [submitting, setSubmitting] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
    
//     // Simulate API call
//     setTimeout(() => {
//       toast.success("Message sent successfully! We'll get back to you soon.");
//       setFormData({ name: "", email: "", subject: "", message: "" });
//       setSubmitting(false);
//     }, 1000);
//   };

//   const contactInfo = [
//     {
//       icon: Phone,
//       title: "Phone",
//       details: ["+91 63973 78896"],
//       color: "from-blue-500 to-cyan-500"
//     },
//     {
//       icon: Mail,
//       title: "Email",
//       details: ["support@buyzaar.com", "careers@buyzaar.com"],
//       color: "from-green-500 to-emerald-500"
//     },
//     {
//       icon: MapPin,
//       title: "Address",
//       details: ["Maulana Azad Nagar Jamalpur, Aligarh", "Uttar Pradesh, India - 202001"],
//       color: "from-purple-500 to-pink-500"
//     },
//     {
//       icon: Clock,
//       title: "Business Hours",
//       details: ["Monday - Saturday: 9AM - 9PM", "Sunday: 10AM - 6PM"],
//       color: "from-orange-500 to-red-500"
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-bg fade-in">
//       {/* Hero Section */}
//       <div className="relative bg-gradient-primary text-white py-16">
//         <div className="container-narrow px-4 text-center">
//           <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
//             Contact Us
//           </h1>
//           <p className="text-white/90 max-w-2xl mx-auto">
//             Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
//           </p>
//         </div>
//       </div>

//       <div className="container-narrow px-4 py-12">
//         <div className="grid lg:grid-cols-2 gap-12">
//           {/* Contact Form */}
//           <div className="bg-card rounded-xl border border-border p-6 md:p-8">
//             <h2 className="text-2xl font-display font-bold text-text mb-6">
//               Send us a Message
//             </h2>
            
//             <form onSubmit={handleSubmit} className="space-y-5">
//               <div>
//                 <label className="block text-sm font-medium text-text mb-2">
//                   Your Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                   className="input w-full"
//                   placeholder="John Doe"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-text mb-2">
//                   Email Address *
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                   className="input w-full"
//                   placeholder="john@example.com"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-text mb-2">
//                   Subject *
//                 </label>
//                 <input
//                   type="text"
//                   name="subject"
//                   value={formData.subject}
//                   onChange={handleChange}
//                   required
//                   className="input w-full"
//                   placeholder="How can we help?"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-text mb-2">
//                   Message *
//                 </label>
//                 <textarea
//                   name="message"
//                   value={formData.message}
//                   onChange={handleChange}
//                   required
//                   rows={5}
//                   className="input w-full resize-none"
//                   placeholder="Tell us more about your inquiry..."
//                 />
//               </div>
              
//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className="btn btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50"
//               >
//                 {submitting ? (
//                   <>
//                     <div className="spinner w-4 h-4"></div>
//                     Sending...
//                   </>
//                 ) : (
//                   <>
//                     <Send size={18} />
//                     Send Message
//                   </>
//                 )}
//               </button>
//             </form>
//           </div>

//           {/* Contact Information */}
//           <div className="space-y-6">
//             <h2 className="text-2xl font-display font-bold text-text">
//               Get in Touch
//             </h2>
//             <p className="text-text-muted">
//               We're here to help! Reach out to us through any of these channels.
//             </p>
            
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {contactInfo.map((info, index) => (
//                 <div key={index} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all">
//                   <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${info.color} flex items-center justify-center mb-3`}>
//                     <info.icon className="w-6 h-6 text-white" />
//                   </div>
//                   <h3 className="font-semibold text-text mb-2">{info.title}</h3>
//                   {info.details.map((detail, i) => (
//                     <p key={i} className="text-sm text-text-muted">{detail}</p>
//                   ))}
//                 </div>
//               ))}
//             </div>

//             {/* Map */}
//             <div className="bg-card rounded-xl border border-border overflow-hidden">
//               <div className="h-64 bg-bg-alt flex items-center justify-center">
//                 <div className="text-center">
//                   <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
//                   <p className="text-text-muted">Map View Coming Soon</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* FAQ Link */}
//         <div className="mt-12 text-center">
//           <p className="text-text-muted">
//             Check our <Link to="/faq" className="text-primary hover:underline">FAQ page</Link> for quick answers to common questions.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContactUs;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import toast from "react-hot-toast";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    setTimeout(() => {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setSubmitting(false);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+91 63973 78896"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["support@buyzaar.com", "careers@buyzaar.com"],
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: MapPin,
      title: "Address",
      details: ["Maulana Azad Nagar Jamalpur, Aligarh", "Uttar Pradesh, India - 202001"],
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Monday - Saturday: 9AM - 9PM", "Sunday: 10AM - 6PM"],
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <div className="relative bg-gradient-primary text-white py-16">
        <div className="container-narrow px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
            Contact Us
          </h1>
          <p className="text-white/90 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      <div className="container-narrow px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-card rounded-xl border border-border p-6 md:p-8">
            <h2 className="text-2xl font-display font-bold text-text mb-6">
              Send us a Message
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input w-full"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input w-full"
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="input w-full"
                  placeholder="How can we help?"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="input w-full resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>
              
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-text">
              Get in Touch
            </h2>
            <p className="text-text-muted">
              We're here to help! Reach out to us through any of these channels.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div key={index} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${info.color} flex items-center justify-center mb-3`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-text mb-2">{info.title}</h3>
                    {info.details.map((detail, i) => (
                      <p key={i} className="text-sm text-text-muted">{detail}</p>
                    ))}
                  </div>
                );
              })}
            </div>

            {/* Map */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="h-64 bg-bg-alt flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
                  <p className="text-text-muted">Map View Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Link */}
        <div className="mt-12 text-center">
          <p className="text-text-muted">
            Check our <Link to="/faq" className="text-primary hover:underline">FAQ page</Link> for quick answers to common questions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;