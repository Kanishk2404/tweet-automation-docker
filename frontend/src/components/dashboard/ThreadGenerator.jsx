import React, { useState } from 'react';
import ThreadModal from '../ThreadModal';

const ThreadGenerator = ({ onThreadGenerated }) => {
    const [showModal, setShowModal] = useState(false);
    const [threadPrompt, setThreadPrompt] = useState('');
    const [threadTweets, setThreadTweets] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateThread = async () => {
        if (!threadPrompt.trim()) return;

        setIsGenerating(true);
        try {
            // This would be replaced with actual API call
            await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate API call
            const mockThread = [
                `Thread based on: "${threadPrompt}"\n\nThis is the first tweet in the thread.`,
                `This is the second tweet continuing the thread about ${threadPrompt}.`,
                `And this is the final tweet wrapping up our discussion on ${threadPrompt}.`
            ];
            setThreadTweets(mockThread);
            onThreadGenerated && onThreadGenerated(mockThread);
        } catch (error) {
            console.error('Error generating thread:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePostThread = async () => {
        if (threadTweets.length === 0) return;

        try {
            // This would be replaced with actual posting API
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
            alert('Thread posted successfully!');
            setThreadTweets([]);
            setThreadPrompt('');
            setShowModal(false);
        } catch (error) {
            console.error('Error posting thread:', error);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Generate Thread</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thread Prompt
                    </label>
                    <textarea
                        value={threadPrompt}
                        onChange={(e) => setThreadPrompt(e.target.value)}
                        placeholder="Enter your thread prompt here..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        rows={3}
                    />
                </div>

                <button
                    onClick={handleGenerateThread}
                    disabled={isGenerating || !threadPrompt.trim()}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isGenerating ? 'Generating Thread...' : 'Generate Thread'}
                </button>

                {threadTweets.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Thread Preview</h3>
                        <div className="space-y-3">
                            {threadTweets.map((tweet, idx) => (
                                <div key={idx} className="border border-gray-200 rounded-md p-3 bg-gray-50">
                                    <div className="text-sm text-gray-500 mb-1">Tweet {idx + 1}</div>
                                    <textarea
                                        value={tweet}
                                        onChange={(e) => {
                                            const newTweets = [...threadTweets];
                                            newTweets[idx] = e.target.value;
                                            setThreadTweets(newTweets);
                                        }}
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                        rows={2}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex space-x-3">
                            <button
                                onClick={handlePostThread}
                                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                Post Thread
                            </button>
                            <button
                                onClick={() => setThreadTweets([])}
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

export default ThreadGenerator; 