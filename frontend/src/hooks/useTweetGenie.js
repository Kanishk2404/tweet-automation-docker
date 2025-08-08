import { useState, useCallback } from 'react';
import { DateTime } from 'luxon';
import { tweetGenieAPI } from '../services/tweetGenieAPI';
import toast from 'react-hot-toast';

export const useTweetGenie = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Helper to convert base64 dataURL to File
    const dataURLtoFile = (dataurl, filename) => {
        const arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        for (let i = 0; i < n; i++) u8arr[i] = bstr.charCodeAt(i);
        return new File([u8arr], filename, { type: mime });
    };

    // Generate tweet using AI
    const generateTweet = useCallback(async (payload) => {
        setLoading(true);
        setError(null);
        try {
            const data = await tweetGenieAPI.generateTweet(payload);
            if (data.success) {
                toast.success('Tweet generated successfully!');
                return data.content;
            } else {
                throw new Error(data.message || 'Failed to generate tweet');
            }
        } catch (err) {
            const errorMsg = err.message || 'Error generating tweet';
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Post tweet
    const postTweet = useCallback(async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const data = await tweetGenieAPI.postTweet(formData);
            if (data.success) {
                const imageText = data.hasImage ? " with image" : "";
                toast.success(`Tweet posted successfully${imageText}! 🎉`);
                return data;
            } else {
                throw new Error(data.message || 'Failed to post tweet');
            }
        } catch (err) {
            const errorMsg = err.message || 'Error posting tweet';
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Schedule tweet
    const scheduleTweet = useCallback(async (payload) => {
        setLoading(true);
        setError(null);
        try {
            const data = await tweetGenieAPI.scheduleTweet(payload);
            if (data.success) {
                toast.success('Tweet scheduled successfully!');
                return data;
            } else {
                throw new Error(data.message || 'Failed to schedule tweet');
            }
        } catch (err) {
            const errorMsg = err.message || 'Error scheduling tweet';
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Generate AI image
    const generateAIImage = useCallback(async (payload) => {
        setLoading(true);
        setError(null);
        try {
            const data = await tweetGenieAPI.generateAIImage(payload);
            if (data.success && data.image) {
                toast.success('AI image generated successfully!');
                return data.image;
            } else {
                throw new Error(data.message || 'Failed to generate AI image');
            }
        } catch (err) {
            const errorMsg = err.message || 'Error generating AI image';
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Generate bulk tweets
    const generateBulkTweets = useCallback(async (payload) => {
        setLoading(true);
        setError(null);
        try {
            const data = await tweetGenieAPI.generateBulkTweets(payload);
            if (data.success && Array.isArray(data.results)) {
                toast.success('Bulk tweets generated successfully!');
                return data.results;
            } else {
                throw new Error(data.message || 'Failed to generate bulk tweets');
            }
        } catch (err) {
            const errorMsg = err.message || 'Error generating bulk tweets';
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Schedule bulk tweets
    const scheduleBulkTweets = useCallback(async (payload) => {
        setLoading(true);
        setError(null);
        try {
            const data = await tweetGenieAPI.scheduleBulkTweets(payload);
            if (data.success) {
                toast.success(data.message || 'Bulk tweets scheduled successfully!');
                return data;
            } else {
                throw new Error(data.message || 'Failed to schedule bulk tweets');
            }
        } catch (err) {
            const errorMsg = err.message || 'Error scheduling bulk tweets';
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Get scheduled tweets
    const getScheduledTweets = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await tweetGenieAPI.getScheduledTweets();
            if (data.success) {
                // Format scheduledTime to user's local timezone using luxon
                const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
                const formatted = (data.scheduledTweets || []).map(t => ({
                    ...t,
                    scheduledTimeLocal: t.scheduledTime
                        ? DateTime.fromISO(t.scheduledTime, { zone: 'utc' }).setZone(userTimeZone).toFormat('yyyy-LL-dd HH:mm')
                        : ''
                }));
                return formatted;
            } else {
                throw new Error(data.message || 'Failed to fetch scheduled tweets');
            }
        } catch (err) {
            const errorMsg = err.message || 'Error fetching scheduled tweets';
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Delete scheduled tweet
    const deleteScheduledTweet = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const data = await tweetGenieAPI.deleteScheduledTweet(id);
            if (data.success) {
                toast.success('Scheduled tweet deleted successfully!');
                return data;
            } else {
                throw new Error(data.message || 'Failed to delete scheduled tweet');
            }
        } catch (err) {
            const errorMsg = err.message || 'Error deleting scheduled tweet';
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
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
    };
}; 