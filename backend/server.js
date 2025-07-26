// Helper to validate API keys (not empty, not placeholder)
function isValidKey(key) {
    if (!key || typeof key !== 'string') return false;
    const trimmed = key.trim();
    if (!trimmed) return false;
    if (trimmed.startsWith('sk-...') || trimmed.startsWith('your-')) return false;
    return true;
}
require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { TwitterApi } = require('twitter-api-v2');
// const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai');
const fetch = require('node-fetch');
const sequelize = require('./db');
const TweetModel = require('./models/tweet');       

// Initialize Sequelize and Tweet model
const Tweet = TweetModel(sequelize);

sequelize.sync().then(() => {
    console.log('Database synced!');
});

const app = express();
app.use(cors());
app.use(express.json());

// Configure multer for image uploads
const upload = multer({
    dest: 'uploads/',
    limits: {
        fileSize: 10 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

const ACCESS_CODE = process.env.ACCESS_CODE || "tweetmaster2025";
const PORT = process.env.PORT || 5000;

// OpenAI support removed

let openaiClient = null;
if (process.env.OPENAI_API_KEY){
    openaiClient = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    console.log('OpenAI API initialized successfully');
} else{
    console.log('OpenAI API key not found. OpenAI fallback disabled.');
}

// Initialize Gemini client
let geminiClient = null;
let geminiModel = null;
if (process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    geminiModel = geminiClient.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log('Gemini AI initialized successfully');
} else {
    console.log('Gemini API key not found.');
}

// Initialize Twitter client
let twitterClient = null;
if (process.env.TWITTER_API_KEY && process.env.TWITTER_API_SECRET && 
    process.env.TWITTER_ACCESS_TOKEN && process.env.TWITTER_ACCESS_SECRET) {
    
    twitterClient = new TwitterApi({
        appKey: process.env.TWITTER_API_KEY,
        appSecret: process.env.TWITTER_API_SECRET,
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessSecret: process.env.TWITTER_ACCESS_SECRET,
    });
    console.log('Twitter API initialized successfully');
} else {
    console.log('Twitter API keys not found. Tweet posting disabled.');
}

// Health check endpoint for Railway
app.get('/', (req, res) => {
    res.json({ 
        status: 'Tweet Automator Backend is running!',
        timestamp: new Date().toISOString(),
        services: {
            twitter: !!twitterClient,
            gemini: !!geminiClient,
            // openai: !!openaiClient
        }
    });
});

// Auth endpoint
app.post('/auth', (req, res) => {
    const { password } = req.body;
    if (password === ACCESS_CODE) {
        res.json({ success: true, message: "Access granted!" });
    } else {
        res.json({ success: false, message: "Invalid access code" });
    }
});

// Generate tweet endpoint
app.post('/generate-tweet', async (req, res) => {
    // Log received API keys for debugging
    console.log('Received API keys:', {
        perplexityApiKey: !!req.body.perplexityApiKey,
        geminiApiKey: !!req.body.geminiApiKey,
        openaiApiKey: !!req.body.openaiApiKey
    });
    const {
        userName,
        openaiApiKey,
        twitterApiKey,
        twitterApiSecret,
        twitterAccessToken,
        twitterAccessSecret,
        aiPrompt
    } = req.body;

    // Use provided Perplexity key or fallback to env, only if valid
    const perplexityApiKey = isValidKey(req.body.perplexityApiKey)
        ? req.body.perplexityApiKey
        : isValidKey(process.env.PERPLEXITY_API_KEY)
            ? process.env.PERPLEXITY_API_KEY
            : null;

    // Use provided Gemini key or fallback to env, only if valid
    const geminiApiKey = isValidKey(req.body.geminiApiKey)
        ? req.body.geminiApiKey
        : isValidKey(process.env.GEMINI_API_KEY)
            ? process.env.GEMINI_API_KEY
            : null;

    // ...existing code...

    // Always generate a tweet specifically about what the user asked
    const prompt = aiPrompt && aiPrompt.trim()
        ? `Generate an engaging, creative tweet specifically about: ${aiPrompt}. Include relevant emojis if appropriate.`
        : `Generate an engaging, creative tweet about any topic. Include relevant emojis if appropriate.`;

    // Unified AI provider logic
    const axios = require('axios');
    let generatedTweet = '';
    try {
        // 1. Try Perplexity
        if (perplexityApiKey) {
            console.log('Using Perplexity API key:', perplexityApiKey);
            try {
                const resp = await axios.post('https://api.perplexity.ai/chat/completions', {
                    model: 'sonar-pro',
                    messages: [{ role: 'user', content: prompt }],
                }, {
                    headers: { 'Authorization': `Bearer ${perplexityApiKey}` }
                });
                generatedTweet = resp.data.choices[0].message.content.trim();
                console.log('✅ Generated tweet with Perplexity:', generatedTweet);
            } catch (err) {
                if (err.response) {
                    console.error('Perplexity error:', {
                        status: err.response.status,
                        data: err.response.data,
                        headers: err.response.headers
                    });
                } else {
                    console.error('Perplexity error:', err.message);
                }
            }
        }
        // 2. Try Gemini if Perplexity failed or not provided
        if (!generatedTweet && geminiApiKey) {
            try {
                const { GoogleGenerativeAI } = require('@google/generative-ai');
                const geminiClient = new GoogleGenerativeAI(geminiApiKey);
                const geminiModel = geminiClient.getGenerativeModel({ model: "gemini-1.5-flash" });
                const result = await geminiModel.generateContent(
                    `You are a social media expert creating engaging, concise, and shareable tweets. Keep each tweet under 280 characters, add personality, and encourage engagement.\n\n${prompt}`
                );
                const response = result.response;
                generatedTweet = response.text().trim();
                console.log('✅ Generated tweet with Gemini:', generatedTweet);
            } catch (err) {
                console.error('Gemini error:', err.message);
            }
        }
        // 3. Try OpenAI if Perplexity and Gemini failed or not provided
        if (!generatedTweet && openaiApiKey) {
            try {
                const OpenAI = require('openai');
                const openaiClient = new OpenAI({ apiKey: openaiApiKey });
                const completion = await openaiClient.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: "You are a social media expert creating engaging, concise, and shareable tweets. Keep each tweet under 280 characters, add personality, and encourage engagement.\n\n"
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    max_tokens: 100,
                    temperature: 0.8,
                });
                generatedTweet = completion.choices[0].message.content.trim();
                console.log('✅ Generated tweet with OpenAI:', generatedTweet);
            } catch (err) {
                console.error('OpenAI error:', err.message);
            }
        }
        if (!generatedTweet) {
            return res.json({
                success: false,
                message: "AI generation disabled. Add Perplexity, Gemini, or OpenAI API key to enable this feature."
            });
        }
        // Remove quotes if the AI added them
        const cleanTweet = generatedTweet.replace(/^[[\"']|[\"']]$/g, '');
        res.json({
            success: true,
            content: cleanTweet,
            message: "Tweet generated successfully!"
        });
    } catch (error) {
        console.error('❌ Error generating tweet:', error);
        res.status(500).json({
            success: false,
            message: "Failed to generate tweet",
            error: error.message
        });
    }
});

// --- /generate-ai-image endpoint (fixed) ---
app.post('/generate-ai-image', async (req, res) => {
    const { prompt, openaiApiKey } = req.body;

    if (!prompt || !prompt.trim()) {
        return res.status(400).json({
            success: false,
            message: "Prompt is required to generate an image."
        });
    }

    // Enhance prompt for better image quality
    let enhancedPrompt = '';
    if (prompt && prompt.trim()) {
        enhancedPrompt = `Create a high-quality, visually engaging image for social media. ${prompt}`;
    } else {
        enhancedPrompt = 'Create a high-quality, visually engaging image for social media.';
    }
    
    // Use provided Perplexity key or fallback to env, only if valid
    const perplexityApiKey = isValidKey(req.body.perplexityApiKey)
        ? req.body.perplexityApiKey
        : isValidKey(process.env.PERPLEXITY_API_KEY)
            ? process.env.PERPLEXITY_API_KEY
            : null;

    // Use provided Gemini key or fallback to env, only if valid
    const geminiApiKey = isValidKey(req.body.geminiApiKey)
        ? req.body.geminiApiKey
        : isValidKey(process.env.GEMINI_API_KEY)
            ? process.env.GEMINI_API_KEY
            : null;

    // Try Gemini first if key is provided
    if (geminiApiKey) {
        try {
            const { GoogleGenerativeAI } = require('@google/generative-ai');
            const genAI = new GoogleGenerativeAI(geminiApiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent([
                { text: enhancedPrompt }
            ]);
            if (result.response && typeof result.response.text === 'function') {
                const base64Image = result.response.text();
                if (base64Image && base64Image.startsWith('data:image/')) {
                    return res.json({
                        success: true,
                        image: base64Image,
                        provider: "gemini"
                    });
                }
            }
            // If Gemini does not return an image, fallback to OpenAI if available
            if (openaiApiKey) {
                const openaiClient = new OpenAI({ apiKey: openaiApiKey });
                const response = await openaiClient.images.generate({
                    prompt: enhancedPrompt,
                    n: 1,
                    size: "512x512",
                    response_format: "url"
                });
                return res.json({
                    success: true,
                    image: response.data[0].url,
                    provider: "openai-fallback"
                });
            }
            return res.status(500).json({
                success: false,
                message: "Gemini did not return an image and no OpenAI key provided."
            });
        } catch (error) {
            console.error('Gemini image generation failed:', error);
            // Fallback to OpenAI if available
            if (openaiApiKey) {
                try {
                    const openaiClient = new OpenAI({ apiKey: openaiApiKey });
                    const response = await openaiClient.images.generate({
                        prompt: enhancedPrompt,
                        n: 1,
                        size: "512x512",
                        response_format: "url"
                    });
                    return res.json({
                        success: true,
                        image: response.data[0].url,
                        provider: "openai-fallback"
                    });
                } catch (openaiError) {
                    console.error('OpenAI fallback failed:', openaiError);
                }
            }
            return res.status(500).json({
                success: false,
                message: "Gemini image generation failed and no OpenAI fallback succeeded.",
                error: error.message
            });
        }
    }

    // If only OpenAI key is provided
    if (openaiApiKey) {
        try {
            const openaiClient = new OpenAI({ apiKey: openaiApiKey });
            const response = await openaiClient.images.generate({
                prompt: enhancedPrompt,
                n: 1,
                size: "512x512",
                response_format: "url"
            });
            return res.json({
                success: true,
                image: response.data[0].url,
                provider: "openai"
            });
        } catch (error) {
            console.error('OpenAI image generation failed:', error);
            return res.status(500).json({
                success: false,
                message: "OpenAI image generation failed.",
                error: error.message
            });
        }
    }

    // No valid key provided
    return res.status(400).json({
        success: false,
        message: "No valid AI image provider key supplied. Provide Gemini or OpenAI API key."
    });
});
// --- end /generate-ai-image endpoint ---

// Post tweet to X/Twitter
app.post('/post-tweet', upload.single('image'), async (req, res) => {
    const {
        twitterApiKey,
        twitterApiSecret,
        twitterAccessToken,
        twitterAccessSecret,
        content,
        imageUrl // new: allow imageUrl in body
    } = req.body;

    // Validate all required Twitter keys
    if (!twitterApiKey || !twitterApiSecret || !twitterAccessToken || !twitterAccessSecret) {
        return res.status(400).json({
            success: false,
            message: "All Twitter API keys (API key, API secret, Access token, Access secret) are required to post a tweet."
        });
    }

    // Initialize Twitter client for this request
    let twitterClient = new TwitterApi({
        appKey: twitterApiKey,
        appSecret: twitterApiSecret,
        accessToken: twitterAccessToken,
        accessSecret: twitterAccessSecret,
    });

    try {
        if (!content) {
            return res.status(400).json({
                success: false,
                message: "Tweet content is required."
            });
        }

        if (content.length > 280) {
            return res.status(400).json({
                success: false,
                message: "Tweet content exceeds 280 characters."
            });
        }

        let mediaId = null;

        // If image is uploaded, upload it to Twitter first
        if (req.file) {
            try {
                console.log('Uploading image to Twitter...');
                const mediaUpload = await twitterClient.v1.uploadMedia(req.file.path);
                mediaId = mediaUpload;
                console.log('Image uploaded successfully, media ID:', mediaId);
                
                // Clean up the uploaded file
                fs.unlinkSync(req.file.path);
            } catch (imageError) {
                console.error('Error uploading image:', imageError);
                // Clean up the uploaded file
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(500).json({
                    success: false,
                    message: "Failed to upload image",
                    error: imageError.message
                });
            }
        } else if (imageUrl) {
            // If imageUrl is provided, fetch and upload
            try {
                console.log('Fetching image from URL for Twitter upload...');
                const response = await fetch(imageUrl);
                if (!response.ok) throw new Error('Failed to fetch image from URL');
                const buffer = await response.buffer();
                // Guess file type from URL or response headers
                let ext = 'jpg';
                if (imageUrl.endsWith('.png') || response.headers.get('content-type') === 'image/png') ext = 'png';
                const tempPath = `uploads/ai-image-${Date.now()}.${ext}`;
                fs.writeFileSync(tempPath, buffer);
                const mediaUpload = await twitterClient.v1.uploadMedia(tempPath);
                mediaId = mediaUpload;
                fs.unlinkSync(tempPath);
                console.log('Image from URL uploaded successfully, media ID:', mediaId);
            } catch (imageUrlError) {
                console.error('Error uploading image from URL:', imageUrlError);
                return res.status(500).json({
                    success: false,
                    message: "Failed to upload image from URL",
                    error: imageUrlError.message
                });
            }
        }
        
        // Post the tweet with or without image
        const tweetPayload = { text: content };
        if (mediaId) {
            tweetPayload.media = { media_ids: [mediaId] };
        }
        
        const tweet = await twitterClient.v2.tweet(tweetPayload);
        
        console.log('Tweet posted successfully:', tweet.data.id);

        // Save tweet to the database
        await Tweet.create({
            userName: req.body.userName || "Unknown",
            content: content,
            imageUrl: imageUrl || null,
            twitterId: tweet && tweet.data && tweet.data.id ? tweet.data.id : null,
        })
        
        res.json({
            success: true,
            message: "Tweet posted successfully!",
            tweetId: tweet.data.id,
            tweetUrl: `https://twitter.com/user/status/${tweet.data.id}`,
            hasImage: !!mediaId
        });
        
    } catch (error) {
        console.error('Error posting tweet:', error);
        
        // Clean up uploaded file if it exists
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({
            success: false,
            message: "Failed to post tweet",
            error: error.message
        });
    }
});


// This endpoint handles GET requests to /tweet-history
app.get('/tweet-history', async (req, res) => {
    try {
        const tweets = await Tweet.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json({
            success: true,
            tweets: tweets
        });
    } catch (error) {
        console.error('Error fetching tweet history:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch tweet history",
            error: error.message
        });
    }
});

// This endpoint handles DELETE requests to /tweet-history/:id
app.delete('/tweet-history/:id', express.json(), async (req, res) => {
    try {
        const tweetId = req.params.id;
        const tweet = await Tweet.findByPk(tweetId);
        if (!tweet) {
            return res.status(404).json({ success: false, message: "Tweet not found" });
        }

        // Use credentials from request body if provided
        const { twitterApiKey, twitterApiSecret, twitterAccessToken, twitterAccessSecret } = req.body || {};
        let deleteClient = null;
        if (twitterApiKey && twitterApiSecret && twitterAccessToken && twitterAccessSecret) {
            const { TwitterApi } = require('twitter-api-v2');
            deleteClient = new TwitterApi({
                appKey: twitterApiKey,
                appSecret: twitterApiSecret,
                accessToken: twitterAccessToken,
                accessSecret: twitterAccessSecret,
            });
        } else if (global.twitterClient) {
            deleteClient = global.twitterClient;
        }

        // Delete from Twitter if twitterId exists and we have a client
        if (tweet.twitterId && deleteClient) {
            try {
                await deleteClient.v2.deleteTweet(tweet.twitterId);
            } catch (err) {
                console.error("Error deleting from Twitter:", err);
                // Optionally, you can return an error here or just log it
            }
        }
        await tweet.destroy();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete tweet", error: error.message });
    }
});

// Test endpoint
app.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
