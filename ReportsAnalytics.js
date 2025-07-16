import React, { useMemo } from 'react';
import './ReportAnalytics.css';

const ReportsAndAnalytics = ({ customers, tickets }) => {

    // --- Data Processing Functions (Memoized for performance) ---

    // Ensure customers and tickets are arrays before processing
    // This is a defensive check, though the parent component should ensure they are.
    const safeCustomers = customers || [];
    const safeTickets = tickets || [];

    // KPI Calculations
    const totalCustomers = useMemo(() => safeCustomers.length, [safeCustomers]);
    const totalTickets = useMemo(() => safeTickets.length, [safeTickets]);
    const openTickets = useMemo(() => safeTickets.filter(t => t.status === 'Open').length, [safeTickets]);
    const inProgressTickets = useMemo(() => safeTickets.filter(t => t.status === 'In Progress').length, [safeTickets]);
    const resolvedTickets = useMemo(() => safeTickets.filter(t => t.status === 'Resolved').length, [safeTickets]);
    const closedTickets = useMemo(() => safeTickets.filter(t => t.status === 'Closed').length, [safeTickets]);

    // Mock Average Resolution Time (needs real timestamps and 'resolved' status in a real app)
    const avgResolutionTime = useMemo(() => {
        const resolved = safeTickets.filter(t => t.status === 'Resolved' || t.status === 'Closed');
        if (resolved.length === 0) return 'N/A';

        let totalDurationHours = 0;
        resolved.forEach(ticket => {
            const created = new Date(ticket.createdAt);
            const updated = new Date(ticket.updatedAt); // Using updatedAt as resolution time for simplicity
            if (updated > created) {
                totalDurationHours += (updated - created) / (1000 * 60 * 60); // Difference in hours
            }
        });
        const avgHours = totalDurationHours / resolved.length;
        if (avgHours < 24) {
            return `${avgHours.toFixed(1)} hours`;
        } else {
            return `${(avgHours / 24).toFixed(1)} days`;
        }
    }, [safeTickets]);

    // Customer Distribution by Type
    const customerTypeDistribution = useMemo(() => {
        const distribution = {};
        safeCustomers.forEach(customer => {
            distribution[customer.type] = (distribution[customer.type] || 0) + 1;
        });
        return Object.entries(distribution).map(([type, count]) => ({ type, count }));
    }, [safeCustomers]);

    // Tickets by Status
    const ticketsByStatus = useMemo(() => {
        const statusCounts = {};
        safeTickets.forEach(ticket => {
            statusCounts[ticket.status] = (statusCounts[ticket.status] || 0) + 1;
        });
        // Ensure all possible statuses are present, even if 0
        const allStatuses = ['Open', 'In Progress', 'Resolved', 'Closed', 'On Hold'];
        return allStatuses.map(status => ({
            status,
            count: statusCounts[status] || 0
        }));
    }, [safeTickets]);

    // Tickets by Priority
    const ticketsByPriority = useMemo(() => {
        const priorityCounts = {};
        safeTickets.forEach(ticket => {
            priorityCounts[ticket.priority] = (priorityCounts[ticket.priority] || 0) + 1;
        });
        const allPriorities = ['High', 'Medium', 'Low'];
        return allPriorities.map(priority => ({
            priority,
            count: priorityCounts[priority] || 0
        }));
    }, [safeTickets]);

    // Top Customers by Number of Tickets
    const topCustomersByTickets = useMemo(() => {
        const customerTicketCounts = {};
        safeTickets.forEach(ticket => {
            customerTicketCounts[ticket.customerId] = (customerTicketCounts[ticket.customerId] || 0) + 1;
        });

        return Object.entries(customerTicketCounts)
            .map(([customerId, count]) => ({
                customer: safeCustomers.find(c => c.id === customerId)?.name || `Unknown (${customerId})`,
                count
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5); // Top 5
    }, [safeCustomers, safeTickets]);

    // Agent Performance
    const agentPerformance = useMemo(() => {
        const agentCounts = {};
        safeTickets.forEach(ticket => {
            agentCounts[ticket.assignedTo] = (agentCounts[ticket.assignedTo] || 0) + 1;
        });
        return Object.entries(agentCounts).map(([agent, count]) => ({ agent, count }));
    }, [safeTickets]);

    // Simple Bar Chart Component
    const BarChart = ({ data, valueKey, labelKey, barClassPrefix = '' }) => {
        if (!data || data.length === 0) return <p className="no-data-message">No data to display.</p>;
        const maxCount = Math.max(...data.map(item => item[valueKey]));
        return (
            <div className="bar-chart">
                {data.map((item, index) => (
                    <div className="bar-item" key={index}>
                        <div className="bar-label">{item[labelKey]}</div>
                        <div
                            className={`bar ${barClassPrefix}${String(item[labelKey]).toLowerCase().replace(/\s/g, '-')}`}
                            style={{ width: `${(item[valueKey] / maxCount) * 80}%` }} // Max width 80%
                            title={`${item[labelKey]}: ${item[valueKey]}`}
                        >
                            {item[valueKey]}
                        </div>
                        <span className="bar-value">{item[valueKey]}</span>
                    </div>
                ))}
            </div>
        );
    };

    // Simple Pie Chart (for visual effect, not actual proportions with segments)
    const PieChart = ({ data, valueKey, labelKey, colors }) => {
        if (!data || data.length === 0) return <p className="no-data-message">No data for pie chart.</p>;

        const total = data.reduce((sum, item) => sum + item[valueKey], 0);
        let currentAngle = 0;
        const conicGradientParts = data.map((item, index) => {
            const percentage = item[valueKey] / total;
            const startAngle = currentAngle;
            const endAngle = currentAngle + percentage * 360;
            currentAngle = endAngle;
            const color = colors[index % colors.length];
            return `${color} ${startAngle}deg ${endAngle}deg`;
        }).join(', ');

        return (
            <div className="pie-chart-container">
                <div className="pie-chart" style={{ background: `conic-gradient(${conicGradientParts})` }}></div>
                <ul className="pie-chart-legend">
                    {data.map((item, index) => (
                        <li key={index}>
                            <span className="pie-chart-legend-color" style={{ backgroundColor: colors[index % colors.length] }}></span>
                            {item[labelKey]}: {item[valueKey]} ({(item[valueKey] / total * 100).toFixed(1)}%)
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    const customerTypeColors = ['#4CAF50', '#2196F3', '#FFC107', '#E91E63', '#9C27B0', '#00BCD4']; // Example colors

    return (
        <div className="reports-container">
            <h2>Reports & Analytics Dashboard</h2>

            <div className="report-section">
                <h3>Overall Performance At a Glance</h3>
                <div className="kpi-grid">
                    <div className="kpi-card">
                        <h4>Total Customers</h4>
                        <p>{totalCustomers}</p>
                    </div>
                    <div className="kpi-card">
                        <h4>Total Tickets</h4>
                        <p>{totalTickets}</p>
                    </div>
                    <div className="kpi-card">
                        <h4>Open Tickets</h4>
                        <p>{openTickets}</p>
                    </div>
                    <div className="kpi-card">
                        <h4>In Progress Tickets</h4>
                        <p>{inProgressTickets}</p>
                    </div>
                    <div className="kpi-card">
                        <h4>Resolved/Closed Tickets</h4>
                        <p>{resolvedTickets + closedTickets}</p>
                    </div>
                    <div className="kpi-card">
                        <h4>Avg. Ticket Resolution Time</h4>
                        <p>{avgResolutionTime}</p>
                    </div>
                </div>
            </div>

            <div className="report-section">
                <h3>Customer Insights</h3>
                <div className="chart-container">
                    <h4>Customer Distribution by Type</h4>
                    {customerTypeDistribution.length > 0 ? (
                        <PieChart
                            data={customerTypeDistribution}
                            valueKey="count"
                            labelKey="type"
                            colors={customerTypeColors}
                        />
                    ) : (
                        <p className="no-data-message">No customer type data available.</p>
                    )}
                </div>

                <div className="chart-container" style={{ marginTop: '30px' }}>
                    <h4>Top Customers by Ticket Volume</h4>
                    {topCustomersByTickets.length > 0 ? (
                        <ul className="report-list">
                            {topCustomersByTickets.map((item, index) => (
                                <li key={index}><strong>{item.customer}</strong>: {item.count} tickets</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-data-message">No ticket data to determine top customers.</p>
                    )}
                </div>

                 <div className="chart-container" style={{ marginTop: '30px' }}>
                    <h4>Customers by Last Order Date (Recent First)</h4>
                    {safeCustomers.length > 0 ? (
                        <ul className="report-list">
                            {safeCustomers.sort((a, b) => new Date(b.lastOrderDate) - new Date(a.lastOrderDate)).map(customer => (
                                <li key={customer.id}>
                                    <strong>{customer.name}</strong> - Last Ordered: {new Date(customer.lastOrderDate).toLocaleDateString('en-IN')}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-data-message">No customer data available.</p>
                    )}
                </div>
            </div>

            <div className="report-section">
                <h3>Ticket Insights</h3>
                <div className="chart-container">
                    <h4>Tickets by Status</h4>
                    {ticketsByStatus.length > 0 ? (
                        <BarChart
                            data={ticketsByStatus}
                            valueKey="count"
                            labelKey="status"
                            barClassPrefix="bar-status-"
                        />
                    ) : (
                        <p className="no-data-message">No ticket status data available.</p>
                    )}
                </div>

                <div className="chart-container" style={{ marginTop: '30px' }}>
                    <h4>Tickets by Priority</h4>
                    {ticketsByPriority.length > 0 ? (
                        <BarChart
                            data={ticketsByPriority}
                            valueKey="count"
                            labelKey="priority"
                            barClassPrefix="bar-priority-"
                        />
                    ) : (
                        <p className="no-data-message">No ticket priority data available.</p>
                    )}
                </div>

                <div className="chart-container" style={{ marginTop: '30px' }}>
                    <h4>Tickets Assigned Per Agent</h4>
                    {agentPerformance.length > 0 ? (
                        <BarChart
                            data={agentPerformance}
                            valueKey="count"
                            labelKey="agent"
                        />
                    ) : (
                        <p className="no-data-message">No agent assignment data available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportsAndAnalytics;