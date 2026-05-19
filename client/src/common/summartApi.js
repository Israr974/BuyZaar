   export const baseUrl = "https://buyzaar-0evg.onrender.com"
// export const baseUrl = "http://localhost:3000"


const summaryApi = () => {
  return {

    register: { url: `${baseUrl}/api/user/register`, method: 'post' },
    login: { url: `${baseUrl}/api/user/login`, method: 'post' },
    forgotPassword: { url: `${baseUrl}/api/user/forgot-password`, method: 'put' },
    forgotPasswordVerifyOtp: { url: `${baseUrl}/api/user/verify-otp`, method: 'put' },
    resetPassword: { url: `${baseUrl}/api/user/reset-password`, method: 'put' },
    refreshToken: { url: `${baseUrl}/api/user/refresh-token`, method: 'post' },
    getUserDetail: { url: `${baseUrl}/api/user/me`, method: 'get' },
    logout: { url: `${baseUrl}/api/user/logout`, method: 'post' },
    updateUser: { url: `${baseUrl}/api/user/update`, method: 'put' },
    resendVerification: { url: `${baseUrl}/api/user/resend-verification`, method: 'post' },
    uploadAvatar: { url: `${baseUrl}/api/user/upload-profile`, method: "post" },
    updateAvatar: { url: `${baseUrl}/api/user/update-profile`, method: "put" },
    deleteAvatar: { url: `${baseUrl}/api/user/delete-profile`, method: "delete" },


    addCategory: { url: `${baseUrl}/api/category`, method: 'post' },
    getAllCategory: { url: `${baseUrl}/api/category`, method: 'get' },
    updateCategory: (id) => ({ url: `${baseUrl}/api/category/${id}`, method: 'put' }),
    deleteCategory: (id) => ({ url: `${baseUrl}/api/category/${id}`, method: 'delete' }),


    createSubcategory: { url: `${baseUrl}/api/subcategory`, method: 'post' },
    getSubcategory: { url: `${baseUrl}/api/subcategory`, method: 'get' },
    updateSubCategory: (id) => ({ url: `${baseUrl}/api/subcategory/${id}`, method: 'put' }),
    deleteSubCategory: (id) => ({ url: `${baseUrl}/api/subcategory/${id}`, method: 'delete' }),


    addProduct: { url: `${baseUrl}/api/product/add`, method: 'post' },
    getProduct: { url: `${baseUrl}/api/product`, method: 'get' },
    getProductByCategory: { url: `${baseUrl}/api/product/by-category`, method: 'post' },
    getProductByCategoryAndSubcategory: { url: `${baseUrl}/api/product/by-category-subcategory`, method: 'post' },
    getProductById: () => ({ url: `${baseUrl}/api/product/by-id`, method: 'post' }),
    updateProductDetails: { url: `${baseUrl}/api/product/update`, method: 'put' },
    deleteProduct: { url: `${baseUrl}/api/product/delete`, method: 'delete' },
    searchProduct: { url: `${baseUrl}/api/search`, method: 'post' },


    addToCart: { url: `${baseUrl}/api/cart/add`, method: "post" },
    getCartProducts: { url: `${baseUrl}/api/cart/`, method: "get" },
    updateCartQuantity: { url: `${baseUrl}/api/cart/update`, method: "put" },
    removeFromCart: { url: `${baseUrl}/api/cart/remove`, method: "delete" },
    clearCart: { url: `${baseUrl}/api/cart/clear`, method: "delete" },
    getCartCount: { url: `${baseUrl}/api/cart/count`, method: "get" },


    addAddress: { url: `${baseUrl}/api/address`, method: 'post' },
    getAddresses: { url: `${baseUrl}/api/address`, method: 'get' },
    updateAddress: (id) => ({ url: `${baseUrl}/api/address/${id}`, method: 'put' }),
    deleteAddress: (id) => ({ url: `${baseUrl}/api/address/${id}`, method: 'delete' }),
    getAddressById: () => ({ url: `${baseUrl}/api/address/by-id`, method: 'post' }),


    getMyOrders: { url: `${baseUrl}/api/orders/my-orders`, method: 'get' },
    getOrderById: (id) => ({ url: `${baseUrl}/api/orders/${id}`, method: 'get' }),
    cancelOrder: (id) => ({ url: `${baseUrl}/api/orders/${id}/cancel`, method: 'put' }),
    updateDeliveryStatus: (id) => ({ url: `${baseUrl}/api/orders/${id}/status`, method: 'put' }),
    placeOrder: { url: `${baseUrl}/api/orders`, method: 'post' },
    getAllOrders: { url: `${baseUrl}/api/orders`, method: 'get' },
    updateOrderStatus: (id) => ({ url: `${baseUrl}/api/orders/${id}/status`, method: 'put' }),


    addToWishlist: { url: `${baseUrl}/api/wishlist/add`, method: 'post' },
    getWishlist: { url: `${baseUrl}/api/wishlist`, method: 'get' },
    removeFromWishlist: { url: `${baseUrl}/api/wishlist/remove`, method: 'delete' },
    clearWishlist: { url: `${baseUrl}/api/wishlist/clear`, method: 'delete' },


    addReview: { url: `${baseUrl}/api/reviews`, method: 'post' },
    getProductReviews: (productId) => ({ url: `${baseUrl}/api/reviews/product/${productId}`, method: 'get' }),
    updateReview: (reviewId) => ({ url: `${baseUrl}/api/reviews/${reviewId}`, method: 'put' }),
    deleteReview: (reviewId) => ({ url: `${baseUrl}/api/reviews/${reviewId}`, method: 'delete' }),
    markReviewHelpful: (reviewId) => ({ url: `${baseUrl}/api/reviews/${reviewId}/helpful`, method: 'post' }),
    getAllReviews: { url: `${baseUrl}/api/reviews/all`, method: 'get' },


    uploadImage: { url: `${baseUrl}/api/upload`, method: 'post' },
    getBanners: { url: `${baseUrl}/api/banner/banners`, method: "get" },
    uploadBanner: { url: `${baseUrl}/api/banner/admin/banners`, method: "post" },
    deleteBanner: { url: `${baseUrl}/api/banner/admin/banners/`, method: "delete" },

    getGalleryImages: { url: `${baseUrl}/api/gallery/`, method: 'get' },
    getAllGalleryImages: { url: `${baseUrl}/api/gallery/all`, method: 'get' },
    createGalleryImage: { url: `${baseUrl}/api/gallery/upload`, method: 'post' },
    updateGalleryImage: (id) => ({ url: `${baseUrl}/api/gallery/${id}`, method: 'put' }),
    deleteGalleryImage: (id) => ({ url: `${baseUrl}/api/gallery/${id}`, method: 'delete' }),



  };
};

export default summaryApi;