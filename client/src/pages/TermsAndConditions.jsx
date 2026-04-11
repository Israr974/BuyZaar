import React from "react";
import { Link } from "react-router-dom";
import { Shield, FileText, Clock, CreditCard, Truck, RefreshCw } from "lucide-react";

const TermsAndConditions = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using BuyZaar, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our website."
    },
    {
      title: "2. Account Registration",
      content: "You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials."
    },
    {
      title: "3. Product Information",
      content: "We strive to display accurate product information, but we do not warrant that product descriptions, images, or prices are error-free."
    },
    {
      title: "4. Pricing and Payments",
      content: "All prices are in Indian Rupees (INR) and include applicable taxes. We reserve the right to change prices without notice."
    },
    {
      title: "5. Orders and Cancellations",
      content: "We reserve the right to cancel any order due to stock unavailability, pricing errors, or suspected fraudulent activity."
    },
    {
      title: "6. Shipping and Delivery",
      content: "Delivery times are estimates and not guaranteed. We are not responsible for delays caused by third-party courier services."
    },
    {
      title: "7. Returns and Refunds",
      content: "Please refer to our Return Policy for detailed information about returns and refunds."
    },
    {
      title: "8. Intellectual Property",
      content: "All content on this website, including logos, images, and text, is our property and protected by copyright laws."
    },
    {
      title: "9. Limitation of Liability",
      content: "We are not liable for any indirect, incidental, or consequential damages arising from your use of our website."
    },
    {
      title: "10. Governing Law",
      content: "These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Aligarh, Uttar Pradesh."
    }
  ];

  return (
    <div className="min-h-screen bg-bg fade-in">
      <div className="container-narrow px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold gradient-text mb-3">
            Terms & Conditions
          </h1>
          <p className="text-text-muted">
            Last updated: January 1, 2024
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="bg-card rounded-xl border border-border p-6 mb-8">
          <h2 className="font-semibold text-text mb-4 flex items-center gap-2">
            <Shield size={18} className="text-primary" />
            Quick Navigation
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {sections.map((section, index) => (
              <a
                key={index}
                href={`#section-${index}`}
                className="text-sm text-primary hover:underline"
              >
                {section.title}
              </a>
            ))}
          </div>
        </div>

        {/* Terms Content */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="divide-y divide-border">
            {sections.map((section, index) => (
              <div key={index} id={`section-${index}`} className="p-6">
                <h2 className="text-lg font-semibold text-text mb-3">
                  {section.title}
                </h2>
                <p className="text-text-muted leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-8 text-center">
          <p className="text-text-muted">
            For questions about these Terms, please contact us at{" "}
            <a href="mailto:support@buyzaar.com" className="text-primary hover:underline">
              support@buyzaar.com
            </a>
          </p>
          <Link to="/" className="btn btn-outline mt-6 inline-flex">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;