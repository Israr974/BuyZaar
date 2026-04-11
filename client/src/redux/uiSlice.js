import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: localStorage.getItem("theme") || "light",
  modal: null,
  modalData: null,
  loading: false,
  sidebarOpen: false,
  mobileMenuOpen: false,
  cartSidebarOpen: false,
  searchModalOpen: false,
  notifications: [],
  toast: null,
  overlay: false,
  activeTab: null,
  scrollPosition: 0,
  isOnline: navigator.onLine !== false,
  deviceType: "desktop",
  viewMode: localStorage.getItem("viewMode") || "grid",
  language: localStorage.getItem("language") || "en",
  currency: "INR",
  currencySymbol: "₹",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // Theme
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem("theme", action.payload);
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.theme);
      // Apply theme to document
      if (state.theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
    
    // Modal
    openModal: (state, action) => {
      state.modal = action.payload;
      state.modalData = action.payload?.data || null;
      document.body.style.overflow = "hidden";
    },
    closeModal: (state) => {
      state.modal = null;
      state.modalData = null;
      document.body.style.overflow = "unset";
    },
    setModalData: (state, action) => {
      state.modalData = action.payload;
    },
    
    // Loading
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    startLoading: (state) => {
      state.loading = true;
    },
    stopLoading: (state) => {
      state.loading = false;
    },
    
    // Sidebars
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
      document.body.style.overflow = state.sidebarOpen ? "hidden" : "unset";
    },
    openSidebar: (state) => {
      state.sidebarOpen = true;
      document.body.style.overflow = "hidden";
    },
    closeSidebar: (state) => {
      state.sidebarOpen = false;
      document.body.style.overflow = "unset";
    },
    
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
      document.body.style.overflow = state.mobileMenuOpen ? "hidden" : "unset";
    },
    openMobileMenu: (state) => {
      state.mobileMenuOpen = true;
      document.body.style.overflow = "hidden";
    },
    closeMobileMenu: (state) => {
      state.mobileMenuOpen = false;
      document.body.style.overflow = "unset";
    },
    
    toggleCartSidebar: (state) => {
      state.cartSidebarOpen = !state.cartSidebarOpen;
      document.body.style.overflow = state.cartSidebarOpen ? "hidden" : "unset";
    },
    openCartSidebar: (state) => {
      state.cartSidebarOpen = true;
      document.body.style.overflow = "hidden";
    },
    closeCartSidebar: (state) => {
      state.cartSidebarOpen = false;
      document.body.style.overflow = "unset";
    },
    
    // Search
    openSearchModal: (state) => {
      state.searchModalOpen = true;
      document.body.style.overflow = "hidden";
    },
    closeSearchModal: (state) => {
      state.searchModalOpen = false;
      document.body.style.overflow = "unset";
    },
    toggleSearchModal: (state) => {
      state.searchModalOpen = !state.searchModalOpen;
      document.body.style.overflow = state.searchModalOpen ? "hidden" : "unset";
    },
    
    // Notifications
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        ...action.payload,
        timestamp: new Date().toISOString(),
      };
      state.notifications.unshift(notification);
      setTimeout(() => {
        const index = state.notifications.findIndex(n => n.id === notification.id);
        if (index !== -1) {
          state.notifications.splice(index, 1);
        }
      }, 5000);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    // Toast
    showToast: (state, action) => {
      state.toast = action.payload;
      setTimeout(() => {
        state.toast = null;
      }, 3000);
    },
    hideToast: (state) => {
      state.toast = null;
    },
    
    // Overlay
    showOverlay: (state) => {
      state.overlay = true;
      document.body.style.overflow = "hidden";
    },
    hideOverlay: (state) => {
      state.overlay = false;
      document.body.style.overflow = "unset";
    },
    toggleOverlay: (state) => {
      state.overlay = !state.overlay;
      document.body.style.overflow = state.overlay ? "hidden" : "unset";
    },
    
    // Active Tab
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    
    // Scroll Position
    setScrollPosition: (state, action) => {
      state.scrollPosition = action.payload;
    },
    
    // Network Status
    setOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
    },
    
    // Device Type
    setDeviceType: (state, action) => {
      state.deviceType = action.payload;
    },
    
    // View Mode
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
      localStorage.setItem("viewMode", action.payload);
    },
    toggleViewMode: (state) => {
      state.viewMode = state.viewMode === "grid" ? "list" : "grid";
      localStorage.setItem("viewMode", state.viewMode);
    },
    
    // Language
    setLanguage: (state, action) => {
      state.language = action.payload;
      localStorage.setItem("language", action.payload);
    },
    
    // Currency
    setCurrency: (state, action) => {
      state.currency = action.payload.code;
      state.currencySymbol = action.payload.symbol;
      localStorage.setItem("currency", action.payload.code);
    },
    
    // Reset
    resetUI: () => initialState,
  },
});

export const {
  setTheme,
  toggleTheme,
  openModal,
  closeModal,
  setModalData,
  setLoading,
  startLoading,
  stopLoading,
  toggleSidebar,
  openSidebar,
  closeSidebar,
  toggleMobileMenu,
  openMobileMenu,
  closeMobileMenu,
  toggleCartSidebar,
  openCartSidebar,
  closeCartSidebar,
  openSearchModal,
  closeSearchModal,
  toggleSearchModal,
  addNotification,
  removeNotification,
  clearNotifications,
  showToast,
  hideToast,
  showOverlay,
  hideOverlay,
  toggleOverlay,
  setActiveTab,
  setScrollPosition,
  setOnlineStatus,
  setDeviceType,
  setViewMode,
  toggleViewMode,
  setLanguage,
  setCurrency,
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;