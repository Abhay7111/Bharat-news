import React from 'react';

function Storys() {

  const stories = [
    { id: 1, title: 'Story 1', image: 'https://cdn.pixabay.com/photo/2025/01/07/21/44/cats-9317796_960_720.jpg' },
    { id: 1, title: 'Story 1', image: 'https://cdn.pixabay.com/photo/2023/01/04/09/25/boho-7696303_960_720.jpg' },
    { id: 1, title: 'Story 1', image: 'https://cdn.pixabay.com/photo/2023/05/06/07/00/plant-7973730_960_720.jpg' },
    { id: 1, title: 'Story 1', image: 'https://cdn.pixabay.com/photo/2022/12/30/17/10/monstera-7687340_1280.jpg' },
    { id: 1, title: 'Story 1', image: 'https://cdn.pixabay.com/photo/2023/05/21/11/45/monstera-8008394_1280.jpg' },
    { id: 1, title: 'Story 1', image: 'https://cdn.pixabay.com/photo/2023/09/20/11/40/plants-8264654_960_720.jpg' },
    { id: 1, title: 'Story 1', image: 'https://cdn.pixabay.com/photo/2022/12/20/17/27/sheet-7668351_1280.jpg' },
    { id: 1, title: 'Story 1', image: 'https://cdn.pixabay.com/photo/2015/06/06/10/18/clef-799258_1280.jpg' },
    { id: 1, title: 'Story 1', image: 'https://cdn.pixabay.com/photo/2023/02/10/14/09/dandelion-7780950_960_720.jpg' },
    { id: 1, title: 'Story 1', image: 'https://cdn.pixabay.com/photo/2022/09/11/18/23/colors-7447681_1280.jpg' },
    { id: 1, title: 'Story 1', image: 'https://cdn.pixabay.com/photo/2023/03/07/11/58/woman-7835587_960_720.jpg' },
  ]

  return (
    <div className='w-full py-2 overflow-auto'>
      <div className='w-fit h-full gap-5 flex items-center justify-start'>
        {stories.map((items, index) => (
          <div className='size-14 rounded-full bg-transparent border-2 border-zinc-50'>
            <img src={items.image} className='w-full h-full rounded-full object-fill' />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Storys