import React from 'react';
import TweetHistory from '../TweetHistory';

const TweetHistoryPanel = ({
    showScheduled,
    setShowScheduled,
    scheduledTweets,
    userName,
    handleDeleteScheduled,
    tweetHistoryRef
}) => {
    return (
        <div className="flex-0 flex-shrink-0 min-w-80 max-w-lg bg-white rounded-xl shadow-lg p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Tweet History</h3>
                <button
                    className="text-xs px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors font-medium"
                    onClick={() => setShowScheduled(s => !s)}
                >
                    {showScheduled ? 'Show History' : 'Show Scheduled'}
                </button>
            </div>

            {!showScheduled && <TweetHistory ref={tweetHistoryRef} />}

            {showScheduled && (
                <div>
                    <h4 className="text-md font-semibold mb-4 text-gray-800 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Scheduled Posts
                    </h4>
                    {scheduledTweets.length === 0 && (
                        <div className="text-gray-500 text-sm text-center py-8">
                            <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            No scheduled posts yet.
                        </div>
                    )}
                    <div className="space-y-3">
                        {scheduledTweets
                            .filter(t => t.userName === userName)
                            .map(t => (
                                <div key={t.id} className="bg-gray-50 rounded-lg p-4 text-sm relative border border-gray-200 hover:border-gray-300 transition-colors">
                                    <div className="mb-2">
                                        <span className="font-semibold text-gray-700">Content:</span>
                                        <p className="mt-1 text-gray-800 leading-relaxed">{t.content}</p>
                                    </div>
                                    {t.imageUrl && (
                                        <div className="mb-2">
                                            <span className="font-semibold text-gray-700">Image:</span>
                                            <a
                                                href={t.imageUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 ml-2 underline"
                                            >
                                                View Image
                                            </a>
                                        </div>
                                    )}
                                    <div className="mb-2">
                                        <span className="font-semibold text-gray-700">Scheduled:</span>
                                        <p className="mt-1 text-gray-600">{new Date(t.scheduledTime).toLocaleString()}</p>
                                    </div>
                                    <div className="mb-3">
                                        <span className="font-semibold text-gray-700">Status:</span>
                                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${t.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                t.status === 'posted' ? 'bg-green-100 text-green-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {t.status}
                                        </span>
                                    </div>
                                    <button
                                        className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white border-none rounded-full w-6 h-6 flex items-center justify-center text-xs cursor-pointer transition-colors"
                                        onClick={() => handleDeleteScheduled(t.id)}
                                        title="Delete scheduled post"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TweetHistoryPanel; 