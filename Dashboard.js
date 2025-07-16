// CRMDashboard/Dashboard.js
import React from 'react';
import './Dashboard.css';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const dummyData = {
    totalRevenue: '₹550 Cr',
    revenueChange: '+8.5%',
    newCustomers: '15,200',
    churnRate: '0.8%',
    onTimeDelivery: '98.7%',
    delayedDeliveries: 12,
    dailyMilkCollection: '1.8 M Liters',
    avgMilkQuality: 'Good',
    customerSatisfaction: '4.7/5',
    employeeProductivity: '92%',
    wastageRate: '1.5%',

    productCategories: [
        { name: 'Milk', value: 45 },
        { name: 'Curd', value: 20 },
        { name: 'Ghee', value: 10 },
        { name: 'Ice Cream', value: 8 },
        { name: 'Value-Added', value: 17 }
    ],
    salesByState: [
        { state: 'Karnataka', value: 150 },
        { state: 'Telangana', value: 120 },
        { state: 'Andhra Pradesh', value: 100 },
        { state: 'Tamil Nadu', value: 90 },
        { state: 'Maharashtra', value: 40 },
        { state: 'Other', value: 50 }
    ],
    alerts: [
        { id: 1, type: 'Production', message: 'Plant 3 - Quality Hold on Batch #12345', severity: 'High' },
        { id: 2, type: 'Logistics', message: 'Delivery Route D-05 delayed by 2 hours', severity: 'Medium' },
        { id: 3, type: 'Procurement', message: 'Low FAT/SNF reported at Chilling Center #12', severity: 'Medium' },
        { id: 4, type: 'Sales', message: 'Sales target for Week 24 below projection', severity: 'Low' },
        { id: 5, type: 'Quality', message: 'Batch 56789 - pH level out of spec', severity: 'High' }
    ]
};

const Dashboard = () => {
    const productCategoryData = {
        labels: dummyData.productCategories.map(p => p.name),
        datasets: [{
            data: dummyData.productCategories.map(p => p.value),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
        }]
    };

    const salesByStateData = {
        labels: dummyData.salesByState.map(s => s.state),
        datasets: [{
            label: 'Sales (₹ Cr)',
            data: dummyData.salesByState.map(s => s.value),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            tooltip: { mode: 'index', intersect: false },
        },
    };

    return (
        <div className="dashboard-overview">
            <div className="welcome-card">
                <h2>Welcome! to the Dashboard</h2>
                <p>Dive deep into your operations with these insightful metrics and visualizations.</p>
            </div>

            <div className="kpi-cards-grid">
                <div className="kpi-card">
                    <h3>Total Revenue (YTD)</h3>
                    <div className="card-content">
                        <p className="kpi-value">{dummyData.totalRevenue}</p>
                        <p className="kpi-sub-value">vs Last Year: <span className="positive">{dummyData.revenueChange}</span></p>
                    </div>
                </div>

                 <div className="kpi-card">
                    <h3>Customer Growth</h3>
                    <div className="card-content">
                        <p className="kpi-value">{dummyData.newCustomers}</p>
                        <p className="kpi-sub-value">New (Last 30 Days) | Churn: <span className="negative">{dummyData.churnRate}</span></p>
                    </div>
                </div>

                <div className="kpi-card">
                    <h3>On-Time Delivery Rate</h3>
                    <div className="card-content">
                        <p className="kpi-value">{dummyData.onTimeDelivery}</p>
                        <p className="kpi-sub-value">Delayed Today: <span className="negative">{dummyData.delayedDeliveries}</span></p>
                    </div>
                </div>

                <div className="kpi-card">
                    <h3>Daily Milk Collection</h3>
                    <div className="card-content">
                         <p className="kpi-value">{dummyData.dailyMilkCollection}</p>
                        <p className="kpi-sub-value">Avg. Quality: {dummyData.avgMilkQuality}</p>
                    </div>
                </div>
            </div>

            {/* Main Charts & Alerts Section Layout */}
            <div className="charts-and-alerts-container">
                {/* Left Column: Sales Bar Chart + Extra Data Cards */}
                <div className="left-column-content">
                    <div className="chart-card">
                        <h3>Sales Performance by State/Region</h3>
                        <div className="chart-container">
                            <Bar data={salesByStateData} options={chartOptions} />
                        </div>
                    </div>

                    {/* Extra data cards to fill space */}
                    <div className="kpi-card extra-data-card">
                        <h3>Customer Satisfaction</h3>
                        <div className="card-content">
                            <p className="kpi-value positive">{dummyData.customerSatisfaction}</p>
                            <p className="kpi-sub-value">Based on latest surveys</p>
                        </div>
                    </div>

                    <div className="kpi-card extra-data-card">
                        <h3>Employee Productivity</h3>
                        <div className="card-content">
                            <p className="kpi-value">{dummyData.employeeProductivity}</p>
                            <p className="kpi-sub-value">Average across all units</p>
                        </div>
                    </div>

                    <div className="kpi-card extra-data-card">
                        <h3>Wastage Rate</h3>
                        <div className="card-content">
                            <p className="kpi-value negative">{dummyData.wastageRate}</p>
                            <p className="kpi-sub-value">Current production cycle</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Alerts + Revenue Pie Chart */}
                <div className="right-column-content">
                    <div className="alerts-section chart-card"> {/* Alerts take the top right spot */}
                        <h3>Key Alerts & Notifications</h3>
                        <div className="alerts-list">
                            {dummyData.alerts.length > 0 ? (
                                dummyData.alerts.map(alert => (
                                    <div key={alert.id} className={`alert-item alert-${alert.severity.toLowerCase()}`}>
                                        <span className="alert-type">[{alert.type}]</span> {alert.message}
                                        <span className="alert-severity">{alert.severity}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="no-alerts">No critical alerts at this time.</p>
                            )}
                        </div>
                    </div>

                    <div className="chart-card large-chart-card"> {/* Pie chart moves to bottom right */}
                        <h3>Revenue Breakdown by Product Category</h3>
                        <div className="chart-container">
                            <Pie data={productCategoryData} options={chartOptions} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;