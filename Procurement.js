// src/Procurement.js
import React, { useState, useEffect } from 'react';
import './Procurement.css'; // Import the consolidated CSS file

// --- Mock Data Simulation ---
// This data simulates what you'd typically fetch from a backend API
const mockFarmers = [
    {
        id: 'F001',
        name: 'Ram Dairy Farm',
        contact: '9876543210',
        location: 'Kolar',
        herdSize: 25,
        dailyYield: '300 L',
        bankDetails: 'SBI A/C: ******1234'
    },
    {
        id: 'F002',
        name: 'Gopal Milk House',
        contact: '9988776655',
        location: 'Malur',
        herdSize: 18,
        dailyYield: '220 L',
        bankDetails: 'HDFC A/C: ******5678'
    },
    {
        id: 'F003',
        name: 'Priya Dairy',
        contact: '9123456789',
        location: 'Chikkaballapur',
        herdSize: 30,
        dailyYield: '350 L',
        bankDetails: 'ICICI A/C: ******9012'
    },
    {
        id: 'F004',
        name: 'Krishna Farms',
        contact: '9000011111',
        location: 'Nelamangala',
        herdSize: 15,
        dailyYield: '180 L',
        bankDetails: 'PNB A/C: ******3456'
    }
];

// Mock milk collection data (daily entries) - adjusted for current date
// Using the current date information (June 19, 2025)
const today = new Date('2025-06-19T00:00:00'); // Ensure it's 19th June 2025
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1); // 18th June 2025

let mockMilkCollections = [
    { id: 'M001', farmerId: 'F001', date: today.toISOString().split('T')[0], quantity: 150, fat: 3.5, snf: 8.5, rate: 30.50, amount: 4575.00 },
    { id: 'M002', farmerId: 'F002', date: today.toISOString().split('T')[0], quantity: 100, fat: 4.0, snf: 8.8, rate: 32.00, amount: 3200.00 },
    { id: 'M003', farmerId: 'F001', date: yesterday.toISOString().split('T')[0], quantity: 145, fat: 3.6, snf: 8.4, rate: 30.70, amount: 4451.50 },
    { id: 'M004', farmerId: 'F003', date: today.toISOString().split('T')[0], quantity: 170, fat: 3.8, snf: 8.6, rate: 31.50, amount: 5355.00 },
    { id: 'M005', farmerId: 'F004', date: today.toISOString().split('T')[0], quantity: 90, fat: 4.2, snf: 8.9, rate: 32.50, amount: 2925.00 },
];
// --- End Mock Data Simulation ---


