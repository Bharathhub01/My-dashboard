// components/Header.js
import React, { useState } from 'react';
import { Search, Bell, User, Settings, LogOut, TrendingUp } from 'lucide-react'; // Removed X icon
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [userName, setUserName] = useState('Bharath S');
    // Removed isSearchActive state as it's no longer needed for the card

    const handleDropdownItemClick = () => {
        setIsProfileMenuOpen(false);
    };

    return (
        <header className="main-header">
            <div className="header-left-global">
                <Link to="/dashboard" className="logo-link">
                    <img src="/Company logo.jpg" alt="Dodla Dairy Logo" className="logo" />
                </Link>
                <div className="app-branding">
                    <span className="app-name">Dodla Dairy</span>
                    <span className="app-tagline">Ops Hub</span>
                </div>
            </div>

            <div className="trending-data-global">
                <TrendingUp size={20} className="trending-icon" />
                <span className="trending-title">Live Trends:</span>
                <div className="trending-item">
                    Sales Up <span className="trend-value">+3.2%</span> <span className="trend-indicator-up">▲</span>
                </div>
                <div className="trending-item">
                    Milk Prod <span className="trend-value">-0.5%</span> <span className="trend-indicator-down">▼</span>
                </div>
            </div>

            <div className="header-right-global">
                <div className="search-global-wrapper">
                    <input
                        type="text"
                        placeholder="Search here" // Changed placeholder text
                        // Removed onFocus and onBlur handlers
                    />
                    <Search className="search-icon-global" size={16} /> {/* Simplified search icon */}
                    {/* Removed search card conditional rendering */}
                </div>

                <Bell className="icon-global" size={20} />

                <div className="profile-menu-container-global">
                    <img
                        src="/Profile.jpg"
                        alt="User Avatar"
                        className="avatar-global"
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    />
                    {isProfileMenuOpen && (
                        <div className="profile-dropdown-global">
                            <div className="profile-username-global">
                                Hi, {userName}!
                            </div>
                            <Link to="/Profile" onClick={handleDropdownItemClick}>
                                <User size={16} /> Profile
                            </Link>
                            <Link to="/settings" onClick={handleDropdownItemClick}>
                                <Settings size={16} /> Settings
                            </Link>
                            <Link to="/logout" onClick={handleDropdownItemClick}>
                                <LogOut size={16} /> Logout
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;