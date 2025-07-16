// LogisticsDashboard.js
import React, { useState, useEffect } from 'react';
import './Logistics.css'; // Your CSS file

// --- Dummy Data (Extensive for detailed module) ---
const PRODUCTS = [
    'Milk (1L Pouch)', 'UHT Milk (1L Carton)', 'Curd (500g Cup)', 'Buttermilk (200ml)',
    'Ice Cream (500ml Tub)', 'Lassi (250ml Bottle)', 'Flavoured Milk (200ml)',
    'Sweets (Kaju Katli 250g)', 'Paneer (200g Block)', 'Ghee (1KG Jar)'
];

const WAREHOUSES_DATA = [ // Renamed to avoid conflict with WAREHOUSES
    { id: 'WH001', name: 'Bengaluru Main Depot', location: 'Koramangala, Bengaluru', capacity: '10,000 SqFt', temperature: '4°C' },
    { id: 'WH002', name: 'Mysuru Satellite Hub', location: 'JP Nagar, Mysuru', capacity: '5,000 SqFt', temperature: '3°C' },
    { id: 'WH003', name: 'Mangaluru Cold Storage', location: 'Bendoor, Mangaluru', capacity: '7,000 SqFt', temperature: '2°C' },
];

const VEHICLES_DATA = [ // Renamed
    { id: 'VEC001', type: 'Refrigerated Van', capacity: '1000 Liters', status: 'Available', currentLocation: 'WH001', driver: 'Rajesh Kumar', tempRange: '2-5°C', fuelLevel: 85 },
    { id: 'VEC002', type: 'Milk Tanker', capacity: '5000 Liters', status: 'En Route', currentLocation: 'NH44 Near Bengaluru', driver: 'Suresh Bhat', tempRange: '4-6°C', fuelLevel: 60 },
    { id: 'VEC003', type: 'Small Delivery Truck', capacity: '500 Liters', status: 'In Transit', currentLocation: 'Jayanagar 4th Block', driver: 'Amit Singh', tempRange: '5-8°C', fuelLevel: 45 },
    { id: 'VEC004', type: 'Refrigerated Van', capacity: '1200 Liters', status: 'Maintenance', currentLocation: 'Service Center', driver: null, tempRange: '2-5°C', fuelLevel: 10 },
    { id: 'VEC005', type: 'Small Delivery Truck', capacity: '600 Liters', status: 'Available', currentLocation: 'WH002', driver: 'Priya Sharma', tempRange: '5-8°C', fuelLevel: 90 },
];

const RETAILERS_DATA = [ // Renamed
    { id: 'RET001', name: 'SuperMart Koramangala', contact: '9876543210', email: 'supermart@example.com', address: '123, 1st Main Rd, Koramangala, Bengaluru', creditLimit: 50000, outstanding: 15000 },
    { id: 'RET002', name: 'Local Dairy Shop Jayanagar', contact: '9876512345', email: 'ldshop@example.com', address: '45, 10th Cross, Jayanagar, Bengaluru', creditLimit: 20000, outstanding: 5000 },
    { id: 'RET003', name: 'Hotel Grand', contact: '9988776655', email: 'hotelgrand@example.com', address: 'MG Road, Bengaluru', creditLimit: 100000, outstanding: 25000 },
    { id: 'RET004', name: 'FreshGroceries Online', contact: '9123456789', email: 'online@freshgroceries.com', address: 'Delivery Hub, Indiranagar, Bengaluru', creditLimit: 75000, outstanding: 0 },
];
// --- End Dummy Data ---

const LogisticsDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [orders, setOrders] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [vehicles, setVehicles] = useState(VEHICLES_DATA); // Use VEHICLES_DATA
    const [retailers, setRetailers] = useState(RETAILERS_DATA); // Use RETAILERS_DATA
    const [warehouses, setWarehouses] = useState(WAREHOUSES_DATA); // New state for warehouses

    // Form visibility states
    const [showAddWarehouseForm, setShowAddWarehouseForm] = useState(false);
    const [showAddVehicleForm, setShowAddVehicleForm] = useState(false);
    const [showCreateOrderForm, setShowCreateOrderForm] = useState(false);
    const [showAddRetailerForm, setShowAddRetailerForm] = useState(false);

    // Form data states
    const [newWarehouse, setNewWarehouse] = useState({ name: '', location: '', capacity: '', temperature: '' });
    const [newVehicle, setNewVehicle] = useState({ id: '', type: '', capacity: '', status: 'Available', currentLocation: '', driver: '', tempRange: '', fuelLevel: 100 });
    const [newOrder, setNewOrder] = useState({ productId: '', quantity: '', retailerId: '', deliveryDate: '', warehouseId: '' });
    const [newRetailer, setNewRetailer] = useState({ name: '', contact: '', email: '', address: '', creditLimit: 0, outstanding: 0 });


    // Simulate fetching and initializing data
    useEffect(() => {
        setOrders([
            { id: 'ORD001', product: 'Milk (1L Pouch)', quantity: 500, retailerId: 'RET001', destination: 'SuperMart, Koramangala', status: 'Pending', deliveryDate: '2025-07-01', assignedVehicle: null, warehouse: 'WH001' },
            { id: 'ORD002', product: 'Curd (500g Cup)', quantity: 200, retailerId: 'RET002', destination: 'Local Dairy Shop, Jayanagar', status: 'Dispatched', deliveryDate: '2025-07-01', assignedVehicle: 'VEC003', warehouse: 'WH001' },
            { id: 'ORD003', product: 'Buttermilk (200ml)', quantity: 150, retailerId: 'RET003', destination: 'Restaurant ABC, Koramangala', status: 'In Transit', deliveryDate: '2025-07-01', assignedVehicle: 'VEC002', warehouse: 'WH002' },
            { id: 'ORD004', product: 'Ice Cream (500ml Tub)', quantity: 100, retailerId: 'RET001', destination: 'Confectionery Store, HSR Layout', status: 'Pending', deliveryDate: '2025-07-02', assignedVehicle: null, warehouse: 'WH001' },
            { id: 'ORD005', product: 'Flavoured Milk (200ml)', quantity: 300, retailerId: 'RET004', destination: 'School Canteen, Electronic City', status: 'Delivered', deliveryDate: '2025-06-30', assignedVehicle: 'VEC001', warehouse: 'WH003' },
            { id: 'ORD006', product: 'Paneer (200g Block)', quantity: 80, retailerId: 'RET003', destination: 'Hotel Grand, MG Road', status: 'Pending', deliveryDate: '2025-07-02', assignedVehicle: null, warehouse: 'WH001' },
            { id: 'ORD007', product: 'Ghee (1KG Jar)', quantity: 25, retailerId: 'RET002', destination: 'Grocery Mart, Whitefield', status: 'Dispatched', deliveryDate: '2025-07-01', assignedVehicle: 'VEC003', warehouse: 'WH002' },
        ]);

        setInventory([
            { warehouseId: 'WH001', product: 'Milk (1L Pouch)', stock: 2500 },
            { warehouseId: 'WH001', product: 'Curd (500g Cup)', stock: 1200 },
            { warehouseId: 'WH001', product: 'Ice Cream (500ml Tub)', stock: 500 },
            { warehouseId: 'WH001', product: 'Paneer (200g Block)', stock: 400 },
            { warehouseId: 'WH002', product: 'UHT Milk (1L Carton)', stock: 1500 },
            { warehouseId: 'WH002', product: 'Buttermilk (200ml)', stock: 800 },
            { warehouseId: 'WH002', product: 'Ghee (1KG Jar)', stock: 300 },
            { warehouseId: 'WH003', product: 'Flavoured Milk (200ml)', stock: 1000 },
            { warehouseId: 'WH003', product: 'Lassi (250ml Bottle)', stock: 700 },
            { warehouseId: 'WH003', product: 'Sweets (Kaju Katli 250g)', stock: 300 },
        ]);
    }, []);

    // --- Utility Functions ---
    const getRetailerName = (retailerId) => {
        const retailer = retailers.find(r => r.id === retailerId);
        return retailer ? retailer.name : 'N/A';
    };

    const getWarehouseName = (warehouseId) => {
        const warehouse = warehouses.find(wh => wh.id === warehouseId);
        return warehouse ? warehouse.name : 'N/A';
    };

    const getVehicleDetails = (vehicleId) => {
        const vehicle = vehicles.find(v => v.id === vehicleId);
        return vehicle ? `${vehicle.id} (${vehicle.type})` : 'N/A';
    };

    // --- Form Handlers ---

    // Add Warehouse
    const handleAddWarehouseChange = (e) => {
        const { name, value } = e.target;
        setNewWarehouse(prevState => ({ ...prevState, [name]: value }));
    };

    const handleAddWarehouseSubmit = (e) => {
        e.preventDefault();
        const newId = `WH${String(warehouses.length + 1).padStart(3, '0')}`;
        const warehouseToAdd = { id: newId, ...newWarehouse };
        setWarehouses(prevWarehouses => [...prevWarehouses, warehouseToAdd]);
        setNewWarehouse({ name: '', location: '', capacity: '', temperature: '' });
        setShowAddWarehouseForm(false);
        alert(`Warehouse ${warehouseToAdd.name} added!`);
    };

    // Add Vehicle
    const handleAddVehicleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewVehicle(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAddVehicleSubmit = (e) => {
        e.preventDefault();
        // Generate a new ID if not provided, or ensure uniqueness
        const newId = newVehicle.id || `VEC${String(vehicles.length + 1).padStart(3, '0')}`;
        const vehicleToAdd = { ...newVehicle, id: newId, fuelLevel: Number(newVehicle.fuelLevel) }; // Ensure fuelLevel is number
        setVehicles(prevVehicles => [...prevVehicles, vehicleToAdd]);
        setNewVehicle({ id: '', type: '', capacity: '', status: 'Available', currentLocation: '', driver: '', tempRange: '', fuelLevel: 100 });
        setShowAddVehicleForm(false);
        alert(`Vehicle ${vehicleToAdd.id} added!`);
    };

    // Create New Order
    const handleCreateOrderChange = (e) => {
        const { name, value } = e.target;
        setNewOrder(prevState => ({ ...prevState, [name]: value }));
    };

    const handleCreateOrderSubmit = (e) => {
        e.preventDefault();
        const newId = `ORD${String(orders.length + 1).padStart(3, '0')}`;
        const selectedProduct = PRODUCTS.find(p => p === newOrder.productId);
        const selectedRetailer = retailers.find(r => r.id === newOrder.retailerId);
        const selectedWarehouse = warehouses.find(wh => wh.id === newOrder.warehouseId);

        if (!selectedProduct || !selectedRetailer || !selectedWarehouse) {
            alert('Please select valid product, retailer, and warehouse.');
            return;
        }

        const orderToAdd = {
            id: newId,
            product: selectedProduct,
            quantity: Number(newOrder.quantity),
            retailerId: selectedRetailer.id,
            destination: selectedRetailer.address, // Use retailer address as destination
            status: 'Pending',
            deliveryDate: newOrder.deliveryDate,
            assignedVehicle: null,
            warehouse: selectedWarehouse.id
        };

        setOrders(prevOrders => [...prevOrders, orderToAdd]);
        setNewOrder({ productId: '', quantity: '', retailerId: '', deliveryDate: '', warehouseId: '' });
        setShowCreateOrderForm(false);
        alert(`Order ${orderToAdd.id} created!`);
    };

    // Add New Retailer
    const handleAddRetailerChange = (e) => {
        const { name, value } = e.target;
        setNewRetailer(prevState => ({
            ...prevState,
            [name]: name === 'creditLimit' || name === 'outstanding' ? Number(value) : value
        }));
    };

    const handleAddRetailerSubmit = (e) => {
        e.preventDefault();
        const newId = `RET${String(retailers.length + 1).padStart(3, '0')}`;
        const retailerToAdd = { id: newId, ...newRetailer };
        setRetailers(prevRetailers => [...prevRetailers, retailerToAdd]);
        setNewRetailer({ name: '', contact: '', email: '', address: '', creditLimit: 0, outstanding: 0 });
        setShowAddRetailerForm(false);
        alert(`Retailer ${retailerToAdd.name} added!`);
    };


    // --- Dashboard Content ---
    const renderDashboard = () => {
        const pendingOrders = orders.filter(o => o.status === 'Pending').length;
        const dispatchedOrders = orders.filter(o => o.status === 'Dispatched' || o.status === 'In Transit').length;
        const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
        const availableVehicles = vehicles.filter(v => v.status === 'Available').length;
        const totalProductsInStock = inventory.reduce((sum, item) => sum + item.stock, 0);

        // Report Data Calculations
        const orderStatusCounts = orders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {});

        const vehicleStatusCounts = vehicles.reduce((acc, vehicle) => {
            acc[vehicle.status] = (acc[vehicle.status] || 0) + 1;
            return acc;
        }, {});

        const allProductsStock = inventory.reduce((acc, item) => {
            acc[item.product] = (acc[item.product] || 0) + item.stock;
            return acc;
        }, {});

        const sortedProductsByStock = Object.entries(allProductsStock).sort(([, a], [, b]) => b - a);
        const top5Products = sortedProductsByStock.slice(0, 5);
        const low5Products = sortedProductsByStock.slice(-5).reverse(); // Reverse for ascending order

        const retailersWithOutstanding = retailers.filter(r => r.outstanding > 0).sort((a, b) => b.outstanding - a.outstanding);


        return (
            <div className="dashboard-grid">
                {/* Main Overview Cards */}
                <div className="dash-card primary">
                    <h3>Pending Orders Today</h3>
                    <p>{pendingOrders}</p>
                </div>
                <div className="dash-card info">
                    <h3>Dispatched Orders Today</h3>
                    <p>{dispatchedOrders}</p>
                </div>
                <div className="dash-card success">
                    <h3>Delivered Orders Today</h3>
                    <p>{deliveredOrders}</p>
                </div>
                <div className="dash-card warning">
                    <h3>Available Vehicles</h3>
                    <p>{availableVehicles}</p>
                </div>

                {/* Reports Section */}
                <div className="dash-full-width report-section">
                    <h2>Operational Reports</h2>
                    <div className="reports-grid">
                        <div className="report-card">
                            <h3>Order Status Breakdown</h3>
                            <ul className="report-list">
                                {Object.entries(orderStatusCounts).map(([status, count]) => (
                                    <li key={status}>
                                        <span className={`status-badge status-${status.toLowerCase().replace(' ', '-')}`}>
                                            {status}
                                        </span>: <strong>{count}</strong>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="report-card">
                            <h3>Vehicle Fleet Status</h3>
                            <ul className="report-list">
                                {Object.entries(vehicleStatusCounts).map(([status, count]) => (
                                    <li key={status}>
                                        <span className={`status-badge status-${status.toLowerCase().replace(' ', '-')}`}>
                                            {status}
                                        </span>: <strong>{count}</strong>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="report-card">
                            <h3>Top 5 Products in Stock</h3>
                            <ul className="report-list">
                                {top5Products.length > 0 ? (
                                    top5Products.map(([product, stock]) => (
                                        <li key={product}>{product}: <strong>{stock} units</strong></li>
                                    ))
                                ) : (
                                    <li>No products in stock.</li>
                                )}
                            </ul>
                        </div>

                        <div className="report-card">
                            <h3>Low 5 Products in Stock</h3>
                            <ul className="report-list warning-items">
                                {low5Products.length > 0 ? (
                                    low5Products.map(([product, stock]) => (
                                        <li key={product}>{product}: <strong>{stock} units</strong></li>
                                    ))
                                ) : (
                                    <li>All products well-stocked.</li>
                                )}
                            </ul>
                        </div>

                        <div className="report-card full-width-report">
                            <h3>Retailers with Outstanding Payments</h3>
                            {retailersWithOutstanding.length > 0 ? (
                                <div className="table-container-small">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Retailer</th>
                                                <th>Outstanding Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {retailersWithOutstanding.map(retailer => (
                                                <tr key={retailer.id}>
                                                    <td>{retailer.name}</td>
                                                    <td className="outstanding-amount">₹{retailer.outstanding.toLocaleString('en-IN')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p>No outstanding payments at the moment.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="dash-full-width">
                    <h2>Recent Activities</h2>
                    <ul className="activity-list">
                        <li>Order ORD003 (Buttermilk) assigned to VEC002, In Transit.</li>
                        <li>Vehicle VEC004 sent for maintenance.</li>
                        <li>New stock of Milk (1L Pouch) received at Bengaluru Main Depot (WH001).</li>
                        <li>Retailer FreshGroceries Online (RET004) placed a new order.</li>
                        {/* More dynamic activities could be added here */}
                    </ul>
                </div>
            </div>
        );
    };

    // --- Warehousing Content ---
    const renderWarehousing = () => {
        const warehousesWithInventory = warehouses.map(wh => ({
            ...wh,
            products: inventory.filter(item => item.warehouseId === wh.id)
        }));

        return (
            <div className="logistics-section-wrapper">
                <button className="add-button" onClick={() => setShowAddWarehouseForm(true)}>
                    + Add New Warehouse
                </button>

                {showAddWarehouseForm && (
                    <div className="form-modal-overlay">
                        <div className="form-modal-content">
                            <h3>Add New Warehouse</h3>
                            <form onSubmit={handleAddWarehouseSubmit} className="logistics-form">
                                <div className="form-group">
                                    <label htmlFor="whName">Warehouse Name:</label>
                                    <input
                                        type="text"
                                        id="whName"
                                        name="name"
                                        value={newWarehouse.name}
                                        onChange={handleAddWarehouseChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="whLocation">Location:</label>
                                    <input
                                        type="text"
                                        id="whLocation"
                                        name="location"
                                        value={newWarehouse.location}
                                        onChange={handleAddWarehouseChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="whCapacity">Capacity (e.g., 10,000 SqFt):</label>
                                    <input
                                        type="text"
                                        id="whCapacity"
                                        name="capacity"
                                        value={newWarehouse.capacity}
                                        onChange={handleAddWarehouseChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="whTemperature">Temperature (e.g., 4°C):</label>
                                    <input
                                        type="text"
                                        id="whTemperature"
                                        name="temperature"
                                        value={newWarehouse.temperature}
                                        onChange={handleAddWarehouseChange}
                                        required
                                    />
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="primary-button">Add Warehouse</button>
                                    <button type="button" className="secondary-button" onClick={() => setShowAddWarehouseForm(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {warehousesWithInventory.map(wh => (
                    <div key={wh.id} className="warehouse-card logistics-section">
                        <h3>{wh.name} ({wh.id})</h3>
                        <p><strong>Location:</strong> {wh.location}</p>
                        <p><strong>Capacity:</strong> {wh.capacity}</p>
                        <p><strong>Temperature:</strong> {wh.temperature}</p>
                        <h4>Current Stock:</h4>
                        {wh.products.length > 0 ? (
                            <ul className="product-stock-list">
                                {wh.products.map((p, idx) => (
                                    <li key={idx}>
                                        <span>{p.product}</span>
                                        <span className="stock-qty">{p.stock} units</span>
                                        <button className="small-button" onClick={() => alert(`Adjusting ${p.product} in ${wh.name}`)}>Adjust</button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No products currently in stock.</p>
                        )}
                        <button className="secondary-button" onClick={() => alert(`View details for ${wh.name}`)}>View Details</button>
                    </div>
                ))}
            </div>
        );
    };

    // --- Transportation Content ---
    const renderTransportation = () => {
        const handleAssignDriver = (vehicleId) => { alert(`Assign driver for ${vehicleId}`); };
        const handleUpdateLocation = (vehicleId) => { alert(`Update location for ${vehicleId}`); };

        return (
            <div className="logistics-section-wrapper">
                <button className="add-button" onClick={() => setShowAddVehicleForm(true)}>
                    + Add New Vehicle
                </button>

                {showAddVehicleForm && (
                    <div className="form-modal-overlay">
                        <div className="form-modal-content">
                            <h3>Add New Vehicle</h3>
                            <form onSubmit={handleAddVehicleSubmit} className="logistics-form">
                                <div className="form-group">
                                    <label htmlFor="vehicleId">Vehicle ID (optional):</label>
                                    <input
                                        type="text"
                                        id="vehicleId"
                                        name="id"
                                        value={newVehicle.id}
                                        onChange={handleAddVehicleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="vehicleType">Type:</label>
                                    <select
                                        id="vehicleType"
                                        name="type"
                                        value={newVehicle.type}
                                        onChange={handleAddVehicleChange}
                                        required
                                    >
                                        <option value="">Select Type</option>
                                        <option value="Refrigerated Van">Refrigerated Van</option>
                                        <option value="Milk Tanker">Milk Tanker</option>
                                        <option value="Small Delivery Truck">Small Delivery Truck</option>
                                        <option value="Large Hauler">Large Hauler</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="vehicleCapacity">Capacity:</label>
                                    <input
                                        type="text"
                                        id="vehicleCapacity"
                                        name="capacity"
                                        value={newVehicle.capacity}
                                        onChange={handleAddVehicleChange}
                                        placeholder="e.g., 1000 Liters"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="vehicleCurrentLocation">Current Location:</label>
                                    <input
                                        type="text"
                                        id="vehicleCurrentLocation"
                                        name="currentLocation"
                                        value={newVehicle.currentLocation}
                                        onChange={handleAddVehicleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="vehicleDriver">Driver (optional):</label>
                                    <input
                                        type="text"
                                        id="vehicleDriver"
                                        name="driver"
                                        value={newVehicle.driver}
                                        onChange={handleAddVehicleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="vehicleTempRange">Temperature Range:</label>
                                    <input
                                        type="text"
                                        id="vehicleTempRange"
                                        name="tempRange"
                                        value={newVehicle.tempRange}
                                        onChange={handleAddVehicleChange}
                                        placeholder="e.g., 2-5°C"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="vehicleFuelLevel">Fuel Level (%):</label>
                                    <input
                                        type="number"
                                        id="vehicleFuelLevel"
                                        name="fuelLevel"
                                        value={newVehicle.fuelLevel}
                                        onChange={handleAddVehicleChange}
                                        min="0"
                                        max="100"
                                        required
                                    />
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="primary-button">Add Vehicle</button>
                                    <button type="button" className="secondary-button" onClick={() => setShowAddVehicleForm(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="vehicle-list-grid">
                    {vehicles.map(vehicle => (
                        <div key={vehicle.id} className={`vehicle-card status-${vehicle.status.toLowerCase().replace(' ', '-')}`}>
                            <h3>{vehicle.id} - {vehicle.type}</h3>
                            <p><strong>Status:</strong> <span className="status-badge">{vehicle.status}</span></p>
                            <p><strong>Driver:</strong> {vehicle.driver || 'Unassigned'}</p>
                            <p><strong>Location:</strong> {vehicle.currentLocation}</p>
                            <p><strong>Capacity:</strong> {vehicle.capacity}</p>
                            <p><strong>Temp Range:</strong> {vehicle.tempRange}</p>
                            <p><strong>Fuel:</strong> {vehicle.fuelLevel}%</p>
                            <div className="vehicle-actions">
                                {vehicle.status === 'Available' && (
                                    <button className="small-button" onClick={() => handleAssignDriver(vehicle.id)}>Assign Driver</button>
                                )}
                                {vehicle.status !== 'Available' && (
                                    <button className="small-button" onClick={() => handleUpdateLocation(vehicle.id)}>Update Location</button>
                                )}
                                <button className="small-button secondary-button" onClick={() => alert(`View routes for ${vehicle.id}`)}>View Routes</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="logistics-section route-map-placeholder">
                    <h2>Route Optimization & Map View</h2>
                    <p>Map integration with real-time vehicle locations and optimized routes would appear here.</p>
                    <button className="primary-button" onClick={() => alert('Feature: Plan New Route')}>Plan New Route</button>
                </div>
            </div>
        );
    };

    // --- Distribution & Orders Content ---
    const renderDistribution = () => {
        const handleAssignVehicleToOrder = (orderId, vehicleId) => {
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, assignedVehicle: vehicleId, status: 'Dispatched' } : order
                )
            );
            // Optionally update vehicle status
            setVehicles(prevVehicles =>
                prevVehicles.map(vehicle =>
                    vehicle.id === vehicleId ? { ...vehicle, status: 'En Route', currentLocation: 'Assigned to Order ' + orderId } : vehicle
                )
            );
            alert(`Order ${orderId} assigned to vehicle ${vehicleId}`);
        };

        const handleUpdateOrderStatus = (orderId, newStatus) => {
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
            if (newStatus === 'Delivered') {
                // Optionally update vehicle status back to available if it was the only order
                const deliveredOrder = orders.find(o => o.id === orderId);
                if (deliveredOrder && deliveredOrder.assignedVehicle) {
                    const otherOrdersForVehicle = orders.filter(o => o.assignedVehicle === deliveredOrder.assignedVehicle && o.id !== orderId && o.status !== 'Delivered');
                    if (otherOrdersForVehicle.length === 0) {
                         setVehicles(prevVehicles =>
                            prevVehicles.map(vehicle =>
                                vehicle.id === deliveredOrder.assignedVehicle ? { ...vehicle, status: 'Available', currentLocation: getWarehouseName(vehicle.currentLocation.split(' ').pop()) || 'Unknown Depot' } : vehicle
                            )
                        );
                    }
                }
            }
            alert(`Order ${orderId} status updated to ${newStatus}`);
        };

        return (
            <div className="logistics-section-wrapper">
                <button className="add-button" onClick={() => setShowCreateOrderForm(true)}>
                    + Create New Order
                </button>

                {showCreateOrderForm && (
                    <div className="form-modal-overlay">
                        <div className="form-modal-content">
                            <h3>Create New Order</h3>
                            <form onSubmit={handleCreateOrderSubmit} className="logistics-form">
                                <div className="form-group">
                                    <label htmlFor="orderProduct">Product:</label>
                                    <select
                                        id="orderProduct"
                                        name="productId"
                                        value={newOrder.productId}
                                        onChange={handleCreateOrderChange}
                                        required
                                    >
                                        <option value="">Select Product</option>
                                        {PRODUCTS.map(product => (
                                            <option key={product} value={product}>{product}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="orderQuantity">Quantity:</label>
                                    <input
                                        type="number"
                                        id="orderQuantity"
                                        name="quantity"
                                        value={newOrder.quantity}
                                        onChange={handleCreateOrderChange}
                                        min="1"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="orderRetailer">Retailer:</label>
                                    <select
                                        id="orderRetailer"
                                        name="retailerId"
                                        value={newOrder.retailerId}
                                        onChange={handleCreateOrderChange}
                                        required
                                    >
                                        <option value="">Select Retailer</option>
                                        {retailers.map(retailer => (
                                            <option key={retailer.id} value={retailer.id}>{retailer.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="orderWarehouse">Source Warehouse:</label>
                                    <select
                                        id="orderWarehouse"
                                        name="warehouseId"
                                        value={newOrder.warehouseId}
                                        onChange={handleCreateOrderChange}
                                        required
                                    >
                                        <option value="">Select Warehouse</option>
                                        {warehouses.map(wh => (
                                            <option key={wh.id} value={wh.id}>{wh.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="orderDeliveryDate">Delivery Date:</label>
                                    <input
                                        type="date"
                                        id="orderDeliveryDate"
                                        name="deliveryDate"
                                        value={newOrder.deliveryDate}
                                        onChange={handleCreateOrderChange}
                                        min={new Date().toISOString().split('T')[0]} // Min date is today
                                        required
                                    />
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="primary-button">Create Order</button>
                                    <button type="button" className="secondary-button" onClick={() => setShowCreateOrderForm(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Product</th>
                                <th>Qty</th>
                                <th>Retailer</th>
                                <th>Warehouse</th>
                                <th>Delivery Date</th>
                                <th>Vehicle</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} className={order.status === 'Delivered' ? 'delivered-row' : ''}>
                                    <td>{order.id}</td>
                                    <td>{order.product}</td>
                                    <td>{order.quantity}</td>
                                    <td>{getRetailerName(order.retailerId)}</td>
                                    <td>{getWarehouseName(order.warehouse)}</td>
                                    <td>{order.deliveryDate}</td>
                                    <td>{getVehicleDetails(order.assignedVehicle)}</td>
                                    <td>
                                        <span className={`status-badge status-${order.status.toLowerCase().replace(' ', '-')}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            {order.status === 'Pending' && (
                                                <button className="small-button" onClick={() => {
                                                    const availableVehicles = vehicles.filter(v => v.status === 'Available' || v.status === 'En Route'); // Can assign to vehicles that are en route but might have capacity
                                                    if (availableVehicles.length > 0) {
                                                        const vehicleId = prompt(`Assign order ${order.id} to an available vehicle (e.g., ${availableVehicles[0].id}). Enter Vehicle ID:`);
                                                        if (vehicleId && vehicles.some(v => v.id === vehicleId)) {
                                                            handleAssignVehicleToOrder(order.id, vehicleId);
                                                        } else if (vehicleId) {
                                                            alert('Invalid Vehicle ID. Please select an existing vehicle.');
                                                        }
                                                    } else {
                                                        alert('No vehicles currently available or en route for assignment.');
                                                    }
                                                }}>Assign</button>
                                            )}
                                            {(order.status === 'Dispatched' || order.status === 'In Transit') && (
                                                <button className="small-button" onClick={() => handleUpdateOrderStatus(order.id, 'Delivered')}>Mark Delivered</button>
                                            )}
                                            <button className="small-button secondary-button" onClick={() => alert(`View details for ${order.id}`)}>Details</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // --- Retailer Management Content ---
    const renderRetailers = () => {
        return (
            <div className="logistics-section-wrapper">
                <button className="add-button" onClick={() => setShowAddRetailerForm(true)}>
                    + Add New Retailer
                </button>

                {showAddRetailerForm && (
                    <div className="form-modal-overlay">
                        <div className="form-modal-content">
                            <h3>Add New Retailer</h3>
                            <form onSubmit={handleAddRetailerSubmit} className="logistics-form">
                                <div className="form-group">
                                    <label htmlFor="retailerName">Retailer Name:</label>
                                    <input
                                        type="text"
                                        id="retailerName"
                                        name="name"
                                        value={newRetailer.name}
                                        onChange={handleAddRetailerChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="retailerContact">Contact No:</label>
                                    <input
                                        type="tel"
                                        id="retailerContact"
                                        name="contact"
                                        value={newRetailer.contact}
                                        onChange={handleAddRetailerChange}
                                        pattern="[0-9]{10}"
                                        placeholder="e.g., 9876543210"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="retailerEmail">Email:</label>
                                    <input
                                        type="email"
                                        id="retailerEmail"
                                        name="email"
                                        value={newRetailer.email}
                                        onChange={handleAddRetailerChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="retailerAddress">Address:</label>
                                    <textarea
                                        id="retailerAddress"
                                        name="address"
                                        value={newRetailer.address}
                                        onChange={handleAddRetailerChange}
                                        required
                                    ></textarea>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="retailerCreditLimit">Credit Limit (₹):</label>
                                    <input
                                        type="number"
                                        id="retailerCreditLimit"
                                        name="creditLimit"
                                        value={newRetailer.creditLimit}
                                        onChange={handleAddRetailerChange}
                                        min="0"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="retailerOutstanding">Outstanding (₹):</label>
                                    <input
                                        type="number"
                                        id="retailerOutstanding"
                                        name="outstanding"
                                        value={newRetailer.outstanding}
                                        onChange={handleAddRetailerChange}
                                        min="0"
                                        required
                                    />
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="primary-button">Add Retailer</button>
                                    <button type="button" className="secondary-button" onClick={() => setShowAddRetailerForm(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Retailer ID</th>
                                <th>Name</th>
                                <th>Contact</th>
                                <th>Address</th>
                                <th>Credit Limit</th>
                                <th>Outstanding</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {retailers.map(retailer => (
                                <tr key={retailer.id}>
                                    <td>{retailer.id}</td>
                                    <td>{retailer.name}</td>
                                    <td>{retailer.contact}</td>
                                    <td>{retailer.address}</td>
                                    <td>₹{retailer.creditLimit.toLocaleString('en-IN')}</td>
                                    <td className={retailer.outstanding > 0 ? 'outstanding-amount' : ''}>₹{retailer.outstanding.toLocaleString('en-IN')}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="small-button" onClick={() => alert(`View orders for ${retailer.name}`)}>View Orders</button>
                                            <button className="small-button secondary-button" onClick={() => alert(`Edit ${retailer.name}`)}>Edit</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // --- Main Render Function ---
    return (
        <div className="logistics-dashboard-container">
            <h1>Dairy Logistics Operations</h1>

            <nav className="dashboard-nav">
                <button
                    className={activeTab === 'dashboard' ? 'active' : ''}
                    onClick={() => setActiveTab('dashboard')}
                >
                    Dashboard
                </button>
                <button
                    className={activeTab === 'warehousing' ? 'active' : ''}
                    onClick={() => setActiveTab('warehousing')}
                >
                    Warehousing
                </button>
                <button
                    className={activeTab === 'transportation' ? 'active' : ''}
                    onClick={() => setActiveTab('transportation')}
                >
                    Transportation
                </button>
                <button
                    className={activeTab === 'distribution' ? 'active' : ''}
                    onClick={() => setActiveTab('distribution')}
                >
                    Distribution & Orders
                </button>
                <button
                    className={activeTab === 'retailers' ? 'active' : ''}
                    onClick={() => setActiveTab('retailers')}
                >
                    Retailer Management
                </button>
            </nav>

            <div className="dashboard-content">
                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'warehousing' && renderWarehousing()}
                {activeTab === 'transportation' && renderTransportation()}
                {activeTab === 'distribution' && renderDistribution()}
                {activeTab === 'retailers' && renderRetailers()}
            </div>
        </div>
    );
};

export default LogisticsDashboard;