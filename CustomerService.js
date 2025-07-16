import React, { useState, useEffect } from 'react';
import './CustomerService.css'; // Import the CSS file

// Mock data with Indian names and dairy-specific details
const mockCustomers = [
    {
        id: 'CUST001',
        name: 'Sharma Dairy Farm',
        contactPerson: 'Anil Sharma',
        phone: '+91 98765 12345',
        email: 'anil.sharma@sharmadairy.com',
        address: 'Plot No. 10, Anand Nagar, Pune, Maharashtra',
        type: 'Wholesale Distributor',
        lastOrderDate: '2025-07-07',
        notes: 'Buys 1000L milk & 200kg paneer weekly. Preferred delivery: Mon/Wed/Fri mornings.'
    },
    {
        id: 'CUST002',
        name: 'Krishna Kirana Store',
        contactPerson: 'Priya Singh',
        phone: '+91 99887 65432',
        email: 'priya.singh@krishnakirana.com',
        address: 'Shop No. 5, Sector 15, Dwarka, Delhi',
        type: 'Retailer',
        lastOrderDate: '2025-07-08',
        notes: 'Regular buyer of various dairy products. Requires chilled delivery.'
    },
    {
        id: 'CUST003',
        name: 'Goyal Sweets & Snacks',
        contactPerson: 'Suresh Goyal',
        phone: '+91 91234 56789',
        email: 'suresh.goyal@goyalsweets.com',
        address: 'B-24, Gandhi Road, Ahmedabad, Gujarat',
        type: 'Confectionery',
        lastOrderDate: '2025-07-06',
        notes: 'Bulk purchaser of Ghee and Khoa. Sensitive to delivery timings due to production schedule.'
    },
    {
        id: 'CUST004',
        name: 'Sai Baba Temple Canteen',
        contactPerson: 'Rajesh Kumar',
        phone: '+91 80123 45678',
        email: 'rajesh.kumar@saitemple.org',
        address: 'Temple Road, Shirdi, Maharashtra',
        type: 'Institutional Buyer',
        lastOrderDate: '2025-07-09',
        notes: 'Daily requirement of milk for Prasad. Needs early morning delivery (by 6 AM).'
    },
    {
        id: 'CUST005',
        name: 'Fresh Dairy Delights Cafe',
        contactPerson: 'Sneha Reddy',
        phone: '+91 77654 32109',
        email: 'sneha.reddy@fddcafe.com',
        address: 'Shop No. 12, Jubilee Hills, Hyderabad, Telangana',
        type: 'Cafe/Restaurant',
        lastOrderDate: '2025-07-07',
        notes: 'Buys fresh cream, butter, and yogurt for beverages and desserts. Quality conscious.'
    },
    {
        id: 'CUST006',
        name: 'Patel Provision Store',
        contactPerson: 'Jignesh Patel',
        phone: '+91 90000 11223',
        email: 'jignesh.patel@patelprovisions.com',
        address: 'Main Bazaar, Vadodara, Gujarat',
        type: 'Retailer',
        lastOrderDate: '2025-07-05',
        notes: 'Small retailer, prefers cash on delivery. Orders vary based on festive seasons.'
    }
];

