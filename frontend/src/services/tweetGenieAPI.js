import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// API service for tweetGenie functionality
export const tweetGenieAPI = {
    // Tweet Generation
    generateTweet: async (payload) => {
        try {
            const response = await api.post('/generate-tweet', payload);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to generate tweet');
        }
    },

    // Post Tweet
    postTweet: async (formData) => {
        try {
            const response = await api.post('/post-tweet', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to post tweet');
        }
    },

    // Schedule Tweet
    scheduleTweet: async (payload) => {
        try {
            const response = await api.post('/schedule-tweet', payload);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to schedule tweet');
        }
    },

    // Generate AI Image
    generateAIImage: async (payload) => {
        try {
            const response = await api.post('/generate-ai-image', payload);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to generate AI image');
        }
    },

    // Bulk Tweet Generation
    generateBulkTweets: async (payload) => {
        try {
            const response = await api.post('/generate-bulk-tweets', payload);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to generate bulk tweets');
        }
    },

    // Schedule Bulk Tweets
    scheduleBulkTweets: async (payload) => {
        try {
            const response = await api.post('/schedule-bulk-tweets', payload);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to schedule bulk tweets');
        }
    },

    // Get Scheduled Tweets
    getScheduledTweets: async () => {
        try {
            const response = await api.get('/scheduled-tweets');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch scheduled tweets');
        }
    },

    // Delete Scheduled Tweet
    deleteScheduledTweet: async (id) => {
        try {
            const response = await api.delete(`/scheduled-tweets/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete scheduled tweet');
        }
    }
};

export default api; 