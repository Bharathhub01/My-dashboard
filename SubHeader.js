// components/SubHeader.js
import React from 'react';
import {
    LayoutDashboard, // For Dashboard Overview
    Tag,             // For Sales & Marketing (like a price tag)
    Headset,         // For Customer Service
    Leaf,            // For Procurement & Farmers (representing natural input)
    Factory,         // For Production & Quality
    Package,         // For Inventory
    Truck,           // For Logistics & Distribution
    ShoppingCart,    // For Retail Parlours
    LineChart,       // For Reports & Analytics
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import './SubHeader.css'; // Import the CSS for this component

const SubHeader = ({ onModuleChange, activeModule }) => {
    const location = useLocation();

    // Helper function to apply an 'active' class based on the current URL path
    const getNavLinkClass = (path) => {
        // This checks if the current URL pathname exactly matches the link's path
        return `sub-nav-link ${location.pathname === path ? 'active-sub-nav-link' : ''}`;
    };

    return (
        <nav className="sub-header-nav">
            {/* Dashboard Overview Link */}
            <Link
                to="/dashboard"
                className={getNavLinkClass('/dashboard')}
                onClick={() => onModuleChange('dashboard')} // Update parent state for content rendering
            >
                <LayoutDashboard size={24} /> {/* Bigger icon */}
                <span className="link-text">Dashboard</span> {/* Text for hover */}
            </Link>

            {/* Sales & Marketing Link */}
            <Link
                to="/sales"
                className={getNavLinkClass('/sales')}
                onClick={() => onModuleChange('sales')}
            >
                <Tag size={24} /> {/* Bigger icon */}
                <span className="link-text">Sales & Marketing</span> {/* Text for hover */}
            </Link>

            {/* Customer Service Link */}
            <Link
                to="/customer-service"
                className={getNavLinkClass('/customer-service')}
                onClick={() => onModuleChange('customer-service')}
            >
                <Headset size={24} /> {/* Bigger icon */}
                <span className="link-text">Customer Service</span> {/* Text for hover */}
            </Link>

            {/* Procurement & Farmers Link */}
            <Link
                to="/procurement"
                className={getNavLinkClass('/procurement')}
                onClick={() => onModuleChange('procurement')}
            >
                <Leaf size={24} /> {/* Bigger icon */}
                <span className="link-text">Procurement & Farmers</span> {/* Text for hover */}
            </Link>

            {/* Production & Quality Link */}
            <Link
                to="/production"
                className={getNavLinkClass('/production')}
                onClick={() => onModuleChange('production')}
            >
                <Factory size={24} /> {/* Bigger icon */}
                <span className="link-text">Production & Quality</span> {/* Text for hover */}
            </Link>

            {/* Inventory Link */}
            <Link
                to="/inventory"
                className={getNavLinkClass('/inventory')}
                onClick={() => onModuleChange('inventory')}
            >
                <Package size={24} /> {/* Bigger icon */}
                <span className="link-text">Inventory</span> {/* Text for hover */}
            </Link>

            {/* Logistics & Distribution Link */}
            <Link
                to="/logistics"
                className={getNavLinkClass('/logistics')}
                onClick={() => onModuleChange('logistics')}
            >
                <Truck size={24} /> {/* Bigger icon */}
                <span className="link-text">Logistics & Distribution</span> {/* Text for hover */}
            </Link>

            {/* Retail Parlours Link */}
            <Link
                to="/retail-parlours"
                className={getNavLinkClass('/retail-parlours')}
                onClick={() => onModuleChange('retail-parlours')}
            >
                <ShoppingCart size={24} /> {/* Bigger icon */}
                <span className="link-text">Retail Parlours</span> {/* Text for hover */}
            </Link>

            {/* Reports & Analytics Link */}
            <Link
                to="/reports-analytics"
                className={getNavLinkClass('/reports-analytics')}
                onClick={() => onModuleChange('reports-analytics')}
            >
                <LineChart size={24} /> {/* Bigger icon */}
                <span className="link-text">Reports & Analytics</span> {/* Text for hover */}
            </Link>

            {/* Add more links as needed for other top-level modules */}
        </nav>
    );
};

export default SubHeader;