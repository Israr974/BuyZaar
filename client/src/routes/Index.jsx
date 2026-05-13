import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import OtpVerification from "../pages/otpVerification";
import ResetPassword from "../pages/ResetPassword";
import MobileUser from "../pages/MobileUser";
import Dashboard from "../layout/Dashboard";
import Profile from "../pages/Profile";
import MyOrder from "../pages/MyOrder";
import Address from "../pages/Address";
import Category from "../pages/Category"
import SubCategory from "../pages/SubCategory"
import UploadProduct from "../pages/UploadProduct"
import ProductAdmin from "../pages/ProductAdmin"
import { AdminPermission } from "../components/AdminPermission";
import ProductList from "../pages/ProductList";
import ProductDisplayPage from "../pages/ProductDisplayPage";
import CheckOutPage from "../pages/CheckOutPage";
import DeliveryAddress from "../pages/DeliveryAddress";
import CODPayment from "../pages/CODPayment";
import CardPayment from "../pages/CardPayment";
import UPIPayment from "../pages/UPIPayment";
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentFail from "../pages/PaymentFail";
import Orders from "../pages/Orders";
import RequireAuth from "../components/RequireAuth";
import Wishlist from "../pages/Wishlist";
import AboutUs from "../pages/AboutUs";
import ContactUs from "../pages/ContactUs";
import FAQ from "../pages/FAQ";
import TermsAndConditions from "../pages/TermsAndConditions";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import ReturnPolicy from "../pages/ReturnPolicy";
import ShippingInfo from "../pages/ShippingInfo";
import Setting from "../pages/Setting"
import HelpCenter from "../pages/HelpCenter"
import FlashSalePage from "../pages/FlashSalePage";

const ROUTES = {

  HOME: "/",
  SEARCH: "/search",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  VERIFY_OTP: "/verify-otp",
  RESET_PASSWORD: "/reset-password",
  USER_MOBILE: "/user",
  

  PRODUCT: "/product/:product",
  CATEGORY: "/:category",
  CATEGORY_SUBCATEGORY: "/:category/:subcategory",
  

  CHECKOUT: "/checkout",
  PAYMENT_COD: "/payment/cod",
  PAYMENT_CARD: "/payment/card",
  PAYMENT_UPI: "/payment/upi",
  PAYMENT_SUCCESS: "/payment/success",
  PAYMENT_FAIL: "/payment/fail",
  
  DASHBOARD: "/dashboard",
  DASHBOARD_PROFILE: "/dashboard/profile",
  DASHBOARD_MYORDERS: "/dashboard/myorder",
  DASHBOARD_ADDRESS: "/dashboard/address",
  DASHBOARD_WISHLIST: "/dashboard/wishlist",
  DASHBOARD_SETTINGS: "/dashboard/setting",
  DASHBOARD_HELP: "/dashboard/help",
  
  ADMIN_CATEGORY: "/dashboard/category",
  ADMIN_SUBCATEGORY: "/dashboard/subcategory",
  ADMIN_UPLOAD_PRODUCT: "/dashboard/uploadproduct",
  ADMIN_PRODUCTS: "/dashboard/product",
  ADMIN_ORDERS: "/dashboard/order",
  
  ABOUT: "/about",
  CONTACT: "/contact",
  FAQ: "/faq",
  TERMS: "/terms",
  PRIVACY: "/privacy",
  RETURN_POLICY: "/return-policy",
  SHIPPING_INFO: "/shipping-info",
};


const publicRoutes = [
  { path: ROUTES.HOME, element: <Home /> },
  { path: ROUTES.SEARCH, element: <SearchPage /> },
  { path: ROUTES.LOGIN, element: <Login /> },
  { path: ROUTES.REGISTER, element: <Register /> },
  { path: ROUTES.FORGOT_PASSWORD, element: <ForgotPassword /> },
  { path: ROUTES.VERIFY_OTP, element: <OtpVerification /> },
  { path: ROUTES.RESET_PASSWORD, element: <ResetPassword /> },
  { path: ROUTES.USER_MOBILE, element: <MobileUser /> },
];


