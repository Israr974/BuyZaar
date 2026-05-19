import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa";
import { MapPin, Phone, Mail, Clock, CreditCard, Truck, Shield, Headphones } from "lucide-react";
import { validateUrlConverter } from "../utils/validateUrl";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const categories = useSelector((state) => state.product.allCategory);

  const quickLinks = [
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
    { name: "FAQs", path: "/faq" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms & Conditions", path: "/terms" },
    { name: "Return Policy", path: "/return-policy" },
    { name: "Shipping Info", path: "/shipping-info" },
  ];

  const shopLinks = [
    { name: "New Arrivals", path: "/search?q=new" },
    { name: "Best Sellers", path: "/search?q=best" },
    { name: "Sale", path: "/search?q=sale" },
    { name: "Wishlist", path: "/dashboard/wishlist" },
    { name: "Track Order", path: "/dashboard/myorder" },
  ];

  const services = [
    { icon: Truck, text: "Free Shipping", subtext: "On orders over ₹999" },
    { icon: Shield, text: "Secure Payment", subtext: "100% secure transactions" },
    { icon: Headphones, text: "24/7 Support", subtext: "Dedicated customer care" },
    { icon: CreditCard, text: "Easy Returns", subtext: "30 days return policy" },
  ];

  const socialLinks = [
    { icon: FaFacebook, href: "#", label: "Facebook" },
    { icon: FaInstagram, href: "#", label: "Instagram" },
    { icon: FaTwitter, href: "#", label: "Twitter" },
    { icon: FaLinkedin, href: "#", label: "LinkedIn" },
    { icon: FaYoutube, href: "#", label: "YouTube" },
  ];

  const paymentMethods = [
    { name: "Visa", url: "https://upload.wikimedia.org/wikipedia/commons/9/98/Visa_Inc._logo_%282005%E2%80%932014%29.svg" },
    { name: "Mastercard", url: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" },
    { name: "PayPal", url: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" },
    { name: "American Express", url: "https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" },
    { name: "RuPay", url: "https://upload.wikimedia.org/wikipedia/commons/archive/d/d1/20111124065039%21RuPay.svg" },
  ];

  const renderSocialLink = ({ icon: Icon, href, label }) => (
    <a 
      key={label}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 rounded-full bg-bg-alt flex items-center justify-center text-text-muted hover:bg-primary hover:text-white transition-all duration-300"
      aria-label={label}
    >
      <Icon size={16} />
    </a>
  );

  const renderNavLink = (name, path) => (
    <li key={name}>
      <Link
        to={path}
        className="text-text-muted hover:text-primary transition-colors text-sm flex items-center gap-2 group"
      >
        <span className="w-1 h-1 rounded-full bg-primary/0 group-hover:bg-primary transition-all"></span>
        {name}
      </Link>
    </li>
  );

  const renderCategoryLink = (category) => (
    <li key={category._id}>
      <Link
        to={`/${validateUrlConverter(category.name)}-${category._id}/all-all`}
        className="text-text-muted hover:text-primary transition-colors text-sm flex items-center gap-2 group"
      >
        <span className="w-1 h-1 rounded-full bg-primary/0 group-hover:bg-primary transition-all"></span>
        {category.name}
      </Link>
    </li>
  );

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="border-b border-border">
        <div className="container-wide py-8 px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="flex items-center gap-3 group">
                  <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-text">{service.text}</p>
                    <p className="text-xs text-text-muted">{service.subtext}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container-wide py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <h2 className="text-2xl font-bold gradient-text">BuyZaar</h2>
            </Link>
            <p className="text-text-muted text-sm mb-4 leading-relaxed">
              Your one-stop destination for quality products and exceptional service. 
              Shop with confidence and experience the best online shopping.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(renderSocialLink)}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-text mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map(link => renderNavLink(link.name, link.path))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-text mb-4 text-lg">Shop</h3>
            <ul className="space-y-2">
              {shopLinks.map(link => renderNavLink(link.name, link.path))}
            </ul>
          </div>


          <div>
            <h3 className="font-semibold text-text mb-4 text-lg">Categories</h3>
            <ul className="space-y-2">
              {categories?.length > 0 ? (
                categories.slice(0, 6).map(renderCategoryLink)
              ) : (
                <li className="text-text-muted text-sm">Loading categories...</li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-text mb-4 text-lg">Get in Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-text-muted mt-0.5 flex-shrink-0" />
                <span className="text-text-muted text-sm">Maulana Azad Nagar Jamalpur, Aligarh, UP 202001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-text-muted flex-shrink-0" />
                <a href="tel:+916397378896" className="text-text-muted hover:text-primary text-sm transition-colors">
                  +91 63973 78896
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-text-muted flex-shrink-0" />
                <a href="mailto:support@buyzaar.com" className="text-text-muted hover:text-primary text-sm transition-colors">
                  support@buyzaar.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={18} className="text-text-muted flex-shrink-0" />
                <span className="text-text-muted text-sm">Mon - Sat: 9AM - 9PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="font-semibold text-text text-lg">Subscribe to Our Newsletter</h3>
              <p className="text-text-muted text-sm mt-1">Get the latest updates on new products and upcoming sales</p>
            </div>
            <div className="flex w-full md:w-auto gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="input py-2 px-4 text-sm flex-1 md:w-72"
                aria-label="Email for newsletter"
              />
              <button className="btn btn-primary whitespace-nowrap px-6">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-text-muted text-sm text-center md:text-left">
              {currentYear} BuyZaar. All rights reserved
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="text-text-muted hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-text-muted hover:text-primary transition-colors">
                Terms of Use
              </Link>
              <Link to="/sitemap" className="text-text-muted hover:text-primary transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
          <div className="text-center mt-3 sm:mt-4">
  <span className="inline-flex items-center gap-1.5 sm:gap-2 md:gap-3 px-3 sm:px-4 md:px-5 py-1 sm:py-1.5 md:py-2 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
    <span className="text-[10px] sm:text-xs md:text-sm text-gray-500">Made by</span>
    <span className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 dark:text-white">
      Israr 
    </span>
    <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-green-500"></span>
  </span>
</div>
        </div>
      </div>

      <div className="border-t border-border bg-bg-alt">
        <div className="container-wide px-6 py-4">
          <div className="flex flex-wrap justify-center items-center gap-6">
            <span className="text-xs text-text-muted">Secure payments by:</span>
            <div className="flex gap-3">
              {paymentMethods.map(method => (
                <img 
                  key={method.name}
                  src={method.url}
                  alt={method.name}
                  className="h-6 object-contain"
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;