// import React from 'react'
// import { IoClose } from "react-icons/io5"
// import { RiDeleteBin6Line } from "react-icons/ri"
// import { AlertTriangle, X, CheckCircle, HelpCircle } from "lucide-react"

// const ConfirmBox = ({ 
//   cancel, 
//   confirm, 
//   close, 
//   title = "Delete Confirmation", 
//   message = "Are you sure you want to permanently delete this item? This action cannot be undone.",
//   confirmText = "Delete",
//   cancelText = "Cancel",
//   confirmColor = "red", 
//   type = "danger" 
// }) => {
  
//   const getConfirmButtonStyles = () => {
//     switch (confirmColor) {
//       case 'blue':
//         return 'bg-primary hover:bg-primary-dark text-white'
//       case 'green':
//         return 'bg-success hover:bg-green-700 text-white'
//       case 'yellow':
//         return 'bg-warning hover:bg-yellow-600 text-white'
//       default:
//         return 'bg-error hover:bg-red-700 text-white'
//     }
//   }

//   const getIcon = () => {
//     switch (type) {
//       case 'warning':
//         return <AlertTriangle size={32} className="text-warning" />
//       case 'info':
//         return <HelpCircle size={32} className="text-primary" />
//       case 'success':
//         return <CheckCircle size={32} className="text-success" />
//       default:
//         return <RiDeleteBin6Line size={32} className="text-error" />
//     }
//   }

//   const getGradient = () => {
//     switch (confirmColor) {
//       case 'blue':
//         return "from-primary via-primary-light to-primary"
//       case 'green':
//         return "from-success via-green-500 to-success"
//       case 'yellow':
//         return "from-warning via-yellow-500 to-warning"
//       default:
//         return "from-error via-red-500 to-error"
//     }
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 fade-in">
//       {/* Backdrop */}
//       <div 
//         className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
//         onClick={close}
//         aria-hidden="true"
//       />
      
//       {/* Modal */}
//       <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 animate-zoom-in">
        
//         {/* Close Button */}
//         <button
//           onClick={close}
//           className="absolute right-4 top-4 z-10 p-1.5 hover:bg-bg-alt rounded-lg transition-colors text-text-muted hover:text-text"
//           aria-label="Close"
//         >
//           <X size={18} />
//         </button>
        
//         {/* Icon */}
//         <div className="absolute -top-7 left-1/2 transform -translate-x-1/2">
//           <div className={`p-3 bg-card border-2 border-border shadow-xl rounded-full`}>
//             {getIcon()}
//           </div>
//         </div>
        
//         {/* Content */}
//         <div className="pt-12 pb-6 px-6 text-center">
//           <h3 className="font-display font-bold text-xl text-text mb-3">
//             {title}
//           </h3>
//           <p className="text-text-muted leading-relaxed">
//             {message}
//           </p>
          
//           {/* Action Buttons */}
//           <div className="flex gap-3 mt-8">
//             <button
//               onClick={cancel}
//               className="flex-1 btn btn-outline py-2.5 rounded-xl font-medium transition-all duration-200 hover:bg-bg-alt"
//             >
//               {cancelText}
//             </button>
//             <button
//               onClick={confirm}
//               className={`flex-1 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 ${getConfirmButtonStyles()}`}
//             >
//               {confirmText}
//             </button>
//           </div>
          
//           {/* Footer Note */}
//           <p className="text-xs text-text-muted mt-6 flex items-center justify-center gap-1">
//             <AlertTriangle size={10} />
//             This action cannot be undone
//           </p>
//         </div>
        
//         {/* Gradient Bottom Bar */}
//         <div className={`h-1 bg-gradient-to-r ${getGradient()} rounded-b-2xl opacity-80`} />
//       </div>
//     </div>
//   )
// }

// // Pre-defined Confirm Box Variants
// export const DeleteConfirmBox = ({ cancel, confirm, close, itemName = "item" }) => (
//   <ConfirmBox
//     cancel={cancel}
//     confirm={confirm}
//     close={close}
//     title="Delete Item"
//     message={`Are you sure you want to delete "${itemName}"? This action cannot be undone and all associated data will be permanently removed.`}
//     confirmText="Delete"
//     cancelText="Cancel"
//     confirmColor="red"
//     type="danger"
//   />
// )

// export const LogoutConfirmBox = ({ cancel, confirm, close }) => (
//   <ConfirmBox
//     cancel={cancel}
//     confirm={confirm}
//     close={close}
//     title="Logout"
//     message="Are you sure you want to logout? You will need to login again to access your account."
//     confirmText="Logout"
//     cancelText="Stay Logged In"
//     confirmColor="red"
//     type="warning"
//   />
// )

// export const SaveConfirmBox = ({ cancel, confirm, close, itemName = "changes" }) => (
//   <ConfirmBox
//     cancel={cancel}
//     confirm={confirm}
//     close={close}
//     title="Save Changes"
//     message={`Are you sure you want to save these ${itemName}? This will update your information.`}
//     confirmText="Save"
//     cancelText="Cancel"
//     confirmColor="green"
//     type="success"
//   />
// )

// export const ClearCartConfirmBox = ({ cancel, confirm, close }) => (
//   <ConfirmBox
//     cancel={cancel}
//     confirm={confirm}
//     close={close}
//     title="Clear Cart"
//     message="Are you sure you want to clear your entire cart? All items will be removed."
//     confirmText="Clear Cart"
//     cancelText="Keep Items"
//     confirmColor="red"
//     type="danger"
//   />
// )

