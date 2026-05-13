import { createSlice } from "@reduxjs/toolkit";

const THEMES = {
  LIGHT: "light",
  DARK: "dark",
};

const DEVICE_TYPES = {
  MOBILE: "mobile",
  TABLET: "tablet",
  DESKTOP: "desktop",
};

const VIEW_MODES = {
  GRID: "grid",
  LIST: "list",
};

const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

const TOAST_DURATION = 3000;
const NOTIFICATION_DURATION = 5000;

const getInitialTheme = () => {
  if (typeof window === "undefined") return THEMES.LIGHT;
  
  const saved = localStorage.getItem("theme");
  if (saved === THEMES.DARK || saved === THEMES.LIGHT) return saved;
  
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? THEMES.DARK : THEMES.LIGHT;
};

const applyThemeToDocument = (theme) => {
  if (typeof document === "undefined") return;
  
  if (theme === THEMES.DARK) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

const setBodyOverflow = (shouldHide) => {
  if (typeof document === "undefined") return;
  document.body.style.overflow = shouldHide ? "hidden" : "";
};

const getInitialDeviceType = () => {
  if (typeof window === "undefined") return DEVICE_TYPES.DESKTOP;
  
  const width = window.innerWidth;
  if (width < 768) return DEVICE_TYPES.MOBILE;
  if (width < 1024) return DEVICE_TYPES.TABLET;
  return DEVICE_TYPES.DESKTOP;
};

const getInitialState = () => ({
 
  theme: getInitialTheme(),
  
  modal: {
    isOpen: false,
    type: null,
    data: null,
    options: {},
  },
  
  loading: {
    global: false,
    page: false,
    actions: new Set(),
  },

  sidebar: {
    isOpen: false,
    type: null,
  },
  mobileMenuOpen: false,
  cartSidebarOpen: false,

  searchModalOpen: false,
  searchQuery: "",
  
  notifications: [],
  
  toast: {
    message: null,
    type: NOTIFICATION_TYPES.SUCCESS,
    visible: false,
    duration: TOAST_DURATION,
  },
  
  overlay: false,
  activeTab: null,
  scrollPosition: 0,
  isOnline: typeof navigator !== "undefined" ? navigator.onLine !== false : true,
  deviceType: getInitialDeviceType(),
  viewMode: (typeof localStorage !== "undefined" ? localStorage.getItem("viewMode") : null) || VIEW_MODES.GRID,
  language: (typeof localStorage !== "undefined" ? localStorage.getItem("language") : null) || "en",
  currency: {
    code: "INR",
    symbol: "₹",
    rate: 1,
  },
  
  imageLoadErrors: new Set(),
  lazyLoadEnabled: true,
  reducedMotion: typeof window !== "undefined" 
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches 
    : false,
  
  keyboardShortcutsEnabled: true,
});

const initialState = getInitialState();

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      const newTheme = action.payload;
      state.theme = newTheme;
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("theme", newTheme);
      }
      applyThemeToDocument(newTheme);
    },
    
    toggleTheme: (state) => {
      const newTheme = state.theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
      state.theme = newTheme;
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("theme", newTheme);
      }
      applyThemeToDocument(newTheme);
    },
   
    openModal: (state, action) => {
      const { type, data = null, options = {} } = action.payload;
      state.modal = {
        isOpen: true,
        type,
        data,
        options,
      };
      setBodyOverflow(true);
    },
    
    closeModal: (state) => {
      state.modal = {
        isOpen: false,
        type: null,
        data: null,
        options: {},
      };
      setBodyOverflow(false);
    },
    
    setModalData: (state, action) => {
      if (state.modal.isOpen) {
        state.modal.data = action.payload;
      }
    },
    
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload;
    },
    
    setPageLoading: (state, action) => {
      state.loading.page = action.payload;
    },
    
    startActionLoading: (state, action) => {
      state.loading.actions.add(action.payload);
    },
    
    stopActionLoading: (state, action) => {
      state.loading.actions.delete(action.payload);
    },
    
    isActionLoading: (state, action) => {
      return state.loading.actions.has(action.payload);
    },
    
    openSidebar: (state, action) => {
      state.sidebar = {
        isOpen: true,
        type: action.payload || "default",
      };
      setBodyOverflow(true);
    },
    
    closeSidebar: (state) => {
      state.sidebar = {
        isOpen: false,
        type: null,
      };
      setBodyOverflow(false);
    },
    
    toggleSidebar: (state, action) => {
      const sidebarType = action.payload || "default";
      if (state.sidebar.isOpen && state.sidebar.type === sidebarType) {
        state.sidebar = { isOpen: false, type: null };
        setBodyOverflow(false);
      } else {
        state.sidebar = { isOpen: true, type: sidebarType };
        setBodyOverflow(true);
      }
    },
    
    openMobileMenu: (state) => {
      state.mobileMenuOpen = true;
      setBodyOverflow(true);
    },
    
    closeMobileMenu: (state) => {
      state.mobileMenuOpen = false;
      setBodyOverflow(false);
    },
    
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
      setBodyOverflow(state.mobileMenuOpen);
    },
    
    openCartSidebar: (state) => {
      state.cartSidebarOpen = true;
      setBodyOverflow(true);
    },
    
    closeCartSidebar: (state) => {
      state.cartSidebarOpen = false;
      setBodyOverflow(false);
    },
    
    toggleCartSidebar: (state) => {
      state.cartSidebarOpen = !state.cartSidebarOpen;
      setBodyOverflow(state.cartSidebarOpen);
    },
    
    openSearchModal: (state) => {
      state.searchModalOpen = true;
      setBodyOverflow(true);
    },
    
    closeSearchModal: (state) => {
      state.searchModalOpen = false;
      state.searchQuery = "";
      setBodyOverflow(false);
    },
    
    toggleSearchModal: (state) => {
      state.searchModalOpen = !state.searchModalOpen;
      if (!state.searchModalOpen) {
        state.searchQuery = "";
      }
      setBodyOverflow(state.searchModalOpen);
    },
    
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    
    clearSearchQuery: (state) => {
      state.searchQuery = "";
    },
    
    addNotification: (state, action) => {
      const { type = NOTIFICATION_TYPES.INFO, title, message, duration = NOTIFICATION_DURATION } = action.payload;
      const id = Date.now() + Math.random();
      
      const notification = {
        id,
        type,
        title,
        message,
        timestamp: new Date().toISOString(),
        duration,
      };
      
      state.notifications.unshift(notification);
      
      setTimeout(() => {
        const index = state.notifications.findIndex(n => n.id === id);
        if (index !== -1) {
          state.notifications.splice(index, 1);
        }
      }, duration);
    },
    
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    markNotificationAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
    },
    
    showToast: (state, action) => {
      const { message, type = NOTIFICATION_TYPES.SUCCESS, duration = TOAST_DURATION } = action.payload;
      state.toast = {
        message,
        type,
        visible: true,
        duration,
      };
      
      setTimeout(() => {
        if (state.toast.visible) {
          state.toast.visible = false;
        }
      }, duration);
    },
    
    hideToast: (state) => {
      state.toast.visible = false;
    },
    
    showOverlay: (state) => {
      state.overlay = true;
      setBodyOverflow(true);
    },
    
    hideOverlay: (state) => {
      state.overlay = false;
      setBodyOverflow(false);
    },
    
    toggleOverlay: (state) => {
      state.overlay = !state.overlay;
      setBodyOverflow(state.overlay);
    },
    
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    
    setScrollPosition: (state, action) => {
      state.scrollPosition = action.payload;
    },
    
    saveScrollPosition: (state, action) => {
      const { key, position } = action.payload;
      state.scrollPositions = {
        ...state.scrollPositions,
        [key]: position,
      };
    },
    
    restoreScrollPosition: (state, action) => {
      return state.scrollPositions?.[action.payload] || 0;
    },
    
    setOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
    },
    
    setDeviceType: (state, action) => {
      state.deviceType = action.payload;
    },
    
    updateDeviceType: (state) => {
      state.deviceType = getInitialDeviceType();
    },
    
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("viewMode", action.payload);
      }
    },
    
    toggleViewMode: (state) => {
      state.viewMode = state.viewMode === VIEW_MODES.GRID ? VIEW_MODES.LIST : VIEW_MODES.GRID;
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("viewMode", state.viewMode);
      }
    },
    
    setLanguage: (state, action) => {
      state.language = action.payload;
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("language", action.payload);
      }
    },
    
    setCurrency: (state, action) => {
      const { code, symbol, rate = 1 } = action.payload;
      state.currency = { code, symbol, rate };
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("currency", code);
      }
    },
    
    addImageLoadError: (state, action) => {
      state.imageLoadErrors.add(action.payload);
    },
    
    removeImageLoadError: (state, action) => {
      state.imageLoadErrors.delete(action.payload);
    },
    
    clearImageLoadErrors: (state) => {
      state.imageLoadErrors.clear();
    },
    
    setLazyLoadEnabled: (state, action) => {
      state.lazyLoadEnabled = action.payload;
    },
    
    setReducedMotion: (state, action) => {
      state.reducedMotion = action.payload;
    },
    
    setKeyboardShortcutsEnabled: (state, action) => {
      state.keyboardShortcutsEnabled = action.payload;
    },
    
    toggleKeyboardShortcuts: (state) => {
      state.keyboardShortcutsEnabled = !state.keyboardShortcutsEnabled;
    },
    
    resetUI: () => initialState,
    
    closeAllModalsAndSidebars: (state) => {
      state.modal.isOpen = false;
      state.sidebar.isOpen = false;
      state.mobileMenuOpen = false;
      state.cartSidebarOpen = false;
      state.searchModalOpen = false;
      state.overlay = false;
      setBodyOverflow(false);
    },
  },
});

