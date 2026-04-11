import React from "react";
import { Link } from "react-router-dom";
import { Truck, Clock, MapPin, Package, CreditCard, Globe } from "lucide-react";

const ShippingInfo = () => {
  const deliveryTimes = [
    { location: "Metro Cities (Delhi, Mumbai, Bangalore, Chennai)", time: "2-3 business days" },
    { location: "Tier 2 Cities (Pune, Ahmedabad, Jaipur, etc.)", time: "3-4 business days" },
    { location: "Tier 3 Cities & Towns", time: "4-6 business days" },
    { location: "Remote Areas", time: "6-8 business days" }
  ];

  const shippingRates = [
    { amount: "Below ₹999", rate: "₹50" },
    { amount: "₹999 and above", rate: "FREE" }
  ];

  return (
    <div className="min-h-screen bg-bg fade-in">
      <div className="container-narrow px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Truck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold gradient-text mb-3">
            Shipping Information
          </h1>
          <p className="text-text-muted">
            Learn about our shipping policies and delivery times
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Delivery Time */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
                <Clock size={20} className="text-primary" />
                Delivery Time
              </h2>
              <div className="space-y-3">
                {deliveryTimes.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                    <span className="text-text-muted text-sm">{item.location}</span>
                    <span className="font-medium text-text text-sm">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Rates */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
                <CreditCard size={20} className="text-primary" />
                Shipping Rates
              </h2>
              <div className="space-y-3">
                {shippingRates.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                    <span className="text-text-muted text-sm">Order {item.amount}</span>
                    <span className="font-medium text-text text-sm">{item.rate}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-text-muted mt-4">
                * Free shipping automatically applied at checkout
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Order Processing */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
                <Package size={20} className="text-primary" />
                Order Processing
              </h2>
              <p className="text-text-muted mb-3">
                Orders are processed within 24 hours of confirmation. You'll receive:
              </p>
              <ul className="space-y-2 text-text-muted text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Order confirmation email immediately
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Shipping confirmation with tracking number
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Delivery updates via SMS/Email
                </li>
              </ul>
            </div>

            {/* Shipping Partners */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
                <Globe size={20} className="text-primary" />
                Our Shipping Partners
              </h2>
              <div className="flex flex-wrap gap-3">
                {["Delhivery", "Blue Dart", "DTDC", "Ecom Express", "India Post", "XpressBees"].map((partner) => (
                  <span key={partner} className="px-3 py-1.5 bg-bg-alt rounded-lg text-text-muted text-sm">
                    {partner}
                  </span>
                ))}
              </div>
            </div>

            {/* International Shipping */}
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-6 border border-border">
              <h3 className="font-semibold text-text mb-2 flex items-center gap-2">
                <Globe size={18} className="text-primary" />
                International Shipping
              </h3>
              <p className="text-sm text-text-muted">
                Currently, we ship only within India. International shipping will be available soon!
              </p>
            </div>
          </div>
        </div>

        {/* Track Order */}
        <div className="mt-8 text-center">
          <p className="text-text-muted">
            Already placed an order?{" "}
            <Link to="/dashboard/myorder" className="text-primary hover:underline">
              Track your order here
            </Link>
          </p>
          <Link to="/" className="btn btn-outline mt-6 inline-flex">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;