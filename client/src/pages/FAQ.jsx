import React, { useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Link } from "react-router-dom";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: "Orders",
      questions: [
        {
          q: "How do I place an order?",
          a: "Simply browse products, add items to your cart, proceed to checkout, fill in your details, and complete the payment. You'll receive an order confirmation via email."
        },
        {
          q: "Can I modify my order after placing it?",
          a: "Orders can be modified within 1 hour of placement. Contact our support team immediately with your order ID."
        },
        {
          q: "How do I track my order?",
          a: "Go to 'My Orders' in your dashboard. Click on the order to see real-time tracking status and updates."
        }
      ]
    },
    {
      category: "Payments",
      questions: [
        {
          q: "What payment methods do you accept?",
          a: "We accept Credit/Debit Cards, UPI (Google Pay, PhonePe, Paytm), Net Banking, and Cash on Delivery."
        },
        {
          q: "Is it safe to pay online?",
          a: "Yes! We use 256-bit SSL encryption and PCI compliant payment gateways. Your payment information is completely secure."
        },
        {
          q: "What is Cash on Delivery (COD)?",
          a: "COD allows you to pay in cash when your order is delivered. No online payment required."
        }
      ]
    },
    {
      category: "Shipping & Delivery",
      questions: [
        {
          q: "How long does delivery take?",
          a: "Standard delivery takes 3-5 business days. Metro cities may receive orders in 2-3 days."
        },
        {
          q: "Do you offer free shipping?",
          a: "Yes! Free shipping on all orders above ₹999. Otherwise, a flat ₹50 shipping fee applies."
        },
        {
          q: "Do you ship internationally?",
          a: "Currently, we only ship within India. International shipping coming soon!"
        }
      ]
    },
    {
      category: "Returns & Refunds",
      questions: [
        {
          q: "What is your return policy?",
          a: "We offer 30-day easy returns. Items must be unused, with original tags and packaging."
        },
        {
          q: "How do I initiate a return?",
          a: "Go to 'My Orders', select the order, click 'Return Item', and follow the instructions."
        },
        {
          q: "How long do refunds take?",
          a: "Refunds are processed within 5-7 business days after we receive and inspect the returned item."
        }
      ]
    },
    {
      category: "Account & Security",
      questions: [
        {
          q: "How do I reset my password?",
          a: "Click 'Forgot Password' on the login page. Enter your email to receive an OTP and reset instructions."
        },
        {
          q: "How do I delete my account?",
          a: "Contact our support team to request account deletion. We'll process it within 48 hours."
        }
      ]
    }
  ];

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-white">
      
      <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-white/90 max-w-2xl mx-auto">
            Find answers to common questions about shopping on BuyZaar
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
       
        <div className="max-w-md mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
        </div>

        <div className="space-y-8">
          {filteredFaqs.map((category, catIndex) => (
            <div key={catIndex} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">{category.category}</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {category.questions.map((faq, qIndex) => {
                  const globalIndex = `${catIndex}-${qIndex}`;
                  const isOpen = openIndex === globalIndex;
                  
                  return (
                    <div key={qIndex}>
                      <button
                        onClick={() => toggleQuestion(globalIndex)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-800">{faq.q}</span>
                        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4 text-gray-500 leading-relaxed">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Search className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No results found</h3>
            <p className="text-gray-500">Try different keywords or browse all categories</p>
            <button
              onClick={() => setSearchTerm("")}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-lg mt-6 font-medium hover:shadow-lg transition"
            >
              Clear Search
            </button>
          </div>
        )}

        <div className="mt-12 text-center bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl p-8 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Still have questions?</h3>
          <p className="text-gray-500 mb-4">
            Can't find the answer you're looking for? Please contact our support team.
          </p>
          <Link to="/contact" className="inline-block bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ;