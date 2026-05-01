import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, FileText, Clock, CreditCard, Truck, RefreshCw, ChevronUp, Mail, Calendar } from "lucide-react";

const TermsAndConditions = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  const sections = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      content: "By accessing and using BuyZaar, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our website.",
      icon: Shield
    },
    {
      id: "account",
      title: "2. Account Registration",
      content: "You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials.",
      icon: Shield
    },
    {
      id: "products",
      title: "3. Product Information",
      content: "We strive to display accurate product information, but we do not warrant that product descriptions, images, or prices are error-free.",
      icon: FileText
    },
    {
      id: "pricing",
      title: "4. Pricing and Payments",
      content: "All prices are in Indian Rupees (INR) and include applicable taxes. We reserve the right to change prices without notice.",
      icon: CreditCard
    },
    {
      id: "orders",
      title: "5. Orders and Cancellations",
      content: "We reserve the right to cancel any order due to stock unavailability, pricing errors, or suspected fraudulent activity.",
      icon: RefreshCw
    },
    {
      id: "shipping",
      title: "6. Shipping and Delivery",
      content: "Delivery times are estimates and not guaranteed. We are not responsible for delays caused by third-party courier services.",
      icon: Truck
    },
    {
      id: "returns",
      title: "7. Returns and Refunds",
      content: "Please refer to our Return Policy for detailed information about returns and refunds.",
      icon: RefreshCw
    },
    {
      id: "intellectual",
      title: "8. Intellectual Property",
      content: "All content on this website, including logos, images, and text, is our property and protected by copyright laws.",
      icon: Shield
    },
    {
      id: "liability",
      title: "9. Limitation of Liability",
      content: "We are not liable for any indirect, incidental, or consequential damages arising from your use of our website.",
      icon: Clock
    },
    {
      id: "governing",
      title: "10. Governing Law",
      content: "These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Aligarh, Uttar Pradesh.",
      icon: Clock
    }
  ];

  // Back to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-bg fade-in">
      <div className="container-narrow px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 mb-4 animate-float">
            <FileText className="w-10 h-10 text-primary" aria-hidden="true" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold gradient-text mb-3">
            Terms & Conditions
          </h1>
          <div className="flex items-center justify-center gap-3 text-sm text-text-muted">
            <span className="flex items-center gap-1">
              <Calendar size={14} aria-hidden="true" />
              Last updated: {lastUpdated}
            </span>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="bg-card rounded-xl border border-border p-5 md:p-6 mb-8 sticky top-20 z-10 bg-card/95 backdrop-blur-sm">
          <h2 className="font-semibold text-text mb-4 flex items-center gap-2">
            <Shield size={18} className="text-primary" aria-hidden="true" />
            Quick Navigation
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="text-left text-sm px-2 py-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-primary/5 transition-all"
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Terms Content */}
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="divide-y divide-border">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <div 
                  key={section.id} 
                  id={section.id} 
                  className="p-5 md:p-6 scroll-mt-24 hover:bg-bg-alt/30 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon size={16} className="text-primary" aria-hidden="true" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-text mb-2">
                        {section.title}
                      </h2>
                      <p className="text-text-muted leading-relaxed text-sm md:text-base">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-8 text-center">
          <div className="bg-bg-alt rounded-xl p-6">
            <p className="text-text-muted mb-4">
              For questions about these Terms, please contact us
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a 
                href="mailto:support@buyzaar.com" 
                className="btn-primary px-5 py-2 rounded-lg inline-flex items-center gap-2 text-sm"
              >
                <Mail size={16} />
                support@buyzaar.com
              </a>
              <Link 
                to="/" 
                className="btn-outline px-5 py-2 rounded-lg inline-flex items-center gap-2 text-sm"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-[11px] text-text-muted">
            By continuing to use BuyZaar, you acknowledge that you have read and agree to these Terms and Conditions.
          </p>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-primary text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
          aria-label="Back to top"
        >
          <ChevronUp size={20} aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

export default TermsAndConditions;