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
  const hasWishedRef = useRef(false);

  const [showCategory, setShowCategory] = useState(false);
  const [categories, setCategories] = useState([]);

  const apiTimeoutRef = useRef(null);
  const apiFallbackSpokenRef = useRef(false);

  // Track if data has been loaded at least once
  const dataLoadedRef = useRef(false);

  // Helper: get a voice, fallback to default if not found
  const getVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    let voice =
      voices.find(v => v.lang === 'en-IN' && v.name && v.name.toLowerCase().includes('google')) ||
      voices.find(v => v.lang === 'en-IN') ||
      voices.find(v => v.lang && v.lang.startsWith('en')) ||
      voices[0] ||
      null;
    return voice;
  };

  // Speak function with fallback for voices not loaded
  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.lang = 'en-IN';

    const setAndSpeak = () => {
      utterance.voice = getVoice();
      utterance.onend = () => {};
      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
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
  const takeCommand = async (msg) => {
    setListening(false);
    const lowerMsg = msg.trim().toLowerCase();
    setChatHistory(prev => [...prev, { type: 'user', text: msg }]);

    // Always fetch data from API before processing the command
    let latestData = [];
    try {
      const res = await axios.get('https://server-01-v2cx.onrender.com/getassistant');
      latestData = Array.isArray(res.data) ? res.data : [];
      setData(latestData); // update state for UI/category list
    } catch (err) {
      setError('Failed to load assistant data for voice command.');
      speak('Sorry, I failed to load my brain.');
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
      return;
    }

    // Only return the data item whose question exactly matches the input (case-insensitive, trimmed)
    let matchedItem = null;
    for (const item of latestData) {
      if (item.question) {
        const q = item.question.trim().toLowerCase();
        if (lowerMsg === q) {
          matchedItem = item;
          break;
        }
      }
    }

    if (matchedItem) {
      const { answer, link, image, file, open } = matchedItem;
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
      setGoogleSearchQuery('');
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
  const handleStartListening = async () => {
    setError('');
    setLoading(true);
    try {
      // Always fetch data from API when starting to listen
      const res = await axios.get('https://server-01-v2cx.onrender.com/getassistant');
      setData(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
      dataLoadedRef.current = true;
    } catch (err) {
      setError('Failed to load assistant data for voice recognition.');
      setLoading(false);
      speak('Sorry, I failed to load my brain.');
      return;
    }
    if (!recognitionRef.current) {
      setError('Speech recognition is not available.');
      return;
    }
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

    let SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser.');
      return;
    }

    // Fix: Always create a new instance and assign to ref
    let recognition;
    try {
      recognition = new SpeechRecognition();
    } catch (e) {
      setError('Speech recognition could not be initialized.');
      return;
    }
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      setListening(false);
      if (event.results && event.results[0] && event.results[0][0]) {
        const transcript = event.results[0][0].transcript;
        // Use async takeCommand to ensure API fetch
        takeCommand(transcript);
      }
    };

    recognition.onerror = (event) => {
      setListening(false);
      // Chrome bug: "no-speech" error fires if mic permission denied or no input
      if (event.error === 'not-allowed' || event.error === 'denied') {
        setError('Microphone access denied. Please allow microphone permission.');
      } else if (event.error === 'no-speech') {
        setError('No speech detected. Please try again.');
      } else {
        setError('Voice recognition error: ' + (event.error || 'Unknown error'));
      }
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    // Clean up on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current = null;
      }
    };
    // eslint-disable-next-line
  }, []);

  // Fetch assistant data with 5s fallback
  useEffect(() => {
    apiFallbackSpokenRef.current = false;
    setLoading(true);

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
        dataLoadedRef.current = true;
        if (apiTimeoutRef.current) {
          clearTimeout(apiTimeoutRef.current);
        }
      } catch (error) {
        setError('Failed to load assistant data.');
        setLoading(false);
        if (apiTimeoutRef.current) {
          clearTimeout(apiTimeoutRef.current);
        }
        if (!apiFallbackSpokenRef.current) {
          speak('Sorry, I failed to load my brain.');
          apiFallbackSpokenRef.current = true;
        }
      }
    };
    fetchData();

    return () => {
      if (apiTimeoutRef.current) {
        clearTimeout(apiTimeoutRef.current);
      }
    };
  }, []);

  // Extract unique categories from data
  useEffect(() => {
    if (data && data.length > 0) {
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
        <div className="mb-4 w-full max-w-full rounded-2xl overflow-hidden border border-zinc-700 bg-zinc-900" style={{ height: 400 }}>
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
