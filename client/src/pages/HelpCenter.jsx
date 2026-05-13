
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

        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="w-full flex items-center justify-between p-3 bg-card rounded-xl border border-border"
          >
            <span className="flex items-center gap-2">
              {ActiveIcon && <ActiveIcon size={16} className="text-primary" />}
              <span className="text-sm">{activeCategoryData?.name}</span>
            </span>
            <span>{showMobileMenu ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
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