import React from 'react';
import { NavLink } from 'react-router';

function Mostviews_citys() {

     const cities = [
          {id:1, name: 'City 1', view:'size-16', pos:'end', img: 'https://cdn.pixabay.com/photo/2025/01/07/21/44/cats-9317796_960_720.jpg'},
          {id:2, name: 'City 2', view:'size-32', pos:'start', img: 'https://cdn.pixabay.com/photo/2023/09/20/11/40/plants-8264654_960_720.jpg'},
          {id:3, name: 'City 3', view:'size-14', pos:'center', img: 'https://cdn.pixabay.com/photo/2023/05/21/11/45/monstera-8008394_1280.jpg'},
          {id:4, name: 'City 4', view:'size-24', pos:'center', img: 'https://cdn.pixabay.com/photo/2023/01/04/09/25/boho-7696303_960_720.jpg'},
          {id:5, name: 'City 5', view:'size-16', pos:'start', img: 'https://cdn.pixabay.com/photo/2023/02/10/14/09/dandelion-7780950_960_720.jpg'},
          {id:6, name: 'City 6', view:'size-32', pos:'center', img: 'https://cdn.pixabay.com/photo/2022/09/11/18/23/colors-7447681_1280.jpg'},
          {id:7, name: 'City 7', view:'size-34', pos:'start', img: 'https://cdn.pixabay.com/photo/2023/05/06/07/00/plant-7973730_960_720.jpg'},
          {id:8, name: 'City 8', view:'size-20', pos:'end', img: 'https://cdn.pixabay.com/photo/2022/12/30/17/10/monstera-7687340_1280.jpg'},
          {id:9, name: 'City 9', view:'size-14', pos:'end', img: 'https://cdn.pixabay.com/photo/2022/12/20/17/27/sheet-7668351_1280.jpg'},
     ]

  return (
    <div className='w-full h-[500px] rounded-md p-2 bg-transparent mt-3'>
          <div className='grid grid-cols-3 gap-2'>
               {cities.map((city) => (
                    <div key={city.id} className={`flex flex-col items-${city.pos} justify-center bg-transparent rounded-md p-2`}>
                         <NavLink to={`${city.name}`} className={`${city.view} relative rounded-full`}>
                              <img src={city.img} alt={city.name} className={`${city.view} z-0 object-cover absolute top-0 left-0 rounded-full mb-2 `} />
                              <p className='relative z-10 tracking-tight leading-none w-full text-center top-full mt-1 font-medium text-xs '>{city.name} </p>
                         </NavLink>
                    </div>
               ))}
          </div>
    </div>
  )
}

export default Mostviews_citys