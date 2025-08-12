import React from 'react'
import { Outlet } from 'react-router'

function Home() {
  return (
    <div className='w-full h-screen bg-transparent flex flex-col items-center justify-center'>
      <Outlet/>
    </div>
  )
}

export default Home