// export const CancelOrderConfirmBox = ({ cancel, confirm, close, orderId }) => (
//   <ConfirmBox
//     cancel={cancel}
//     confirm={confirm}
//     close={close}
//     title="Cancel Order"
//     message={`Are you sure you want to cancel order #${orderId}? This action cannot be undone.`}
//     confirmText="Cancel Order"
//     cancelText="Keep Order"
//     confirmColor="red"
//     type="warning"
//   />
// )

// export default ConfirmBox


import React from 'react'
import { IoClose } from "react-icons/io5"
import { RiDeleteBin6Line } from "react-icons/ri"
import { AlertTriangle, X, CheckCircle, HelpCircle } from "lucide-react"

const ConfirmBox = ({ 
  cancel, 
  confirm, 
  close, 
  title = "Delete Confirmation", 
  message = "Are you sure you want to permanently delete this item? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  confirmColor = "red", 
  type = "danger" 
}) => {
  
  const getConfirmButtonStyles = () => {
    switch (confirmColor) {
      case 'blue':
        return 'bg-blue-600 hover:bg-blue-700 text-white'
      case 'green':
        return 'bg-green-600 hover:bg-green-700 text-white'
      case 'yellow':
        return 'bg-yellow-500 hover:bg-yellow-600 text-white'
      default:
        return 'bg-red-600 hover:bg-red-700 text-white'
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertTriangle size={32} className="text-yellow-500" />
      case 'info':
        return <HelpCircle size={32} className="text-blue-600" />
      case 'success':
        return <CheckCircle size={32} className="text-green-600" />
      default:
        return <RiDeleteBin6Line size={32} className="text-red-600" />
    }
  }

  const getGradient = () => {
    switch (confirmColor) {
      case 'blue':
        return "from-blue-600 via-blue-500 to-blue-600"
      case 'green':
        return "from-green-600 via-green-500 to-green-600"
      case 'yellow':
        return "from-yellow-500 via-yellow-400 to-yellow-500"
      default:
        return "from-red-600 via-red-500 to-red-600"
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={close}
        aria-hidden="true"
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300">
        
        <button
          onClick={close}
          className="absolute right-4 top-4 z-10 p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-800"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        
        <div className="absolute -top-7 left-1/2 transform -translate-x-1/2">
          <div className="p-3 bg-white border-2 border-gray-200 shadow-xl rounded-full">
            {getIcon()}
          </div>
        </div>
        
        <div className="pt-12 pb-6 px-6 text-center">
          <h3 className="font-bold text-xl text-gray-800 mb-3">
            {title}
          </h3>
          <p className="text-gray-500 leading-relaxed">
            {message}
          </p>
          
          <div className="flex gap-3 mt-8">
            <button
              onClick={cancel}
              className="flex-1 border-2 border-gray-300 text-gray-700 py-2.5 rounded-xl font-medium transition-all duration-200 hover:bg-gray-50"
            >
              {cancelText}
            </button>
            <button
              onClick={confirm}
              className={`flex-1 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 ${getConfirmButtonStyles()}`}
            >
              {confirmText}
            </button>
          </div>
          
          <p className="text-xs text-gray-400 mt-6 flex items-center justify-center gap-1">
            <AlertTriangle size={10} />
            This action cannot be undone
          </p>
        </div>
        
        <div className={`h-1 bg-gradient-to-r ${getGradient()} rounded-b-2xl opacity-80`} />
      </div>
    </div>
  )
}

export const DeleteConfirmBox = ({ cancel, confirm, close, itemName = "item" }) => (
  <ConfirmBox
    cancel={cancel}
    confirm={confirm}
    close={close}
    title="Delete Item"
    message={`Are you sure you want to delete "${itemName}"? This action cannot be undone and all associated data will be permanently removed.`}
    confirmText="Delete"
    cancelText="Cancel"
    confirmColor="red"
    type="danger"
  />
)

export const LogoutConfirmBox = ({ cancel, confirm, close }) => (
  <ConfirmBox
    cancel={cancel}
    confirm={confirm}
    close={close}
    title="Logout"
    message="Are you sure you want to logout? You will need to login again to access your account."
    confirmText="Logout"
    cancelText="Stay Logged In"
    confirmColor="red"
    type="warning"
  />
)

export const SaveConfirmBox = ({ cancel, confirm, close, itemName = "changes" }) => (
  <ConfirmBox
    cancel={cancel}
    confirm={confirm}
    close={close}
    title="Save Changes"
    message={`Are you sure you want to save these ${itemName}? This will update your information.`}
    confirmText="Save"
    cancelText="Cancel"
    confirmColor="green"
    type="success"
  />
)

export const ClearCartConfirmBox = ({ cancel, confirm, close }) => (
  <ConfirmBox
    cancel={cancel}
    confirm={confirm}
    close={close}
    title="Clear Cart"
    message="Are you sure you want to clear your entire cart? All items will be removed."
    confirmText="Clear Cart"
    cancelText="Keep Items"
    confirmColor="red"
    type="danger"
  />
)

export const CancelOrderConfirmBox = ({ cancel, confirm, close, orderId }) => (
  <ConfirmBox
    cancel={cancel}
    confirm={confirm}
    close={close}
    title="Cancel Order"
    message={`Are you sure you want to cancel order #${orderId}? This action cannot be undone.`}
    confirmText="Cancel Order"
    cancelText="Keep Order"
    confirmColor="red"
    type="warning"
  />
)

export default ConfirmBox