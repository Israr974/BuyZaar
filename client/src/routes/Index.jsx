
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
import SubCategory from "../pages/subCategory"
import UploadProduct from "../pages/UploadProduct"
import ProductAdmin from "../pages/ProductAdmin"
import { AdminPermission } from "../layout/AdminPermission";
import ProductList from "../pages/ProductList";
import ProductDisplayPage from "../pages/ProductDisplayPage";
import CheckOutPage from "../pages/CheckOutPage";
import DeliveryAddress from "../pages/DeliveryAddress";
import CODPayment from "../pages/CODPayment";
import CardPayment from "../pages/CardPayment";
import UPIPayment from "../pages/UPIPayment";
import PaymentSuccess from "../components/PaymentSuccess";
import PaymentFail from "../components/PaymentFail";
import Orders from "../pages/Orders";
import RequireAuth from "../components/RequireAuth";



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
        {
            path: "dashboard",
            element:

                <RequireAuth><Dashboard /></RequireAuth>,



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
        }



    ]

}])
export default router;