import React from 'react'
import Storys from '../Small-components/Storys'
import Mostviews_citys from '../Small-components/Mostviews-citys'

function News() {
  return (
    <div className='bg-zinc-800 h-full w-full max-w-[700px] transition-all p-2'>
      <div className='w-full flex items-center justify-between h-10 mb-3'>
        <h1 className='text-2xl font-medium'>Bharat news</h1>
        <div className='size-8 bg-zinc-800 rounded-md border border-zinc-200/10 hover:border-zinc-200/40 transition-all duration-300 cursor-pointer flex items-center justify-center'>
          <i className='ri-menu-line text-xl'></i>
        </div>
      </div>
     <Storys/>
     <Mostviews_citys/>
    </div>
  )
}

export default News