const mockTickets = [
    {
        id: 'TKT001',
        customerId: 'CUST001',
        subject: 'Spoiled Milk Batch - July 6 Delivery',
        description: 'Mr. Sharma reported 50L milk from yesterday\'s delivery (Batch: MM-20250705-A) smelled sour and curdled. Needs immediate replacement.',
        status: 'Open',
        priority: 'High',
        assignedTo: 'Agent Pooja',
        createdAt: '2025-07-07T11:30:00Z',
        updatedAt: '2025-07-07T11:30:00Z',
        communicationLog: [
            { type: 'note', agent: 'Agent Pooja', timestamp: '2025-07-07T11:35:00Z', content: 'Called Mr. Sharma, apologised. Arranged for pickup of spoiled batch and delivery of fresh 50L milk by 3 PM today.' },
            { type: 'email', agent: 'Agent Pooja', timestamp: '2025-07-07T11:45:00Z', content: 'Sent email confirmation for replacement delivery and quality team investigation.' }
        ]
    },
    {
        id: 'TKT002',
        customerId: 'CUST002',
        subject: 'Billing Discrepancy - June Invoice (Paneer)',
        description: 'Ms. Singh claims invoice #202506-012 shows 10kg paneer charged, but only 8kg was received. Requesting credit note for 2kg difference.',
        status: 'In Progress',
        priority: 'Medium',
        assignedTo: 'Agent Rahul',
        createdAt: '2025-07-06T15:00:00Z',
        updatedAt: '2025-07-07T09:15:00Z',
        communicationLog: [
            { type: 'note', agent: 'Agent Rahul', timestamp: '2025-07-06T15:05:00Z', content: 'Checked delivery records and warehouse dispatch. Found potential discrepancy. Forwarded to billing department for review.' }
        ]
    },
    {
        id: 'TKT003',
        customerId: 'CUST003',
        subject: 'Inquiry about Organic Ghee availability',
        description: 'Mr. Goyal is interested in purchasing organic ghee in bulk for his new product line. Wants to know pricing and supply capacity.',
        status: 'Closed',
        priority: 'Low',
        assignedTo: 'Agent Pooja',
        createdAt: '2025-07-01T10:00:00Z',
        updatedAt: '2025-07-01T11:00:00Z',
        communicationLog: [
            { type: 'note', agent: 'Agent Pooja', timestamp: '2025-07-01T10:15:00Z', content: 'Provided current organic ghee pricing and minimum order quantity. Connected him with Sales Manager, Mr. Verma.' }
        ]
    },
    {
        id: 'TKT004',
        customerId: 'CUST001',
        subject: 'Delivery Delay - July 8 Morning',
        description: 'Mr. Sharma called, his morning delivery was delayed by 2 hours. This impacted his morning distribution. Requesting better punctuality.',
        status: 'Resolved',
        priority: 'Medium',
        assignedTo: 'Agent Rahul',
        createdAt: '2025-07-08T09:00:00Z',
        updatedAt: '2025-07-08T10:30:00Z',
        communicationLog: [
            { type: 'note', agent: 'Agent Rahul', timestamp: '2025-07-08T09:10:00Z', content: 'Checked with logistics, driver reported vehicle issue. Informed customer and confirmed new ETA.' },
            { type: 'note', agent: 'Agent Rahul', timestamp: '2025-07-08T10:20:00Z', content: 'Delivery completed. Customer confirmed receipt. Logged feedback for logistics.' }
        ]
    },
    {
        id: 'TKT005',
        customerId: 'CUST004',
        subject: 'Milk quality feedback for July 9 delivery',
        description: 'Mr. Kumar from Sai Baba Temple Canteen reported milk for today\'s delivery felt slightly less creamy than usual. Not a complaint, just feedback.',
        status: 'Closed',
        priority: 'Low',
        assignedTo: 'Agent Pooja',
        createdAt: '2025-07-09T08:00:00Z',
        updatedAt: '2025-07-09T08:45:00Z',
        communicationLog: [
            { type: 'note', agent: 'Agent Pooja', timestamp: '2025-07-09T08:10:00Z', content: 'Thanked Mr. Kumar for the feedback. Assured him we would check with quality control. No action required for this ticket.' }
        ]
    },
    {
        id: 'TKT006',
        customerId: 'CUST005',
        subject: 'Damaged packaging of Fresh Cream',
        description: 'Ms. Reddy received 5 units of fresh cream with dented packaging, making them unsellable. Requesting replacement or credit.',
        status: 'Open',
        priority: 'High',
        assignedTo: 'Agent Rahul',
        createdAt: '2025-07-09T14:30:00Z',
        updatedAt: '2025-07-09T14:30:00Z',
        communicationLog: [
            { type: 'note', agent: 'Agent Rahul', timestamp: '2025-07-09T14:35:00Z', content: 'Acknowledged issue. Arranged for pick-up and replacement within 4 hours. Notified warehouse team for better handling.' }
        ]
    }
];

