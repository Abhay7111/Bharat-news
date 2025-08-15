import React from 'react'
import { NavLink, Outlet } from 'react-router'

function Home() {
  return (
    <div className='w-full text-white h-[100dvh] bg-transparent flex flex-col items-center justify-start'>
      <Outlet/>
      <div className='w-full py-1 max-w-[700px] h-17 absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center justify-center bg-zinc-800'>
      <div className='w-[95%] h-full border border-zinc-600 bg-zinc-800 rounded-full flex items-center justify-around gap-3'>
        <NavLink className={({isActive})=>` text-xl font-medium text-shadow-lg ${isActive? 'text-shadow-blue-500' : ''}`} to={`/`}><i className='ri-home-5-line'></i></NavLink>
        <NavLink className={({isActive})=>`text-xl font-medium text-shadow-lg ${isActive? 'text-shadow-blue-500' : ''}`} to={`/chat`}><i className='ri-message-3-line'></i></NavLink>
        <NavLink className={({isActive})=>`text-xl font-medium text-shadow-lg ${isActive? 'text-shadow-blue-500' : ''}`} to={`/add-new`}><i className='ri-add-line'></i></NavLink>
        <NavLink className={({isActive})=>`text-xl font-medium text-shadow-lg ${isActive? 'text-shadow-blue-500' : ''}`} to={`/notification`}><i className='ri-notification-3-line'></i></NavLink>
        <NavLink className={({isActive})=>`text-xl font-medium text-shadow-lg ${isActive? 'text-shadow-blue-500' : ''}`} to={`/profile`}><i className='ri-user-line'></i></NavLink>
      </div>
      </div>
    </div>
  )
}

export default Home