const Procurement = () => {
    const [farmers, setFarmers] = useState([]);
    const [milkCollections, setMilkCollections] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFarmer, setSelectedFarmer] = useState(null); // For modal
    const [isModalOpen, setIsModalOpen] = useState(false); // For modal control

    // State for the new milk collection form
    const [newCollection, setNewCollection] = useState({
        farmerId: '',
        quantity: '',
        fat: '',
        snf: '',
        date: new Date().toISOString().split('T')[0] // Default to today's date
    });

    useEffect(() => {
        // Simulate fetching data on component mount
        setTimeout(() => {
            setFarmers(mockFarmers);
            setMilkCollections(mockMilkCollections);
        }, 500);
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Modal Handlers
    const handleFarmerCardClick = (farmer) => {
        setSelectedFarmer(farmer);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedFarmer(null);
    };

    const handleCollectionFormChange = (event) => {
        const { name, value } = event.target;
        setNewCollection(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddCollectionSubmit = (event) => {
        event.preventDefault();
        // Simple validation
        if (!newCollection.farmerId || !newCollection.quantity || !newCollection.fat || !newCollection.snf || !newCollection.date) {
            alert('Please fill all fields for milk collection.');
            return;
        }

        const quantity = parseFloat(newCollection.quantity);
        const fat = parseFloat(newCollection.fat);
        const snf = parseFloat(newCollection.snf);

        if (isNaN(quantity) || isNaN(fat) || isNaN(snf) || quantity <= 0 || fat <= 0 || snf <= 0) {
            alert('Please enter valid positive numbers for quantity, fat, and SNF.');
            return;
        }

        // --- Simulate Rate Calculation (simplified) ---
        let ratePerLiter = 0;
        if (fat >= 4.0 && snf >= 8.8) {
            ratePerLiter = 32.50; // Premium rate
        } else if (fat >= 3.5 && snf >= 8.5) {
            ratePerLiter = 30.50; // Standard rate
        } else {
            ratePerLiter = 28.00; // Lower rate or subject to review
        }
        const calculatedAmount = quantity * ratePerLiter;

        const newEntry = {
            id: `M${Date.now()}`, // Simple unique ID
            farmerId: newCollection.farmerId,
            date: newCollection.date,
            quantity: quantity,
            fat: fat,
            snf: snf,
            rate: ratePerLiter,
            amount: parseFloat(calculatedAmount.toFixed(2))
        };

        // Add to mock data and update state
        // Using unshift to add to the beginning, so it appears as "recent"
        mockMilkCollections.unshift(newEntry);
        setMilkCollections([...mockMilkCollections]);

        // Reset form
        setNewCollection({
            farmerId: '',
            quantity: '',
            fat: '',
            snf: '',
            date: new Date().toISOString().split('T')[0]
        });

        alert('Milk collection added successfully!');
    };


    const filteredFarmers = farmers.filter(farmer =>
        farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farmer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farmer.contact.includes(searchTerm)
    );

    // Get the most recent collection for each farmer to display in the main list
    const getRecentCollection = (farmerId) => {
        const collectionsForFarmer = milkCollections
            .filter(col => col.farmerId === farmerId)
            .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by most recent date
        return collectionsForFarmer.length > 0 ? collectionsForFarmer[0] : null;
    };

    // Component for the Farmer Details Modal (now embedded)
    const FarmerDetailsModal = ({ farmer, collections, onClose }) => {
        const sortedCollections = [...collections].sort((a, b) => new Date(b.date) - new Date(a.date));
        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                    <h2>{farmer.name}'s Milk Collection History</h2>

                    <div className="farmer-info-modal">
                        <p><strong>Farmer ID:</strong> {farmer.id}</p>
                        <p><strong>Location:</strong> {farmer.location}</p>
                        <p><strong>Contact:</strong> {farmer.contact}</p>
                        <p><strong>Herd Size:</strong> {farmer.herdSize}</p>
                        <p><strong>Est. Daily Yield:</strong> {farmer.dailyYield}</p>
                        <p><strong>Bank Details:</strong> {farmer.bankDetails}</p>
                    </div>

                    <div className="collection-history-table">
                        <h3>Collection Entries</h3>
                        {sortedCollections.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Quantity (L)</th>
                                        <th>Fat (%)</th>
                                        <th>SNF (%)</th>
                                        <th>Rate (₹/L)</th>
                                        <th>Amount (₹)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedCollections.map(entry => (
                                        <tr key={entry.id}>
                                            <td>{entry.date}</td>
                                            <td>{entry.quantity}</td>
                                            <td>{entry.fat}</td>
                                            <td>{entry.snf}</td>
                                            <td>{entry.rate.toFixed(2)}</td>
                                            <td>{entry.amount.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No collection history available for this farmer.</p>
                        )}
                    </div>
                </div>
            </div>
        );
    };


    return (
        <div className="procurement-dashboard">
            <h2>Dairy Procurement</h2>

            <div className="collection-form-section">
                <h3>Add New Milk Collection</h3>
                <form onSubmit={handleAddCollectionSubmit} className="milk-collection-form">
                    <div className="form-group">
                        <label htmlFor="farmerId">Select Farmer:</label>
                        <select
                            id="farmerId"
                            name="farmerId"
                            value={newCollection.farmerId}
                            onChange={handleCollectionFormChange}
                            required
                        >
                            <option value="">-- Select Farmer --</option>
                            {farmers.map(farmer => (
                                <option key={farmer.id} value={farmer.id}>
                                    {farmer.name} ({farmer.location})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="date">Date:</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={newCollection.date}
                            onChange={handleCollectionFormChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="quantity">Quantity (Liters):</label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={newCollection.quantity}
                            onChange={handleCollectionFormChange}
                            min="0.1"
                            step="0.1"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fat">Fat (%):</label>
                        <input
                            type="number"
                            id="fat"
                            name="fat"
                            value={newCollection.fat}
                            onChange={handleCollectionFormChange}
                            min="0.1"
                            step="0.1"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="snf">SNF (%):</label>
                        <input
                            type="number"
                            id="snf"
                            name="snf"
                            value={newCollection.snf}
                            onChange={handleCollectionFormChange}
                            min="0.1"
                            step="0.1"
                            required
                        />
                    </div>
                    <button type="submit" className="add-collection-btn">Add Collection</button>
                </form>
            </div>

            <div className="farmer-list-section">
                <h3>Registered Farmers & Recent Collections</h3>
                <input
                    type="text"
                    placeholder="Search farmers by name, location, or contact..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                />

                {farmers.length === 0 ? (
                    <p>Loading farmers...</p>
                ) : (
                    <div className="farmer-cards-container">
                        {filteredFarmers.length > 0 ? (
                            filteredFarmers.map(farmer => {
                                const recentCollection = getRecentCollection(farmer.id);
                                return (
                                    <div key={farmer.id} className="farmer-card" onClick={() => handleFarmerCardClick(farmer)}>
                                        <h3>{farmer.name}</h3>
                                        <p><strong>Location:</strong> {farmer.location}</p>
                                        <p><strong>Contact:</strong> {farmer.contact}</p>
                                        {recentCollection ? (
                                            <div className="recent-collection-info">
                                                <h4>Recent Collection ({recentCollection.date})</h4>
                                                <p>Vol: {recentCollection.quantity} L</p>
                                                <p>Fat: {recentCollection.fat}% | SNF: {recentCollection.snf}%</p>
                                                <p>Amt: ₹{recentCollection.amount.toFixed(2)}</p>
                                            </div>
                                        ) : (
                                            <p className="no-collection">No recent collection data.</p>
                                        )}
                                        <button className="view-history-btn">View Full History</button>
                                    </div>
                                );
                            })
                        ) : (
                            <p>No farmers found matching your criteria.</p>
                        )}
                    </div>
                )}
            </div>

            {/* Render the modal if open and a farmer is selected */}
            {isModalOpen && selectedFarmer && (
                <FarmerDetailsModal
                    farmer={selectedFarmer}
                    collections={milkCollections.filter(col => col.farmerId === selectedFarmer.id)}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default Procurement;