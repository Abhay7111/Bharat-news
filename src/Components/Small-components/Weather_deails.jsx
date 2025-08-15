import React from 'react'

function Weather_deails() {
  return (
    <div className='w-full h-fit flex gap-2 p-2 border border-zinc-300/10 rounded-md bg-zinc-800/20'>
     <div className=' grid grid-cols-2 gap-2'>
          <div className='w-full h-full '>
               <h1 className='text-lg font-semibold'>Weather Details</h1>
               <p className='text-sm font-medium opacity-70'>Detailed information about the current weather conditions.</p>
          </div>
          <div className='w-full h-full flex items-center justify-center'>
               <img src='https://cdn.pixabay.com/photo/2023/01/04/09/25/boho-7696303_960_720.jpg' alt='Weather Details' className='w-full h-full object-cover rounded-md' />   
          </div>
     </div>
    </div>
  )
}

export default Weather_deails