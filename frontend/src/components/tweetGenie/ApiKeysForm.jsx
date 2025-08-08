import React from 'react';

const ApiKeysForm = ({
    userName,
    setUserName,
    perplexityApiKey,
    setPerplexityApiKey,
    geminiApiKey,
    setGeminiApiKey,
    openaiApiKey,
    setOpenaiApiKey,
    usePerplexity,
    setUsePerplexity,
    useGemini,
    setUseGemini,
    useOpenAI,
    setUseOpenAI,
    twitterApiKey,
    setTwitterApiKey,
    twitterApiSecret,
    setTwitterApiSecret,
    twitterAccessToken,
    setTwitterAccessToken,
    twitterAccessSecret,
    setTwitterAccessSecret,
    useOwnKeys,
    setUseOwnKeys,
    onLogin
}) => {
    return (
        <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-3xl rounded-3xl shadow-2xl border-2 border-white/40 relative overflow-hidden transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-blue-400 before:via-purple-500 before:to-blue-400 before:rounded-t-3xl">
            <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">Welcome to tweetgenie</h2>
            <p className="text-center text-gray-600 mb-6">Submit your API keys to continue</p>

            <div className="bg-gray-50 rounded-xl shadow-sm p-6 mb-8 max-w-lg mx-auto flex flex-col gap-4">
                {/* API Key Mode Selection */}
                <div className="mb-4 text-center">
                    <label className="font-semibold mr-3">API Key Mode:</label>
                    <label className="mr-4">
                        <input
                            type="radio"
                            checked={useOwnKeys}
                            onChange={() => setUseOwnKeys(true)}
                            className="mr-1"
                        />
                        Use your own API keys
                    </label>
                    <label>
                        <input
                            type="radio"
                            checked={!useOwnKeys}
                            onChange={() => setUseOwnKeys(false)}
                            className="mr-1"
                        />
                        Use TweetGenie built-in AI
                    </label>
                </div>

                {/* Username Input */}
                <div className="flex items-center gap-3">
                    <span role="img" aria-label="user" className="text-2xl">👤</span>
                    <input
                        type="text"
                        value={userName}
                        onChange={e => setUserName(e.target.value)}
                        onFocus={e => {
                            if (!userName && localStorage.getItem('userName')) {
                                setUserName(localStorage.getItem('userName'));
                            }
                        }}
                        placeholder="Your Name"
                        className="flex-1 w-full px-4 py-3 border-2 border-blue-400 rounded-lg bg-blue-50 text-lg text-gray-800 transition-all duration-300 focus:border-blue-600 focus:outline-none focus:bg-white focus:shadow-lg focus:shadow-blue-200"
                        autoComplete="username"
                        name="username"
                    />
                </div>

                {/* AI Providers Selection */}
                <div className="mb-2">
                    <label className="font-semibold mr-2">AI Providers:</label>
                    <span title="Use Perplexity AI for tweet generation" className="mr-3">
                        <input
                            type="checkbox"
                            checked={usePerplexity}
                            onChange={e => {
                                setUsePerplexity(e.target.checked);
                                if (!e.target.checked) {
                                    setPerplexityApiKey('');
                                    localStorage.removeItem('perplexityApiKey');
                                }
                            }}
                            disabled={!useOwnKeys}
                            className="mr-1"
                        />
                        <span role="img" aria-label="perplexity">🧠</span> Perplexity
                    </span>
                    <span title="Use Gemini AI for tweet generation" className="mr-3">
                        <input
                            type="checkbox"
                            checked={useGemini}
                            onChange={e => {
                                setUseGemini(e.target.checked);
                                if (!e.target.checked) {
                                    setGeminiApiKey('');
                                    localStorage.removeItem('geminiApiKey');
                                }
                            }}
                            disabled={!useOwnKeys}
                            className="mr-1"
                        />
                        <span role="img" aria-label="gemini">🌈</span> Gemini
                    </span>
                    <span title="Use OpenAI for tweet generation">
                        <input
                            type="checkbox"
                            checked={useOpenAI}
                            onChange={e => {
                                setUseOpenAI(e.target.checked);
                                if (!e.target.checked) {
                                    setOpenaiApiKey('');
                                    localStorage.removeItem('openaiApiKey');
                                }
                            }}
                            disabled={!useOwnKeys}
                            className="mr-1"
                        />
                        <span role="img" aria-label="openai">🤖</span> OpenAI
                    </span>
                </div>

                {/* Perplexity API Key */}
                {usePerplexity && (
                    <div className="flex items-center gap-3">
                        <span role="img" aria-label="perplexity" className="text-xl">🧠</span>
                        <input
                            type="password"
                            value={perplexityApiKey}
                            onChange={e => setPerplexityApiKey(e.target.value)}
                            onFocus={e => {
                                if (!perplexityApiKey && localStorage.getItem('perplexityApiKey')) {
                                    setPerplexityApiKey(localStorage.getItem('perplexityApiKey'));
                                }
                            }}
                            placeholder="Perplexity API Key"
                            className="flex-1 w-full px-4 py-3 border-2 border-blue-400 rounded-lg bg-blue-50 text-lg text-gray-800 transition-all duration-300 focus:border-blue-600 focus:outline-none focus:bg-white focus:shadow-lg focus:shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            autoComplete="off"
                            name="perplexity-api-key"
                            disabled={!useOwnKeys}
                        />
                        <span title="Get your Perplexity API key from perplexity.ai" className="text-gray-500 text-sm">?</span>
                    </div>
                )}

                {/* Gemini API Key */}
                {useGemini && (
                    <div className="flex items-center gap-3">
                        <span role="img" aria-label="gemini" className="text-xl">🌈</span>
                        <input
                            type="password"
                            value={geminiApiKey}
                            onChange={e => setGeminiApiKey(e.target.value)}
                            onFocus={e => {
                                if (!geminiApiKey && localStorage.getItem('geminiApiKey')) {
                                    setGeminiApiKey(localStorage.getItem('geminiApiKey'));
                                }
                            }}
                            placeholder="Gemini API Key"
                            className="flex-1 w-full px-4 py-3 border-2 border-blue-400 rounded-lg bg-blue-50 text-lg text-gray-800 transition-all duration-300 focus:border-blue-600 focus:outline-none focus:bg-white focus:shadow-lg focus:shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            autoComplete="off"
                            name="gemini-api-key"
                            disabled={!useOwnKeys}
                        />
                        <span title="Get your Gemini API key from makersuite.google.com" className="text-gray-500 text-sm">?</span>
                    </div>
                )}

                {/* OpenAI API Key */}
                {useOpenAI && (
                    <div className="flex items-center gap-3">
                        <span role="img" aria-label="openai" className="text-xl">🤖</span>
                        <input
                            type="password"
                            value={openaiApiKey}
                            onChange={e => setOpenaiApiKey(e.target.value)}
                            onFocus={e => {
                                if (!openaiApiKey && localStorage.getItem('openaiApiKey')) {
                                    setOpenaiApiKey(localStorage.getItem('openaiApiKey'));
                                }
                            }}
                            placeholder="OpenAI API Key"
                            className="flex-1 w-full px-4 py-3 border-2 border-blue-400 rounded-lg bg-blue-50 text-lg text-gray-800 transition-all duration-300 focus:border-blue-600 focus:outline-none focus:bg-white focus:shadow-lg focus:shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            autoComplete="off"
                            name="openai-api-key"
                            disabled={!useOwnKeys}
                        />
                        <span title="Get your OpenAI API key from platform.openai.com" className="text-gray-500 text-sm">?</span>
                    </div>
                )}

                {/* Twitter Credentials */}
                <div className="mt-4 mb-2 font-semibold text-base">Twitter Credentials</div>
                <div className="flex flex-col gap-4 items-stretch mb-4 w-full max-w-md mx-auto">
                    {/* Twitter API Key */}
                    <div className="flex items-center gap-3">
                        <span role="img" aria-label="twitter" className="text-xl">🐦</span>
                        <input
                            type="password"
                            value={twitterApiKey}
                            onChange={e => setTwitterApiKey(e.target.value)}
                            onFocus={e => {
                                if (!twitterApiKey && localStorage.getItem('twitterApiKey')) {
                                    setTwitterApiKey(localStorage.getItem('twitterApiKey'));
                                }
                            }}
                            placeholder="Twitter API Key"
                            className="flex-1 w-full px-4 py-3 border-2 border-blue-400 rounded-lg bg-blue-50 text-lg text-gray-800 transition-all duration-300 focus:border-blue-600 focus:outline-none focus:bg-white focus:shadow-lg focus:shadow-blue-200"
                            autoComplete="off"
                            name="twitter-api-key"
                        />
                    </div>
                    <div className="text-xs text-gray-500 ml-8">
                        Enter your Twitter/X API Key (Consumer Key)
                    </div>

                    {/* Twitter API Secret */}
                    <div className="flex items-center gap-3">
                        <span role="img" aria-label="twitter" className="text-xl">🐦</span>
                        <input
                            type="password"
                            value={twitterApiSecret}
                            onChange={e => setTwitterApiSecret(e.target.value)}
                            onFocus={e => {
                                if (!twitterApiSecret && localStorage.getItem('twitterApiSecret')) {
                                    setTwitterApiSecret(localStorage.getItem('twitterApiSecret'));
                                }
                            }}
                            placeholder="Twitter API Secret"
                            className="flex-1 w-full px-4 py-3 border-2 border-blue-400 rounded-lg bg-blue-50 text-lg text-gray-800 transition-all duration-300 focus:border-blue-600 focus:outline-none focus:bg-white focus:shadow-lg focus:shadow-blue-200"
                            autoComplete="off"
                            name="twitter-api-secret"
                        />
                    </div>
                    <div className="text-xs text-gray-500 ml-8">
                        Enter your Twitter/X API Secret (Consumer Secret)
                    </div>

                    {/* Twitter Access Token */}
                    <div className="flex items-center gap-3">
                        <span role="img" aria-label="twitter" className="text-xl">🐦</span>
                        <input
                            type="password"
                            value={twitterAccessToken}
                            onChange={e => setTwitterAccessToken(e.target.value)}
                            onFocus={e => {
                                if (!twitterAccessToken && localStorage.getItem('twitterAccessToken')) {
                                    setTwitterAccessToken(localStorage.getItem('twitterAccessToken'));
                                }
                            }}
                            placeholder="Twitter Access Token"
                            className="flex-1 w-full px-4 py-3 border-2 border-blue-400 rounded-lg bg-blue-50 text-lg text-gray-800 transition-all duration-300 focus:border-blue-600 focus:outline-none focus:bg-white focus:shadow-lg focus:shadow-blue-200"
                            autoComplete="off"
                            name="twitter-access-token"
                        />
                    </div>
                    <div className="text-xs text-gray-500 ml-8">
                        Enter your Twitter/X Access Token (OAuth 1.0a Access Token)
                    </div>

                    {/* Twitter Access Secret */}
                    <div className="flex items-center gap-3">
                        <span role="img" aria-label="twitter" className="text-xl">🐦</span>
                        <input
                            type="password"
                            value={twitterAccessSecret}
                            onChange={e => setTwitterAccessSecret(e.target.value)}
                            onFocus={e => {
                                if (!twitterAccessSecret && localStorage.getItem('twitterAccessSecret')) {
                                    setTwitterAccessSecret(localStorage.getItem('twitterAccessSecret'));
                                }
                            }}
                            placeholder="Twitter Access Secret"
                            className="flex-1 w-full px-4 py-3 border-2 border-blue-400 rounded-lg bg-blue-50 text-lg text-gray-800 transition-all duration-300 focus:border-blue-600 focus:outline-none focus:bg-white focus:shadow-lg focus:shadow-blue-200"
                            autoComplete="off"
                            name="twitter-access-secret"
                        />
                    </div>
                    <div className="text-xs text-gray-500 ml-8">
                        Enter your Twitter/X Access Secret (OAuth 1.0a Access Token Secret)
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <button
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                onClick={onLogin}
            >
                Submit
            </button>
        </div>
    );
};

export default ApiKeysForm; 