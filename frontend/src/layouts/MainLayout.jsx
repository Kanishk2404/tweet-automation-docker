import React from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

const MainLayout = ({ children }) => {
    const { isAuthenticated, handleLogout, showAuth } = useAuth();

    return (
        <div className="App">
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: '#10B981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        duration: 4000,
                        iconTheme: {
                            primary: '#EF4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />

            <Navbar
                isAuthenticated={isAuthenticated}
                onLogout={handleLogout}
                onShowAuth={showAuth}
            />

            <main>
                {children}
            </main>
        </div>
    );
};

export default MainLayout; 