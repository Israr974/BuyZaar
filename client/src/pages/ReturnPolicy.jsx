import React from "react";
import { Link } from "react-router-dom";
import { RefreshCw, Clock, Package, CreditCard, Shield, AlertCircle } from "lucide-react";

const ReturnPolicy = () => {
  const sections = [
    {
      icon: Clock,
      title: "30-Day Return Window",
      content: "You have 30 days from the date of delivery to initiate a return. Items must be unused, in original packaging, with all tags attached."
    },
    {
      icon: Package,
      title: "Eligible Items",
      content: "Most items are eligible for return except perishable goods, personalized items, intimate apparel, and digital products."
    },
    {
      icon: CreditCard,
      title: "Refund Process",
      content: "Refunds are processed within 5-7 business days after we receive and inspect the returned item. Refunds go to original payment method."
    },
    {
      icon: Shield,
      title: "Return Shipping",
      content: "Free returns for defective or incorrect items. For other returns, shipping charges may apply."
    },
    {
      icon: AlertCircle,
      title: "Non-Returnable Items",
      content: "Gift cards, clearance items, and perishable goods cannot be returned. Please check product descriptions for details."
    }
  ];

  const steps = [
    { step: 1, title: "Request Return", description: "Go to 'My Orders' and click 'Return Item'" },
    { step: 2, title: "Pack Item", description: "Pack item securely with original packaging" },
    { step: 3, title: "Ship Back", description: "Use provided return label or courier" },
    { step: 4, title: "Get Refund", description: "Refund processed after inspection" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <RefreshCw className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-3">
            Return & Refund Policy
          </h1>
          <p className="text-gray-500">
            Last updated: January 1, 2024
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">How to Return an Item</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-3">
                  <span className="text-blue-600 font-bold text-lg">{step.step}</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{step.title}</h3>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {sections.map((section, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <section.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{section.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div>
              <p className="font-medium text-gray-800">How long does it take to get a refund?</p>
              <p className="text-sm text-gray-500">Refunds are processed within 5-7 business days after we receive the returned item.</p>
            </div>
            <div>
              <p className="font-medium text-gray-800">Can I exchange an item instead of returning?</p>
              <p className="text-sm text-gray-500">Yes, we offer exchanges for size or color variations. Contact support for assistance.</p>
            </div>
            <div>
              <p className="font-medium text-gray-800">What if I received a damaged item?</p>
              <p className="text-sm text-gray-500">Contact us immediately with photos. We'll arrange a free replacement or refund.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500">
            For return assistance, contact us at{" "}
            <a href="mailto:returns@buyzaar.com" className="text-blue-600 hover:underline">
              returns@buyzaar.com
            </a>
          </p>
          <Link to="/" className="inline-block mt-6 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:border-blue-600 hover:text-blue-600 transition">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;