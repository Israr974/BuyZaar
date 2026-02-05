import React from 'react'
import IsAdmin from '../utils/IsAdmin'
import { useSelector } from 'react-redux'

export const AdminPermission = ({children}) => {
    const user=useSelector(state=>state.user)
  return (
    <>
{
    IsAdmin(user.role) ? children:<p className='text-red-600'> Don't Have Permission</p>
}
</>
    
  )
}
