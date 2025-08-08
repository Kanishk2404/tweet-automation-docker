import React from 'react';

const DashboardHeader = () => {
    return (
        <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage your tweets, schedule content, and track performance
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md text-sm font-medium">
                            ✅ Authentication Active
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader; 