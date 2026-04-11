
import { createBrowserRouter } from "react-router-dom";
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



const router = createBrowserRouter([{
    path: "/",
    element: <App />,
    children: [
        {
            path: "",
            element: <Home />
        },
        {
            path: "search",
            element: <SearchPage />
        },
        {
            path: "login",
            element: <Login />
        },
        {
            path: "register",
            element: <Register />
        },

        {
            path: "forgot-password",
            element: <ForgotPassword />
        },
        {
            path: "verify-otp",
            element: <OtpVerification />
        },
        {
            path: "reset-password",
            element: <ResetPassword />
        },
        {
            path: "user",
            element: <MobileUser />
        },


        // {
        //     path: "dashboard",
        //     element:

        //         <RequireAuth><Dashboard /></RequireAuth>,



        //     children: [
        //         {
        //             path: "profile",
        //             element: <Profile />
        //         },
        //         {
        //             path: "myorder",
        //             element: <MyOrder />
        //         },
        //         {
        //             path: "address",
        //             element: <Address />
        //         },
        //         {
        //             path: "wishlist",
        //             element: <Wishlist />
        //         },
        //         {
        //             path: "category",
        //             element: <AdminPermission><Category /></AdminPermission>
        //         },
        //         {
        //             path: "order",
        //             element: <AdminPermission><Orders /></AdminPermission>
        //         },
        //         {
        //             path: "subcategory",
        //             element: <AdminPermission><SubCategory /></AdminPermission>
        //         },
        //         {
        //             path: "uploadproduct",
        //             element: <AdminPermission><UploadProduct /></AdminPermission>
        //         },
        //         {
        //             path: "product",
        //             element: <AdminPermission><ProductAdmin /></AdminPermission>
        //         }

        //     ]
        // },

        // In router.jsx - Update the dashboard route

{
  path: "dashboard",
  element: <RequireAuth><Dashboard /></RequireAuth>,  // No role required, just login
  children: [
    {
      path: "profile",
      element: <Profile />
    },
    {
      path: "myorder",
      element: <MyOrder />
    },
    {
      path: "address",
      element: <Address />
    },
    {
      path: "wishlist",
      element: <Wishlist />
    },
    // Admin only routes - use AdminPermission or AdminRoute
    {
      path: "category",
      element: <AdminPermission><Category /></AdminPermission>
    },
    {
      path: "order",
      element: <AdminPermission><Orders /></AdminPermission>
    },
    {
      path: "subcategory",
      element: <AdminPermission><SubCategory /></AdminPermission>
    },
    {
      path: "uploadproduct",
      element: <AdminPermission><UploadProduct /></AdminPermission>
    },
    {
      path: "product",
      element: <AdminPermission><ProductAdmin /></AdminPermission>
    }
  ]
},
        {
            path: ":category",
            children: [
                {
                    path: ":subcategory",
                    element: <ProductList />
                }
            ]

        },
        {
            path: "product/:product",
            element: <ProductDisplayPage />
        },
        {
            path: "checkout",
            element: (
                <RequireAuth>
                    <CheckOutPage />
                </RequireAuth>
            ),
        },
        {
            path: "payment/cod",
            element: (
                <RequireAuth>
                    <CODPayment />
                </RequireAuth>
            ),
        },

        {
            path: "payment/card",
            element: <CardPayment />
        },
        {
            path: "payment/upi",
            element: <UPIPayment />
        },
        {
            path: "payment/success",
            element: <PaymentSuccess />
        },
        {
            path: "payment/fail",
            element: <PaymentFail />
        },

        {
  path: "about",
  element: <AboutUs />
},
{
  path: "contact",
  element: <ContactUs />
},
{
  path: "faq",
  element: <FAQ />
},
{
  path: "terms",
  element: <TermsAndConditions />
},
{
  path: "privacy",
  element: <PrivacyPolicy />
},
{
  path: "return-policy",
  element: <ReturnPolicy />
},
{
  path: "shipping-info",
  element: <ShippingInfo />
}



    ]

}])
export default router;