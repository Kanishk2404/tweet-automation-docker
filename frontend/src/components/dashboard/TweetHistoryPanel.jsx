import React, { useState, useEffect, useRef } from 'react';
import TweetHistory from '../TweetHistory';

const TweetHistoryPanel = () => {
    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const tweetHistoryRef = useRef();

    const fetchTweets = async () => {
        setLoading(true);
        try {
            // This would be replaced with actual API call
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            const mockTweets = [
                {
                    id: 1,
                    content: "This is a sample tweet about AI and technology! 🤖 #AI #Tech",
                    userName: "TweetGenie User",
                    createdAt: new Date().toISOString(),
                    imageUrl: null
                },
                {
                    id: 2,
                    content: "Another great tweet about machine learning and its applications in modern software development.",
                    userName: "TweetGenie User",
                    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                    imageUrl: null
                }
            ];
            setTweets(mockTweets);
            setError(null);
        } catch (error) {
            setError('Failed to fetch tweets');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTweets();
    }, []);

    const handleDelete = async (tweetId) => {
        if (!window.confirm("Are you sure you want to delete this tweet?")) return;

        try {
            // This would be replaced with actual delete API
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
            setTweets(tweets => tweets.filter(t => t.id !== tweetId));
        } catch (error) {
            console.error('Error deleting tweet:', error);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Tweet History</h2>
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600">Loading tweets...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Tweet History</h2>
                <div className="text-center py-8">
                    <div className="text-red-600 mb-2">Error: {error}</div>
                    <button
                        onClick={fetchTweets}
                        className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Tweet History</h2>
                <button
                    onClick={fetchTweets}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                    Refresh
                </button>
            </div>

            {tweets.length === 0 ? (
                <div className="text-center py-8">
                    <div className="text-gray-500 mb-2">No tweets found</div>
                    <p className="text-sm text-gray-400">Your posted tweets will appear here</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {tweets.map(tweet => (
                        <div key={tweet.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div className="font-medium text-gray-900">{tweet.userName}</div>
                                <button
                                    onClick={() => handleDelete(tweet.id)}
                                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                            <div className="text-gray-700 mb-2">{tweet.content}</div>
                            {tweet.imageUrl && (
                                <img
                                    src={tweet.imageUrl}
                                    alt="tweet"
                                    className="max-w-xs max-h-48 object-cover rounded-md"
                                />
                            )}
                            <div className="text-xs text-gray-500">
                                {new Date(tweet.createdAt).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TweetHistoryPanel; 