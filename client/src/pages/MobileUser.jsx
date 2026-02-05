import React from 'react'
import ShowMenu from '../components/ShowMenu'
import { useSelector } from 'react-redux';
import { ImCross } from "react-icons/im";


const MobileUser = () => {
    const user = useSelector((state) => state.user);
  return (
    <section className='bg-white' >
        <div className="text-right">
        <button className='p-3' onClick={()=>window.history.back()}>
          <ImCross size={16} />
        </button>
        </div>
        <div className=''><ShowMenu user={user}/>
    </div>
    </section>
  )
}

export default MobileUser