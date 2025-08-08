import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

export const useAPI = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const executeAPI = useCallback(async (apiCall, successMessage = null, errorMessage = null) => {
        setLoading(true);
        setError(null);

        try {
            const response = await apiCall();

            if (successMessage) {
                toast.success(successMessage);
            }

            return response.data;
        } catch (err) {
            const errorMsg = errorMessage || err.response?.data?.error || 'An error occurred';
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
        executeAPI,
    };
}; 