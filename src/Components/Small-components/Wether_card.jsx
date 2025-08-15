import React from 'react'
import Mostviews_citys from './Mostviews-citys'

function Weather_card() {


  return (
      // weather card
      <div className='w-full min-h-32 bg-white rounded-2xl overflow-hidden relative p-4 '>
        <div className='absolute size-40 bg-blue-500/60 z-0 animatebgl rounded-full top-0 left-0 blur-[100px]'></div>
        <div className='absolute size-40 bg-rose-500/50 z-0 animatebgr rounded-full top-0 right-0 blur-[100px]'></div>
          <div className=' absoluttop-0 left-0 px-4 w-full flex items-center justify-between'>
            <h1 className='text-sm font-semibold '>India</h1>
            <button type='Submit' className='ri-add-line text-xl hover:text-shadow-blue-500 text-shadow-2xs cursor-pointer rounded-full'></button>
          </div>
        <div className='w-full h-full relative mt- flex flex-col items-center justify-center p-2 pt-0'>
          <div className='w-full h-20 border-b border-zinc-800/10 flex items-center justify-between gap-3'>
            {/* cloud icon and names */}
            <div className='flex items-center justify-start gap-2.5'>
              <div className='w-fit h-full'>
                <i className='ri-cloud-line text-6xl'></i>
              </div>
              <div className='flex flex-col gap-1 items-start justify-center h-fit'>
                <h1 className='text-xl font-semibold leading-none'>Cloudy</h1>
                <p className='text-sm opacity-70 font-medium leading-none'>Sun with a cool</p>
              </div>
            </div>
            {/* weather dc */}
            <div className='w-fit h-fit'>
              <h1 className='text-6xl font-medium leading-none flex items-start justify-start'>28 <span className='text-lg font-black'>o</span></h1>
            </div>
          </div>
          {/* Quality of weather */}
          <div className='w-full h-fit grid grid-cols-3 items-center'>
            <div className='w-full h-full flex flex-col p-3 items-center justify-center'>
              <h1 className='text-lg flex items-start justify-start font-bold'><i class="ri-temp-cold-line"></i>29 <span className='text-sm font-black'>o</span></h1>
              <p className='text-sm font-medium opacity-70'>Sensible</p>
            </div>
            <div className='w-full h-full flex flex-col p-3 items-center justify-center'>
              <h1 className='text-lg flex items-start justify-start font-bold'><i class="ri-contrast-drop-2-line"></i>60 <span className='font-black'>%</span></h1>
              <p className='text-sm font-medium opacity-70'>Humidity</p>
            </div>
            <div className='w-full h-full flex flex-col p-3 items-center justify-center'>
              <h1 className='text-lg flex items-center justify-center font-bold'><i class="ri-windy-line"></i>17<span className='font-medium text-sm ml-0.5'>Km/h</span></h1>
              <p className='text-sm font-medium opacity-70'>Force</p>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Weather_card