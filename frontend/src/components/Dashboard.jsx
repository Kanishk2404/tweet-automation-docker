import React, { useState } from 'react';
import DashboardHeader from './dashboard/DashboardHeader';
import DashboardStats from './dashboard/DashboardStats';
import TweetGenerator from './dashboard/TweetGenerator';
import TweetScheduler from './dashboard/TweetScheduler';
import ThreadGenerator from './dashboard/ThreadGenerator';
import BulkPromptManager from './dashboard/BulkPromptManager';
import TweetHistoryPanel from './dashboard/TweetHistoryPanel';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', name: 'Overview', icon: '📊' },
        { id: 'generate', name: 'Generate', icon: '✨' },
        { id: 'schedule', name: 'Schedule', icon: '⏰' },
        { id: 'threads', name: 'Threads', icon: '🧵' },
        { id: 'bulk', name: 'Bulk', icon: '📦' },
        { id: 'history', name: 'History', icon: '📝' }
    ];

    const handleTweetGenerated = (tweet) => {
        console.log('Tweet generated:', tweet);
    };

    const handleTweetScheduled = (scheduleData) => {
        console.log('Tweet scheduled:', scheduleData);
    };

    const handleThreadGenerated = (thread) => {
        console.log('Thread generated:', thread);
    };

    const handleBulkPromptsSubmitted = (prompts) => {
        console.log('Bulk prompts submitted:', prompts);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-6">
                        <DashboardStats />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <TweetHistoryPanel />
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => setActiveTab('generate')}
                                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                                    >
                                        Generate New Tweet
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('schedule')}
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                                    >
                                        Schedule Tweet
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('threads')}
                                        className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
                                    >
                                        Create Thread
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'generate':
                return <TweetGenerator onTweetGenerated={handleTweetGenerated} />;
            case 'schedule':
                return <TweetScheduler onSchedule={handleTweetScheduled} />;
            case 'threads':
                return <ThreadGenerator onThreadGenerated={handleThreadGenerated} />;
            case 'bulk':
                return <BulkPromptManager onBulkPromptsSubmitted={handleBulkPromptsSubmitted} />;
            case 'history':
                return <TweetHistoryPanel />;
            default:
                return <DashboardStats />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tab Navigation */}
                <div className="mb-8">
                    <nav className="flex space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`${activeTab === tab.id
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                            >
                                <span>{tab.icon}</span>
                                <span>{tab.name}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 