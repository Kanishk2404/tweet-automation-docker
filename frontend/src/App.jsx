import { useState, useRef, useEffect } from 'react'
import './App.css'

const BACKEND_URL = import.meta.env.VITE_API_URL;

function App() {
  // Load from localStorage if available
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || '');
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('geminiApiKey') || '');
  const [openaiApiKey, setOpenaiApiKey] = useState(() => localStorage.getItem('openaiApiKey') || '');
  const [twitterApiKey, setTwitterApiKey] = useState(() => localStorage.getItem('twitterApiKey') || '');
  const [twitterApiSecret, setTwitterApiSecret] = useState(() => localStorage.getItem('twitterApiSecret') || '');
  const [twitterAccessToken, setTwitterAccessToken] = useState(() => localStorage.getItem('twitterAccessToken') || '');
  const [twitterAccessSecret, setTwitterAccessSecret] = useState(() => localStorage.getItem('twitterAccessSecret') || ''); 
  const [tweetContent, setTweetContent] = useState('');
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
    if (geminiApiKey !== '') localStorage.setItem('geminiApiKey', geminiApiKey);
  }, [geminiApiKey]);
  useEffect(() => {
    if (openaiApiKey !== '') localStorage.setItem('openaiApiKey', openaiApiKey);
  }, [openaiApiKey]);
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

  // Generate AI image from tweet content using backend
  // Helper to convert base64 dataURL to File
  function dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    for (let i = 0; i < n; i++) u8arr[i] = bstr.charCodeAt(i);
    return new File([u8arr], filename, { type: mime });
  }

  const handleGenerateAIImage = async () => {
    const aiKeys = {};
    if (geminiApiKey) aiKeys.geminiApiKey = geminiApiKey;
    if (openaiApiKey) aiKeys.openaiApiKey = openaiApiKey;
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
          // If image is a URL, do not fetch as file, just store the URL
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
          />
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
          />
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
          />
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
          />
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
          />
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
          />
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
          />
          <button
            style={{marginTop: '1rem', fontWeight: 600, fontSize: '1.1rem'}}
            onClick={() => {
              if (
                userName &&
                (geminiApiKey || openaiApiKey) &&
                twitterApiKey &&
                twitterApiSecret &&
                twitterAccessToken &&
                twitterAccessSecret
              ) {
                setIsLoggedIn(true);
              } else if (!geminiApiKey && !openaiApiKey) {
                alert('Please provide at least one AI key: OpenAI or Gemini.');
              } else {
                alert('Please fill in all required fields.');
              }
            }}
          >
            Submit
          </button>
          
        </div>
      ) : (
        <div className="main-app">
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
              style={{marginBottom: '0.5rem'}}
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
              // Only send the AI key that is filled (not both)
              const aiKeys = {};
              if (geminiApiKey) aiKeys.geminiApiKey = geminiApiKey;
              if (openaiApiKey) aiKeys.openaiApiKey = openaiApiKey;
              fetch(`${BACKEND_URL}/generate-tweet`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  aiPrompt,
                  userName,
                  ...aiKeys,
                  twitterApiKey,
                  twitterApiSecret,
                  twitterAccessToken,
                  twitterAccessSecret 
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
            style={{marginTop: '2rem'}}
          >
            Logout
          </button>
        </div>
      )}
    </>
  )
}

export default App