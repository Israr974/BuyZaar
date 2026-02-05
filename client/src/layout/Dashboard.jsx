import React from 'react';
import ShowMenu from '../components/ShowMenu';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
  const user = useSelector((state) => state.user);
  

  return (
    <section className=' bg-white'>
      <div className='grid grid-cols-[300px_1fr]'>
        
        
        <aside className='bg-gray-100 min-h-[81.5vh]  p-4 hidden lg:block '>
          <ShowMenu user={user} />
        </aside>

        
        <main className='p-6'>
         
          <Outlet/>
        </main>
      </div>
    </section>
  );
};

export default Dashboard;


