import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const VoiceAssistant = () => {
  const [message, setMessage] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const btnRef = useRef(null);
  const [chatHistory, setChatHistory] = useState([]);
  const chatEndRef = useRef(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [googleSearchQuery, setGoogleSearchQuery] = useState('');
  const [showGoogleButton, setShowGoogleButton] = useState(false);
  const hasWishedRef = useRef(false); // Prevent wishMe from running twice

  // For showing categories when user types "/"
  const [showCategory, setShowCategory] = useState(false);
  const [categories, setCategories] = useState([]);

  // Timer ref for API loading fallback
  const apiTimeoutRef = useRef(null);
  const apiFallbackSpokenRef = useRef(false);

  // Helper: get a voice, fallback to default if not found
  const getVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    // Try to find a suitable English voice
    let voice =
      voices.find(v => v.lang === 'en-IN' && v.name.includes('Google')) ||
      voices.find(v => v.lang === 'en-IN') ||
      voices.find(v => v.lang.startsWith('en')) ||
      voices[0] ||
      null;
    return voice;
  };

  // Speak function with fallback for voices not loaded
  const speak = (text) => {
    if (!window.speechSynthesis) return;
    // Prevent double speaking by cancelling any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.lang = 'en-IN';

    // Sometimes voices are not loaded immediately
    const setAndSpeak = () => {
      utterance.voice = getVoice();
      utterance.onend = () => {
        if (btnRef.current) {
          btnRef.current.click();
        }
      };
      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      // Remove previous handler to avoid multiple triggers
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.onvoiceschanged = setAndSpeak;
    } else {
      setAndSpeak();
    }
  };

  // Greet on load, but only once
  const wishMe = () => {
    if (hasWishedRef.current) return;
    hasWishedRef.current = true;
    const hour = new Date().getHours();
    if (hour < 12) {
      speak('Good morning. How can I help you?');
    } else if (hour < 16) {
      speak('Good afternoon. How can I help you?');
    } else {
      speak('Good evening. How can I help you?');
    }
  };

  // Main command handler
  const takeCommand = (msg) => {
    setListening(false);
    const lowerMsg = msg.trim().toLowerCase();
    setChatHistory(prev => [...prev, { type: 'user', text: msg }]);

    // Try to match exact question
    const found = data.find(item => lowerMsg === (item.question || '').toLowerCase());

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
      if (open && link) {
        window.open(link, '_blank');
      }
      setGoogleSearchQuery(''); // Clear any previous Google search
      setShowGoogleButton(false);
      return;
    }

    // Built-in commands
    if (lowerMsg.includes('play music')) {
      speak('Playing music...');
      window.open('https://www.youtube.com/watch?v=2Vv-BfVoq4g', '_blank');
      setChatHistory(prev => [
        ...prev,
        { type: 'bot', text: 'Playing music...' }
      ]);
      setGoogleSearchQuery('');
      setShowGoogleButton(false);
      return;
    }
    if (lowerMsg.includes('time')) {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      speak(`The time is ${time}`);
      setChatHistory(prev => [...prev, { type: 'bot', text: `The time is ${time}` }]);
      setGoogleSearchQuery('');
      setShowGoogleButton(false);
      return;
    }
    if (lowerMsg.includes('date')) {
      const date = new Date().toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
      speak(`Today's date is ${date}`);
      setChatHistory(prev => [...prev, { type: 'bot', text: `Today's date is ${date}` }]);
      setGoogleSearchQuery('');
      setShowGoogleButton(false);
      return;
    }

    // Fallback: Google search
    const cleaned = lowerMsg.replace(/shipra|shifra/gi, '').trim();
    const fallbackText = cleaned
      ? 'This is what I found on Google: ' + cleaned
      : "Sorry, I didn't understand. Please try again.";
    speak(fallbackText);
    setChatHistory(prev => [...prev, { type: 'bot', text: fallbackText }]);
    if (cleaned) {
      setGoogleSearchQuery(cleaned);
      setShowGoogleButton(true);
    } else {
      setGoogleSearchQuery('');
      setShowGoogleButton(false);
    }
  };

  // Start listening
  const handleStartListening = () => {
    if (!recognitionRef.current) return;
    setListening(true);
    try {
      recognitionRef.current.start();
    } catch (err) {
      setListening(false);
      setError('Could not start voice recognition.');
    }
  };

  // Handle text input submit
  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // If user input is just "/", do not send as command, just show categories
      if (message.trim() === '/') {
        setShowCategory(true);
        return;
      }
      takeCommand(message);
      setMessage('');
      setShowCategory(false);
    }
  };

  // Open Google search in a new tab
  const handleOpenGoogle = () => {
    if (googleSearchQuery) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(googleSearchQuery)}`, '_blank');
    }
  };

  // Setup speech recognition
  useEffect(() => {
    // Only wish once, and only after voices are loaded
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = wishMe;
    } else {
      wishMe();
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser.');
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

    recognition.onerror = (event) => {
      setListening(false);
      setError('Voice recognition error: ' + (event.error || 'Unknown error'));
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    // eslint-disable-next-line
  }, []);

  // Fetch assistant data with 5s fallback
  useEffect(() => {
    apiFallbackSpokenRef.current = false;
    setLoading(true);

    // Set up a 5s timer to speak fallback if data not loaded
    apiTimeoutRef.current = setTimeout(() => {
      if (loading && !apiFallbackSpokenRef.current) {
        speak("I'm still trying to fix it");
        apiFallbackSpokenRef.current = true;
      }
    }, 5000);

    const fetchData = async () => {
      try {
        const res = await axios.get('https://server-01-v2cx.onrender.com/getassistant');
        setData(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
        // If data loads before 5s, clear the timer and don't speak fallback
        if (apiTimeoutRef.current) {
          clearTimeout(apiTimeoutRef.current);
        }
      } catch (error) {
        setError('Failed to load assistant data.');
        setLoading(false);
        if (apiTimeoutRef.current) {
          clearTimeout(apiTimeoutRef.current);
        }
        // Only speak error if not already speaking fallback
        if (!apiFallbackSpokenRef.current) {
          speak('Sorry, I failed to load my brain.');
          apiFallbackSpokenRef.current = true;
        }
      }
    };
    fetchData();

    // Cleanup timer on unmount or rerun
    return () => {
      if (apiTimeoutRef.current) {
        clearTimeout(apiTimeoutRef.current);
      }
    };
  }, []);

  // Extract unique categories from data
  useEffect(() => {
    if (data && data.length > 0) {
      // Assume each item has a "category" field
      const cats = Array.from(
        new Set(
          data
            .map(item => item.category)
            .filter(Boolean)
        )
      );
      setCategories(cats);
    }
  }, [data]);

  // Show/hide category list when user types "/"
  useEffect(() => {
    if (message.trim() === '/') {
      setShowCategory(true);
    } else {
      setShowCategory(false);
    }
  }, [message]);

  // Scroll to bottom on new chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, googleSearchQuery, showCategory]);

  if (loading) return <div className="text-white p-4">Loading assistant data...</div>;

  // Handle category click: fill input with category name and hide list
  const handleCategoryClick = (cat) => {
    setMessage(cat + ' ');
    setShowCategory(false);
  };

  return (
    <div className="h-full w-full bg-zinc-800 flex flex-col justify-end p-4">
      {error && (
        <div className="mb-2 text-red-400 bg-transparent rounded px-3 py-2 text-lg">{error}</div>
      )}
      {/* Chat History */}
      <div className="flex flex-col gap-2 overflow-y-auto h-full mb-4 scroll-smooth">
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`w-full flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 rounded-lg text-white break-words text-sm ${
                chat.type === 'user' ? 'bg-green-600' : 'bg-blue-600'
              }`}
            >
              {chat.text && <div className="mb-1"><p>{chat.text}</p></div>}

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

      {/* Category List */}
      {showCategory && categories.length > 0 && (
        <div className="mb-2 w-full max-w-full rounded-xl overflow-hidden border border-zinc-700 bg-zinc-900 shadow-lg z-10">
          <div className="p-3">
            <div className="mb-2 text-cyan-300 font-semibold text-sm">Categories</div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat, idx) => (
                <button
                  key={cat + idx}
                  type="button"
                  onClick={() => handleCategoryClick(cat)}
                  className="bg-zinc-700 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Google Search Results */}
      {googleSearchQuery && (
        <div className="mb-4 w-full max-w-full rounded-2xl overflow-hidden border border-zinc-700 bg-zinc-900" style={{ height: 1000 }}>
          <iframe
            title="Google Search"
            src={`https://www.bing.com/search?q=${encodeURIComponent(googleSearchQuery)}`}
            style={{ width: '100%', height: '100%', border: 'none' }}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
          <div className="flex justify-end p-2 bg-zinc-900 ">
            <button
              onClick={handleOpenGoogle}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
            >
              Open in Google
            </button>
          </div>
        </div>
      )}

      {/* Input & Buttons */}
      <form onSubmit={handleInputSubmit} className="flex gap-2 w-full relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 p-3 border border-gray-300/30 text-white bg-zinc-800 rounded-md focus:outline-none focus:ring focus:ring-zinc-500"
          autoComplete="off"
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
            listening ? 'bg-zinc-700 hover:bg-zinc-800' : 'bg-zinc-800 hover:bg-zinc-700'
          }`}
          disabled={listening}
          aria-label="Start voice recognition"
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
