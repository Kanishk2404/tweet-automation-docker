import React from 'react';

const DashboardStats = () => {
    const stats = [
        {
            title: 'Total Tweets',
            value: '24',
            change: '+12%',
            changeType: 'positive',
            icon: '📊'
        },
        {
            title: 'Scheduled Posts',
            value: '8',
            change: '+3',
            changeType: 'positive',
            icon: '⏰'
        },
        {
            title: 'Threads Created',
            value: '5',
            change: '+2',
            changeType: 'positive',
            icon: '🧵'
        },
        {
            title: 'Engagement Rate',
            value: '12.5%',
            change: '+2.1%',
            changeType: 'positive',
            icon: '📈'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                        <div className="text-2xl">{stat.icon}</div>
                    </div>
                    <div className="mt-2">
                        <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {stat.change}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">from last month</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DashboardStats; 