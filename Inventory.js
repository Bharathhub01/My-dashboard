import React, { useState, useEffect } from 'react';
import './Inventory.css'; // Dedicated CSS for Inventory module

// Utility to format date to YYYY-MM-DD
const getFormattedDate = (date) => date.toISOString().split('T')[0];

// --- Mock Data Simulation ---
let mockInventoryItems = [
    {
        id: 'UHTM001', // Changed ID to reflect UHT Milk
        name: 'UHT Milk 1L',
        category: 'Milk',
        unit: 'Liter',
        currentStock: 8000, // Adjusted initial stock
        reorderLevel: 1500,
        lastUpdated: getFormattedDate(new Date())
    },
    {
        id: 'BTLK001', // New product
        name: 'Buttermilk 500ml',
        category: 'Buttermilk',
        unit: 'Liter', // Assuming 0.5 Liter packs for consistency, or 'Piece'
        currentStock: 5000,
        reorderLevel: 1000,
        lastUpdated: getFormattedDate(new Date())
    },
    {
        id: 'MILK001', // New product
        name: 'Milk 500ml',
        category: 'Milk',
        unit: 'Liter', // Assuming 0.5 Liter packs
        currentStock: 15000,
        reorderLevel: 3000,
        lastUpdated: getFormattedDate(new Date())
    },
    {
        id: 'FCM001',
        name: 'Full Cream Milk',
        category: 'Milk',
        unit: 'Liter',
        currentStock: 5000,
        reorderLevel: 1000,
        lastUpdated: '2025-06-25'
    },
    {
        id: 'TDM001',
        name: 'Toned Milk',
        category: 'Milk',
        unit: 'Liter',
        currentStock: 3500,
        reorderLevel: 800,
        lastUpdated: '2025-06-25'
    },
    {
        id: 'CURD001', // Added from sidebar if not already explicitly covered
        name: 'Plain Curd (500g)',
        category: 'Curd', // Changed to 'Curd' for clarity
        unit: 'Piece', // Assuming it's sold as pieces/packets
        currentStock: 800,
        reorderLevel: 200,
        lastUpdated: '2025-06-24'
    },
    {
        id: 'GHEE001',
        name: 'Cow Ghee (500ml)',
        category: 'Ghee',
        unit: 'Piece',
        currentStock: 150,
        reorderLevel: 50,
        lastUpdated: '2025-06-23'
    },
    {
        id: 'PNR001',
        name: 'Paneer (200g)',
        category: 'Paneer',
        unit: 'Piece',
        currentStock: 250,
        reorderLevel: 75,
        lastUpdated: '2025-06-25'
    },
    {
        id: 'BTR001',
        name: 'Butter (100g)',
        category: 'Butter',
        unit: 'Piece',
        currentStock: 400,
        reorderLevel: 100,
        lastUpdated: '2025-06-25'
    },
    {
        id: 'ICRM001', // Added from sidebar
        name: 'Vanilla Ice Cream (1L)',
        category: 'Ice Cream',
        unit: 'Piece',
        currentStock: 200,
        reorderLevel: 70,
        lastUpdated: '2025-06-24'
    },
    {
        id: 'LASS001', // Added from sidebar
        name: 'Sweet Lassi 200ml',
        category: 'Lassi',
        unit: 'Piece',
        currentStock: 600,
        reorderLevel: 150,
        lastUpdated: '2025-06-25'
    },
    {
        id: 'FLVM001', // Added from sidebar
        name: 'Mango Flavoured Milk 200ml',
        category: 'Flavoured Milk',
        unit: 'Piece',
        currentStock: 750,
        reorderLevel: 200,
        lastUpdated: '2025-06-25'
    },
    {
        id: 'SWT001', // Added from sidebar
        name: 'Milk Peda (250g)',
        category: 'Sweets',
        unit: 'Piece',
        currentStock: 100,
        reorderLevel: 30,
        lastUpdated: '2025-06-23'
    },
];
// --- End Mock Data Simulation ---

// InventoryFormModal Component
const InventoryFormModal = ({ isOpen, onClose, onSubmit, currentItem, categories, units }) => {
    const [formData, setFormData] = useState({
        id: currentItem ? currentItem.id : null,
        name: currentItem ? currentItem.name : '',
        category: currentItem ? currentItem.category : '',
        unit: currentItem ? currentItem.unit : '',
        currentStock: currentItem ? currentItem.currentStock : '',
        reorderLevel: currentItem ? currentItem.reorderLevel : '',
        lastUpdated: currentItem ? currentItem.lastUpdated : getFormattedDate(new Date())
    });
    const [errors, setErrors] = useState({});

    // Update form data if currentItem changes (e.g., when editing a different item)
    useEffect(() => {
        if (currentItem) {
            setFormData({
                id: currentItem.id,
                name: currentItem.name,
                category: currentItem.category,
                unit: currentItem.unit,
                currentStock: currentItem.currentStock,
                reorderLevel: currentItem.reorderLevel,
                lastUpdated: currentItem.lastUpdated
            });
        } else {
            // Reset for new item
            setFormData({
                id: null,
                name: '',
                category: '',
                unit: '',
                currentStock: '',
                reorderLevel: '',
                lastUpdated: getFormattedDate(new Date())
            });
        }
        setErrors({}); // Clear errors on item change
    }, [currentItem, isOpen]); // Also reset when modal opens/closes

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for the field being edited
        setErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Item Name is required.';
        if (!formData.category.trim()) newErrors.category = 'Category is required.';
        if (!formData.unit.trim()) newErrors.unit = 'Unit is required.';
        if (isNaN(formData.currentStock) || formData.currentStock < 0) newErrors.currentStock = 'Current Stock must be a non-negative number.';
        if (isNaN(formData.reorderLevel) || formData.reorderLevel < 0) newErrors.reorderLevel = 'Reorder Level must be a non-negative number.';
        if (parseInt(formData.reorderLevel) > parseInt(formData.currentStock) && formData.currentStock !== '') {
            // This is more a warning than a strict error, but good to highlight.
            // For now, let's make it an error to ensure valid setup.
            newErrors.reorderLevel = 'Reorder Level cannot be greater than Current Stock.';
        }


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
            onClose(); // Close modal on successful submission
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                <h2>{currentItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}</h2>
                <form onSubmit={handleSubmit} className="inventory-form">
                    <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
                        <label htmlFor="name">Item Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        {errors.name && <span className="error-message">{errors.name}</span>}
                    </div>

                    <div className={`form-group ${errors.category ? 'has-error' : ''}`}>
                        <label htmlFor="category">Category:</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                        {errors.category && <span className="error-message">{errors.category}</span>}
                    </div>

                    <div className={`form-group ${errors.unit ? 'has-error' : ''}`}>
                        <label htmlFor="unit">Unit of Measure:</label>
                        <select
                            id="unit"
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Unit</option>
                            {units.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                        {errors.unit && <span className="error-message">{errors.unit}</span>}
                    </div>

                    <div className={`form-group ${errors.currentStock ? 'has-error' : ''}`}>
                        <label htmlFor="currentStock">Current Stock:</label>
                        <input
                            type="number"
                            id="currentStock"
                            name="currentStock"
                            value={formData.currentStock}
                            onChange={handleChange}
                            min="0"
                            required
                        />
                        {errors.currentStock && <span className="error-message">{errors.currentStock}</span>}
                    </div>

                    <div className={`form-group ${errors.reorderLevel ? 'has-error' : ''}`}>
                        <label htmlFor="reorderLevel">Reorder Level:</label>
                        <input
                            type="number"
                            id="reorderLevel"
                            name="reorderLevel"
                            value={formData.reorderLevel}
                            onChange={handleChange}
                            min="0"
                            required
                        />
                        {errors.reorderLevel && <span className="error-message">{errors.reorderLevel}</span>}
                    </div>

                    <button type="submit" className="action-btn primary full-width">
                        {currentItem ? 'Save Changes' : 'Add Item'}
                    </button>
                </form>
            </div>
        </div>
    );
};


