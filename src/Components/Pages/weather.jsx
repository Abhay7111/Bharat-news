import React from 'react'
import Weather_card from '../Small-components/Wether_card'
import Weather_deails from '../Small-components/Weather_deails'

function weather() {
  return (
    <div className='w-full h-fit text-zinc-800 flex flex-col gap-2'>
     <Weather_card/>
     <div className='w-full h-fit text-white '>
          {/* <Weather_deails/> */}
     </div>
    </div>
  )
}

export default weather