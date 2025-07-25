import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';

// Use VITE_API_URL for Vite projects
const BACKEND_URL = import.meta.env.VITE_API_URL;

const TweetHistory = forwardRef(function TweetHistory(props, ref) {
  // State hooks
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Fetch tweets function
  const fetchTweets = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/tweet-history`);
      const data = await response.json();
      if (data.success) {
        setTweets(data.tweets);
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch tweets');
      }
    } catch (error) {
      setError('An error occurred while fetching tweets');
    } finally {
      setLoading(false);
    }
  };

  // Expose refresh method to parent
  useImperativeHandle(ref, () => ({
    refresh: fetchTweets
  }));

  // Fetch on mount
  useEffect(() => {
    fetchTweets();
    // eslint-disable-next-line
  }, []);


  if (loading) return <div>Loading tweet history...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!tweets.length) return <div>No tweets found.</div>;

  // Delete handler
  const handleDelete = async (tweetId) => {
    if (!window.confirm("Are you sure you want to delete this tweet?")) return;
    try {
      // Get Twitter credentials from localStorage
      const twitterApiKey = localStorage.getItem('twitterApiKey') || '';
      const twitterApiSecret = localStorage.getItem('twitterApiSecret') || '';
      const twitterAccessToken = localStorage.getItem('twitterAccessToken') || '';
      const twitterAccessSecret = localStorage.getItem('twitterAccessSecret') || '';
      const response = await fetch(`${BACKEND_URL}/tweet-history/${tweetId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          twitterApiKey,
          twitterApiSecret,
          twitterAccessToken,
          twitterAccessSecret
        })
      });
      const data = await response.json();
      if (data.success) {
        setTweets(tweets => tweets.filter(t => t.id !== tweetId));
      } else {
        alert(data.message || "Failed to delete tweet.");
      }
    } catch (err) {
      alert("Error deleting tweet.");
    }
  };

  return (
    <div className="tweet-history">
      <h3>Tweet History</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tweets.map(tweet => (
          <li key={tweet.id} style={{ borderBottom: '1px solid #eee', marginBottom: 12, paddingBottom: 8 }}>
            <div style={{ fontWeight: 600 }}>{tweet.userName || 'Unknown User'}</div>
            <div style={{ margin: '6px 0' }}>{tweet.content}</div>
            {tweet.imageUrl && (
              <img src={tweet.imageUrl} alt="tweet" style={{ maxWidth: 200, maxHeight: 200, display: 'block', margin: '8px 0' }} />
            )}
            <div style={{ fontSize: 12, color: '#888' }}>{new Date(tweet.createdAt).toLocaleString()}</div>
            <div style={{ marginTop: 8, display: 'flex', gap: 12 }}>
              <button className="delete-btn" style={{ padding: '6px 16px', borderRadius: 8, border: '1px solid #e0245e', background: '#fff0f3', color: '#e0245e', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleDelete(tweet.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default TweetHistory;