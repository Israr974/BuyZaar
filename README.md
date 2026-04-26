#  BuyZaar - Complete MERN E-Commerce Platform

A production-ready, full-featured e-commerce website built with the MERN stack (MongoDB, Express.js, React, Node.js), featuring Razorpay payments, Cloudinary media management, and Resend email integration. Deployed on Vercel (frontend), Render (backend), and MongoDB Atlas (database).

##  Live URLs (Update after deployment)
- **Frontend:** https://buy-zaar974.vercel.app
- **Backend API:** https://buyzaar-0evg.onrender.com

## Table of Contents
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Local Development Setup](#local-development-setup)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Deployment Guide](#deployment-guide)
- [Payment Integration](#payment-integration)
- [Email Service Setup](#email-service-setup)
- [Image Upload with Cloudinary](#image-upload-with-cloudinary)
- [Common Issues & Solutions](#common-issues--solutions)
- [Performance Optimization](#performance-optimization)
- [Security Best Practices](#security-best-practices)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Cost Breakdown](#cost-breakdown)
- [FAQ](#faq)
- [Support](#support)

##  Tech Stack

### Frontend (Hosted on Vercel)
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM v6** - Routing
- **Axios** - HTTP requests
- **Context API + useReducer** - State management
- **Tailwind CSS** - Styling (optional)
- **Razorpay SDK** - Payment gateway
- **React Hot Toast** - Notifications

### Backend (Hosted on Render)
- **Node.js 20** - Runtime
- **Express.js 4** - Web framework
- **MongoDB + Mongoose 8** - Database and ODM
- **JWT** - Authentication (Access & Refresh tokens)
- **Bcryptjs** - Password hashing
- **Razorpay** - Payment processing
- **Cloudinary** - Image upload and optimization
- **Resend** - Email service
- **Express Validator** - Input validation
- **Express Rate Limit** - Rate limiting
- **Helmet** - Security headers
- **Cookie Parser** - Cookie management
- **Multer** - File upload handling

### Database (MongoDB Atlas)
- **MongoDB Atlas M0 (Free Tier)** - Cloud database
- **Mongoose ODM** - Data modeling
- **Indexes** - Optimized queries
- **Validation** - Schema-level validation

##  Features

### User Features
-  User registration with email verification
-  Login/Logout with JWT authentication
-  Password reset via email
-  Profile management (update name, email, password)
-  Order history tracking
-  Product browsing with search and filters
-  Shopping cart management (add, remove, update quantity)
-  Secure checkout with Razorpay
-  Order confirmation emails
- Responsive design (Mobile/Tablet/Desktop)

### Admin Features
-  Admin dashboard
-  Product management (CRUD operations)
-  Order management (view all orders, update status)
-  User management (view users, change roles, delete)
-  Inventory management
-  Analytics dashboard (coming soon)

### Technical Features
-  JWT access & refresh tokens
-  HTTP-only cookies for security
-  Rate limiting on API endpoints
-  Input sanitization & validation
-  CORS properly configured
-  Error handling middleware
-  Async error handling
-  File upload to Cloudinary
-  Email notifications (Resend API)
-  Payment verification & webhooks


