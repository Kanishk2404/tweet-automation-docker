import React, { useState } from 'react';

const ThreadModal = ({
  show,
  onClose,
  threadPrompt,
  setThreadPrompt,
  threadTweets,
  setThreadTweets,
  isGenerating,
  setIsGenerating,
  userName,
  twitterApiKey,
  twitterApiSecret,
  twitterAccessToken,
  twitterAccessSecret,
  usePerplexity,
  useGemini,
  useOpenAI,
  useOwnKeys,
  perplexityApiKey,
  geminiApiKey,
  openaiApiKey,
  DEFAULT_PERPLEXITY_KEY,
  DEFAULT_GEMINI_KEY,
  tweetHistoryRef
}) => {
  if (!show) return null;

  const handleGenerateThread = async () => {
    setIsGenerating(true);
    setThreadTweets([]);
    const aiProviders = [];
    if (usePerplexity) aiProviders.push('perplexity');
    if (useGemini) aiProviders.push('gemini');
    if (useOpenAI) aiProviders.push('openai');
    const payload = {
      prompt: threadPrompt,
      aiProviders,
      useOwnKeys,
    };
    if (useOwnKeys) {
      if (usePerplexity && perplexityApiKey.trim() !== '') payload.perplexityApiKey = perplexityApiKey;
      if (useGemini && geminiApiKey.trim() !== '') payload.geminiApiKey = geminiApiKey;
      if (useOpenAI && openaiApiKey.trim() !== '') payload.openaiApiKey = openaiApiKey;
    } else {
      if (DEFAULT_PERPLEXITY_KEY && DEFAULT_PERPLEXITY_KEY.trim() !== '') payload.perplexityApiKey = DEFAULT_PERPLEXITY_KEY;
      if (DEFAULT_GEMINI_KEY && DEFAULT_GEMINI_KEY.trim() !== '') payload.geminiApiKey = DEFAULT_GEMINI_KEY;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/generate-thread`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success && Array.isArray(data.tweets)) {
        setThreadTweets(data.tweets);
      } else {
        alert('Failed to generate thread: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Error connecting to backend for thread generation.');
    }
    setIsGenerating(false);
  };

  const handlePostThread = async () => {
    if (threadTweets.length === 0) return;
    setIsGenerating(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/post-thread`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tweets: threadTweets,
          userName,
          twitterApiKey,
          twitterApiSecret,
          twitterAccessToken,
          twitterAccessSecret
        })
      });
      const data = await response.json();
      if (data.success) {
        alert('Thread posted successfully!');
        onClose();
        setThreadPrompt('');
        setThreadTweets([]);
        if (tweetHistoryRef && tweetHistoryRef.current && tweetHistoryRef.current.refresh) {
          tweetHistoryRef.current.refresh();
        }
      } else {
        alert('Failed to post thread: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Error connecting to backend for posting thread.');
    }
    setIsGenerating(false);
  };

  return (
    <div className="modal">
      <h2>Generate a Twitter Thread</h2>
      <input
        type="text"
        value={threadPrompt}
        onChange={e => setThreadPrompt(e.target.value)}
        placeholder="e.g. Rank top 5 cricketing moments"
        style={{ width: '100%', marginBottom: 12 }}
      />
      <button
        onClick={handleGenerateThread}
        disabled={isGenerating || !threadPrompt.trim()}
      >
        {isGenerating ? 'Generating...' : 'Generate'}
      </button>
      {threadTweets.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <h3>Thread Preview</h3>
          {threadTweets.map((tweet, idx) => (
            <textarea
              key={idx}
              value={tweet}
              onChange={e => {
                const newTweets = [...threadTweets];
                newTweets[idx] = e.target.value;
                setThreadTweets(newTweets);
              }}
              rows={3}
              style={{ width: '100%', marginBottom: 8 }}
            />
          ))}
          <button
            style={{ marginTop: 12, fontWeight: 600 }}
            disabled={isGenerating || threadTweets.length === 0}
            onClick={handlePostThread}
          >
            {isGenerating ? 'Posting...' : 'Post Thread'}
          </button>
        </div>
      )}
      <button onClick={onClose} style={{ marginTop: 16 }}>Close</button>
    </div>
  );
};

export default ThreadModal;
