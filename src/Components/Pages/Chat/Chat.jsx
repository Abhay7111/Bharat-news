import React, { useState } from 'react'
import VoiceAssistant from '../../Small-components/VoiceAsisitent';

function Chat() {
  const [opensearch, setopensearch] = useState(false);
  return (
    <div className='w-full max-w-[700px] heightminus bg-zinc-800 h-full flex flex-col items-center'>
      <div className='w-full h-full'><VoiceAssistant/></div>
    </div>
  )
}

export default Chat