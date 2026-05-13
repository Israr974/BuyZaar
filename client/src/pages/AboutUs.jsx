import React from "react";
import { Link } from "react-router-dom";
import { Shield, Truck, CreditCard, Headphones, Star, Users, Award, Globe } from "lucide-react";
import image from "../assets/AboutUs Image.jpeg";

const AboutUs = () => {
  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "Free delivery on orders above ₹999",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "100% secure payment gateway",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: CreditCard,
      title: "Easy Returns",
      description: "30 days return policy",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Dedicated customer care",
      color: "from-orange-500 to-red-500"
    }
  ];

  const stats = [
    { value: "50K+", label: "Happy Customers", icon: Users },
    { value: "10K+", label: "Products", icon: Star },
    { value: "500+", label: "Brands", icon: Award },
    { value: "25+", label: "Countries", icon: Globe }
  ];

  return (
    <div className="min-h-screen bg-bg">
      <div className="relative bg-gradient-primary text-white py-20">
        <div className="container-narrow px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            About BuyZaar
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Your trusted partner for premium shopping experience since 2024
          </p>
        </div>
      </div>

      <div className="container-narrow px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 rounded-full bg-gradient-to-b from-primary to-accent"></div>
              <h2 className="text-2xl font-display font-bold text-text">Our Story</h2>
            </div>
            <p className="text-text-muted mb-4 leading-relaxed">
              Founded in 2024, BuyZaar started with a simple mission: to provide 
              quality products at affordable prices with exceptional customer service.
            </p>
            <p className="text-text-muted mb-4 leading-relaxed">
              What began as a small online store has grown into a trusted destination 
              for thousands of customers across India. We carefully curate our product 
              selection to ensure only the best quality items reach our customers.
            </p>
            <p className="text-text-muted leading-relaxed">
              Our team is passionate about creating the best shopping experience, 
              from easy navigation to secure checkout and fast delivery.
            </p>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
              <img 
                src={image}
                alt="Our Team"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">Since 2024</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-bg-alt py-16">
        <div className="container-narrow px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-3xl font-bold gradient-text">{stat.value}</p>
                  <p className="text-text-muted text-sm">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container-narrow px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-text mb-3">
            Why Choose BuyZaar?
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            We're committed to providing the best shopping experience possible
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-card rounded-xl border border-border p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
                <div className={`w-14 h-14 mx-auto rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold text-text mb-2">{feature.title}</h3>
                <p className="text-sm text-text-muted">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary/5 to-accent/5 py-16">
        <div className="container-narrow px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card rounded-xl border border-border p-8 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-text mb-3">Our Mission</h3>
              <p className="text-text-muted">
                To democratize online shopping by providing quality products at 
                affordable prices with exceptional customer service.
              </p>
            </div>
            <div className="bg-card rounded-xl border border-border p-8 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <Globe className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-text mb-3">Our Vision</h3>
              <p className="text-text-muted">
                To become India's most trusted e-commerce platform, known for 
                quality, reliability, and customer satisfaction.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-narrow px-4 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-text mb-4">
          Ready to Start Shopping?
        </h2>
        <p className="text-text-muted mb-6 max-w-md mx-auto">
          Join thousands of happy customers who shop with us every day
        </p>
        <Link to="/" className="btn btn-primary px-8 py-3">
          Shop Now
        </Link>
      </div>
    </div>
  );
};

export default AboutUs;