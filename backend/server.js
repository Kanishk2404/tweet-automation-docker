require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { TwitterApi } = require('twitter-api-v2');
const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

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

// Initialize OpenAI client
let openaiClient = null;
if (process.env.OPENAI_API_KEY) {
    openaiClient = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    console.log('OpenAI API initialized successfully');
} else {
    console.log('OpenAI API key not found. AI generation disabled.');
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
    try {
        // Check if any AI service is available
        if (!geminiModel && !openaiClient) {
            return res.json({ 
                success: false, 
                message: "AI generation disabled. Add Gemini or OpenAI API key to enable this feature." 
            });
        }

        const { topic } = req.body;
        
        // Create a prompt for tweet generation
        const prompt = topic 
            ? `Generate an engaging, creative tweet about: ${topic}. Make it witty, relatable, and under 280 characters. Include relevant emojis if appropriate.`
            : `Generate a random, engaging tweet that would perform well on social media. Make it witty, thought-provoking, or entertaining. Include relevant emojis if appropriate. Keep it under 280 characters.`;

        let generatedTweet = '';

        // Always prioritize Gemini first
        if (geminiModel) {
            console.log('Using Gemini AI for tweet generation...');
            const result = await geminiModel.generateContent(
                `You are a social media expert who creates viral, engaging tweets. Always stay within 280 characters and make content that resonates with audiences.\n\n${prompt}`
            );
            const response = await result.response;
            generatedTweet = response.text().trim();
            console.log('✅ Generated tweet with Gemini:', generatedTweet);
        } else if (openaiClient) {
            console.log('Using OpenAI as Gemini is not available...');
            const completion = await openaiClient.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a social media expert who creates viral, engaging tweets. Always stay within 280 characters and make content that resonates with audiences."
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
        }
        
        // Remove quotes if the AI added them
        const cleanTweet = generatedTweet.replace(/^["']|["']$/g, '');

        res.json({
            success: true,
            content: cleanTweet,
            message: "Tweet generated successfully!"
        });

    } catch (error) {
        console.error('❌ Error generating tweet:', error);
        
        // If Gemini fails, try OpenAI as fallback
        if (error.message && geminiModel && openaiClient) {
            try {
                console.log('🔄 Gemini failed, trying OpenAI fallback...');
                const completion = await openaiClient.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: "You are a social media expert who creates viral, engaging tweets. Always stay within 280 characters and make content that resonates with audiences."
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    max_tokens: 100,
                    temperature: 0.8,
                });
                const generatedTweet = completion.choices[0].message.content.trim();
                const cleanTweet = generatedTweet.replace(/^["']|["']$/g, '');
                console.log('✅ Generated tweet with OpenAI (fallback):', cleanTweet);
                
                return res.json({
                    success: true,
                    content: cleanTweet,
                    message: "Tweet generated successfully with fallback AI!"
                });
            } catch (fallbackError) {
                console.error('❌ Both AI services failed:', fallbackError);
            }
        }
        
        res.status(500).json({
            success: false,
            message: "Failed to generate tweet",
            error: error.message
        });
    }
});

// Post tweet to X/Twitter
app.post('/post-tweet', upload.single('image'), async (req, res) => {
    try {
        const { content } = req.body;
        
        if (!content) {
            return res.status(400).json({
                success: false,
                message: "Tweet content is required"
            });
        }
        
        if (content.length > 280) {
            return res.status(400).json({
                success: false,
                message: "Tweet content exceeds 280 characters"
            });
        }
        
        if (!twitterClient) {
            return res.json({
                success: false,
                message: "Twitter API not configured. Add your X API keys to enable tweet posting."
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
        }
        
        // Post the tweet with or without image
        const tweetPayload = { text: content };
        if (mediaId) {
            tweetPayload.media = { media_ids: [mediaId] };
        }
        
        const tweet = await twitterClient.v2.tweet(tweetPayload);
        
        console.log('Tweet posted successfully:', tweet.data.id);
        
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

// Test endpoint
app.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
