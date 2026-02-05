

export const baseUrl = "http://localhost:3030";

const summaryApi = () => {
  return {

    // User Authentication

    register: { url: `${baseUrl}/api/user/register`, method: 'post' },
    login: { url: `${baseUrl}/api/user/login`, method: 'post' },
    forgotPassword: { url: `${baseUrl}/api/user/forgot-password`, method: 'put' },
    forgotPasswordVerifyOtp: { url: `${baseUrl}/api/user/verify-otp`, method: 'put' },
    resetPassword: { url: `${baseUrl}/api/user/reset-password`, method: 'put' },
    refreshToken: { url: `${baseUrl}/api/user/refresh-token`, method: 'post' },
    getUserDetail: { url: `${baseUrl}/api/user/me`, method: 'get' },/*------------- */
    logout: { url: `${baseUrl}/api/user/logout`, method: 'post' },
    updateUser: { url: `${baseUrl}/api/user/update`, method: 'put' },


    // Category
    addCategory: { url: `${baseUrl}/api/category`, method: 'post' },
    getAllCategory: { url: `${baseUrl}/api/category`, method: 'get' },/*------------- */
    updateCategory: (id) => ({ url: `${baseUrl}/api/category/${id}`, method: 'put' }),
    deleteCategory: (id) => ({ url: `${baseUrl}/api/category/${id}`, method: 'delete' }),

    // Subcategory
    createSubcategory: { url: `${baseUrl}/api/subcategory`, method: 'post' },
    getSubcategory: { url: `${baseUrl}/api/subcategory`, method: 'get' },
    updateSubCategory: (id) => ({ url: `${baseUrl}/api/subcategory/${id}`, method: 'put' }),
    deleteSubCategory: (id) => ({ url: `${baseUrl}/api/subcategory/${id}`, method: 'delete' }),

    // Product
    addProduct: { url: `${baseUrl}/api/product/add`, method: 'post' },
    getProduct: { url: `${baseUrl}/api/product`, method: 'get' },
    getProductByCategory: { url: `${baseUrl}/api/product/by-category`, method: 'post' },
    getProductByCategoryAndSubcategory: { url: `${baseUrl}/api/product/by-category-subcategory`, method: 'post' },
    getProductById: () => ({ url: `${baseUrl}/api/product/by-id`, method: 'post' }),
    updateProductDetails: { url: `${baseUrl}/api/product/update`, method: 'put' },
    deleteProduct: { url: `${baseUrl}/api/product/delete`, method: 'delete' },
    searchProduct: { url: `${baseUrl}/api/search`, method: 'post' },

    // Cart 
    addToCart: { url: `${baseUrl}/api/cart/add`, method: "post" },
    getCartProducts: {url: `${baseUrl}/api/cart/`, method: "get"},
    updateCartQuantity: {url: `${baseUrl}/api/cart/update`, method: "put"},
    removeFromCart: { url: `${baseUrl}/api/cart/remove`, method: "delete"},
    clearCart: { url: `${baseUrl}/api/cart/clear`, method: "delete" },
    getCartCount: { url: `${baseUrl}/api/cart/count`, method: "get" },

    // Address
    addAddress: { url: `${baseUrl}/api/address`, method: 'post' },
    getAddresses: { url: `${baseUrl}/api/address`, method: 'get' },
    updateAddress: (id) => ({ url: `${baseUrl}/api/address/${id}`, method: 'put' }),
    deleteAddress: (id) => ({ url: `${baseUrl}/api/address/${id}`, method: 'delete' }),
    getAddressById: () => ({ url: `${baseUrl}/api/address/by-id`, method: 'post' }),


    // Orders
    getMyOrders: { url: `${baseUrl}/api/orders/my-orders`, method: 'get' },
    getOrderById: (id) => ({ url: `${baseUrl}/api/orders/${id}`, method: 'get' }),
    cancelOrder: (id) => ({ url: `${baseUrl}/api/orders/${id}/cancel`, method: 'put' }),
    updateDeliveryStatus: (id) => ({ url: `${baseUrl}/api/orders/${id}/status`, method: 'put' }),
    placeOrder: { url: `${baseUrl}/api/orders`, method: 'post' },

    // Upload
    uploadImage: { url: `${baseUrl}/api/upload`, method: 'post' },
    
  };
};

export default summaryApi;
