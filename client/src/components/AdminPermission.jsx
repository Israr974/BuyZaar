import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Shield, AlertTriangle, Lock, ArrowLeft } from 'lucide-react'
import IsAdmin from '../utils/IsAdmin'

export const AdminPermission = ({ children, fallback, redirectTo, showMessage = true }) => {
  const user = useSelector(state => state.user)
  const navigate = useNavigate()
  const isAdmin = IsAdmin(user?.role)

  if (!isAdmin && redirectTo) {
    navigate(redirectTo)
    return null
  }

  if (!isAdmin && fallback) {
    return fallback
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border overflow-hidden text-center">
            <div className="h-2 bg-gradient-to-r from-red-500 via-red-500 to-red-500"></div>
            
            <div className="p-8">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                  <Shield className="w-14 h-14 text-red-600" />
                </div>
                <div className="absolute -top-2 -right-2 animate-bounce">
                  <AlertTriangle className="w-6 h-6 text-yellow-500" />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-gray-800 mb-3">
                Access Denied
              </h1>
              
              <p className="text-gray-500 mb-6">
                You don't have permission to access this page. This area requires administrator privileges.
              </p>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-500">Your current role:</p>
                <p className="text-lg font-semibold text-gray-800 capitalize">
                  {user?.role || 'Guest'}
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => navigate(-1)}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition"
                >
                  <ArrowLeft size={18} />
                  Go Back
                </button>
                
                <button
                  onClick={() => navigate('/')}
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition"
                >
                  Go to Homepage
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <Lock size={14} />
              Need access? Contact your system administrator
            </p>
          </div>
        </div>
      </div>
    )
  }

  return children
}

export const AdminOnly = ({ children, fallback = null }) => {
  const user = useSelector(state => state.user)
  const isAdmin = IsAdmin(user?.role)
  return isAdmin ? children : fallback
}

export const NonAdminOnly = ({ children, fallback = null }) => {
  const user = useSelector(state => state.user)
  const isAdmin = IsAdmin(user?.role)
  return !isAdmin ? children : fallback
}

export const useAdminPermission = () => {
  const user = useSelector(state => state.user)
  return IsAdmin(user?.role)
}

export default AdminPermission