// Main Inventory Component
const Inventory = () => {
    const [inventoryItems, setInventoryItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null); // Item being edited

    // Predefined categories and units for dropdowns
    const categories = [
        'Milk', 'UHT Milk', 'Curd', 'Buttermilk', 'Ice Cream', 'Lassi',
        'Flavoured Milk', 'Sweets', 'Paneer', 'Ghee', 'Butter', 'Other'
    ]; // Expanded categories based on images
    const units = ['Liter', 'Kg', 'Piece', 'Gram', 'Pack'];


    useEffect(() => {
        // Simulate fetching data
        setTimeout(() => {
            setInventoryItems(mockInventoryItems);
        }, 300);
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const openAddModal = () => {
        setCurrentItem(null); // No item selected for editing
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setCurrentItem(item);
        setIsModalOpen(true);
    };

    const closeFormModal = () => {
        setIsModalOpen(false);
        setCurrentItem(null); // Clear current item on close
    };

    const handleAddItem = (newItemData) => {
        const newId = `INV${Date.now()}`;
        const finalNewItem = {
            ...newItemData,
            id: newId,
            lastUpdated: getFormattedDate(new Date())
        };
        mockInventoryItems.unshift(finalNewItem); // Add to mock data
        setInventoryItems([...mockInventoryItems]); // Update state
        alert('Item added successfully!');
    };

    const handleUpdateItem = (updatedItemData) => {
        mockInventoryItems = mockInventoryItems.map(item =>
            item.id === updatedItemData.id
                ? { ...updatedItemData, lastUpdated: getFormattedDate(new Date()) }
                : item
        );
        setInventoryItems([...mockInventoryItems]);
        alert('Item updated successfully!');
    };

    const handleDeleteItem = (itemId) => {
        if (window.confirm('Are you sure you want to delete this inventory item?')) {
            mockInventoryItems = mockInventoryItems.filter(item => item.id !== itemId);
            setInventoryItems([...mockInventoryItems]);
            alert('Item deleted successfully!');
        }
    };

    const handleUpdateStock = (itemToUpdate, newStockValue) => {
        if (isNaN(newStockValue) || newStockValue < 0) {
            alert('Please enter a valid non-negative stock quantity.');
            return;
        }

        const updatedItem = {
            ...itemToUpdate,
            currentStock: parseInt(newStockValue, 10),
            lastUpdated: getFormattedDate(new Date())
        };
        handleUpdateItem(updatedItem); // Use the existing update handler
    };


    const filteredItems = inventoryItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="inventory-dashboard">
            <h2>Inventory Management</h2>

            <div className="inventory-actions">
                <input
                    type="text"
                    placeholder="Search items by name, category, or ID..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                />
                <button className="action-btn primary" onClick={openAddModal}>Add New Item</button>
            </div>

            <div className="inventory-list-container">
                {inventoryItems.length === 0 ? (
                    <p>Loading inventory...</p>
                ) : (
                    filteredItems.length > 0 ? (
                        filteredItems.map(item => (
                            <div key={item.id} className={`inventory-item-card ${item.currentStock <= item.reorderLevel ? 'low-stock-alert' : ''}`}>
                                <div className="item-info">
                                    <h3>{item.name}</h3>
                                    <p><strong>ID:</strong> {item.id}</p>
                                    <p><strong>Category:</strong> {item.category}</p>
                                    <p><strong>Unit:</strong> {item.unit}</p>
                                    <p><strong>Current Stock:</strong> {item.currentStock} {item.unit}</p>
                                    <p><strong>Reorder Level:</strong> {item.reorderLevel} {item.unit}</p>
                                    <p className="last-updated">Last Updated: {item.lastUpdated}</p>
                                    {item.currentStock <= item.reorderLevel && (
                                        <span className="low-stock-message">LOW STOCK!</span>
                                    )}
                                </div>
                                <div className="item-actions">
                                    <button className="action-btn edit" onClick={() => openEditModal(item)}>Edit Item</button>
                                    <button className="action-btn delete" onClick={() => handleDeleteItem(item.id)}>Delete Item</button>
                                    {/* Quick Stock Update - could be a separate mini-modal for more complexity */}
                                    <div className="quick-stock-update">
                                        <input
                                            type="number"
                                            value={item.currentStock}
                                            onChange={(e) => handleUpdateStock(item, e.target.value)}
                                            min="0"
                                        />
                                        <button onClick={() => handleUpdateStock(item, item.currentStock)} className="action-btn small">Update Stock</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No inventory items found matching your search criteria.</p>
                    )
                )}
            </div>

            <InventoryFormModal
                isOpen={isModalOpen}
                onClose={closeFormModal}
                onSubmit={currentItem ? handleUpdateItem : handleAddItem}
                currentItem={currentItem}
                categories={categories}
                units={units}
            />
        </div>
    );
};

export default Inventory;