const productRoutes = [
  { path: ROUTES.PRODUCT, element: <ProductDisplayPage /> },
  { path: ROUTES.CATEGORY, children: [
    { path: ":subcategory", element: <ProductList /> },
    
  ]},
  {path:"/flash-sale", element:<FlashSalePage />}
];

const checkoutRoutes = [
  { path: ROUTES.CHECKOUT, element: <RequireAuth><CheckOutPage /></RequireAuth> },
  { path: ROUTES.PAYMENT_COD, element: <RequireAuth><CODPayment /></RequireAuth> },
  { path: ROUTES.PAYMENT_CARD, element: <CardPayment /> },
  { path: ROUTES.PAYMENT_UPI, element: <UPIPayment /> },
  { path: ROUTES.PAYMENT_SUCCESS, element: <PaymentSuccess /> },
  { path: ROUTES.PAYMENT_FAIL, element: <PaymentFail /> },
];


const infoRoutes = [
  { path: ROUTES.ABOUT, element: <AboutUs /> },
  { path: ROUTES.CONTACT, element: <ContactUs /> },
  { path: ROUTES.FAQ, element: <FAQ /> },
  { path: ROUTES.TERMS, element: <TermsAndConditions /> },
  { path: ROUTES.PRIVACY, element: <PrivacyPolicy /> },
  { path: ROUTES.RETURN_POLICY, element: <ReturnPolicy /> },
  { path: ROUTES.SHIPPING_INFO, element: <ShippingInfo /> },
];


const dashboardChildren = [
  { path: "profile", element: <Profile /> },
  { path: "myorder", element: <MyOrder /> },
  { path: "address", element: <Address /> },
  { path: "wishlist", element: <Wishlist /> },
  { path: "setting", element: <Setting /> },
  { path: "help", element: <HelpCenter /> },
  

  { path: "category", element: <AdminPermission><Category /></AdminPermission> },
  { path: "order", element: <AdminPermission><Orders /></AdminPermission> },
  { path: "subcategory", element: <AdminPermission><SubCategory /></AdminPermission> },
  { path: "uploadproduct", element: <AdminPermission><UploadProduct /></AdminPermission> },
  { path: "product", element: <AdminPermission><ProductAdmin /></AdminPermission> },
];

const ErrorBoundary = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-text mb-4">404</h1>
        <p className="text-text-muted mb-6">Page not found</p>
        <a href="/" className="btn-primary px-6 py-2 rounded-lg">
          Go Home
        </a>
      </div>
    </div>
  );
};


const redirects = [
  { path: "/admin", element: <Navigate to="/dashboard" replace /> },
  { path: "/account", element: <Navigate to="/dashboard/profile" replace /> },
  { path: "/cart", element: <Navigate to="/checkout" replace /> },
];

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      
      ...publicRoutes,
      
      
      ...productRoutes,
      
    
      ...checkoutRoutes,
      
    
      ...infoRoutes,
      
      
      ...redirects,
      
    
      {
        path: ROUTES.DASHBOARD,
        element: <RequireAuth><Dashboard /></RequireAuth>,
        children: dashboardChildren,
      },
    ],
  },

  {
    path: "*",
    element: <ErrorBoundary />,
  },
]);


export const getRoutePath = (routeName, params = {}) => {
  let path = ROUTES[routeName] || routeName;
  
  Object.keys(params).forEach(key => {
    path = path.replace(`:${key}`, params[key]);
  });
  
  return path;
};

export const isActiveRoute = (pathname, route) => {
  if (route === ROUTES.HOME) {
    return pathname === route;
  }
  return pathname.startsWith(route);
};

export const navigateToProduct = (productId, productName) => {
  const slug = productName?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || productId;
  return `/product/${slug}-${productId}`;
};

export const navigateToCategory = (categoryId, categoryName) => {
  const slug = categoryName?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || categoryId;
  return `/${slug}-${categoryId}`;
};

export const navigateToSubcategory = (categoryId, categoryName, subcategoryId, subcategoryName) => {
  const categorySlug = categoryName?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || categoryId;
  const subcategorySlug = subcategoryName?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || subcategoryId;
  return `/${categorySlug}-${categoryId}/${subcategorySlug}-${subcategoryId}`;
};

export { ROUTES };
export default router;