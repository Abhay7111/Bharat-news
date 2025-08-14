import React from 'react'
import Storys from '../Small-components/Storys'
import Mostviews_citys from '../Small-components/Mostviews-citys'
import Allnews from '../Small-components/Allnews'
import bgimage from '../../assets/backgroundimage.png'

function News() {
  return (
    <div className='bg-zinc-800 relative h-full w-full max-w-[700px] transition-all p-2 bgimage'>
      <img src={bgimage} className=' absolute top-0 left-0 w-full max-w-[700px] h-full object-cover opacity-15' />
      <div className='relative w-full h-full overflow-auto'>
           <div className='w-full flex items-center justify-between h-10 mb-3 z-20'>
              <h1 className='text-2xl font-medium'>Bharat news</h1>
              <div className='size-8 relative bg-zinc-800 rounded-md border border-zinc-200/10 hover:border-zinc-200/40 transition-all duration-300 cursor-pointer flex items-center justify-center'>
                <i className='ri-menu-line text-xl'></i>
              </div>
            </div>
            <Storys/>
            <Mostviews_citys/>
          <div className='w-full min-h-72 p-2 mt-2 rounded-md bg-transparent'>
            <Allnews/>
          </div>
      </div>
    </div>
  )
}

export default News