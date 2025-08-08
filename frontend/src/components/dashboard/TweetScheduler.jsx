import React, { useState } from 'react';
import ScheduleOptions from '../ScheduleOptions';

const TweetScheduler = ({ onSchedule }) => {
    const [tweetContent, setTweetContent] = useState('');
    const [scheduleConfig, setScheduleConfig] = useState({ type: 'once', times: [''] });
    const [isScheduling, setIsScheduling] = useState(false);

    const handleSchedule = async () => {
        if (!tweetContent.trim()) return;

        setIsScheduling(true);
        try {
            // This would be replaced with actual scheduling API
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            alert('Tweet scheduled successfully!');
            setTweetContent('');
            setScheduleConfig({ type: 'once', times: [''] });
            onSchedule && onSchedule({ content: tweetContent, schedule: scheduleConfig });
        } catch (error) {
            console.error('Error scheduling tweet:', error);
        } finally {
            setIsScheduling(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Schedule Tweet</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tweet Content
                    </label>
                    <textarea
                        value={tweetContent}
                        onChange={(e) => setTweetContent(e.target.value)}
                        placeholder="Enter your tweet content here..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        rows={4}
                    />
                </div>

                <div className="flex">
                    <div className="flex-1">
                        <ScheduleOptions onChange={setScheduleConfig} />
                    </div>
                </div>

                <button
                    onClick={handleSchedule}
                    disabled={isScheduling || !tweetContent.trim()}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isScheduling ? 'Scheduling...' : 'Schedule Tweet'}
                </button>
            </div>
        </div>
    );
};

export default TweetScheduler; 