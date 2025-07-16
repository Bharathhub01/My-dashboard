// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import './App.css'; // Global App styling (at src/App.css)

// --- Components from your CRMDashboard folder ---
import Header from './CRMDashboard/Header';
import OverviewDashboard from './CRMDashboard/Dashboard'; // This is your main overview dashboard
import SubHeader from './CRMDashboard/SubHeader';


// --- Placeholder imports for other modules (assuming they will go into Modules folder) ---
// You will need to create these files inside your 'src/Modules/' directory
import Sales from './Modules/Sales';
import CustomerService from './Modules/CustomerService';
import Procurement from './Modules/Procurement';
import Production from './Modules/Production ';
import Inventory from './Modules/Inventory';
import Logistics from './CRMDashboard/Logistics/LogisticDashboard.js';
import RetailParlours from './Modules/RetailParlours';
import ReportsAnalytics from './Modules/ReportsAnalytics';
import Profile from './Modules/Profile.js';
import Settings from './Modules/Settings';

function App() {
    // The Router must wrap the components that use hooks like useLocation.
    // So, we use an inner component AppContent to encapsulate the routing logic.
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

// AppContent component to handle routing and render specific dashboards
function AppContent() {
    const location = useLocation(); // Hook to get the current URL location
    const [activeModule, setActiveModule] = useState('dashboard'); // State for SubHeader highlighting

    // Effect to update activeModule state when URL changes,
    // ensuring the SubHeader highlights the correct button.
    useEffect(() => {
        // Normalize the path: '/' should be treated as '/dashboard' for active state logic
        const currentPath = location.pathname === '/' ? '/dashboard' : location.pathname;

        // Extract a simple module key from the path for the activeModule state
        // For example: "/sales" -> "sales", "/customer-service" -> "customerservice", "/herd" -> "herd"
        const moduleKey = currentPath.substring(1).replace(/-/g, '');
        setActiveModule(moduleKey || 'dashboard'); // Default to 'dashboard' if path is empty/root

    }, [location.pathname]); // Re-run this effect whenever the URL pathname changes

    // Function to render the appropriate dashboard component based on the current URL path
    const renderCurrentDashboard = () => {
        switch (location.pathname) {
            case '/':
            case '/dashboard':
                return <OverviewDashboard />; // Renders CRMDashboard/Dashboard.js
            case '/sales':
                return <Sales />;
            case '/customer-service':
                return <CustomerService />;
            case '/procurement':
                return <Procurement />;
            case '/production':
                return <Production />;
            case '/inventory':
                return <Inventory />;
            case '/logistics':
                return <Logistics />;
            case '/retail-parlours':
                return <RetailParlours />;
            case '/reports-analytics':
                return <ReportsAnalytics />;
            // Routes for profile, settings, logout from Header's dropdown
            case '/Profile':
                return <Profile />;
            case '/settings':
                return <Settings/>;
            case '/logout':
                // In a real app, this would trigger an actual logout process
                return <div className="page-placeholder"><h2>Logging Out...</h2><p>Redirecting to login page.</p></div>;
            default:
                // Fallback for any undefined paths (e.g., a 404 page)
                return <div className="page-placeholder"><h2>404 - Page Not Found</h2><p>The page you are looking for does not exist.</p></div>;
        }
    };

    return (
        <div className="app-container">
            <Header /> {/* Global Header, always visible */}

            {/* SubHeader for module navigation. It uses activeModule to highlight the current page. */}
            <SubHeader onModuleChange={setActiveModule} activeModule={activeModule} />

            <main className="app-main-content">
                {/* This is where the selected dashboard component will be rendered */}
                {renderCurrentDashboard()}
            </main>
        </div>
    );
}

export default App;