export const {
 
  setTheme,
  toggleTheme,
  

  openModal,
  closeModal,
  setModalData,
  
  setGlobalLoading,
  setPageLoading,
  startActionLoading,
  stopActionLoading,
  
  
  openSidebar,
  closeSidebar,
  toggleSidebar,
  
  openMobileMenu,
  closeMobileMenu,
  toggleMobileMenu,
  
  openCartSidebar,
  closeCartSidebar,
  toggleCartSidebar,
 
  openSearchModal,
  closeSearchModal,
  toggleSearchModal,
  setSearchQuery,
  clearSearchQuery,
  
  addNotification,
  removeNotification,
  clearNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  

  showToast,
  hideToast,
 
  showOverlay,
  hideOverlay,
  toggleOverlay,
  

  setActiveTab,
  
  setScrollPosition,
  saveScrollPosition,
  
  
  setOnlineStatus,
  
  setDeviceType,
  updateDeviceType,
  

  setViewMode,
  toggleViewMode,
  
  
  setLanguage,
  
  
  setCurrency,
  
  addImageLoadError,
  removeImageLoadError,
  clearImageLoadErrors,
  
  setLazyLoadEnabled,
  
  setReducedMotion,
  
  setKeyboardShortcutsEnabled,
  toggleKeyboardShortcuts,
  
  resetUI,
  
  closeAllModalsAndSidebars,
} = uiSlice.actions;

