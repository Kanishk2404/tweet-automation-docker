import { useState, useRef, useEffect } from 'react'
import { DateTime } from 'luxon';
import { Navigate } from 'react-router-dom';
import TweetHistory from '../TweetHistory';
import ThreadModal from '../ThreadModal';
import BulkPromptInput from '../BulkPromptInput';
import SchedulePicker from '../SchedulePicker';

// Import new modular components
import ApiKeysForm from './ApiKeysForm';
import TweetHistoryPanel from './TweetHistoryPanel';
import TweetGenerator from './TweetGenerator';
import BulkPromptsManager from './BulkPromptsManager';
import LogoutButton from './LogoutButton';

// Import custom hook
import { useTweetGenie } from '../../hooks/useTweetGenie';

export default function TweetLayout() {
    // Built-in keys from Vite environment variables
    const DEFAULT_PERPLEXITY_KEY = import.meta.env.VITE_PERPLEXITY_API_KEY || '';
    const DEFAULT_GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
    const DEFAULT_OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

    // Custom hook for API operations
    const {
        loading,
        error,
        dataURLtoFile,
        generateTweet,
        postTweet,
        scheduleTweet,
        generateAIImage,
        generateBulkTweets,
        scheduleBulkTweets,
        getScheduledTweets,
        deleteScheduledTweet
    } = useTweetGenie();

    // Ref for TweetHistory
    const tweetHistoryRef = useRef(null);

    // Load from localStorage if available
    const [userName, setUserName] = useState(() => localStorage.getItem('userName') || '');
    const [perplexityApiKey, setPerplexityApiKey] = useState(() => localStorage.getItem('perplexityApiKey') || '');
    const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('geminiApiKey') || '');
    const [openaiApiKey, setOpenaiApiKey] = useState(() => localStorage.getItem('openaiApiKey') || '');
    const [usePerplexity, setUsePerplexity] = useState(() => localStorage.getItem('usePerplexity') === 'true');
    const [useGemini, setUseGemini] = useState(() => localStorage.getItem('useGemini') === 'true');
    const [useOpenAI, setUseOpenAI] = useState(() => localStorage.getItem('useOpenAI') === 'true');
    const [twitterApiKey, setTwitterApiKey] = useState(() => localStorage.getItem('twitterApiKey') || '');
    const [twitterApiSecret, setTwitterApiSecret] = useState(() => localStorage.getItem('twitterApiSecret') || '');
    const [twitterAccessToken, setTwitterAccessToken] = useState(() => localStorage.getItem('twitterAccessToken') || '');
    const [twitterAccessSecret, setTwitterAccessSecret] = useState(() => localStorage.getItem('twitterAccessSecret') || '');
    const [tweetContent, setTweetContent] = useState('');
    const [useOwnKeys, setUseOwnKeys] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [aiPrompt, setAiPrompt] = useState('');
    const [imagePrompt, setImagePrompt] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const fileInputRef = useRef(null);
    const [showThreadModal, setShowThreadModal] = useState(false);
    const [threadTweets, setThreadTweets] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [threadPrompt, setThreadPrompt] = useState('');
    // Track the last AI image URL (for OpenAI)
    const [aiImageUrl, setAiImageUrl] = useState('');
    const [showBulkPromptInput, setShowBulkPromptInput] = useState(false);
    // Bulk prompts state
    const [bulkGeneratedTweets, setBulkGeneratedTweets] = useState([]);
    const [bulkLoading, setBulkLoading] = useState(false); // global loading for initial bulk
    const [promptLoading, setPromptLoading] = useState({}); // per-prompt loading
    const [bulkError, setBulkError] = useState('');
    const [showBulkReview, setShowBulkReview] = useState(false);
    const [editingTweetIdx, setEditingTweetIdx] = useState(null);
    const [editingTweetValue, setEditingTweetValue] = useState('');
    // Bulk scheduling state
    const [bulkScheduleType, setBulkScheduleType] = useState('once');
    const [bulkTimes, setBulkTimes] = useState(['']);
    const [bulkStartDate, setBulkStartDate] = useState(''); // Single start date for all
    const [bulkScheduleError, setBulkScheduleError] = useState('');
    const [bulkScheduleSuccess, setBulkScheduleSuccess] = useState('');

    // Scheduled tweets state
    const [scheduledTweets, setScheduledTweets] = useState([]);
    const [showScheduled, setShowScheduled] = useState(false);

    // UI state
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [scheduledDateTime, setScheduledDateTime] = useState('');
    const [showSchedulePicker, setShowSchedulePicker] = useState(false);

    // Handler for scheduling all tweets in bulk
    const handleBulkSchedule = async () => {
        // Get user's timezone
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
        setBulkScheduleError('');
        setBulkScheduleSuccess('');
        try {
            // Prepare payload
            const tweets = bulkGeneratedTweets.map(t => ({ prompt: t.prompt, tweet: t.tweet }));
            // Use the selected start date or today if not set
            const today = new Date().toISOString().slice(0, 10);
            const startDate = bulkStartDate || today;
            const payload = {
                tweets,
                scheduleType: bulkScheduleType,
                times: bulkTimes,
                dates: [startDate],
                userTimeZone,
                userName,
                twitterApiKey,
                twitterApiSecret,
                twitterAccessToken,
                twitterAccessSecret
            };

            await scheduleBulkTweets(payload);
            setBulkScheduleSuccess('Bulk tweets scheduled!');
            setBulkScheduleError('');
        } catch (err) {
            setBulkScheduleError(err.message || 'Failed to schedule bulk tweets.');
            setBulkScheduleSuccess('');
        }
    };

    // Fetch scheduled tweets for the logged-in user
    const fetchScheduledTweets = async () => {
        try {
            const formatted = await getScheduledTweets();
            setScheduledTweets(formatted);
        } catch (err) {
            console.error('Error fetching scheduled tweets:', err);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchScheduledTweets();
        }
    }, [isLoggedIn, showScheduled]);

    // Handler to delete a scheduled tweet
    const handleDeleteScheduled = async (id) => {
        if (!window.confirm('Are you sure you want to delete this scheduled post?')) return;
        try {
            await deleteScheduledTweet(id);
            fetchScheduledTweets();
        } catch (err) {
            console.error('Error deleting scheduled tweet:', err);
        }
    };

    // Bulk prompt submit: send to backend, get generated tweets, show review UI
    const handleBulkSubmit = async (promptsArray) => {
        setBulkLoading(true);
        setBulkError('');
        setBulkGeneratedTweets([]);
        setShowBulkReview(true);
        setPromptLoading({});

        // Compose AI provider info
        const aiProviders = [];
        if (usePerplexity) aiProviders.push('perplexity');
        if (useGemini) aiProviders.push('gemini');
        if (useOpenAI) aiProviders.push('openai');

        // Process prompts one by one
        for (let i = 0; i < promptsArray.length; i++) {
            const prompt = promptsArray[i];
            setPromptLoading(prev => ({ ...prev, [i]: true }));
            try {
                const payload = {
                    prompts: [prompt],
                    aiProviders,
                    useOwnKeys,
                    perplexityApiKey,
                    geminiApiKey,
                    openaiApiKey
                };

                const results = await generateBulkTweets(payload);
                if (Array.isArray(results) && results.length > 0) {
                    setBulkGeneratedTweets(prev => [...prev, results[0]]);
                } else {
                    setBulkGeneratedTweets(prev => [...prev, { prompt, tweet: '', error: 'Failed to generate tweet.' }]);
                }
            } catch (err) {
                setBulkGeneratedTweets(prev => [...prev, { prompt, tweet: '', error: err.message || 'Error generating tweet.' }]);
            }
            setPromptLoading(prev => ({ ...prev, [i]: false }));
        }
        setBulkLoading(false);
        setShowBulkPromptInput(false);
    };

    // Edit and regenerate a single prompt in the review list
    const handleEditTweet = (idx) => {
        setEditingTweetIdx(idx);
        setEditingTweetValue(bulkGeneratedTweets[idx].tweet);
    };

    const handleSaveEditTweet = (idx) => {
        setBulkGeneratedTweets(prev => prev.map((item, i) => i === idx ? { ...item, tweet: editingTweetValue } : item));
        setEditingTweetIdx(null);
        setEditingTweetValue('');
    };

    // Save to localStorage on change
    useEffect(() => {
        if (userName !== '') localStorage.setItem('userName', userName);
    }, [userName]);
    useEffect(() => {
        if (perplexityApiKey !== '') localStorage.setItem('perplexityApiKey', perplexityApiKey);
    }, [perplexityApiKey]);
    useEffect(() => {
        if (geminiApiKey !== '') localStorage.setItem('geminiApiKey', geminiApiKey);
    }, [geminiApiKey]);
    useEffect(() => {
        if (openaiApiKey !== '') localStorage.setItem('openaiApiKey', openaiApiKey);
    }, [openaiApiKey]);
    useEffect(() => {
        localStorage.setItem('usePerplexity', usePerplexity);
    }, [usePerplexity]);
    useEffect(() => {
        localStorage.setItem('useGemini', useGemini);
    }, [useGemini]);
    useEffect(() => {
        localStorage.setItem('useOpenAI', useOpenAI);
    }, [useOpenAI]);
    useEffect(() => {
        if (twitterApiKey !== '') localStorage.setItem('twitterApiKey', twitterApiKey);
    }, [twitterApiKey]);
    useEffect(() => {
        if (twitterApiSecret !== '') localStorage.setItem('twitterApiSecret', twitterApiSecret);
    }, [twitterApiSecret]);
    useEffect(() => {
        if (twitterAccessToken !== '') localStorage.setItem('twitterAccessToken', twitterAccessToken);
    }, [twitterAccessToken]);
    useEffect(() => {
        if (twitterAccessSecret !== '') localStorage.setItem('twitterAccessSecret', twitterAccessSecret);
    }, [twitterAccessSecret]);

    const handleGenerateAIImage = async () => {
        const aiKeys = {};
        // Use user's keys if provided, else use built-in keys
        if (useOwnKeys) {
            if (openaiApiKey) aiKeys.openaiApiKey = openaiApiKey;
        }
        const payload = {
            prompt: imagePrompt || tweetContent,
            ...aiKeys,
            useOwnKeys
        };

        setIsImageLoading(true);
        try {
            const imageData = await generateAIImage(payload);
            setImagePreview(imageData); // Show the generated image as preview
            if (imageData.startsWith('data:image/')) {
                const file = dataURLtoFile(imageData, 'ai-image.png');
                setSelectedImage(file);
                setAiImageUrl('');
            } else if (imageData.startsWith('http')) {
                setSelectedImage(null);
                setAiImageUrl(imageData);
            } else {
                setSelectedImage(null);
                setAiImageUrl('');
            }
        } catch (err) {
            console.error('AI image generation failed:', err);
        } finally {
            setIsImageLoading(false);
        }
    };

    // Handler functions for TweetGenerator
    const handleGenerateTweet = async () => {
        // Validate keys before sending
        if (usePerplexity && perplexityApiKey.trim() === '') {
            alert('Perplexity is selected but no API key is provided. Please enter a valid key or uncheck Perplexity.');
            return;
        }
        if (useGemini && geminiApiKey.trim() === '') {
            alert('Gemini is selected but no API key is provided. Please enter a valid key or uncheck Gemini.');
            return;
        }
        if (useOpenAI && openaiApiKey.trim() === '') {
            alert('OpenAI is selected but no API key is provided. Please enter a valid key or uncheck OpenAI.');
            return;
        }

        // Collect all selected providers in order of fallback
        const aiProviders = [];
        if (usePerplexity) aiProviders.push('perplexity');
        if (useGemini) aiProviders.push('gemini');
        if (useOpenAI) aiProviders.push('openai');

        const aiKeys = {};
        if (useOwnKeys) {
            if (usePerplexity && perplexityApiKey.trim() !== '') aiKeys.perplexityApiKey = perplexityApiKey;
            if (useGemini && geminiApiKey.trim() !== '') aiKeys.geminiApiKey = geminiApiKey;
            if (useOpenAI && openaiApiKey.trim() !== '') aiKeys.openaiApiKey = openaiApiKey;
        } else {
            if (DEFAULT_PERPLEXITY_KEY && DEFAULT_PERPLEXITY_KEY.trim() !== '') aiKeys.perplexityApiKey = DEFAULT_PERPLEXITY_KEY;
            if (DEFAULT_GEMINI_KEY && DEFAULT_GEMINI_KEY.trim() !== '') aiKeys.geminiApiKey = DEFAULT_GEMINI_KEY;
        }

        // Only send keys for selected providers
        const payload = {
            aiPrompt: aiPrompt,
            userName: userName,
            aiProviders,
            twitterApiKey: twitterApiKey,
            twitterApiSecret: twitterApiSecret,
            twitterAccessToken: twitterAccessToken,
            twitterAccessSecret: twitterAccessSecret,
            useOwnKeys,
            ...aiKeys
        };

        try {
            const generatedContent = await generateTweet(payload);
            setTweetContent(generatedContent);
        } catch (err) {
            console.error('Error generating tweet:', err);
        }
    };

    const handlePostTweet = async () => {
        const formData = new FormData();
        formData.append('userName', userName);
        formData.append('geminiApiKey', geminiApiKey);
        formData.append('openaiApiKey', openaiApiKey);
        formData.append('twitterApiKey', twitterApiKey);
        formData.append('twitterApiSecret', twitterApiSecret);
        formData.append('twitterAccessToken', twitterAccessToken);
        formData.append('twitterAccessSecret', twitterAccessSecret);
        formData.append('content', tweetContent);
        if (selectedImage) {
            formData.append('image', selectedImage);
        }
        if (!selectedImage && aiImageUrl) {
            formData.append('imageUrl', aiImageUrl);
        }

        try {
            const data = await postTweet(formData);
            setTweetContent(''); // Clear the textarea after successful post
            setSelectedImage(null); // Clear image
            setImagePreview(null); // Clear preview
            setAiImageUrl('');
            if (fileInputRef.current) fileInputRef.current.value = ''; // Clear file input
            // Refresh tweet history
            if (tweetHistoryRef.current && tweetHistoryRef.current.refresh) {
                tweetHistoryRef.current.refresh();
            }
        } catch (err) {
            console.error('Error posting tweet:', err);
        }
    };

    const handleScheduleTweet = async () => {
        // Prepare payload for scheduling
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
        // Convert local datetime-local string to ISO with time zone
        let scheduledTimeIso = scheduledDateTime;
        if (scheduledDateTime) {
            scheduledTimeIso = DateTime.fromISO(scheduledDateTime, { zone: userTimeZone }).toISO();
        }
        const payload = {
            userName,
            content: tweetContent,
            imageUrl: aiImageUrl || null,
            scheduledTime: scheduledTimeIso,
            twitterApiKey,
            twitterApiSecret,
            twitterAccessToken,
            twitterAccessSecret,
            userTimeZone
        };

        try {
            await scheduleTweet(payload);
            setScheduledDateTime('');
            setTweetContent('');
            setAiImageUrl('');
            setSelectedImage(null);
            setImagePreview(null);
        } catch (err) {
            console.error('Error scheduling tweet:', err);
        }
        setShowSchedulePicker(false);
    };

    // Login handler
    const handleLogin = () => {
        // If user selects any AI provider and provides a key, use their keys. Otherwise, use built-in keys.
        const userSelectedAnyAI = usePerplexity || useGemini || useOpenAI;
        const aiKeyValid =
            (usePerplexity && perplexityApiKey) ||
            (useGemini && geminiApiKey) ||
            (useOpenAI && openaiApiKey);
        if (
            userName &&
            twitterApiKey &&
            twitterApiSecret &&
            twitterAccessToken &&
            twitterAccessSecret
        ) {
            // If user selected at least one AI and provided a key, use their keys
            if (userSelectedAnyAI && aiKeyValid) {
                setUseOwnKeys(true);
                setIsLoggedIn(true);
            } else {
                // Use built-in keys
                setUseOwnKeys(false);
                setIsLoggedIn(true);
            }
        } else {
            alert('Please fill in all required fields.');
        }
    };

    // Logout handler
    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserName('');
        setPerplexityApiKey('');
        setGeminiApiKey('');
        setOpenaiApiKey('');
        setTwitterApiKey('');
        setTwitterApiSecret('');
        setTwitterAccessToken('');
        setTwitterAccessSecret('');
        setTweetContent('');
        setSelectedImage(null);
        setImagePreview(null);
        setAiPrompt('');
    };

    // If not logged in, redirect to login
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
                <div className="w-full max-w-4xl">
                    <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        TweetGenie
                    </h1>
                    <ApiKeysForm
                        userName={userName}
                        setUserName={setUserName}
                        perplexityApiKey={perplexityApiKey}
                        setPerplexityApiKey={setPerplexityApiKey}
                        geminiApiKey={geminiApiKey}
                        setGeminiApiKey={setGeminiApiKey}
                        openaiApiKey={openaiApiKey}
                        setOpenaiApiKey={setOpenaiApiKey}
                        usePerplexity={usePerplexity}
                        setUsePerplexity={setUsePerplexity}
                        useGemini={useGemini}
                        setUseGemini={setUseGemini}
                        useOpenAI={useOpenAI}
                        setUseOpenAI={setUseOpenAI}
                        twitterApiKey={twitterApiKey}
                        setTwitterApiKey={setTwitterApiKey}
                        twitterApiSecret={twitterApiSecret}
                        setTwitterApiSecret={setTwitterApiSecret}
                        twitterAccessToken={twitterAccessToken}
                        setTwitterAccessToken={setTwitterAccessToken}
                        twitterAccessSecret={twitterAccessSecret}
                        setTwitterAccessSecret={setTwitterAccessSecret}
                        useOwnKeys={useOwnKeys}
                        setUseOwnKeys={setUseOwnKeys}
                        onLogin={handleLogin}
                    />
                </div>
            </div>
        );
    }

    // Main dashboard layout
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                TweetGenie
                            </h1>
                            <span className="ml-4 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                                Welcome, {userName}!
                            </span>
                        </div>
                        <LogoutButton onLogout={handleLogout} />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-start gap-6">
                    {/* Tweet History Panel */}
                    <TweetHistoryPanel
                        showScheduled={showScheduled}
                        setShowScheduled={setShowScheduled}
                        scheduledTweets={scheduledTweets}
                        userName={userName}
                        handleDeleteScheduled={handleDeleteScheduled}
                        tweetHistoryRef={tweetHistoryRef}
                    />

                    {/* Tweet Generator */}
                    <div className="flex-1 flex-shrink-0 min-w-64 max-w-2xl">
                        {!isCollapsed && (
                            <TweetGenerator
                                userName={userName}
                                tweetContent={tweetContent}
                                setTweetContent={setTweetContent}
                                aiPrompt={aiPrompt}
                                setAiPrompt={setAiPrompt}
                                imagePrompt={imagePrompt}
                                setImagePrompt={setImagePrompt}
                                selectedImage={selectedImage}
                                setSelectedImage={setSelectedImage}
                                imagePreview={imagePreview}
                                setImagePreview={setImagePreview}
                                aiImageUrl={aiImageUrl}
                                setAiImageUrl={setAiImageUrl}
                                isImageLoading={isImageLoading}
                                setIsImageLoading={setIsImageLoading}
                                fileInputRef={fileInputRef}
                                showSchedulePicker={showSchedulePicker}
                                setShowSchedulePicker={setShowSchedulePicker}
                                scheduledDateTime={scheduledDateTime}
                                setScheduledDateTime={setScheduledDateTime}
                                showThreadModal={showThreadModal}
                                setShowThreadModal={setShowThreadModal}
                                threadTweets={threadTweets}
                                setThreadTweets={setThreadTweets}
                                isGenerating={isGenerating}
                                setIsGenerating={setIsGenerating}
                                threadPrompt={threadPrompt}
                                setThreadPrompt={setThreadPrompt}
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
                                handleGenerateAIImage={handleGenerateAIImage}
                                handleGenerateTweet={handleGenerateTweet}
                                handlePostTweet={handlePostTweet}
                                handleScheduleTweet={handleScheduleTweet}
                            />
                        )}

                        {/* Bulk Prompts Manager */}
                        <BulkPromptsManager
                            showBulkPromptInput={showBulkPromptInput}
                            setShowBulkPromptInput={setShowBulkPromptInput}
                            showBulkReview={showBulkReview}
                            setShowBulkReview={setShowBulkReview}
                            isCollapsed={isCollapsed}
                            setIsCollapsed={setIsCollapsed}
                            bulkGeneratedTweets={bulkGeneratedTweets}
                            setBulkGeneratedTweets={setBulkGeneratedTweets}
                            bulkLoading={bulkLoading}
                            setBulkLoading={setBulkLoading}
                            bulkError={bulkError}
                            setBulkError={setBulkError}
                            editingTweetIdx={editingTweetIdx}
                            setEditingTweetIdx={setEditingTweetIdx}
                            editingTweetValue={editingTweetValue}
                            setEditingTweetValue={setEditingTweetValue}
                            bulkScheduleType={bulkScheduleType}
                            setBulkScheduleType={setBulkScheduleType}
                            bulkTimes={bulkTimes}
                            setBulkTimes={setBulkTimes}
                            bulkStartDate={bulkStartDate}
                            setBulkStartDate={setBulkStartDate}
                            bulkScheduleError={bulkScheduleError}
                            setBulkScheduleError={setBulkScheduleError}
                            bulkScheduleSuccess={bulkScheduleSuccess}
                            setBulkScheduleSuccess={setBulkScheduleSuccess}
                            handleBulkSubmit={handleBulkSubmit}
                            handleEditTweet={handleEditTweet}
                            handleSaveEditTweet={handleSaveEditTweet}
                            handleBulkSchedule={handleBulkSchedule}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
