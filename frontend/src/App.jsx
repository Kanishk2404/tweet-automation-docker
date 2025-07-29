import { useState, useRef, useEffect } from 'react'
import './App.css'
import TweetHistory from './components/TweetHistory';
import ThreadModal from './components/ThreadModal';


import BulkPromptInput from './components/BulkPromptInput';
import SchedulePicker from './components/SchedulePicker';


const BACKEND_URL = import.meta.env.VITE_API_URL;

function App() {
  // Built-in keys from Vite environment variables
  const DEFAULT_PERPLEXITY_KEY = import.meta.env.VITE_PERPLEXITY_API_KEY || '';
  const DEFAULT_GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
  const DEFAULT_OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
  // Ref for TweetHistory
  const tweetHistoryRef = useRef(null);
  // Load from localStorage if available
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || '');
  const [perplexityApiKey, setPerplexityApiKey] = useState(() => localStorage.getItem('perplexityApiKey') || '');
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('geminiApiKey') || '');
  const [openaiApiKey, setOpenaiApiKey] = useState(() => localStorage.getItem('openaiApiKey') || '');
  const [usePerplexity, setUsePerplexity] = useState(() => localStorage.getItem('usePerplexity') === 'true');
  const [useGemini, setUseGemini] = useState(() => localStorage.getItem('useGemini') === 'true');
  const [useOpenAI, setUseOpenAI] = useState(() => localStorage.getItem('useOpenAI') === 'true');
  const [twitterApiKey, setTwitterApiKey] = useState(() => localStorage.getItem('twitterApiKey') || '');
  const [twitterApiSecret, setTwitterApiSecret] = useState(() => localStorage.getItem('twitterApiSecret') || '');
  const [twitterAccessToken, setTwitterAccessToken] = useState(() => localStorage.getItem('twitterAccessToken') || '');
  const [twitterAccessSecret, setTwitterAccessSecret] = useState(() => localStorage.getItem('twitterAccessSecret') || ''); 
  const [tweetContent, setTweetContent] = useState('');
  const [useOwnKeys, setUseOwnKeys] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [showThreadModal, setShowThreadModal] = useState(false);
  const [threadTweets, setThreadTweets] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [threadPrompt, setThreadPrompt] = useState('');
  // Track the last AI image URL (for OpenAI)
  const [aiImageUrl, setAiImageUrl] = useState('');
  const [showBulkPromptInput, setShowBulkPromptInput] = useState(false);
  // Bulk prompts state
  const [bulkGeneratedTweets, setBulkGeneratedTweets] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false); // global loading for initial bulk
  const [promptLoading, setPromptLoading] = useState({}); // per-prompt loading
  const [bulkError, setBulkError] = useState('');
  const [showBulkReview, setShowBulkReview] = useState(false);
  const [editingTweetIdx, setEditingTweetIdx] = useState(null);
  const [editingTweetValue, setEditingTweetValue] = useState('');
  // Bulk scheduling state
  const [bulkScheduleType, setBulkScheduleType] = useState('once');
  const [bulkTimes, setBulkTimes] = useState(['']);
  const [bulkStartDate, setBulkStartDate] = useState(''); // Single start date for all
  const [bulkScheduleError, setBulkScheduleError] = useState('');
  const [bulkScheduleSuccess, setBulkScheduleSuccess] = useState('');

  // Handler for scheduling all tweets in bulk
  const handleBulkSchedule = async () => {
    setBulkScheduleError('');
    setBulkScheduleSuccess('');
    try {
      // Prepare payload
      const tweets = bulkGeneratedTweets.map(t => ({ prompt: t.prompt, tweet: t.tweet }));
      // Use the selected start date or today if not set
      const today = new Date().toISOString().slice(0, 10);
      const startDate = bulkStartDate || today;
      const payload = {
        tweets,
        scheduleType: bulkScheduleType,
        times: bulkTimes,
        dates: [startDate],
        userName,
        twitterApiKey,
        twitterApiSecret,
        twitterAccessToken,
        twitterAccessSecret
      };
      const response = await fetch(`${BACKEND_URL}/schedule-bulk-tweets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success) {
        setBulkScheduleSuccess(data.message || 'Bulk tweets scheduled!');
        setBulkScheduleError('');
        // Optionally clear review or refresh scheduled tweets
      } else {
        setBulkScheduleError(data.message || 'Failed to schedule bulk tweets.');
        setBulkScheduleSuccess('');
      }
    } catch (err) {
      setBulkScheduleError('Error connecting to backend for bulk scheduling.');
      setBulkScheduleSuccess('');
    }
  };
  // const [schedule, setSchedule] = useState({ type: 'once', times: null });
  // Scheduled tweets state
  const [scheduledTweets, setScheduledTweets] = useState([]);
  const [showScheduled, setShowScheduled] = useState(false);

  // Fetch scheduled tweets for the logged-in user
  const fetchScheduledTweets = () => {
    fetch(`${BACKEND_URL}/scheduled-tweets`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setScheduledTweets(data.scheduledTweets || []);
        }
      });
  };
  useEffect(() => {
    if (isLoggedIn) {
      fetchScheduledTweets();
    }
  }, [isLoggedIn, showScheduled]);

  // Handler to delete a scheduled tweet
  const handleDeleteScheduled = async (id) => {
    if (!window.confirm('Are you sure you want to delete this scheduled post?')) return;
    try {
      const response = await fetch(`${BACKEND_URL}/scheduled-tweets/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data.success) {
        fetchScheduledTweets();
      } else {
        alert(data.message || 'Failed to delete scheduled post.');
      }
    } catch (err) {
      alert('Error deleting scheduled post.');
    }
  };
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const [scheduledDateTime, setScheduledDateTime] = useState('');
  const [showSchedulePicker, setShowSchedulePicker] = useState(false);

  // Bulk prompt submit: send to backend, get generated tweets, show review UI
  const handleBulkSubmit = async (promptsArray) => {
    setBulkLoading(true);
    setBulkError('');
    setBulkGeneratedTweets([]);
    setShowBulkReview(true);
    setPromptLoading({});
    // Compose AI provider info
    const aiProviders = [];
    if (usePerplexity) aiProviders.push('perplexity');
    if (useGemini) aiProviders.push('gemini');
    if (useOpenAI) aiProviders.push('openai');
    // Process prompts one by one
    for (let i = 0; i < promptsArray.length; i++) {
      const prompt = promptsArray[i];
      setPromptLoading(prev => ({ ...prev, [i]: true }));
      try {
        const payload = {
          prompts: [prompt],
          aiProviders,
          useOwnKeys,
          perplexityApiKey,
          geminiApiKey,
          openaiApiKey
        };
        const response = await fetch(`${BACKEND_URL}/generate-bulk-tweets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (data.success && Array.isArray(data.results) && data.results.length > 0) {
          setBulkGeneratedTweets(prev => [...prev, data.results[0]]);
        } else {
          setBulkGeneratedTweets(prev => [...prev, { prompt, tweet: '', error: data.message || 'Failed to generate tweet.' }]);
        }
      } catch (err) {
        setBulkGeneratedTweets(prev => [...prev, { prompt, tweet: '', error: 'Error connecting to backend for bulk generation.' }]);
      }
      setPromptLoading(prev => ({ ...prev, [i]: false }));
    }
    setBulkLoading(false);
    setShowBulkPromptInput(false);
  };

  // Edit and regenerate a single prompt in the review list
  const handleEditTweet = (idx) => {
    setEditingTweetIdx(idx);
    setEditingTweetValue(bulkGeneratedTweets[idx].tweet);
  };

  const handleSaveEditTweet = (idx) => {
    setBulkGeneratedTweets(prev => prev.map((item, i) => i === idx ? { ...item, tweet: editingTweetValue } : item));
    setEditingTweetIdx(null);
    setEditingTweetValue('');
  };

  // Save to localStorage on change
  useEffect(() => {
    if (userName !== '') localStorage.setItem('userName', userName);
  }, [userName]);
  useEffect(() => {
    if (perplexityApiKey !== '') localStorage.setItem('perplexityApiKey', perplexityApiKey);
  }, [perplexityApiKey]);
  useEffect(() => {
    if (geminiApiKey !== '') localStorage.setItem('geminiApiKey', geminiApiKey);
  }, [geminiApiKey]);
  useEffect(() => {
    if (openaiApiKey !== '') localStorage.setItem('openaiApiKey', openaiApiKey);
  }, [openaiApiKey]);
  useEffect(() => {
    localStorage.setItem('usePerplexity', usePerplexity);
  }, [usePerplexity]);
  useEffect(() => {
    localStorage.setItem('useGemini', useGemini);
  }, [useGemini]);
  useEffect(() => {
    localStorage.setItem('useOpenAI', useOpenAI);
  }, [useOpenAI]);
  useEffect(() => {
    if (twitterApiKey !== '') localStorage.setItem('twitterApiKey', twitterApiKey);
  }, [twitterApiKey]);
  useEffect(() => {
    if (twitterApiSecret !== '') localStorage.setItem('twitterApiSecret', twitterApiSecret);
  }, [twitterApiSecret]);
  useEffect(() => {
    if (twitterAccessToken !== '') localStorage.setItem('twitterAccessToken', twitterAccessToken);
  }, [twitterAccessToken]);
  useEffect(() => {
    if (twitterAccessSecret !== '') localStorage.setItem('twitterAccessSecret', twitterAccessSecret);
  }, [twitterAccessSecret]);

  // Helper to convert base64 dataURL to File
  function dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    for (let i = 0; i < n; i++) u8arr[i] = bstr.charCodeAt(i);
    return new File([u8arr], filename, { type: mime });
  }

  const handleGenerateAIImage = async () => {
    const aiKeys = {};
    // Use user's keys if provided, else use built-in keys
    if (useOwnKeys) {
      if (openaiApiKey) aiKeys.openaiApiKey = openaiApiKey;
    }
    const payload = {
      prompt: imagePrompt || tweetContent,
      ...aiKeys,
      useOwnKeys
    };
    console.log('Image generation payload:', payload);
    setIsImageLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/generate-ai-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success && data.image) {
        setImagePreview(data.image); // Show the generated image as preview
        if (data.image.startsWith('data:image/')) {
          const file = dataURLtoFile(data.image, 'ai-image.png');
          setSelectedImage(file);
          setAiImageUrl('');
          setIsImageLoading(false);
        } else if (data.image.startsWith('http')) {
          setSelectedImage(null);
          setAiImageUrl(data.image);
          setIsImageLoading(false);
        } else {
          setSelectedImage(null);
          setAiImageUrl('');
          setIsImageLoading(false);
        }
      } else {
        alert('AI image generation failed: ' + (data.message || 'Unknown error'));
        setIsImageLoading(false);
      }
    } catch (err) {
      alert('Error connecting to backend for AI image generation.');
      setIsImageLoading(false);
    }
  };

  return (
    <>
      <h1>Tweet Automator</h1>
      {!isLoggedIn ? (
        <div className="login-container">
          <h2 style={{textAlign: 'center', marginBottom: '1rem'}}>Welcome to Tweet Automator</h2>
          <p style={{textAlign: 'center', color: '#555', marginBottom: '1.5rem'}}>Submit your API keys to continue</p>
          <div className="input-section" style={{
            background: '#f7f8fa',
            borderRadius: 10,
            boxShadow: '0 1px 6px #0001',
            padding: '24px 32px',
            marginBottom: '2rem',
            maxWidth: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}>
            <div style={{marginBottom: '1rem', textAlign: 'center'}}>
              <label style={{fontWeight: 600, marginRight: 12}}>API Key Mode:</label>
              <label style={{marginRight: 16}}>
                <input type="radio" checked={useOwnKeys} onChange={() => setUseOwnKeys(true)} /> Use your own API keys
              </label>
              <label>
                <input type="radio" checked={!useOwnKeys} onChange={() => setUseOwnKeys(false)} /> Use pre-existing keys
              </label>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
              <span role="img" aria-label="user" style={{fontSize: 22}}>👤</span>
              <input
                type="text"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                onFocus={e => {
                  if (!userName && localStorage.getItem('userName')) {
                    setUserName(localStorage.getItem('userName'));
                  }
                }}
                placeholder="Your Name"
                className="login-input"
                autoComplete="username"
                name="username"
                style={{flex: 1}}
              />
            </div>
            <>
              <div style={{marginBottom: '0.5rem'}}>
                <label style={{fontWeight: 600, marginRight: 8}}>AI Providers:</label>
                <span title="Use Perplexity AI for tweet generation" style={{marginRight: 12}}>
                  <input type="checkbox" checked={usePerplexity} onChange={e => {
                    setUsePerplexity(e.target.checked);
                    if (!e.target.checked) {
                      setPerplexityApiKey('');
                      localStorage.removeItem('perplexityApiKey');
                    }
                  }} disabled={!useOwnKeys} /> <span role="img" aria-label="perplexity">🧠</span> Perplexity
                </span>
                <span title="Use Gemini AI for tweet generation" style={{marginRight: 12}}>
                  <input type="checkbox" checked={useGemini} onChange={e => {
                    setUseGemini(e.target.checked);
                    if (!e.target.checked) {
                      setGeminiApiKey('');
                      localStorage.removeItem('geminiApiKey');
                    }
                  }} disabled={!useOwnKeys} /> <span role="img" aria-label="gemini">🌈</span> Gemini
                </span>
                <span title="Use OpenAI for tweet generation">
                  <input type="checkbox" checked={useOpenAI} onChange={e => {
                    setUseOpenAI(e.target.checked);
                    if (!e.target.checked) {
                      setOpenaiApiKey('');
                      localStorage.removeItem('openaiApiKey');
                    }
                  }} disabled={!useOwnKeys} /> <span role="img" aria-label="openai">🤖</span> OpenAI
                </span>
              </div>
              {usePerplexity && (
                <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                  <span role="img" aria-label="perplexity" style={{fontSize: 20}}>🧠</span>
                  <input
                    type="password"
                    value={perplexityApiKey}
                    onChange={e => setPerplexityApiKey(e.target.value)}
                    onFocus={e => {
                      if (!perplexityApiKey && localStorage.getItem('perplexityApiKey')) {
                        setPerplexityApiKey(localStorage.getItem('perplexityApiKey'));
                      }
                    }}
                    placeholder="Perplexity API Key"
                    className="login-input"
                    autoComplete="off"
                    name="perplexity-api-key"
                    style={{flex: 1}}
                    disabled={!useOwnKeys}
                  />
                  <span title="Get your Perplexity API key from perplexity.ai" style={{color: '#888', fontSize: 14}}>?</span>
                </div>
              )}
              {useGemini && (
                <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                  <span role="img" aria-label="gemini" style={{fontSize: 20}}>🌈</span>
                  <input
                    type="password"
                    value={geminiApiKey}
                    onChange={e => setGeminiApiKey(e.target.value)}
                    onFocus={e => {
                      if (!geminiApiKey && localStorage.getItem('geminiApiKey')) {
                        setGeminiApiKey(localStorage.getItem('geminiApiKey'));
                      }
                    }}
                    placeholder="Gemini API Key"
                    className="login-input"
                    autoComplete="off"
                    name="gemini-api-key"
                    style={{flex: 1}}
                    disabled={!useOwnKeys}
                  />
                  <span title="Get your Gemini API key from makersuite.google.com" style={{color: '#888', fontSize: 14}}>?</span>
                </div>
              )}
              {useOpenAI && (
                <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                  <span role="img" aria-label="openai" style={{fontSize: 20}}>🤖</span>
                  <input
                    type="password"
                    value={openaiApiKey}
                    onChange={e => setOpenaiApiKey(e.target.value)}
                    onFocus={e => {
                      if (!openaiApiKey && localStorage.getItem('openaiApiKey')) {
                        setOpenaiApiKey(localStorage.getItem('openaiApiKey'));
                      }
                    }}
                    placeholder="OpenAI API Key"
                    className="login-input"
                    autoComplete="off"
                    name="openai-api-key"
                    style={{flex: 1}}
                    disabled={!useOwnKeys}
                  />
                  <span title="Get your OpenAI API key from platform.openai.com" style={{color: '#888', fontSize: 14}}>?</span>
                </div>
              )}
            </>
            <div style={{marginTop: '1rem', marginBottom: '0.5rem', fontWeight: 600, fontSize: 16}}>Twitter Credentials</div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px',
              alignItems: 'stretch',
              marginBottom: '1rem',
              width: '100%',
              maxWidth: '700px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                <span role="img" aria-label="twitter" style={{fontSize: 20}}>🐦</span>
                <input
                  type="password"
                  value={twitterApiKey}
                  onChange={e => setTwitterApiKey(e.target.value)}
                  onFocus={e => {
                    if (!twitterApiKey && localStorage.getItem('twitterApiKey')) {
                      setTwitterApiKey(localStorage.getItem('twitterApiKey'));
                    }
                  }}
                  placeholder="Twitter API Key"
                  className="login-input"
                  autoComplete="off"
                  name="twitter-api-key"
                  style={{flex: 1, minWidth: 0, width: '100%'}}
                />
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                <span role="img" aria-label="twitter" style={{fontSize: 20}}>🐦</span>
                <input
                  type="password"
                  value={twitterApiSecret}
                  onChange={e => setTwitterApiSecret(e.target.value)}
                  onFocus={e => {
                    if (!twitterApiSecret && localStorage.getItem('twitterApiSecret')) {
                      setTwitterApiSecret(localStorage.getItem('twitterApiSecret'));
                    }
                  }}
                  placeholder="Twitter API Secret"
                  className="login-input"
                  autoComplete="off"
                  name="twitter-api-secret"
                  style={{flex: 1, minWidth: 0, width: '100%'}}
                />
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                <span role="img" aria-label="twitter" style={{fontSize: 20}}>🐦</span>
                <input
                  type="password"
                  value={twitterAccessToken}
                  onChange={e => setTwitterAccessToken(e.target.value)}
                  onFocus={e => {
                    if (!twitterAccessToken && localStorage.getItem('twitterAccessToken')) {
                      setTwitterAccessToken(localStorage.getItem('twitterAccessToken'));
                    }
                  }}
                  placeholder="Twitter Access Token"
                  className="login-input"
                  autoComplete="off"
                  name="twitter-access-token"
                  style={{flex: 1, minWidth: 0, width: '100%'}}
                />
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                <span role="img" aria-label="twitter" style={{fontSize: 20}}>🐦</span>
                <input
                  type="password"
                  value={twitterAccessSecret}
                  onChange={e => setTwitterAccessSecret(e.target.value)}
                  onFocus={e => {
                    if (!twitterAccessSecret && localStorage.getItem('twitterAccessSecret')) {
                      setTwitterAccessSecret(localStorage.getItem('twitterAccessSecret'));
                    }
                  }}
                  placeholder="Twitter Access Secret"
                  className="login-input"
                  autoComplete="off"
                  name="twitter-access-secret"
                  style={{flex: 1, minWidth: 0, width: '100%'}}
                />
              </div>
            </div>
          </div>
          <button
            style={{marginTop: '1rem', fontWeight: 600, fontSize: '1.1rem'}}
            onClick={() => {
              // If user selects any AI provider and provides a key, use their keys. Otherwise, use built-in keys.
              const userSelectedAnyAI = usePerplexity || useGemini || useOpenAI;
              const aiKeyValid =
                (usePerplexity && perplexityApiKey) ||
                (useGemini && geminiApiKey) ||
                (useOpenAI && openaiApiKey);
              if (
                userName &&
                twitterApiKey &&
                twitterApiSecret &&
                twitterAccessToken &&
                twitterAccessSecret
              ) {
                // If user selected at least one AI and provided a key, use their keys
                if (userSelectedAnyAI && aiKeyValid) {
                  setUseOwnKeys(true);
                  setIsLoggedIn(true);
                } else {
                  // Use built-in keys
                  setUseOwnKeys(false);
                  setIsLoggedIn(true);
                }
              } else {
                alert('Please fill in all required fields.');
              }
            }}
          >
            Submit
          </button>
        </div>
      ) : null}
      {isLoggedIn && (
        <div
          className="tweet-main-layout"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
            marginTop: '32px',
            width: '100%',
            maxWidth: '1200px',
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: '0 12px',
            boxSizing: 'border-box',
          }}
        >
          {/* Tweet History and Scheduled Posts on the extreme left */}
          <div
            className="tweet-history-wrapper"
            style={{
              flex: '0 1 380px',
              minWidth: 260,
              maxWidth: 420,
              background: '#fafbfc',
              borderRadius: 8,
              boxShadow: '0 1px 4px #0001',
              padding: 16,
              maxHeight: '70vh',
              overflowY: 'auto',
              marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontWeight: 600 }}>History</span>
              <button style={{ fontSize: 13, padding: '2px 8px' }} onClick={() => setShowScheduled(s => !s)}>
                {showScheduled ? 'Hide Scheduled' : 'Show Scheduled'}
              </button>
            </div>
            {!showScheduled && <TweetHistory ref={tweetHistoryRef} />}
            {showScheduled && (
              <div>
                <h3 style={{ margin: '10px 0 8px 0', fontSize: 17 }}>Scheduled Posts</h3>
                {scheduledTweets.length === 0 && <div style={{ color: '#888', fontSize: 15 }}>No scheduled posts.</div>}
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {scheduledTweets
                    .filter(t => t.userName === userName)
                    .map(t => (
                      <li key={t.id} style={{
                        background: '#fff',
                        borderRadius: 6,
                        boxShadow: '0 1px 2px #0001',
                        marginBottom: 10,
                        padding: 10,
                        fontSize: 15,
                        position: 'relative'
                      }}>
                        <div style={{ marginBottom: 4 }}><b>Content:</b> {t.content}</div>
                        {t.imageUrl && <div style={{ marginBottom: 4 }}><b>Image:</b> <a href={t.imageUrl} target="_blank" rel="noopener noreferrer">View</a></div>}
                        <div style={{ marginBottom: 4 }}><b>Scheduled:</b> {new Date(t.scheduledTime).toLocaleString()}</div>
                        <div style={{ marginBottom: 4 }}><b>Status:</b> {t.status}</div>
                        {/* Delete button removed as requested */}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
          {/* Tweet Generator on the right */}
          <div
            className="tweet-generator-wrapper"
            style={{
              flex: '1 1 340px',
              minWidth: 260,
              maxWidth: 600,
              display: 'flex',
              flexDirection: 'column',
              background: 'transparent',
              marginBottom: 16,
            }}
          >
            <div
              className="tweet-generator-panel"
              style={{
                background: '#fff',
                borderRadius: 8,
                boxShadow: '0 1px 4px #0001',
                padding: 16,
                width: '100%',
                minHeight: 200,
                boxSizing: 'border-box',
              }}
            >
              {!isCollapsed && (
                <>


              <h2>Create your tweet ({userName})</h2>

              <textarea
                value={tweetContent}
                onChange={(e) => setTweetContent(e.target.value)}
                placeholder="what's happening?"
                rows={4}
                style={{ width: '100%' }}
              />
              <p className={`character-counter ${tweetContent.length > 260 ? 'warning' : ''}`}>Characters: {tweetContent.length}/280</p>

              {/* Schedule Button and Picker (correctly placed under textarea) */}
              <div style={{ marginBottom: 12 }}>
                <button
                  style={{ marginRight: 8 }}
                  onClick={() => setShowSchedulePicker(true)}
                >
                  Schedule
                </button>
                {showSchedulePicker && (
                  <div style={{ display: 'inline-block', marginLeft: 8 }}>
                    <SchedulePicker
                      value={scheduledDateTime}
                      onChange={val => setScheduledDateTime(val)}
                    />
                    <button
                      style={{ marginLeft: 8 }}
                      disabled={tweetContent.length === 0 || tweetContent.length > 280 || !scheduledDateTime}
                      onClick={async () => {
                        // Prepare payload for scheduling
                        const payload = {
                          userName,
                          content: tweetContent,
                          imageUrl: aiImageUrl || null,
                          scheduledTime: scheduledDateTime,
                          twitterApiKey,
                          twitterApiSecret,
                          twitterAccessToken,
                          twitterAccessSecret
                        };
                        try {
                          const response = await fetch(`${BACKEND_URL}/schedule-tweet`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                          });
                          const data = await response.json();
                          if (data.success) {
                            alert('Tweet scheduled successfully!');
                            setScheduledDateTime('');
                            setTweetContent('');
                            setAiImageUrl('');
                            setSelectedImage(null);
                            setImagePreview(null);
                          } else {
                            alert('Failed to schedule tweet: ' + (data.message || 'Unknown error'));
                          }
                        } catch (err) {
                          alert('Error connecting to backend for scheduling.');
                        }
                        setShowSchedulePicker(false);
                      }}
                    >
                      Schedule Tweet
                    </button>
                    <button style={{ marginLeft: 8 }} onClick={() => setShowSchedulePicker(false)}>Cancel</button>
                  </div>
                )}
              </div>

             
              {/* Schedule Picker under textarea */}


              {/* Image Upload Section */}
              <div className="image-upload-section">
                <input
                  type="text"
                  value={imagePrompt}
                  onChange={e => setImagePrompt(e.target.value)}
                  placeholder="Describe the image you want (optional, improves quality)"
                  className="ai-prompt-input"
                  style={{ marginBottom: '0.5rem' }}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setSelectedImage(file);
                      // Create preview
                      const reader = new FileReader();
                      reader.onload = (e) => setImagePreview(e.target.result);
                      reader.readAsDataURL(file);
                    } else {
                      setSelectedImage(null);
                      setImagePreview(null);
                    }
                  }}
                  style={{ display: 'none' }}
                />
                <label htmlFor="image-upload" className="image-upload-btn">
                  📷 Add Image
                </label>
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                    <button
                      className="remove-image-btn"
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}
                <button
                  className='ai-image-btn'
                  disabled={!tweetContent}
                  onClick={handleGenerateAIImage}
                  style={{ marginTop: '1rem' }}
                >
                  Generate AI image
                </button>
              </div>

              {/* AI Prompt Section */}
              <div className="ai-prompt-section">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Enter topic for AI generation (optional)"
                  className="ai-prompt-input"
                />
              </div>

              <div className="button-container">
                <button className="ai-btn" onClick={() => {
                  // Only send the AI key if the box is checked and the key is non-empty
                  const aiKeys = {};
                  // Validate keys before sending
                  if (usePerplexity && perplexityApiKey.trim() === '') {
                    alert('Perplexity is selected but no API key is provided. Please enter a valid key or uncheck Perplexity.');
                    return;
                  }
                  if (useGemini && geminiApiKey.trim() === '') {
                    alert('Gemini is selected but no API key is provided. Please enter a valid key or uncheck Gemini.');
                    return;
                  }
                  if (useOpenAI && openaiApiKey.trim() === '') {
                    alert('OpenAI is selected but no API key is provided. Please enter a valid key or uncheck OpenAI.');
                    return;
                  }
                  // Collect all selected providers in order of fallback
                  const aiProviders = [];
                  if (usePerplexity) aiProviders.push('perplexity');
                  if (useGemini) aiProviders.push('gemini');
                  if (useOpenAI) aiProviders.push('openai');
                  if (useOwnKeys) {
                    if (usePerplexity && perplexityApiKey.trim() !== '') aiKeys.perplexityApiKey = perplexityApiKey;
                    if (useGemini && geminiApiKey.trim() !== '') aiKeys.geminiApiKey = geminiApiKey;
                    if (useOpenAI && openaiApiKey.trim() !== '') aiKeys.openaiApiKey = openaiApiKey;
                  } else {
                    if (DEFAULT_PERPLEXITY_KEY && DEFAULT_PERPLEXITY_KEY.trim() !== '') aiKeys.perplexityApiKey = DEFAULT_PERPLEXITY_KEY;
                    if (DEFAULT_GEMINI_KEY && DEFAULT_GEMINI_KEY.trim() !== '') aiKeys.geminiApiKey = DEFAULT_GEMINI_KEY;
                  }
                  // Only send keys for selected providers
                  const payload = {
                    aiPrompt: aiPrompt,
                    userName: userName,
                    aiProviders,
                    twitterApiKey: twitterApiKey,
                    twitterApiSecret: twitterApiSecret,
                    twitterAccessToken: twitterAccessToken,
                    twitterAccessSecret: twitterAccessSecret,
                    useOwnKeys
                  };
                  aiProviders.forEach(provider => {
                    if (provider === 'perplexity' && aiKeys.perplexityApiKey) payload.perplexityApiKey = aiKeys.perplexityApiKey;
                    if (provider === 'gemini' && aiKeys.geminiApiKey) payload.geminiApiKey = aiKeys.geminiApiKey;
                    if (provider === 'openai' && aiKeys.openaiApiKey) payload.openaiApiKey = aiKeys.openaiApiKey;
                  });
                  fetch(`${BACKEND_URL}/generate-tweet`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                  })
                    .then(response => response.json())
                    .then(data => {
                      if (data.success) {
                        setTweetContent(data.content); // Set the generated tweet content
                      } else {
                        alert('Error generating tweet: ' + data.message);
                      }
                    })
                    .catch(error => {
                      console.error('Network error:', error);
                      alert('Connection error! Make sure the backend server is running.');
                    });
                }}>
                  {aiPrompt ? `Generate AI Content about "${aiPrompt}"` : 'Generate AI Content'}
                </button>

{/* Thread Generation Button*/}

                 <button onClick={() => setShowThreadModal(true)}>
        Generate Thread
             </button>

      <ThreadModal
        show={showThreadModal}
        onClose={() => setShowThreadModal(false)}
        threadPrompt={threadPrompt}
        setThreadPrompt={setThreadPrompt}
        threadTweets={threadTweets}
        setThreadTweets={setThreadTweets}
        isGenerating={isGenerating}
        setIsGenerating={setIsGenerating}
        userName={userName}
        twitterApiKey={twitterApiKey}
        twitterApiSecret={twitterApiSecret}
        twitterAccessToken={twitterAccessToken}
        twitterAccessSecret={twitterAccessSecret}
        usePerplexity={usePerplexity}
        useGemini={useGemini}
        useOpenAI={useOpenAI}
        useOwnKeys={useOwnKeys}
        perplexityApiKey={perplexityApiKey}
        geminiApiKey={geminiApiKey}
        openaiApiKey={openaiApiKey}
        DEFAULT_PERPLEXITY_KEY={DEFAULT_PERPLEXITY_KEY}
        DEFAULT_GEMINI_KEY={DEFAULT_GEMINI_KEY}
        tweetHistoryRef={tweetHistoryRef}
      />

                <button
                  className="tweet-btn"
                  disabled={tweetContent.length === 0 || tweetContent.length > 280 || isImageLoading}
                  onClick={() => {
                    // If AI image is a URL, send imageUrl to backend; else, upload file
                    const formData = new FormData();
                    formData.append('userName', userName);
                    formData.append('geminiApiKey', geminiApiKey);
                    formData.append('openaiApiKey', openaiApiKey);
                    formData.append('twitterApiKey', twitterApiKey);
                    formData.append('twitterApiSecret', twitterApiSecret);
                    formData.append('twitterAccessToken', twitterAccessToken);
                    formData.append('twitterAccessSecret', twitterAccessSecret);
                    formData.append('content', tweetContent);
                    if (selectedImage) {
                      formData.append('image', selectedImage);
                    }
                    if (!selectedImage && aiImageUrl) {
                      formData.append('imageUrl', aiImageUrl);
                    }

                    fetch(`${BACKEND_URL}/post-tweet`, {
                      method: 'POST',
                      body: formData // Don't set Content-Type header, let browser set it for FormData
                    })
                      .then(response => response.json())
                      .then(data => {
                        if (data.success) {
                          const imageText = data.hasImage ? " with image" : "";
                          alert(`Tweet posted successfully${imageText}! 🎉\nTweet ID: ${data.tweetId}`);
                          setTweetContent(''); // Clear the textarea after successful post
                          setSelectedImage(null); // Clear image
                          setImagePreview(null); // Clear preview
                          setAiImageUrl('');
                          if (fileInputRef.current) fileInputRef.current.value = ''; // Clear file input
                          // Refresh tweet history
                          if (tweetHistoryRef.current && tweetHistoryRef.current.refresh) {
                            tweetHistoryRef.current.refresh();
                          }
                        } else {
                          alert(`Failed to post tweet: ${data.message}`);
                        }
                      })
                      .catch(error => {
                        console.error('Error posting tweet:', error);
                        alert('Connection error! Make sure the backend server is running.');
                      });
                  }}
                >
                  Post Tweet
                </button>
              </div>
              </>
              )}


              {/* Bulk Prompts Button - collapse tweet panel and show bulk input */}

              {!showBulkPromptInput && !showBulkReview && (
                <button
                  onClick={() => {
                    setShowBulkPromptInput(true);
                    setIsCollapsed(true);
                  }}
                  style={{ marginTop: 16 }}
                >
                  Bulk Prompts
                </button>
              )}
              {(showBulkPromptInput || showBulkReview) && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    marginTop: 16,
                    width: '100%'
                  }}
                >
                  {/* Bulk Prompt Input */}
                  {showBulkPromptInput && !showBulkReview && (
                    <>
                      <BulkPromptInput
                        onSubmit={async (promptsArray) => {
                          await handleBulkSubmit(promptsArray);
                          setShowBulkReview(true);
                          setShowBulkPromptInput(false);
                        }}
                        onCancel={() => {
                          setShowBulkPromptInput(false);
                          setIsCollapsed(false);
                        }}
                        style={{ width: '100%' }}
                      />
                      <button
                        style={{ marginTop: 16, alignSelf: 'flex-end' }}
                        onClick={() => {
                          setShowBulkPromptInput(false);
                          setIsCollapsed(false);
                        }}
                      >
                        Restore Tweet Panel
                      </button>
                    </>
                  )}
                  {/* Bulk Review */}
                  {showBulkReview && (
                    <div style={{ marginTop: 0 }}>
                      <h3>Review Generated Tweets</h3>
                      {bulkLoading && <div>Generating tweets...</div>}
                      {bulkError && <div style={{ color: 'red' }}>{bulkError}</div>}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                        {bulkGeneratedTweets.map((item, idx) => (
                          <div key={idx} style={{
                            background: '#fff',
                            borderRadius: 8,
                            boxShadow: '0 1px 4px #0001',
                            padding: 16,
                            minWidth: 260,
                            maxWidth: 340,
                            flex: '1 1 260px',
                            marginBottom: 12
                          }}>
                            <div style={{ fontWeight: 600, marginBottom: 6 }}>Prompt:</div>
                            <div style={{ marginBottom: 8 }}>{item.prompt}</div>
                            {editingTweetIdx === idx ? (
                              <>
                                <textarea
                                  value={editingTweetValue}
                                  onChange={e => setEditingTweetValue(e.target.value)}
                                  style={{ width: '100%', marginBottom: 8 }}
                                  rows={3}
                                />
                                <button
                                  style={{ marginRight: 8 }}
                                  onClick={() => handleSaveEditTweet(idx)}
                                  disabled={!editingTweetValue.trim()}
                                >Save</button>
                                <button onClick={() => { setEditingTweetIdx(null); setEditingTweetValue(''); }}>Cancel</button>
                              </>
                            ) : (
                              <>
                                <div style={{ marginBottom: 8, whiteSpace: 'pre-wrap' }}>{item.tweet || <span style={{ color: 'red' }}>{item.error || 'Error'}</span>}</div>
                                <button style={{ marginBottom: 8 }} onClick={() => handleEditTweet(idx)}>Edit</button>
                              </>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Scheduling Options UI */}
                      <div style={{ marginTop: 32, padding: 16, background: '#f7f8fa', borderRadius: 8 }}>
                        <h4>Schedule All Tweets</h4>
                        <div style={{ marginBottom: 12 }}>
                          <label style={{ fontWeight: 500, marginRight: 8 }}>Frequency:</label>
                          <select value={bulkScheduleType} onChange={e => setBulkScheduleType(e.target.value)}>
                            <option value="once">Once a day</option>
                            <option value="twice">Twice a day</option>
                            <option value="four">Four times a week</option>
                          </select>
                        </div>
                        <div style={{ marginBottom: 12 }}>
                          <label style={{ fontWeight: 500, marginRight: 8 }}>Start Date:</label>
                          <input
                            type="date"
                            value={bulkStartDate}
                            onChange={e => setBulkStartDate(e.target.value)}
                            min={new Date().toISOString().slice(0, 10)}
                          />
                        </div>
                        {/* Time pickers based on schedule type */}
                        {bulkScheduleType === 'once' && (
                          <div style={{ marginBottom: 12 }}>
                            <label>Time: </label>
                            <input type="time" value={bulkTimes[0] || ''} onChange={e => setBulkTimes([e.target.value])} />
                          </div>
                        )}
                        {bulkScheduleType === 'twice' && (
                          <div style={{ marginBottom: 12 }}>
                            <label>Time 1: </label>
                            <input type="time" value={bulkTimes[0] || ''} onChange={e => setBulkTimes([e.target.value, bulkTimes[1] || ''])} />
                            <label style={{ marginLeft: 12 }}>Time 2: </label>
                            <input type="time" value={bulkTimes[1] || ''} onChange={e => setBulkTimes([bulkTimes[0] || '', e.target.value])} />
                          </div>
                        )}
                        {bulkScheduleType === 'four' && (
                          <div style={{ marginBottom: 12 }}>
                            {[0,1,2,3].map(i => (
                              <span key={i}>
                                <label>Time {i+1}: </label>
                                <input type="time" value={bulkTimes[i] || ''} onChange={e => {
                                  const newTimes = [...bulkTimes];
                                  newTimes[i] = e.target.value;
                                  setBulkTimes(newTimes);
                                }} style={{ marginRight: 8 }} />
                              </span>
                            ))}
                          </div>
                        )}
                        <button
                          style={{ marginTop: 8, fontWeight: 600 }}
                          onClick={handleBulkSchedule}
                          disabled={
                            bulkGeneratedTweets.length === 0 ||
                            bulkTimes.some(t => !t) ||
                            !bulkStartDate
                          }
                        >
                          Schedule All
                        </button>
                        {bulkScheduleError && <div style={{ color: 'red', marginTop: 8 }}>{bulkScheduleError}</div>}
                        {bulkScheduleSuccess && <div style={{ color: 'green', marginTop: 8 }}>{bulkScheduleSuccess}</div>}
                      </div>

                      <button style={{ marginTop: 24 }} onClick={() => {
                        setShowBulkReview(false);
                        setShowBulkPromptInput(true);
                      }}>Back to Bulk Input</button>
                      <button style={{ marginTop: 24, marginLeft: 12 }} onClick={() => {
                        setShowBulkReview(false);
                        setIsCollapsed(false);
                        setBulkGeneratedTweets([]);
                      }}>Restore Tweet Panel</button>
                    </div>
                  )}
                </div>
              )}

              {/* Logout Button */}
              <button
                className="logout-btn"
                onClick={() => {
                  setIsLoggedIn(false);
                  setUserName('');
                  setPerplexityApiKey('');
                  setGeminiApiKey('');
                  setOpenaiApiKey('');
                  setTwitterApiKey('');
                  setTwitterApiSecret('');
                  setTwitterAccessToken('');
                  setTwitterAccessSecret('');
                  setTweetContent('');
                  setSelectedImage(null);
                  setImagePreview(null);
                  setAiPrompt('');
                }}
                style={{ marginTop: '2rem' }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App;