export const selectTheme = (state) => state.ui?.theme || THEMES.LIGHT;
export const selectIsDarkMode = (state) => state.ui?.theme === THEMES.DARK;
export const selectModal = (state) => state.ui?.modal || {};
export const selectIsModalOpen = (state) => state.ui?.modal?.isOpen || false;
export const selectGlobalLoading = (state) => state.ui?.loading?.global || false;
export const selectPageLoading = (state) => state.ui?.loading?.page || false;
export const selectIsActionLoading = (action) => (state) => 
  state.ui?.loading?.actions?.has(action) || false;
export const selectSidebar = (state) => state.ui?.sidebar || {};
export const selectIsSidebarOpen = (state) => state.ui?.sidebar?.isOpen || false;
export const selectMobileMenuOpen = (state) => state.ui?.mobileMenuOpen || false;
export const selectCartSidebarOpen = (state) => state.ui?.cartSidebarOpen || false;
export const selectSearchModalOpen = (state) => state.ui?.searchModalOpen || false;
export const selectSearchQuery = (state) => state.ui?.searchQuery || "";
export const selectNotifications = (state) => state.ui?.notifications || [];
export const selectUnreadNotifications = (state) => 
  (state.ui?.notifications || []).filter(n => !n.read);
export const selectToast = (state) => state.ui?.toast || {};
export const selectOverlay = (state) => state.ui?.overlay || false;
export const selectActiveTab = (state) => state.ui?.activeTab;
export const selectScrollPosition = (state) => state.ui?.scrollPosition || 0;
export const selectIsOnline = (state) => state.ui?.isOnline ?? true;
export const selectDeviceType = (state) => state.ui?.deviceType || DEVICE_TYPES.DESKTOP;
export const selectIsMobile = (state) => state.ui?.deviceType === DEVICE_TYPES.MOBILE;
export const selectIsTablet = (state) => state.ui?.deviceType === DEVICE_TYPES.TABLET;
export const selectIsDesktop = (state) => state.ui?.deviceType === DEVICE_TYPES.DESKTOP;
export const selectViewMode = (state) => state.ui?.viewMode || VIEW_MODES.GRID;
export const selectIsGridView = (state) => state.ui?.viewMode === VIEW_MODES.GRID;
export const selectIsListView = (state) => state.ui?.viewMode === VIEW_MODES.LIST;
export const selectLanguage = (state) => state.ui?.language || "en";
export const selectCurrency = (state) => state.ui?.currency || { code: "INR", symbol: "₹", rate: 1 };
export const selectCurrencySymbol = (state) => state.ui?.currency?.symbol || "₹";
export const selectLazyLoadEnabled = (state) => state.ui?.lazyLoadEnabled ?? true;
export const selectReducedMotion = (state) => state.ui?.reducedMotion ?? false;
export const selectKeyboardShortcutsEnabled = (state) => state.ui?.keyboardShortcutsEnabled ?? true;

export const selectHasNotifications = (state) => (state.ui?.notifications?.length || 0) > 0;
export const selectUnreadCount = (state) => 
  (state.ui?.notifications || []).filter(n => !n.read).length;


export { THEMES, DEVICE_TYPES, VIEW_MODES, NOTIFICATION_TYPES, TOAST_DURATION, NOTIFICATION_DURATION };

export default uiSlice.reducer;