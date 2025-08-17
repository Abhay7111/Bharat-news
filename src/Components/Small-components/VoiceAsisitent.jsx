import React, { useEffect, useRef, useState } from 'react';
import Resume from '../../assets/Abhay_vishwakarma_Resume.pdf';

const VoiceAssistant = () => {
  const [message, setMessage] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const btnRef = useRef(null);
  const [chatHistory, setChatHistory] = useState([]);
  const chatEndRef = useRef(null); // To scroll to bottom

  const data = [
    {
      id: '1',
      question: 'who are you',
      answer: 'I am Bharat news voice assistant, how can I help you?',
      open:false,
      link: '',
      image: '',
      file: ''
    },
    {
      id: '2',
      question: 'what is your name',
      answer: 'My name is Bharat news AI assistant.',
      open:false,
      link: '',
      image: '',
      file: ''
    },
    {
      id: '3',
      question: 'how are you',
      answer: 'I am just a bunch of code, but I am doing great!',
      open:false,
      link: '',
      image: '',
      file: ''
    },
    {
      id: '4',
      question: 'abhay portfolio',
      answer: 'Here is the portfolio link.',
      open:false,
      link: 'https://abhay7111-pr.netlify.app/',  
      image: '',
      file: ''
    },
    {
      id: '5',
      question: 'show image',
      answer: 'Here is the image you asked for.',
      open:false,
      image: 'https://via.placeholder.com/200',
      link: '',
      file: ''
    },
    {
      id: '6',
      question: 'get resume',
      answer: 'You can download the resume from below.',
      open:false,
      file: Resume,
      image: '',
      link: ''
    },
    {
      id: '7',
      question: 'abhay image',
      answer: "This is abhay's image you asked for.",
      open:false,
      file: '',
      image: 'https://avatars.githubusercontent.com/u/142080096?v=4',
      link: ''
    },
    {
      id: '8',
      question: 'open abhay github',
      answer: "Opening Abhay's GitHub profile. of abhay",
      open:true,
      file: '',
      image: 'https://avatars.githubusercontent.com/u/142080096?v=4',
      link: 'https://github.com/abhay7111'
    },
    {
      id: '9',
      question: 'open youtube',
      answer: "Opening YouTube.",
      open:true,
      file: '',
      image: '',
      link: 'https://youtube.com'
    },
    {
      id: '10',
      question: 'open whatsapp',
      answer: "Opening whatsapp.",
      open:true,
      file: '',
      image: '',
      link: 'whatsapp://send?text=Hello this is a test message'
    },
    {
      id: '11',
      question: 'open BGMI',
      answer: "Opening BGMI.",
      open:true,
      file: '',
      image: '',
      link: ''
    },
    {
      id: '12',
      question: 'open google',
      answer: "Opening Google",
      open:true,
      file: '',
      image: '',
      link: 'https://www.google.com'
    },
    {
      id: '13',
      question: 'open gemini',
      answer: "Opening Google",
      open:true,
      file: '',
      image: '',
      link: 'https://gemini.google.com/'
    },
  ];

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.3;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.lang = 'en-IN';

    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find(v => v.name === 'Google India हिन्दी') || null;

    utterance.onend = () => {
      if (btnRef.current) {
        btnRef.current.click();
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const wishMe = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      speak('Good morning sir. How can I help you?');
    } else if (hour < 16) {
      speak('Good afternoon sir. How can I help you?');
    } else {
      speak('Good evening sir. How can I help you?');
    }
  };

  const takeCommand = (msg) => {
    setListening(false);

    const lowerMsg = msg.trim().toLowerCase();
    setChatHistory(prev => [...prev, { type: 'user', text: msg }]);

    const found = data.find(item => lowerMsg === item.question.toLowerCase());

    if (found) {
      const { answer, link, image, file, open } = found;
      setChatHistory(prev => [
        ...prev,
        {
          type: 'bot',
          text: answer,
          link,
          image,
          file,
          open
        }
      ]);
      speak(answer);
      if (open) {
            window.open(link, '_blank');
      }
      return;
    }

    if (lowerMsg.includes('play music')) {
      speak('Playing music...');
      window.open('https://www.youtube.com/watch?v=2Vv-BfVoq4g', '_blank');
    } else if (lowerMsg.includes('time')) {
      const time = new Date().toLocaleString(undefined, {
        hour: 'numeric',
        minute: 'numeric'
      });
      speak(`The time is ${time}`);
      setChatHistory(prev => [...prev, { type: 'bot', text: `The time is ${time}` }]);
    } else if (lowerMsg.includes('date')) {
      const date = new Date().toLocaleString(undefined, {
        day: 'numeric',
        month: 'short'
      });
      speak(`Today's date is ${date}`);
      setChatHistory(prev => [...prev, { type: 'bot', text: `Today's date is ${date}` }]);
    } else {
      const cleaned = lowerMsg.replace(/shipra|shifra/gi, '').trim();
      const fallbackText = 'This is what I found on Google: ' + cleaned;
      speak(fallbackText);
      setChatHistory(prev => [...prev, { type: 'bot', text: fallbackText }]);
      window.open(`https://www.google.com/search?q=${cleaned}`, '_blank');
    }
  };

  const handleStartListening = () => {
    setListening(true);
    recognitionRef.current.start();
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      takeCommand(message);
      setMessage('');
    }
  };

  useEffect(() => {
    wishMe();

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition not supported.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      takeCommand(transcript);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  // Scroll to bottom on new chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  return (
    <div className="h-full w-full bg-zinc-800 flex flex-col justify-end p-4">
      {/* Chat History */}
      <div className="flex flex-col gap-2 overflow-y-auto h-full mb-4 scroll-smooth">
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`w-full flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 rounded-lg text-white  break-words text-sm  ${
                chat.type === 'user' ? 'bg-green-600' : 'bg-blue-600'
              }`}
            >
              {chat.text && <div className="mb-1 "><p className=''>{chat.text}</p></div>}

              {chat.link && (
                <a
                  href={chat.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-300 underline text-sm block text-wrap"
                >
                  🔗 Open Link
                </a>
              )}

              {chat.image && (
                <img
                  src={chat.image}
                  alt="chat-img"
                  className="mt-2 rounded-md max-w-[200px]"
                />
              )}

              {chat.file && (
                <a
                  href={chat.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="text-yellow-300 underline text-sm block mt-1"
                >
                  📎 Download File
                </a>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input & Buttons */}
      <form onSubmit={handleInputSubmit} className="flex gap-2 w-full">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 p-3 border border-gray-300/30 text-white bg-zinc-800 rounded-md focus:outline-none focus:ring focus:ring-zinc-500"
        />
        <button
          type="submit"
          className="bg-zinc-800 border border-zinc-100/30 text-white size-12 flex items-center justify-center rounded-md hover:bg-blue-700 transition"
        >
          <i className="ri-send-plane-fill text-2xl"></i>
        </button>
        <button
          ref={btnRef}
          onClick={handleStartListening}
          type="button"
          className={`flex items-center cursor-pointer justify-center size-12 rounded-md border border-zinc-100/30 overflow-hidden text-white font-semibold transition text-xl ${
            listening
              ? 'bg-zinc-700 hover:bg-zinc-800'
              : 'bg-zinc-800 hover:bg-zinc-700'
          }`}
        >
          {listening ? (
            <i className="ri-voice-ai-line"></i>
          ) : (
            <i className="ri-mic-off-line font-light"></i>
          )}
        </button>
      </form>
    </div>
    
  );
};

export default VoiceAssistant;
