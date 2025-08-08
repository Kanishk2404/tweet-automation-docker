import React from 'react';
import SchedulePicker from '../SchedulePicker';
import ThreadModal from '../ThreadModal';

const TweetGenerator = ({
    userName,
    tweetContent,
    setTweetContent,
    aiPrompt,
    setAiPrompt,
    imagePrompt,
    setImagePrompt,
    selectedImage,
    setSelectedImage,
    imagePreview,
    setImagePreview,
    aiImageUrl,
    setAiImageUrl,
    isImageLoading,
    setIsImageLoading,
    fileInputRef,
    showSchedulePicker,
    setShowSchedulePicker,
    scheduledDateTime,
    setScheduledDateTime,
    showThreadModal,
    setShowThreadModal,
    threadTweets,
    setThreadTweets,
    isGenerating,
    setIsGenerating,
    threadPrompt,
    setThreadPrompt,
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
    tweetHistoryRef,
    handleGenerateAIImage,
    handleGenerateTweet,
    handlePostTweet,
    handleScheduleTweet
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Create Your Tweet</h2>
                    <p className="text-gray-600">Craft engaging content for your audience</p>
                </div>
            </div>

            {/* Tweet Content Textarea */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    What's happening?
                </label>
                <textarea
                    value={tweetContent}
                    onChange={(e) => setTweetContent(e.target.value)}
                    placeholder="Share your thoughts, ideas, or updates..."
                    rows={4}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl resize-none focus:border-blue-500 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                />
                <div className="flex justify-between items-center mt-2">
                    <p className={`text-sm ${tweetContent.length > 260 ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>
                        Characters: {tweetContent.length}/280
                    </p>
                    {tweetContent.length > 260 && (
                        <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded-full">
                            Character limit exceeded
                        </span>
                    )}
                </div>
            </div>

            {/* Schedule Button and Picker */}
            <div className="mb-6">
                <div className="flex items-center gap-3">
                    <button
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2"
                        onClick={() => setShowSchedulePicker(true)}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Schedule Tweet
                    </button>
                    {showSchedulePicker && (
                        <div className="flex items-center gap-3">
                            <SchedulePicker
                                value={scheduledDateTime}
                                onChange={val => setScheduledDateTime(val)}
                            />
                            <button
                                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                disabled={tweetContent.length === 0 || tweetContent.length > 280 || !scheduledDateTime}
                                onClick={handleScheduleTweet}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Confirm Schedule
                            </button>
                            <button
                                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-all duration-200"
                                onClick={() => setShowSchedulePicker(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Image Upload Section */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Visual Content
                </label>
                <div className="space-y-4">
                    <input
                        type="text"
                        value={imagePrompt}
                        onChange={e => setImagePrompt(e.target.value)}
                        placeholder="Describe the image you want (optional, improves quality)"
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-all duration-200"
                    />
                    <div className="flex items-center gap-3">
                        <input
                            ref={fileInputRef}
                            type="file"
                            id="image-upload"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setSelectedImage(file);
                                    const reader = new FileReader();
                                    reader.onload = (e) => setImagePreview(e.target.result);
                                    reader.readAsDataURL(file);
                                } else {
                                    setSelectedImage(null);
                                    setImagePreview(null);
                                }
                            }}
                            className="hidden"
                        />
                        <label
                            htmlFor="image-upload"
                            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Upload Image
                        </label>

                        <button
                            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            disabled={!tweetContent}
                            onClick={handleGenerateAIImage}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Generate AI Image
                        </button>
                    </div>

                    {imagePreview && (
                        <div className="relative inline-block">
                            <img src={imagePreview} alt="Preview" className="max-w-xs max-h-48 rounded-lg border-2 border-gray-200" />
                            <button
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white border-none rounded-full w-6 h-6 flex items-center justify-center text-sm cursor-pointer transition-all duration-200"
                                onClick={() => {
                                    setSelectedImage(null);
                                    setImagePreview(null);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* AI Prompt Section */}
            <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    AI Content Generation
                </label>
                <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Enter topic for AI generation (optional)"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-all duration-200"
                />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                    className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                    onClick={handleGenerateTweet}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {aiPrompt ? `Generate AI Content about "${aiPrompt}"` : 'Generate AI Content'}
                </button>

                <button
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                    onClick={() => setShowThreadModal(true)}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Generate Thread
                </button>

                <button
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                    disabled={tweetContent.length === 0 || tweetContent.length > 280 || isImageLoading}
                    onClick={handlePostTweet}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Post Tweet
                </button>
            </div>

            {/* Thread Modal */}
            <ThreadModal
                show={showThreadModal}
                onClose={() => setShowThreadModal(false)}
                threadPrompt={threadPrompt}
                setThreadPrompt={setThreadPrompt}
                threadTweets={threadTweets}
                setThreadTweets={setThreadTweets}
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
                userName={userName}
                twitterApiKey={twitterApiKey}
                twitterApiSecret={twitterApiSecret}
                twitterAccessToken={twitterAccessToken}
                twitterAccessSecret={twitterAccessSecret}
                usePerplexity={usePerplexity}
                useGemini={useGemini}
                useOpenAI={useOpenAI}
                useOwnKeys={useOwnKeys}
                perplexityApiKey={perplexityApiKey}
                geminiApiKey={geminiApiKey}
                openaiApiKey={openaiApiKey}
                DEFAULT_PERPLEXITY_KEY={DEFAULT_PERPLEXITY_KEY}
                DEFAULT_GEMINI_KEY={DEFAULT_GEMINI_KEY}
                tweetHistoryRef={tweetHistoryRef}
            />
        </div>
    );
};

export default TweetGenerator; 