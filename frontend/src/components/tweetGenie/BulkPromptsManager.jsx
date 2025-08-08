import React from 'react';
import BulkPromptInput from '../BulkPromptInput';

const BulkPromptsManager = ({
    showBulkPromptInput,
    setShowBulkPromptInput,
    showBulkReview,
    setShowBulkReview,
    isCollapsed,
    setIsCollapsed,
    bulkGeneratedTweets,
    setBulkGeneratedTweets,
    bulkLoading,
    setBulkLoading,
    bulkError,
    setBulkError,
    editingTweetIdx,
    setEditingTweetIdx,
    editingTweetValue,
    setEditingTweetValue,
    bulkScheduleType,
    setBulkScheduleType,
    bulkTimes,
    setBulkTimes,
    bulkStartDate,
    setBulkStartDate,
    bulkScheduleError,
    setBulkScheduleError,
    bulkScheduleSuccess,
    setBulkScheduleSuccess,
    handleBulkSubmit,
    handleEditTweet,
    handleSaveEditTweet,
    handleBulkSchedule
}) => {
    return (
        <div className="mt-8">
            {/* Bulk Prompts Button */}
            {!showBulkPromptInput && !showBulkReview && (
                <button
                    className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-3 font-semibold text-lg"
                    onClick={() => {
                        setShowBulkPromptInput(true);
                        setIsCollapsed(true);
                    }}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Bulk Prompts
                </button>
            )}

            {/* Bulk Content */}
            {(showBulkPromptInput || showBulkReview) && (
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    {/* Bulk Prompt Input */}
                    {showBulkPromptInput && !showBulkReview && (
                        <>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">Bulk Tweet Generation</h3>
                                    <p className="text-gray-600">Generate multiple tweets at once</p>
                                </div>
                            </div>
                            <BulkPromptInput
                                onSubmit={async (promptsArray) => {
                                    await handleBulkSubmit(promptsArray);
                                    setShowBulkReview(true);
                                    setShowBulkPromptInput(false);
                                }}
                                onCancel={() => {
                                    setShowBulkPromptInput(false);
                                    setIsCollapsed(false);
                                }}
                                className="w-full"
                            />
                            <div className="mt-6 flex justify-end">
                                <button
                                    className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 flex items-center gap-2"
                                    onClick={() => {
                                        setShowBulkPromptInput(false);
                                        setIsCollapsed(false);
                                    }}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Cancel
                                </button>
                            </div>
                        </>
                    )}

                    {/* Bulk Review */}
                    {showBulkReview && (
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">Review Generated Tweets</h3>
                                    <p className="text-gray-600">Review and edit your generated content</p>
                                </div>
                            </div>

                            {bulkLoading && (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <p className="text-gray-600">Generating tweets...</p>
                                </div>
                            )}

                            {bulkError && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-red-700 font-medium">{bulkError}</span>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {bulkGeneratedTweets.map((item, idx) => (
                                    <div key={idx} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-colors">
                                        <div className="mb-4">
                                            <h4 className="font-semibold text-gray-800 mb-2">Prompt:</h4>
                                            <p className="text-gray-700 text-sm bg-white p-3 rounded-lg border">{item.prompt}</p>
                                        </div>

                                        {editingTweetIdx === idx ? (
                                            <div className="space-y-3">
                                                <textarea
                                                    value={editingTweetValue}
                                                    onChange={e => setEditingTweetValue(e.target.value)}
                                                    className="w-full p-3 border-2 border-blue-200 rounded-lg resize-none focus:border-blue-500 focus:outline-none"
                                                    rows={4}
                                                    placeholder="Edit your tweet content..."
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                                                        onClick={() => handleSaveEditTweet(idx)}
                                                        disabled={!editingTweetValue.trim()}
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Save
                                                    </button>
                                                    <button
                                                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
                                                        onClick={() => { setEditingTweetIdx(null); setEditingTweetValue(''); }}
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <h4 className="font-semibold text-gray-800 mb-2">Generated Tweet:</h4>
                                                <div className="bg-white p-4 rounded-lg border mb-3">
                                                    {item.tweet ? (
                                                        <p className="text-gray-800 whitespace-pre-wrap">{item.tweet}</p>
                                                    ) : (
                                                        <p className="text-red-500">{item.error || 'Error generating tweet'}</p>
                                                    )}
                                                </div>
                                                <button
                                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
                                                    onClick={() => handleEditTweet(idx)}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Edit
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Scheduling Options UI */}
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Schedule All Tweets
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Frequency:</label>
                                        <select
                                            value={bulkScheduleType}
                                            onChange={e => setBulkScheduleType(e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                        >
                                            <option value="once">Once a day</option>
                                            <option value="twice">Twice a day</option>
                                            <option value="four">Four times a week</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date:</label>
                                        <input
                                            type="date"
                                            value={bulkStartDate}
                                            onChange={e => setBulkStartDate(e.target.value)}
                                            min={new Date().toISOString().slice(0, 10)}
                                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Time pickers based on schedule type */}
                                <div className="mb-4">
                                    {bulkScheduleType === 'once' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Time:</label>
                                            <input
                                                type="time"
                                                value={bulkTimes[0] || ''}
                                                onChange={e => setBulkTimes([e.target.value])}
                                                className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                            />
                                        </div>
                                    )}

                                    {bulkScheduleType === 'twice' && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Time 1:</label>
                                                <input
                                                    type="time"
                                                    value={bulkTimes[0] || ''}
                                                    onChange={e => setBulkTimes([e.target.value, bulkTimes[1] || ''])}
                                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Time 2:</label>
                                                <input
                                                    type="time"
                                                    value={bulkTimes[1] || ''}
                                                    onChange={e => setBulkTimes([bulkTimes[0] || '', e.target.value])}
                                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {bulkScheduleType === 'four' && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {[0, 1, 2, 3].map(i => (
                                                <div key={i}>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Time {i + 1}:</label>
                                                    <input
                                                        type="time"
                                                        value={bulkTimes[i] || ''}
                                                        onChange={e => {
                                                            const newTimes = [...bulkTimes];
                                                            newTimes[i] = e.target.value;
                                                            setBulkTimes(newTimes);
                                                        }}
                                                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <button
                                    className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
                                    onClick={handleBulkSchedule}
                                    disabled={
                                        bulkGeneratedTweets.length === 0 ||
                                        bulkTimes.some(t => !t) ||
                                        !bulkStartDate
                                    }
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Schedule All Tweets
                                </button>

                                {bulkScheduleError && (
                                    <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                                        <span className="text-red-700 text-sm">{bulkScheduleError}</span>
                                    </div>
                                )}
                                {bulkScheduleSuccess && (
                                    <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                                        <span className="text-green-700 text-sm">{bulkScheduleSuccess}</span>
                                    </div>
                                )}
                            </div>

                            {/* Navigation Buttons */}
                            <div className="mt-8 flex gap-4">
                                <button
                                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 flex items-center gap-2"
                                    onClick={() => {
                                        setShowBulkReview(false);
                                        setShowBulkPromptInput(true);
                                    }}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Back to Bulk Input
                                </button>
                                <button
                                    className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 flex items-center gap-2"
                                    onClick={() => {
                                        setShowBulkReview(false);
                                        setIsCollapsed(false);
                                        setBulkGeneratedTweets([]);
                                    }}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BulkPromptsManager; 