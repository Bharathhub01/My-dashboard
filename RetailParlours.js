// RetailParlour.js - Consolidated Module
import React, { useState, useEffect, useMemo } from 'react';
import './RetailParlour.css';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF0000', '#8884D8', '#D0ED57', '#A4DE6C', '#FF6666']; // Expanded colors for Pie Chart

// Defined list of product categories
const PRODUCT_CATEGORIES = [
    'Milk',
    'UHT Milk',
    'Curd',
    'Buttermilk',
    'Ice Cream',
    'Lassi',
    'Flavoured Milk',
    'Sweets',
    'Paneer',
    'Ghee'
];

const RetailParlour = () => {
    // --- Mock Data: This would typically come from a backend API ---
    const [customers, setCustomers] = useState([
        { id: 'C001', name: 'Rohan Sharma', email: 'rohan.s@example.com', phone: '9812345678', address: '123, Dairy Lane, Indiranagar', loyaltyPoints: 520, franchiseId: 'F001' },
        { id: 'C002', name: 'Priya Singh', email: 'priya.s@example.com', phone: '9923456789', address: '456, Milk Road, Koramangala', loyaltyPoints: 810, franchiseId: 'F002' },
        { id: 'C003', name: 'Amit Gupta', email: 'amit.g@example.com', phone: '9734567890', address: '789, Cheese Street, Jayanagar', loyaltyPoints: 340, franchiseId: 'F001' },
        { id: 'C004', name: 'Divya Reddy', email: 'divya.r@example.com', phone: '9645678901', address: '101, Ghee Block, HSR Layout', loyaltyPoints: 120, franchiseId: 'F003' },
        { id: 'C005', name: 'Sana Khan', email: 'sana.k@example.com', phone: '9555544444', address: '202, Butter Street, Electronic City', loyaltyPoints: 600, franchiseId: 'F001' },
    ]);

    const [products, setProducts] = useState([
        { id: 'P101', name: 'Fresh Cow Milk (1L)', price: 60, category: 'Milk', stock: 150 },
        { id: 'P102', name: 'Full Cream Milk (500ml)', price: 35, category: 'UHT Milk', stock: 200 },
        { id: 'P103', name: 'Plain Curd (500g)', price: 75, category: 'Curd', stock: 80 },
        { id: 'P104', name: 'Paneer (250g)', price: 120, category: 'Paneer', stock: 50 },
        { id: 'P105', name: 'Desi Ghee (500ml)', price: 380, category: 'Ghee', stock: 30 },
        { id: 'P106', name: 'Mango Lassi (200ml)', price: 40, category: 'Lassi', stock: 100 },
        { id: 'P107', name: 'Butter (100g)', price: 50, category: 'Sweets', stock: 90 }, // Changed category to Sweets for diversity
        { id: 'P108', name: 'Vanilla Ice Cream (1L)', price: 180, category: 'Ice Cream', stock: 40 },
        { id: 'P109', name: 'Salted Buttermilk (500ml)', price: 30, category: 'Buttermilk', stock: 70 },
        { id: 'P110', name: 'Chocolate Flavoured Milk (200ml)', price: 35, category: 'Flavoured Milk', stock: 120 },
    ]);

    const [sales, setSales] = useState([
        { id: 'S001', customerId: 'C001', date: '2025-07-01', totalAmount: 180, items: [{ productId: 'P101', qty: 2 }, { productId: 'P103', qty: 1 }] },
        { id: 'S002', customerId: 'C002', date: '2025-07-01', totalAmount: 110, items: [{ productId: 'P102', qty: 1 }, { productId: 'P106', qty: 2 }] },
        { id: 'S003', customerId: 'C001', date: '2025-07-02', totalAmount: 440, items: [{ productId: 'P105', qty: 1 }, { productId: 'P101', qty: 1 }] },
        { id: 'S004', customerId: 'C003', date: '2025-07-02', totalAmount: 160, items: [{ productId: 'P104', qty: 1 }, { productId: 'P106', qty: 1 }] },
        { id: 'S005', customerId: 'C002', date: '2025-07-03', totalAmount: 75, items: [{ productId: 'P103', qty: 1 }] },
        { id: 'S006', customerId: 'C004', date: '2025-07-03', totalAmount: 60, items: [{ productId: 'P101', qty: 1 }] },
        { id: 'S007', customerId: 'C005', date: '2025-07-04', totalAmount: 240, items: [{ productId: 'P104', qty: 1 }, { productId: 'P101', qty: 3 }] },
        { id: 'S008', customerId: 'C001', date: '2025-07-04', totalAmount: 215, items: [{ productId: 'P108', qty: 1 }, { productId: 'P110', qty: 1 }] },
    ]);
    // --- End Mock Data ---

    const [activeSection, setActiveSection] = useState('customers'); // Default active tab
    const [selectedCustomer, setSelectedCustomer] = useState(null); // For customer details modal
    const [customerSearchTerm, setCustomerSearchTerm] = useState(''); // For customer search

    // State for the "Place Order" form
    const [newOrder, setNewOrder] = useState({
        customerId: '',
        items: [{ productId: '', qty: 1 }] // Initial item row
    });

    // New State for Product Form
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [productForm, setProductForm] = useState({
        id: '',
        name: '',
        price: '',
        category: '', // This will be from the dropdown
        stock: ''
    });

    // Helper function to get product details by ID (memoized for performance)
    const getProductById = useMemo(() => (id) => products.find(p => p.id === id), [products]);

    // Mock Franchise data (since franchise tab is removed, but customer might still reference it)
    const mockFranchises = useMemo(() => [
        { id: 'F001', name: 'Indiranagar Parlour' },
        { id: 'F002', name: 'Koramangala Store' },
        { id: 'F003', name: 'Jayanagar Outlet' },
    ], []);

    // Helper function to get franchise details by ID (from mock data)
    const getFranchiseById = useMemo(() => (id) => mockFranchises.find(f => f.id === id), [mockFranchises]);

    // Filtered customers based on search term (memoized)
    const filteredCustomers = useMemo(() => {
        return customers.filter(customer =>
            customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
            customer.phone.includes(customerSearchTerm) ||
            customer.email.toLowerCase().includes(customerSearchTerm.toLowerCase())
        );
    }, [customers, customerSearchTerm]);

    // Function to get a customer's sales history
    const getCustomerSalesHistory = (customerId) => {
        return sales
            .filter(sale => sale.customerId === customerId)
            .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by most recent
    };

    // --- CRM Insight Calculations (memoized for performance) ---

    // Most popular products by quantity sold
    const popularProducts = useMemo(() => {
        const productCounts = {};
        sales.forEach(sale => {
            sale.items.forEach(item => {
                if (!productCounts[item.productId]) {
                    productCounts[item.productId] = 0;
                }
                productCounts[item.productId] += item.qty;
            });
        });

        // Filter out products that might not exist in the `products` state anymore
        const result = Object.entries(productCounts)
            .map(([productId, totalQtySold]) => {
                const product = getProductById(productId); // Use the memoized helper
                return product ? { ...product, totalQtySold } : null;
            })
            .filter(Boolean) // Remove null entries
            .sort((a, b) => b.totalQtySold - a.totalQtySold)
            .slice(0, 5); // Top 5 products

        return result;
    }, [sales, getProductById]);

    // Daily Sales Trend calculation
    const dailySales = useMemo(() => {
        const salesByDate = {};
        sales.forEach(sale => {
            if (!salesByDate[sale.date]) {
                salesByDate[sale.date] = 0;
            }
            salesByDate[sale.date] += sale.totalAmount;
        });

        // Convert to array of objects and sort by date
        return Object.entries(salesByDate)
            .map(([date, amount]) => ({ date, amount }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [sales]);

    // --- Order Placement Handlers ---

    const handleOrderItemChange = (e, index) => {
        const { name, value } = e.target;
        const updatedItems = [...newOrder.items];
        updatedItems[index] = {
            ...updatedItems[index],
            [name]: name === 'qty' ? parseInt(value) || 0 : value
        };
        setNewOrder({ ...newOrder, items: updatedItems });
    };

    const addOrderItem = () => {
        setNewOrder({ ...newOrder, items: [...newOrder.items, { productId: '', qty: 1 }] });
    };

    const removeOrderItem = (index) => {
        const updatedItems = newOrder.items.filter((_, i) => i !== index);
        setNewOrder({ ...newOrder, items: updatedItems });
    };

    const handlePlaceOrder = (e) => {
        e.preventDefault();

        // Basic validation
        if (!newOrder.customerId) {
            alert('Please select a customer.');
            return;
        }
        if (newOrder.items.some(item => !item.productId || item.qty <= 0)) {
            alert('Please ensure all selected products have valid quantities.');
            return;
        }

        let totalOrderAmount = 0;
        const purchasedItems = [];

        for (const item of newOrder.items) {
            const product = getProductById(item.productId);
            if (!product) {
                alert(`Product with ID ${item.productId} not found.`);
                return;
            }
            if (product.stock < item.qty) {
                alert(`Insufficient stock for ${product.name}. Available: ${product.stock}, Ordered: ${item.qty}`);
                return;
            }
            totalOrderAmount += product.price * item.qty;
            purchasedItems.push({ productId: product.id, qty: item.qty });
        }


        if (purchasedItems.length === 0) {
            alert('No valid products selected for the order.');
            return;
        }

        // Decrease stock (do this after all validations pass)
        setProducts(prevProducts => prevProducts.map(p => {
            const orderedItem = purchasedItems.find(item => item.productId === p.id);
            return orderedItem ? { ...p, stock: p.stock - orderedItem.qty } : p;
        }));


        const newSaleId = `S${String(sales.length + 1).padStart(3, '0')}`;
        const newSale = {
            id: newSaleId,
            customerId: newOrder.customerId,
            date: new Date().toISOString().slice(0, 10),
            totalAmount: totalOrderAmount,
            items: purchasedItems,
        };

        setSales(prevSales => [...prevSales, newSale]);

        setCustomers(prevCustomers => prevCustomers.map(cust =>
            cust.id === newOrder.customerId
                ? { ...cust, loyaltyPoints: cust.loyaltyPoints + Math.floor(totalOrderAmount / 10) }
                : cust
        ));

        alert(`Order placed successfully for ${customers.find(c => c.id === newOrder.customerId)?.name || 'customer'}! Total: ₹${totalOrderAmount.toFixed(2)}`);

        setNewOrder({ customerId: '', items: [{ productId: '', qty: 1 }] });
        setActiveSection('sales');
    };

    // --- Product Management Handlers ---
    const openAddProductModal = () => {
        setCurrentProduct(null);
        setProductForm({ id: '', name: '', price: '', category: '', stock: '' });
        setIsProductModalOpen(true);
    };

    const openEditProductModal = (product) => {
        setCurrentProduct(product);
        setProductForm({
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.category,
            stock: product.stock
        });
        setIsProductModalOpen(true);
    };

    const closeProductModal = () => {
        setIsProductModalOpen(false);
        setCurrentProduct(null);
        setProductForm({ id: '', name: '', price: '', category: '', stock: '' });
    };

    const handleProductFormChange = (e) => {
        const { name, value } = e.target;
        setProductForm(prev => ({ ...prev, [name]: value }));
    };

    const handleProductSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (!productForm.name || !productForm.price || !productForm.category || productForm.stock === '') {
            alert('Please fill in all product fields.');
            return;
        }
        if (isNaN(productForm.price) || parseFloat(productForm.price) <= 0) {
            alert('Price must be a positive number.');
            return;
        }
        if (isNaN(productForm.stock) || parseInt(productForm.stock) < 0) {
            alert('Stock must be a non-negative integer.');
            return;
        }

        if (currentProduct) {
            // Update existing product
            setProducts(prevProducts => prevProducts.map(p =>
                p.id === currentProduct.id
                    ? {
                        ...p,
                        name: productForm.name,
                        price: parseFloat(productForm.price),
                        category: productForm.category,
                        stock: parseInt(productForm.stock)
                    }
                    : p
            ));
            alert('Product updated successfully!');
        } else {
            // Add new product
            const maxProductIdNum = products.reduce((max, p) => Math.max(max, parseInt(p.id.substring(1)) || 0), 0);
            const newProductId = `P${String(maxProductIdNum + 1).padStart(3, '0')}`;

            const newProduct = {
                id: newProductId,
                name: productForm.name,
                price: parseFloat(productForm.price),
                category: productForm.category,
                stock: parseInt(productForm.stock)
            };
            setProducts(prevProducts => [...prevProducts, newProduct]);
            alert('Product added successfully!');
        }

        closeProductModal();
    };

    const deleteProduct = (productIdToDelete) => {
        if (window.confirm(`Are you sure you want to delete product ${productIdToDelete}? This action cannot be undone.`)) {
            // Check if product is part of any existing sales before deleting
            const isProductInSales = sales.some(sale =>
                sale.items.some(item => item.productId === productIdToDelete)
            );

            if (isProductInSales) {
                alert('Cannot delete product: It is associated with existing sales records. Please note, products that have been sold cannot be removed to maintain sales history. You can add a new product and try deleting it to see the functionality.');
                return;
            }

            // Perform the deletion
            setProducts(prevProducts => prevProducts.filter(p => p.id !== productIdToDelete));
            alert(`Product ${productIdToDelete} deleted successfully.`);
        }
    };

    // New function to clear all sales
    const clearAllSalesHistory = () => {
        if (window.confirm('Are you sure you want to delete ALL sales history? This action cannot be undone.')) {
            setSales([]);
            alert('All sales history has been cleared.');
        }
    };


    return (
        <div className="retail-parlour-dashboard">
            <header className="dashboard-header">
                <h1>Dairy Parlour Operations</h1>
                <nav>
                    <button
                        className={activeSection === 'customers' ? 'active' : ''}
                        onClick={() => setActiveSection('customers')}
                    >
                        Customers
                    </button>
                    <button
                        className={activeSection === 'products' ? 'active' : ''}
                        onClick={() => setActiveSection('products')}
                    >
                        Products
                    </button>
                    <button
                        className={activeSection === 'place-order' ? 'active' : ''}
                        onClick={() => setActiveSection('place-order')}
                    >
                        Place Order
                    </button>
                    <button
                        className={activeSection === 'sales' ? 'active' : ''}
                        onClick={() => setActiveSection('sales')}
                    >
                        Sales History
                    </button>
                    <button
                        className={activeSection === 'crm-insights' ? 'active' : ''}
                        onClick={() => setActiveSection('crm-insights')}
                    >
                        Insights
                    </button>
                </nav>
            </header>

            <main className="dashboard-content">
                {/* Customers Tab Content */}
                {activeSection === 'customers' && (
                    <section className="customers-section">
                        <h2>Customer Management</h2>
                        <input
                            type="text"
                            placeholder="Search customers by name, phone, email..."
                            value={customerSearchTerm}
                            onChange={(e) => setCustomerSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <div className="customer-list">
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map(customer => (
                                    <div key={customer.id} className="customer-card" onClick={() => setSelectedCustomer(customer)}>
                                        <h3>{customer.name} ({customer.id})</h3>
                                        <p><strong>Email:</strong> {customer.email}</p>
                                        <p><strong>Phone:</strong> {customer.phone}</p>
                                        <p><strong>Loyalty Points:</strong> {customer.loyaltyPoints}</p>
                                        <button onClick={(e) => { e.stopPropagation(); setSelectedCustomer(customer); }} className="view-details-btn">View Details</button>
                                    </div>
                                ))
                            ) : (
                                <p className="no-data-message">No customers found matching your search.</p>
                            )}
                        </div>

                        {/* Customer Details Modal */}
                        {selectedCustomer && (
                            <div className="customer-details-modal">
                                <div className="modal-content">
                                    <h3>Customer Details: {selectedCustomer.name}</h3>
                                    <p><strong>ID:</strong> {selectedCustomer.id}</p>
                                    <p><strong>Email:</strong> {selectedCustomer.email}</p>
                                    <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
                                    <p><strong>Address:</strong> {selectedCustomer.address}</p>
                                    <p><strong>Loyalty Points:</strong> {selectedCustomer.loyaltyPoints}</p>
                                    <p><strong>Home Parlour:</strong> {getFranchiseById(selectedCustomer.franchiseId)?.name || 'N/A'}</p>


                                    <h4>Purchase History</h4>
                                    {getCustomerSalesHistory(selectedCustomer.id).length > 0 ? (
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Total Amount (₹)</th>
                                                    <th>Items</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {getCustomerSalesHistory(selectedCustomer.id).map(sale => (
                                                    <tr key={sale.id}>
                                                        <td>{sale.date}</td>
                                                        <td>{sale.totalAmount.toFixed(2)}</td>
                                                        <td>
                                                            {sale.items.map(item => {
                                                                const product = getProductById(item.productId);
                                                                return product ? `${product.name} (x${item.qty})` : 'Unknown Product';
                                                            }).join(', ')}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p className="no-data-message">No purchase history for this customer.</p>
                                    )}

                                    <button onClick={() => setSelectedCustomer(null)} className="close-modal-btn">Close</button>
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* Products Tab Content */}
                {activeSection === 'products' && (
                    <section className="products-section">
                        <h2>Dairy Products Available</h2>
                        <button onClick={openAddProductModal} className="add-new-btn">Add New Product</button>
                        <div className="product-list-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Price (₹)</th>
                                        <th>Stock</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.length > 0 ? (
                                        products.map(product => (
                                            <tr key={product.id}>
                                                <td>{product.id}</td>
                                                <td>{product.name}</td>
                                                <td>{product.category}</td>
                                                <td>{product.price.toFixed(2)}</td>
                                                <td>{product.stock}</td>
                                                <td>
                                                    <button onClick={() => openEditProductModal(product)} className="action-btn edit-btn">Edit</button>
                                                    <button onClick={() => deleteProduct(product.id)} className="action-btn delete-btn">Delete</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="6" className="no-data-message">No products available.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Product Add/Edit Modal */}
                        {isProductModalOpen && (
                            <div className="product-modal">
                                <div className="modal-content">
                                    <h3>{currentProduct ? 'Edit Product' : 'Add New Product'}</h3>
                                    <form onSubmit={handleProductSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="productName">Product Name:</label>
                                            <input
                                                type="text"
                                                id="productName"
                                                name="name"
                                                value={productForm.name}
                                                onChange={handleProductFormChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="productPrice">Price (₹):</label>
                                            <input
                                                type="number"
                                                id="productPrice"
                                                name="price"
                                                value={productForm.price}
                                                onChange={handleProductFormChange}
                                                step="0.01"
                                                min="0.01"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="productCategory">Category:</label>
                                            <select
                                                id="productCategory"
                                                name="category"
                                                value={productForm.category}
                                                onChange={handleProductFormChange}
                                                required
                                            >
                                                <option value="">-- Select Category --</option>
                                                {PRODUCT_CATEGORIES.map(category => (
                                                    <option key={category} value={category}>{category}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="productStock">Stock Quantity:</label>
                                            <input
                                                type="number"
                                                id="productStock"
                                                name="stock"
                                                value={productForm.stock}
                                                onChange={handleProductFormChange}
                                                min="0"
                                                required
                                            />
                                        </div>
                                        <div className="modal-actions">
                                            <button type="submit" className="submit-btn">{currentProduct ? 'Update Product' : 'Add Product'}</button>
                                            <button type="button" onClick={closeProductModal} className="cancel-btn">Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* Place Order Tab Content */}
                {activeSection === 'place-order' && (
                    <section className="place-order-section">
                        <h2>Place New Customer Order</h2>
                        <form onSubmit={handlePlaceOrder} className="order-form">
                            <div className="form-group">
                                <label htmlFor="customerSelect">Select Customer:</label>
                                <select
                                    id="customerSelect"
                                    name="customerId"
                                    value={newOrder.customerId}
                                    onChange={(e) => setNewOrder({ ...newOrder, customerId: e.target.value })}
                                    required
                                >
                                    <option value="">-- Select a Customer --</option>
                                    {customers.map(customer => (
                                        <option key={customer.id} value={customer.id}>
                                            {customer.name} ({customer.phone})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <h4>Order Items:</h4>
                            {newOrder.items.map((item, index) => (
                                <div key={index} className="order-item-row">
                                    <div className="form-group">
                                        <label htmlFor={`productSelect-${index}`}>Product:</label>
                                        <select
                                            id={`productSelect-${index}`}
                                            name="productId"
                                            value={item.productId}
                                            onChange={(e) => handleOrderItemChange(e, index)}
                                            required
                                        >
                                            <option value="">-- Select Product --</option>
                                            {products.map(product => (
                                                <option key={product.id} value={product.id} disabled={product.stock <= 0}>
                                                    {product.name} (₹{product.price.toFixed(2)}) - Stock: {product.stock}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group qty-input">
                                        <label htmlFor={`qtyInput-${index}`}>Quantity:</label>
                                        <input
                                            type="number"
                                            id={`qtyInput-${index}`}
                                            name="qty"
                                            value={item.qty}
                                            onChange={(e) => handleOrderItemChange(e, index)}
                                            min="1"
                                            max={item.productId ? getProductById(item.productId)?.stock : 9999} // Max quantity is current stock
                                            required
                                        />
                                    </div>
                                    {newOrder.items.length > 1 && (
                                        <button type="button" onClick={() => removeOrderItem(index)} className="remove-item-btn">
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button type="button" onClick={addOrderItem} className="add-item-btn">
                                Add Another Item
                            </button>

                            <button type="submit" className="place-order-btn">Place Order</button>
                        </form>
                    </section>
                )}

                {/* Sales History Tab Content */}
                {activeSection === 'sales' && (
                    <section className="sales-section">
                        <h2>Overall Sales History</h2>
                        <button onClick={clearAllSalesHistory} className="clear-sales-btn">Clear All Sales History</button>
                        <div className="sales-list-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Sale ID</th>
                                        <th>Customer</th>
                                        <th>Parlour</th>
                                        <th>Date</th>
                                        <th>Total Amount (₹)</th>
                                        <th>Items Purchased</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sales.length > 0 ? (
                                        sales.map(sale => {
                                            const customer = customers.find(c => c.id === sale.customerId);
                                            const parlour = customer ? getFranchiseById(customer.franchiseId) : null;
                                            return (
                                                <tr key={sale.id}>
                                                    <td>{sale.id}</td>
                                                    <td>{customer?.name || 'N/A'}</td>
                                                    <td>{parlour?.name || 'N/A'}</td>
                                                    <td>{sale.date}</td>
                                                    <td>{sale.totalAmount.toFixed(2)}</td>
                                                    <td>
                                                        {sale.items.map(item => {
                                                            const product = getProductById(item.productId);
                                                            return product ? `${product.name} (x${item.qty})` : 'Unknown Product';
                                                        }).join(', ')}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr><td colSpan="6" className="no-data-message">No sales recorded yet.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* CRM Insights Tab Content */}
                {activeSection === 'crm-insights' && (
                    <section className="crm-insights-section">
                        <h2>Insights & Analytics</h2>
                        <div className="insights-grid">
                            {/* Removed 'Top 5 Customers by Spend' bar graph */}
                            <div className="insight-card">
                                <h3>Top 5 Popular Products (by Quantity Sold)</h3>
                                {popularProducts.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart
                                            data={popularProducts.map(p => ({ name: p.name.split(' ')[0], quantity: p.totalQtySold }))}
                                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" interval={0} angle={-30} textAnchor="end" height={60} />
                                            <YAxis label={{ value: 'Quantity Sold', angle: -90, position: 'insideLeft' }} />
                                            <Tooltip formatter={(value) => [`${value} units`, 'Quantity']} />
                                            <Legend />
                                            <Bar dataKey="quantity" fill="#8884d8" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <p className="no-data-message">No sales data to generate insights for products.</p>
                                )}
                            </div>
                            <div className="insight-card">
                                <h3>Daily Sales Trend</h3>
                                {dailySales.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart
                                            data={dailySales}
                                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis label={{ value: 'Sales Amount (₹)', angle: -90, position: 'insideLeft' }} />
                                            <Tooltip formatter={(value) => [`₹${value.toFixed(2)}`, 'Sales']} />
                                            <Legend />
                                            <Line type="monotone" dataKey="amount" stroke="#FF5722" activeDot={{ r: 8 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <p className="no-data-message">No sales data to generate daily sales trend.</p>
                                )}
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default RetailParlour;