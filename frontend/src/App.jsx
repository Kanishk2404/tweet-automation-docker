

import { useState, useRef, useEffect } from 'react'
import './App.css'
import TweetHistory from './components/TweetHistory';

const BACKEND_URL = import.meta.env.VITE_API_URL;

function App() {
  // Built-in keys (replace with your actual keys)
  const DEFAULT_PERPLEXITY_KEY = 'YOUR_PERPLEXITY_KEY_HERE';
  const DEFAULT_GEMINI_KEY = 'YOUR_GEMINI_KEY_HERE';
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

  // Track the last AI image URL (for OpenAI)
  const [aiImageUrl, setAiImageUrl] = useState('');

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
      if (geminiApiKey) aiKeys.geminiApiKey = geminiApiKey;
      if (openaiApiKey) aiKeys.openaiApiKey = openaiApiKey;
    } else {
      aiKeys.geminiApiKey = DEFAULT_GEMINI_KEY;
      // OpenAI not provided in pre-existing mode
    }
    setIsImageLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/generate-ai-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: imagePrompt || tweetContent,
          ...aiKeys
        })
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
            padding: '24px 20px',
            marginBottom: '2rem',
            maxWidth: 420,
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
                  <input type="checkbox" checked={usePerplexity} onChange={e => setUsePerplexity(e.target.checked)} /> <span role="img" aria-label="perplexity">🧠</span> Perplexity
                </span>
                <span title="Use Gemini AI for tweet generation" style={{marginRight: 12}}>
                  <input type="checkbox" checked={useGemini} onChange={e => setUseGemini(e.target.checked)} /> <span role="img" aria-label="gemini">🌈</span> Gemini
                </span>
                <span title="Use OpenAI for tweet generation">
                  <input type="checkbox" checked={useOpenAI} onChange={e => setUseOpenAI(e.target.checked)} /> <span role="img" aria-label="openai">🤖</span> OpenAI
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
                  />
                  <span title="Get your OpenAI API key from platform.openai.com" style={{color: '#888', fontSize: 14}}>?</span>
                </div>
              )}
            </>
            <div style={{marginTop: '1rem', marginBottom: '0.5rem', fontWeight: 600, fontSize: 16}}>Twitter Credentials</div>
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
                style={{flex: 1}}
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
                style={{flex: 1}}
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
                style={{flex: 1}}
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
                style={{flex: 1}}
              />
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
          {/* Tweet History on the extreme left */}
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
            <TweetHistory ref={tweetHistoryRef} />
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
              <h2>Create your tweet ({userName})</h2>
              <textarea
                value={tweetContent}
                onChange={(e) => setTweetContent(e.target.value)}
                placeholder="what's happening?"
                rows={4}
              />
              <p className={`character-counter ${tweetContent.length > 260 ? 'warning' : ''}`}>Characters: {tweetContent.length}/280</p>

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
                  if (useOwnKeys) {
                    if (usePerplexity && perplexityApiKey.trim() !== '') aiKeys.perplexityApiKey = perplexityApiKey;
                    if (useGemini && geminiApiKey.trim() !== '') aiKeys.geminiApiKey = geminiApiKey;
                    if (useOpenAI && openaiApiKey.trim() !== '') aiKeys.openaiApiKey = openaiApiKey;
                  } else {
                    if (DEFAULT_PERPLEXITY_KEY && DEFAULT_PERPLEXITY_KEY.trim() !== '') aiKeys.perplexityApiKey = DEFAULT_PERPLEXITY_KEY;
                    if (DEFAULT_GEMINI_KEY && DEFAULT_GEMINI_KEY.trim() !== '') aiKeys.geminiApiKey = DEFAULT_GEMINI_KEY;
                  }
                  fetch(`${BACKEND_URL}/generate-tweet`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      aiPrompt: aiPrompt,
                      userName: userName,
                      ...(aiKeys),
                      twitterApiKey: twitterApiKey,
                      twitterApiSecret: twitterApiSecret,
                      twitterAccessToken: twitterAccessToken,
                      twitterAccessSecret: twitterAccessSecret
                    })
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

export default App