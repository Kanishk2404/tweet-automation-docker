import React from 'react';
import { Navigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import NewDashboard from '../components/NewDashboard';

const DashboardPage = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Dashboard />;
};

export default DashboardPage; 