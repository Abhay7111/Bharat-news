import React from 'react'
import Storys from '../Small-components/Storys'
import Mostviews_citys from '../Small-components/Mostviews-citys'
import Allnews from '../Small-components/Allnews'
import bgimage from '../../assets/backgroundimage.png'
import { NavLink, Outlet } from 'react-router'

function News() {

  const buttons = [
    {id:'1', icon:'', name:'All',},
    {id:'2', icon:'rainy', name:'wether',},
    {id:'3', icon:'basketball', name:'Sports',},
    {id:'4', icon:'book-read', name:'Education',},
    {id:'5', icon:'building', name:'City',},
  ]

  return (
    <div className='bg-zinc-800 text-white relative h-full w-full max-w-[700px] heightminus transition-all p-2'>
      <img src={bgimage} className=' absolute top-0 left-0 w-full max-w-[700px] h-full object-cover opacity-15' />
      <div className='relative w-full h-full overflow-auto'>
           <div className='w-full flex items-center justify-between h-10 mb-3 z-20'>
              <h1 className='text-2xl font-medium'>Bharat news</h1>
              <div className='size-8 relative bg-zinc-800 rounded-md border border-zinc-200/10 hover:border-zinc-200/40 transition-all duration-300 cursor-pointer flex items-center justify-center'>
                <i className='ri-menu-line text-xl'></i>
              </div>
            </div>
            <Storys/>
            <div className='w-full h-10 px-2 flex items-center justify-start gap-2 rounded-md my-2 overflow-x-auto'>
              {buttons.map((button) => (
                <NavLink to={`${button.name}`} key={button.id} className={({isActive})=>`text-sm font-medium px-3.5 py-0.5 ${isActive? 'bg-zinc-100 text-black ' : ' text-white bg-zinc-800'} rounded-full border border-zinc-600 hover:border-zinc-500 cursor-pointer flex items-center gap-1`}> <i className={`ri-${button.icon}-line text-lg font-extralight`}></i> {button.name}</NavLink>
              ))}
            </div>
          <div className='w-full min-h-72 p-2 mt-2 rounded-md bg-transparent'>
            <Outlet/>
          </div>
      </div>
    </div>
  )
}

export default News