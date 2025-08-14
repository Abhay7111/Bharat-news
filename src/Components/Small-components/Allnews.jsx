import React from 'react'
import { NavLink } from 'react-router'

function Allnews() {
     const news = [
          {
               id:'1',
               view:'120',
               cityname:'Khalilabad',
               postedday:'Today',
               posted:'9 am',
               tag:[
                    {id:'1', name:'acsident',},
                    {id:'2', name:'khalilabad',},
                    {id:'3', name:'car-crash',}
               ],
               title:'Sandigdh case in khalilabad city : ek uvak ki achanak se...',
               discription:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis ipsam atque explicabo delectus cum labore aliquid ullam. Temporibus cupiditate consequatur maxime odit nihil labore, eaque repellat? Explicabo quia placeat voluptatum!',
               logo:'https://cdn.pixabay.com/photo/2022/12/30/17/10/monstera-7687340_1280.jpg',
               image:'https://cdn.pixabay.com/photo/2016/04/05/01/49/crash-1308575_960_720.jpg',
          },
          {
               id:'2',
               view:'48',
               cityname:'gorakhpur',
               postedday:'yesterday',
               posted:'9 am',
               tag:[
                    {id:'1', name:'acsident',},
                    {id:'2', name:'car-crash',}
               ],
               title:'Sandigdh case in khalilabad city : sdfa sdasd fsdf of....',
               discription:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis ipsam atque explicabo delectus cum labore aliquid ullam. Temporibus cupiditate consequatur maxime odit nihil labore, eaque repellat? Explicabo quia placeat voluptatum!',
               logo:'https://cdn.pixabay.com/photo/2023/05/21/11/45/monstera-8008394_1280.jpg',
               image:'https://cdn.pixabay.com/photo/2018/05/03/08/52/car-3370706_640.jpg',
          },
          {
               id:'2',
               view:'87',
               cityname:'lucknow',
               postedday:'11 days ago',
               posted:'9 am',
               tag:[
                    {id:'1', name:'new-car',},
                    {id:'2', name:'car',}
               ],
               title:'Sandigdh case in khalilabad city : sdfa sdasd fsdf of....',
               discription:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis ipsam atque explicabo delectus cum labore aliquid ullam. Temporibus cupiditate consequatur maxime odit nihil labore, eaque repellat? Explicabo quia placeat voluptatum!',
               logo:'https://cdn.pixabay.com/photo/2023/05/21/11/45/monstera-8008394_1280.jpg',
               image:'https://cdn.pixabay.com/photo/2024/07/13/07/40/cars-8891625_1280.jpg',
          },
     ]
  return (
    <>{news.map((items)=> (
     <div className='w-full mt-5 min-h-20 flex flex-col items-center justify-start'>
          <div className='w-full h-10 flex items-center justify-between gap-2'>
               <div className='flex gap-2 items-start'>
                    <NavLink to={`${items.cityname}`} className='size-9 bg-blue-400 rounded-full'><img src={items.logo} className='w-full h-full object-cover rounded-full' /></NavLink>
                    <NavLink to={`${items.cityname}`} className='flex flex-col justify-start items-start'>
                         <h1 className='text-2xl leading-none font-medium flex items-center justify-start gap-2'> {items.cityname}</h1>
                         <div className='text-sm flex items-center justify-start opacity-80 font-light gap-2'><span>{items.postedday}</span> <span>{items.posted}</span></div>
                    </NavLink>
               </div>
               <div className='w-fit flex items-center justify-end gap-2 '>
                    <button type="submit" className='text-sm font-medium px-3 py-1 bg-zinc-800 rounded-full border border-zinc-600 hover:border-zinc-500 active:border-none outline-none cursor-pointer'>Notify me</button>
                    <i className='ri-more-2-fill'></i>
               </div>
          </div>
          <NavLink to={`${items.cityname}/${items.title}`} className='w-full min-h-20 bg-transparent mt-2'>
               <img src={items.image} alt="not found" className='rounded-xl w-full max-h-[800px] object-cover object-center' />
          </NavLink>
          <div className='w-full mt-4 flex items-start gap-3'>
               <NavLink to={`${items.cityname}/${items.title}`} className='min-w-10 h-6 text-nowrap px-3 border border-zinc-700 rounded-lg hover:border-zinc-600 cursor-pointer transition-all flex items-center justify-center'>
                    <p className='text-xs font-extralight' title={`${items.view} peopls readed`}>R: {items.view}</p>
               </NavLink>
               <div className='w-full flex flex-col'>
                    <h2 className='text-xl text-nowrap w-full h-fit'>{items.title}</h2>
                    <div className='flex gap-2 '>
                         {items.tag.map((tag) => (
                         <NavLink to={`tag/${tag.name}`} className=''>#{tag.name}</NavLink>
                    ))}
                    </div>
               </div>
          </div>
     </div>
    ))}</>
  )
}

export default Allnews