const CustomerService = () => {
    const [selectedView, setSelectedView] = useState('tickets');
    const [tickets, setTickets] = useState(mockTickets);
    const [customers, setCustomers] = useState(mockCustomers);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateTicketModal, setShowCreateTicketModal] = useState(false); // New state for modal

    useEffect(() => {
        // In a real app, fetch data from your backend here
        // Example: fetchData('/api/tickets').then(data => setTickets(data));
        // fetchData('/api/customers').then(data => setCustomers(data));
    }, []);

    const handleTicketClick = (ticketId) => {
        const ticket = tickets.find(t => t.id === ticketId);
        setSelectedTicket(ticket);
        setSelectedView('ticketDetail');
    };

    const handleCustomerClick = (customerId) => {
        const customer = customers.find(c => c.id === customerId);
        setSelectedCustomer(customer);
        setSelectedView('customerDetail');
    };

    const handleNewTicket = (newTicketData) => {
        // In a real app, send this to your backend
        const newTicket = {
            id: `TKT${String(tickets.length + 1).padStart(3, '0')}`, // Simple ID generation
            createdAt: new Date().toISOString(),
            status: 'Open',
            priority: 'Medium', // Default
            assignedTo: 'Unassigned',
            communicationLog: [],
            ...newTicketData,
        };
        setTickets([...tickets, newTicket]);
        setShowCreateTicketModal(false); // Close the modal after creation
    };

    const handleUpdateTicket = (updatedTicket) => {
        // In a real app, send this update to your backend
        setTickets(tickets.map(ticket =>
            ticket.id === updatedTicket.id ? updatedTicket : ticket
        ));
        setSelectedTicket(updatedTicket); // Update selected ticket if it's the one being viewed
    };

    const handleAddCommunication = (ticketId, type, content) => {
        const updatedTickets = tickets.map(ticket => {
            if (ticket.id === ticketId) {
                const newLog = {
                    type,
                    agent: 'Current Agent', // Replace with actual logged-in agent
                    timestamp: new Date().toISOString(),
                    content
                };
                return {
                    ...ticket,
                    communicationLog: [...ticket.communicationLog, newLog],
                    updatedAt: new Date().toISOString()
                };
            }
            return ticket;
        });
        setTickets(updatedTickets);
        if (selectedTicket && selectedTicket.id === ticketId) {
            setSelectedTicket(updatedTickets.find(t => t.id === ticketId));
        }
    };


    const filteredTickets = tickets.filter(ticket =>
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customers.find(c => c.id === ticket.customerId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getCustomerName = (customerId) => {
        const customer = customers.find(c => c.id === customerId);
        return customer ? customer.name : 'Unknown Customer';
    };

    // Helper Components (can be moved to separate files in a larger project)
    const TicketListItem = ({ ticket, onClick }) => (
        <div className="ticket-list-item" onClick={() => onClick(ticket.id)}>
            <h3>{ticket.subject}</h3>
            <p>Customer: {getCustomerName(ticket.customerId)}</p>
            <p>Status: <span className={`status-${ticket.status.toLowerCase().replace(/\s/g, '-')}`}>{ticket.status}</span> | Priority: <span className={`priority-${ticket.priority.toLowerCase()}`}>{ticket.priority}</span></p>
            <p className="ticket-meta">Assigned: {ticket.assignedTo} | Created: {new Date(ticket.createdAt).toLocaleDateString('en-IN')}</p>
        </div>
    );

    const TicketDetail = ({ ticket, onBack, onUpdateTicket, onAddCommunication }) => {
        const [status, setStatus] = useState(ticket.status);
        const [priority, setPriority] = useState(ticket.priority);
        const [assignedTo, setAssignedTo] = useState(ticket.assignedTo);
        const [newNote, setNewNote] = useState('');

        const handleSave = () => {
            onUpdateTicket({ ...ticket, status, priority, assignedTo });
        };

        const handleAddNote = () => {
            if (newNote.trim()) {
                onAddCommunication(ticket.id, 'note', newNote);
                setNewNote('');
            }
        };

        const customer = customers.find(c => c.id === ticket.customerId);

        return (
            <div className="ticket-detail">
                <button onClick={onBack} className="back-button">← Back to Tickets</button>
                <h2>Ticket: {ticket.subject} ({ticket.id})</h2>

                <div className="ticket-detail-header">
                    <div className="form-group">
                        <label>Status:</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option>Open</option>
                            <option>In Progress</option>
                            <option>Resolved</option>
                            <option>Closed</option>
                            <option>On Hold</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Priority:</label>
                        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Assigned To:</label>
                        <input type="text" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} />
                    </div>
                    <button onClick={handleSave} className="save-button">Save Changes</button>
                </div>

                <div className="customer-info-section">
                    <h3>Customer Information</h3>
                    {customer ? (
                        <>
                            <p><strong>Name:</strong> {customer.name} ({customer.type})</p>
                            <p><strong>Contact Person:</strong> {customer.contactPerson}</p>
                            <p><strong>Phone:</strong> {customer.phone}</p>
                            <p><strong>Email:</strong> {customer.email}</p>
                            <p><strong>Address:</strong> {customer.address}</p>
                            <p><strong>Last Order:</strong> {customer.lastOrderDate}</p>
                            <p><strong>Notes:</strong> {customer.notes}</p>
                        </>
                    ) : (
                        <p>Customer not found.</p>
                    )}
                </div>

                <div className="ticket-description">
                    <h3>Description</h3>
                    <p>{ticket.description}</p>
                </div>

                <div className="communication-log">
                    <h3>Communication Log</h3>
                    {ticket.communicationLog.length === 0 ? (
                        <p>No communication recorded yet.</p>
                    ) : (
                        <ul>
                            {ticket.communicationLog.map((log, index) => (
                                <li key={index} className={`log-item log-${log.type}`}>
                                    <strong>[{log.type.toUpperCase()}]</strong> {new Date(log.timestamp).toLocaleString('en-IN')}: {log.content} (by {log.agent})
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="add-note-section">
                        <textarea
                            placeholder="Add a new note or communication..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                        ></textarea>
                        <button onClick={handleAddNote}>Add Note</button>
                    </div>
                </div>
            </div>
        );
    };

    // Modal component for Ticket Creation
    const TicketCreationModal = ({ onCreateTicket, onCancel, customers }) => {
        const [customerId, setCustomerId] = useState('');
        const [subject, setSubject] = useState('');
        const [description, setDescription] = useState('');
        const [priority, setPriority] = useState('Medium');

        const handleSubmit = (e) => {
            e.preventDefault();
            if (!customerId || !subject || !description) {
                alert('Please fill all required fields: Customer, Subject, Description.');
                return;
            }
            onCreateTicket({ customerId, subject, description, priority });
            // Clear form
            setCustomerId('');
            setSubject('');
            setDescription('');
            setPriority('Medium');
        };

        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h2>Create New Ticket</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="customerSelect">Customer:</label>
                            <select id="customerSelect" value={customerId} onChange={(e) => setCustomerId(e.target.value)} required>
                                <option value="">-- Select Customer --</option>
                                {customers.map(customer => (
                                    <option key={customer.id} value={customer.id}>{customer.name} ({customer.contactPerson})</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="subject">Subject:</label>
                            <input type="text" id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description:</label>
                            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="priority">Priority:</label>
                            <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
                                <option>High</option>
                                <option>Medium</option>
                                <option>Low</option>
                            </select>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="submit-button">Create Ticket</button>
                            <button type="button" onClick={onCancel} className="cancel-button">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        switch (selectedView) {
            case 'tickets':
                return (
                    <div className="tickets-view">
                        <h2>Customer Support Tickets</h2>
                        <div className="tickets-actions">
                            <input
                                type="text"
                                placeholder="Search tickets by ID, subject, customer..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            <button onClick={() => setShowCreateTicketModal(true)} className="create-ticket-button">
                                + New Ticket
                            </button>
                        </div>
                        <div className="ticket-list">
                            {filteredTickets.length > 0 ? (
                                filteredTickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(ticket => (
                                    <TicketListItem key={ticket.id} ticket={ticket} onClick={handleTicketClick} />
                                ))
                            ) : (
                                <p>No tickets found matching your search.</p>
                            )}
                        </div>
                        {showCreateTicketModal && (
                            <TicketCreationModal
                                onCreateTicket={handleNewTicket}
                                onCancel={() => setShowCreateTicketModal(false)}
                                customers={customers}
                            />
                        )}
                    </div>
                );
            case 'customers':
                return (
                    <div className="customers-view">
                        <h2>Dairy Customer Directory</h2>
                        <input
                            type="text"
                            placeholder="Search customers by name, phone, address..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                            style={{ marginBottom: '20px', width: 'calc(100% - 22px)' }}
                        />
                        <div className="customer-list">
                            {customers.filter(customer =>
                                customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                customer.phone.includes(searchTerm) ||
                                customer.address.toLowerCase().includes(searchTerm.toLowerCase())
                            ).map(customer => (
                                <div key={customer.id} className="customer-card" onClick={() => handleCustomerClick(customer.id)}>
                                    <h3>{customer.name}</h3>
                                    <p>Contact Person: {customer.contactPerson}</p>
                                    <p>Phone: {customer.phone}</p>
                                    <p>Type: {customer.type}</p>
                                </div>
                            ))}
                        </div>
                        {customers.filter(customer =>
                            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            customer.phone.includes(searchTerm) ||
                            customer.address.toLowerCase().includes(searchTerm.toLowerCase())
                        ).length === 0 && <p>No customers found matching your search.</p>}
                    </div>
                );
            case 'ticketDetail':
                return selectedTicket ? (
                    <TicketDetail
                        ticket={selectedTicket}
                        onBack={() => setSelectedView('tickets')}
                        onUpdateTicket={handleUpdateTicket}
                        onAddCommunication={handleAddCommunication}
                    />
                ) : (
                    <p>Select a ticket to view details.</p>
                );
            case 'customerDetail':
                return selectedCustomer ? (
                    <div className="customer-detail">
                        <button onClick={() => setSelectedView('customers')} className="back-button">← Back to Customers</button>
                        <h2>Customer Profile: {selectedCustomer.name}</h2>
                        <div className="customer-profile-details">
                            <p><strong>Contact Person:</strong> {selectedCustomer.contactPerson}</p>
                            <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
                            <p><strong>Email:</strong> {selectedCustomer.email}</p>
                            <p><strong>Address:</strong> {selectedCustomer.address}</p>
                            <p><strong>Customer Type:</strong> {selectedCustomer.type}</p>
                            <p><strong>Last Order Date:</strong> {selectedCustomer.lastOrderDate}</p>
                            <p><strong>Notes:</strong> {selectedCustomer.notes}</p>
                        </div>

                        <h3>Associated Tickets for {selectedCustomer.name}</h3>
                        <div className="ticket-list">
                            {tickets.filter(t => t.customerId === selectedCustomer.id).length > 0 ? (
                                tickets.filter(t => t.customerId === selectedCustomer.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(ticket => (
                                    <TicketListItem key={ticket.id} ticket={ticket} onClick={handleTicketClick} />
                                ))
                            ) : (
                                <p>No support tickets recorded for this customer.</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <p>Select a customer to view details.</p>
                );
            default:
                return null;
        }
    };

    return (
        <div className="customer-service-module">
            {/* Top Navigation Bar */}
            <nav className="navbar">
                <ul className="navbar-nav">
                    <li className={selectedView === 'tickets' || selectedView === 'ticketDetail' || showCreateTicketModal ? 'active' : ''} onClick={() => { setSelectedView('tickets'); setShowCreateTicketModal(false); }}>Support Tickets</li>
                    <li className={selectedView === 'customers' || selectedView === 'customerDetail' ? 'active' : ''} onClick={() => { setSelectedView('customers'); setShowCreateTicketModal(false); }}>Customer Profiles</li>
                </ul>
            </nav>
            <main className="content-wrapper"> {/* Wrapper for main content */}
                {renderContent()}
            </main>
        </div>
    );
};

export default CustomerService;