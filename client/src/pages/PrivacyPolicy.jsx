import React from "react";
import { Link } from "react-router-dom";
import { Lock, Eye, Database, Shield, Mail, Cookie, UserCheck, Trash2 } from "lucide-react";

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: "We collect personal information including name, email, phone number, address, and payment details when you create an account or place an order."
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: "We use your information to process orders, personalize your experience, improve our services, and send promotional communications (with your consent)."
    },
    {
      icon: Shield,
      title: "Data Security",
      content: "We implement SSL encryption, firewalls, and secure payment gateways to protect your data. We never store complete payment card details."
    },
    {
      icon: Cookie,
      title: "Cookies",
      content: "We use cookies to enhance your browsing experience, remember your preferences, and analyze website traffic. You can disable cookies in browser settings."
    },
    {
      icon: UserCheck,
      title: "Your Rights",
      content: "You have the right to access, correct, or delete your personal data. You can also opt-out of marketing communications at any time."
    },
    {
      icon: Trash2,
      title: "Data Retention",
      content: "We retain your information as long as your account is active or as needed to provide services. You may request account deletion at any time."
    }
  ];

  return (
    <div className="min-h-screen bg-bg fade-in">
      <div className="container-narrow px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Lock className="w-8 h-8 text-primary" aria-hidden="true" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold gradient-text mb-3">
            Privacy Policy
          </h1>
          <p className="text-text-muted">
            Your privacy matters to us. Learn how we protect your data.
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 mb-8">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <p className="text-text-muted leading-relaxed">
              At <strong className="text-primary">BuyZaar</strong>, we are committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when 
              you use our website. Please read this policy carefully.
            </p>
            <span className="text-xs text-text-muted bg-bg-alt px-3 py-1 rounded-full">
              Last updated: January 2025
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {sections.map((section, index) => (
            <div 
              key={`privacy-section-${index}`} 
              className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <section.icon className="w-6 h-6 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-text mb-2">{section.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-6 border border-border">
          <h3 className="font-semibold text-text mb-3 flex items-center gap-2">
            <Mail size={18} className="text-primary" aria-hidden="true" />
            Contact Us
          </h3>
          <p className="text-text-muted text-sm mb-2">
            If you have questions about this Privacy Policy, please contact us:
          </p>
          <ul className="text-text-muted text-sm space-y-1">
            <li> Email: <a href="mailto:privacy@buyzaar.com" className="text-primary hover:underline">privacy@buyzaar.com</a></li>
            <li> Phone: <a href="tel:+916397378896" className="text-primary hover:underline">+91 63973 78896</a></li>
            <li> Address: 123 Shopping Mall, Aligarh, UP 202001</li>
          </ul>
        </div>

        <div className="mt-8 text-center space-x-4">
          <Link to="/" className="btn-primary inline-flex px-6 py-2 rounded-lg">
            Back to Home
          </Link>
          <Link to="/terms" className="btn-outline inline-flex px-6 py-2 rounded-lg">
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;