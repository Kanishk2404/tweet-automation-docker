import { useState } from 'react'
import './App.css'

function App() {
  const [password, setPassword] = useState('');
  const [tweetContent, setTweetContent] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [aiPrompt, setAiPrompt] = useState('');
  
  // Use environment variable for API URL, fallback to localhost for development
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  

  return (
    <>
      <h1>Tweet Automator</h1>
      
      {!isLoggedIn ? (
        // Login form - shown when NOT logged in
        <div className="login-container">
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />

          <button onClick={() => {
            console.log('Login button clicked, password:', password);
            fetch(`${API_URL}/auth`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ password })
            })
            .then(response => {
              console.log('Response status:', response.status);
              return response.json();
            })
            .then(data => {
              console.log('Response data:', data);
              if (data.success) {
                setIsLoggedIn(true);
                setPassword(''); // Clear password field
              } else {
                alert('Wrong password! Try again.');
              }
            })
            .catch(error => {
              console.error('Login error:', error);
              alert('Connection error! Make sure the backend server is running on port 3000.');
            });
          }}>
            Login
          </button>
        </div>
      ) : (
        // Main app - shown when logged in
        <div className="main-app">
          <h2>Create your tweet</h2>
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
                    document.getElementById('image-upload').value = '';
                  }}
                >
                  ✕
                </button>
              </div>
            )}
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
            <button className="ai-btn" onClick = {() => {
              fetch(`${API_URL}/generate-tweet`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ topic: aiPrompt })
              })
              .then(response => response.json())
              .then(data => {
                if (data.success) {
                  setTweetContent(data.content); // Set the generated tweet content
                } else {
                  alert('Error generating tweet: ' + data.message);
                }
              })
            }}>
              {aiPrompt ? `Generate AI Content about "${aiPrompt}"` : 'Generate AI Content'}
            </button>

            <button 
              className="tweet-btn"
              disabled={tweetContent.length === 0 || tweetContent.length > 280}
              onClick={() => {
                const formData = new FormData();
                formData.append('content', tweetContent);
                if (selectedImage) {
                  formData.append('image', selectedImage);
                }

                fetch(`${API_URL}/post-tweet`, {
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
                    document.getElementById('image-upload').value = ''; // Clear file input
                  } else {
                    alert(`Failed to post tweet: ${data.message}`);
                  }
                })
                .catch(error => {
                  console.error('Error posting tweet:', error);
                  alert('Connection error! Make sure the backend server is running.');
                });
              }}>
              Post Tweet
            </button>
          </div>

          <button className="logout-btn" onClick={() => setIsLoggedIn(false)}>
            Logout
          </button> 

        </div>
        

      )}
    </>
  )
}

export default App