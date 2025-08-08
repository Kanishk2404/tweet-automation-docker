import React, { useState } from 'react';
import { useAPI } from '../../hooks/useAPI';
import { authAPI } from '../../services/api';

const TweetGenerator = ({ onTweetGenerated }) => {
    const [prompt, setPrompt] = useState('');
    const [generatedTweet, setGeneratedTweet] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const { executeAPI } = useAPI();

    const handleGenerateTweet = async () => {
        if (!prompt.trim()) return;

        setIsGenerating(true);
        try {
            // This would be replaced with actual API call
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
            const mockTweet = `Generated tweet based on: "${prompt}"\n\nThis is a sample generated tweet that would be created using AI based on your prompt.`;
            setGeneratedTweet(mockTweet);
            onTweetGenerated && onTweetGenerated(mockTweet);
        } catch (error) {
            console.error('Error generating tweet:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePostTweet = async () => {
        if (!generatedTweet) return;

        try {
            // This would be replaced with actual posting API
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            alert('Tweet posted successfully!');
            setGeneratedTweet('');
            setPrompt('');
        } catch (error) {
            console.error('Error posting tweet:', error);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Generate Tweet</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tweet Prompt
                    </label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Enter your tweet prompt here..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        rows={3}
                    />
                </div>

                <button
                    onClick={handleGenerateTweet}
                    disabled={isGenerating || !prompt.trim()}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isGenerating ? 'Generating...' : 'Generate Tweet'}
                </button>

                {generatedTweet && (
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Generated Tweet
                        </label>
                        <textarea
                            value={generatedTweet}
                            onChange={(e) => setGeneratedTweet(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            rows={4}
                        />
                        <div className="mt-3 flex space-x-3">
                            <button
                                onClick={handlePostTweet}
                                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                Post Tweet
                            </button>
                            <button
                                onClick={() => setGeneratedTweet('')}
                                className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TweetGenerator; 