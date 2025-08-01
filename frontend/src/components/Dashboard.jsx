import React from 'react';

const Dashboard = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Welcome to your Dashboard!</h2>
                <p className="text-gray-600 mb-4">
                    This is a protected route. You can only see this content if you're authenticated.
                </p>
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    ✅ Authentication is working correctly!
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 