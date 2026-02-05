import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import logo from "../assets/logo2.png";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-2">
            <img src={logo} alt="Logo" className="w-32 mb-4" />
            <p className="text-gray-600 mb-4">
              Your one-stop destination for quality products and exceptional service.
            </p>
            <div className="flex gap-4">
              <a href="#" className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-all">
                <FaFacebook size={18} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-pink-50 hover:text-pink-500 transition-all">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-100 hover:text-blue-700 transition-all">
                <FaLinkedin size={18} />
              </a>
            </div>
          </div>

          
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Shop</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>

          
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-600">
              <li>support@buyzaar.com</li>
              <li>6397378896</li>
              <li>Aligarh</li>
            </ul>
          </div>
        </div>

        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} All Rights Reserved
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;