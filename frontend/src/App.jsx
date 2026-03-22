import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Analyze from './pages/Analyze';
import Reports from './pages/Reports';
import History from './pages/History';
import LoadingScreen from './components/LoadingScreen';
import HeroSection from './components/HeroSection';
import FeatureCards from './components/FeatureCards';
import Footer from './components/Footer';

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem('verityos_logged_in') === 'true';
    });

    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('verityos_theme');
        if (savedTheme) return savedTheme;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('verityos_theme', theme);
    }, [theme]);

    const handleLogin = () => {
        localStorage.setItem('verityos_logged_in', 'true');
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('verityos_logged_in');
        setIsLoggedIn(false);
    };

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="app-container">
            {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

            <div className={`app-main ${!loading ? 'visible' : 'hidden'}`}>
                <div className="bg-glow-1"></div>
                <div className="bg-glow-2"></div>

                {!isLoggedIn ? (
                    <div className="landing-view">
                        <Navbar onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} hideLinks={true} />
                        <HeroSection />
                        <FeatureCards />
                        <div id="login-section">
                            <Login onLogin={handleLogin} minimal={true} />
                        </div>
                        <Footer />
                    </div>
                ) : (
                    <>
                        <Navbar onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />
                        <div className="app-content">
                            <Routes>
                                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/analyze" element={<Analyze />} />
                                <Route path="/reports" element={<Reports />} />
                                <Route path="/history" element={<History />} />
                                <Route path="*" element={<Navigate to="/dashboard" replace />} />
                            </Routes>
                        </div>
                        <Footer />
                    </>
                )}
            </div>
        </div>
    );
}
