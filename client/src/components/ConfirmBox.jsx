import React from 'react'
import { IoClose } from "react-icons/io5"
import { RiDeleteBin6Line } from "react-icons/ri"

const ConfirmBox = ({ cancel, confirm, close }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 fade-in">
      
      <div 
        className="absolute inset-0 bg-neutral-900/50 backdrop-blur-xs"
        onClick={close}
        aria-hidden="true"
      />
      
      
      <div className="relative card shadow-xl w-full max-w-sm transform transition-all duration-300 scale-100 hover:scale-[1.01]">
        
        
        <button
          onClick={close}
          className="absolute right-4 top-4 z-10 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close"
        >
          <IoClose size={20} className="text-text-muted" />
        </button>
        
        
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
          <div className="p-3 bg-white border border-border shadow-lg rounded-full">
            <RiDeleteBin6Line size={28} className="text-red-500" />
          </div>
        </div>
        
        
        <div className="pt-10 pb-6 px-6 text-center">
          <h3 className="font-display font-bold text-xl text-text mb-2">
            Delete Confirmation
          </h3>
          <p className="text-text-muted mb-6">
            Are you sure you want to permanently delete this item? 
            This action cannot be undone.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={cancel}
              className="btn btn-outline flex-1 py-2.5 rounded-lg hover:border-primary hover:text-primary transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={confirm}
              className="btn bg-red-500 text-white hover:bg-red-600 flex-1 py-2.5 rounded-lg shadow-sm hover:shadow transition-all duration-200"
            >
              Delete
            </button>
          </div>
          
          <p className="text-xs text-text-muted mt-6">
            This will remove all associated data permanently
          </p>
        </div>
        
        
        <div className="h-1 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 rounded-b-lg opacity-80" />
      </div>
    </div>
  )
}

export default ConfirmBox