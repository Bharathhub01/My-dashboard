// src/Production.js
import React, { useState, useEffect, useMemo } from 'react';
import './Production.css';

// --- Mock Data Simulation ---
// This would typically come from a backend API
const mockProducts = [
    { id: 'PROD001', name: 'Milk 500ml', type: 'Milk', unit: 'Liters' }, // Renamed from Standard Milk
    { id: 'PROD002', name: 'UHT Milk 1L', type: 'UHT Milk', unit: 'Liters' },
    { id: 'PROD003', name: 'Curd 1kg', type: 'Curd', unit: 'Kgs' },
    { id: 'PROD004', name: 'Buttermilk 500ml', type: 'Buttermilk', unit: 'Liters' },
    { id: 'PROD005', name: 'Ice Cream 1L', type: 'Ice Cream', unit: 'Liters' },
    { id: 'PROD006', name: 'Lassi 200ml', type: 'Lassi', unit: 'Liters' },
    { id: 'PROD007', name: 'Flavoured Milk 200ml (Chocolate)', type: 'Flavoured Milk', unit: 'Liters' },
    { id: 'PROD008', name: 'Sweet Box 250g', type: 'Sweets', unit: 'Kgs' },
    { id: 'PROD009', name: 'Paneer 500g', type: 'Paneer', unit: 'Kgs' },
    { id: 'PROD010', name: 'Ghee 200ml', type: 'Ghee', unit: 'Liters' },
];

let mockProductionBatches = [
    // ... (existing mock production batches - you might want to adjust productId here
    // for existing batches if you want them to link to new products, or leave as is if
    // they represent older products. For now, I'll assume they link to the first few.)
    {
        id: 'PB001',
        productId: 'PROD001', // Changed from PROD001 to match new Milk product
        batchNumber: 'MILK-20250623-001',
        productionDate: '2025-06-23',
        quantityProduced: 1500,
        status: 'Completed',
        notes: 'Morning shift production',
        qualityCheckId: 'QC001', // Link to a quality check
    },
    {
        id: 'PB002',
        productId: 'PROD003', // Changed from PROD002 to match new Curd product
        batchNumber: 'CURD-20250623-001',
        productionDate: '2025-06-23',
        quantityProduced: 300,
        status: 'Completed',
        notes: 'First curd batch of the day',
        qualityCheckId: 'QC002',
    },
    {
        id: 'PB003',
        productId: 'PROD001', // Changed from PROD001 to match new Milk product
        batchNumber: 'MILK-20250622-002',
        productionDate: '2025-06-22',
        quantityProduced: 1200,
        status: 'Completed',
        notes: 'Previous day evening shift',
        qualityCheckId: 'QC003',
    },
    {
        id: 'PB004',
        productId: 'PROD009', // Changed from PROD004 to match new Paneer product
        batchNumber: 'PANEER-20250623-001',
        productionDate: '2025-06-23',
        quantityProduced: 150,
        status: 'In Progress',
        notes: 'Currently processing',
        qualityCheckId: null, // Not yet linked to QC
    },
    {
        id: 'PB005',
        productId: 'PROD002', // UHT Milk
        batchNumber: 'UHTM-20250624-001',
        productionDate: '2025-06-24',
        quantityProduced: 800,
        status: 'Completed',
        notes: 'Evening UHT milk batch',
        qualityCheckId: 'QC004',
    },
    {
        id: 'PB006',
        productId: 'PROD004', // Buttermilk
        batchNumber: 'BTLK-20250624-001',
        productionDate: '2025-06-24',
        quantityProduced: 500,
        status: 'In Progress',
        notes: 'Buttermilk for morning delivery',
        qualityCheckId: null,
    },
    {
        id: 'PB007',
        productId: 'PROD010', // Ghee
        batchNumber: 'GHEE-20250622-001',
        productionDate: '2025-06-22',
        quantityProduced: 50,
        status: 'Completed',
        notes: 'Special Ghee batch',
        qualityCheckId: 'QC005',
    },
];

let mockQualityChecks = [
    // ... (existing mock quality checks - you might need to adjust batchId here
    // or add new ones to correspond to the new production batches)
    {
        id: 'QC001',
        batchId: 'PB001', // For Milk
        checkDate: '2025-06-23',
        checkedBy: 'QA_Alice',
        parameters: {
            Fat: 3.5, // Changed to "Fat" to match the helper function's expectations
            SNF: 8.5,
            Acidity: 0.14,
            BacteriaCount: 'Low',
        },
        result: 'Passed',
        notes: 'Meets all standards',
    },
    {
        id: 'QC002',
        batchId: 'PB002', // For Curd
        checkDate: '2025-06-23',
        checkedBy: 'QA_Bob',
        parameters: {
            Texture: 'Smooth',
            pH: 4.5,
            ShelfLife: '7 days',
        },
        result: 'Passed',
        notes: 'Good consistency and taste',
    },
    {
        id: 'QC003',
        batchId: 'PB003', // For Milk
        checkDate: '2025-06-22',
        checkedBy: 'QA_Alice',
        parameters: {
            Fat: 3.4,
            SNF: 8.6,
            Acidity: 0.15,
            BacteriaCount: 'Normal',
        },
        result: 'Passed with minor deviation',
        notes: 'Fat content slightly lower than target',
    },
    {
        id: 'QC004',
        batchId: 'PB005', // For UHT Milk
        checkDate: '2025-06-24',
        checkedBy: 'QA_Charlie',
        parameters: {
            Fat: 3.2,
            SNF: 8.4,
            Acidity: 0.13,
            Sterility: 'Passed',
        },
        result: 'Passed',
        notes: 'UHT process confirmed.',
    },
    {
        id: 'QC005',
        batchId: 'PB007', // For Ghee
        checkDate: '2025-06-22',
        checkedBy: 'QA_Alice',
        parameters: {
            Appearance: 'Golden',
            Flavor: 'Rich',
            MoistureContent: 0.2,
        },
        result: 'Passed',
        notes: 'Excellent quality ghee.',
    },
];
// --- End Mock Data Simulation ---

const Production = () => {
    const [products, setProducts] = useState([]);
    const [productionBatches, setProductionBatches] = useState([]);
    const [qualityChecks, setQualityChecks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBatch, setSelectedBatch] = useState(null); // For modal
    const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
    const [isQualityModalOpen, setIsQualityModalOpen] = useState(false);
    const [selectedQualityCheck, setSelectedQualityCheck] = useState(null);

    // --- New State for Editing ---
    const [isEditingBatch, setIsEditingBatch] = useState(false);
    const [editingBatchData, setEditingBatchData] = useState(null); // Holds data for the batch being edited

    const [isEditingQualityCheck, setIsEditingQualityCheck] = useState(false);
    const [editingQualityCheckData, setEditingQualityCheckData] = useState(null); // Holds data for the QC being edited

    // --- New State for Filtering & Sorting ---
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterProductType, setFilterProductType] = useState('All');
    const [sortBy, setSortBy] = useState('productionDate'); // Default sort
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

    // State for new batch form
    const [newBatch, setNewBatch] = useState({
        productId: '',
        quantityProduced: '',
        productionDate: new Date().toISOString().split('T')[0],
        status: 'In Progress',
        notes: ''
    });

    // State for new quality check form
    const [newQualityCheck, setNewQualityCheck] = useState({
        batchId: '',
        checkedBy: '',
        checkDate: new Date().toISOString().split('T')[0],
        parameters: {}, // Dynamic parameters based on product type
        result: '',
        notes: ''
    });

    useEffect(() => {
        // Simulate API calls
        setTimeout(() => {
            setProducts(mockProducts);
            setProductionBatches(mockProductionBatches);
            setQualityChecks(mockQualityChecks);
        }, 500);
    }, []);

    // Helper to get product name from ID
    const getProductName = (productId) => {
        const product = products.find(p => p.id === productId);
        return product ? product.name : 'Unknown Product';
    };

    // Helper to get product unit from ID
    const getProductUnit = (productId) => {
        const product = products.find(p => p.id === productId);
        return product ? product.unit : '';
    };

    // Helper to get product type from ID
    const getProductType = (productId) => {
        const product = products.find(p => p.id === productId);
        return product ? product.type : '';
    };

    // --- Batch Form Handlers ---
    const handleBatchFormChange = (e) => {
        const { name, value } = e.target;
        setNewBatch(prev => ({ ...prev, [name]: value }));
    };

    const handleAddBatch = (e) => {
        e.preventDefault();
        if (!newBatch.productId || !newBatch.quantityProduced || !newBatch.productionDate) {
            alert('Please fill all required fields for production batch.');
            return;
        }

        const quantity = parseFloat(newBatch.quantityProduced);
        if (isNaN(quantity) || quantity <= 0) {
            alert('Quantity produced must be a positive number.');
            return;
        }

        const newBatchEntry = {
            id: `PB${Date.now()}`,
            productId: newBatch.productId,
            // Generate batch number based on product type and date
            batchNumber: `${getProductType(newBatch.productId).toUpperCase().substring(0, 4)}-${newBatch.productionDate.replace(/-/g, '')}-${String(mockProductionBatches.length + 1).padStart(3, '0')}`,
            productionDate: newBatch.productionDate,
            quantityProduced: quantity,
            status: newBatch.status,
            notes: newBatch.notes,
            qualityCheckId: null,
        };

        mockProductionBatches.unshift(newBatchEntry); // Add to mock data at the beginning
        setProductionBatches([...mockProductionBatches]);
        setNewBatch({
            productId: '',
            quantityProduced: '',
            productionDate: new Date().toISOString().split('T')[0],
            status: 'In Progress',
            notes: ''
        });
        alert('Production batch added successfully!');
    };

    // --- Quality Check Form Handlers ---
    const handleQualityFormChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('param_')) {
            const paramName = name.split('_')[1];
            setNewQualityCheck(prev => ({
                ...prev,
                parameters: {
                    ...prev.parameters,
                    [paramName]: value
                }
            }));
        } else {
            setNewQualityCheck(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAddQualityCheck = (e) => {
        e.preventDefault();
        if (!newQualityCheck.batchId || !newQualityCheck.checkedBy || !newQualityCheck.result) {
            alert('Please fill all required fields for quality check.');
            return;
        }

        const targetBatch = productionBatches.find(b => b.id === newQualityCheck.batchId);
        if (!targetBatch) {
            alert('Selected batch not found.');
            return;
        }

        const newQCEntry = {
            id: `QC${Date.now()}`,
            batchId: newQualityCheck.batchId,
            checkDate: newQualityCheck.checkDate,
            checkedBy: newQualityCheck.checkedBy,
            parameters: newQualityCheck.parameters,
            result: newQualityCheck.result,
            notes: newQualityCheck.notes,
        };

        mockQualityChecks.unshift(newQCEntry); // Add to mock data at the beginning
        setQualityChecks([...mockQualityChecks]);

        // Update the production batch to link the quality check
        const updatedBatches = mockProductionBatches.map(batch =>
            batch.id === newQCEntry.batchId ? { ...batch, qualityCheckId: newQCEntry.id, status: newQCEntry.result.includes('Passed') ? 'Completed' : 'Quality Issue' } : batch
        );
        mockProductionBatches = updatedBatches; // Update mock data reference
        setProductionBatches(updatedBatches);

        setNewQualityCheck({
            batchId: '',
            checkedBy: '',
            checkDate: new Date().toISOString().split('T')[0],
            parameters: {},
            result: '',
            notes: ''
        });
        alert('Quality check added successfully!');
    };

    // --- Delete Functionality ---
    const handleDeleteBatch = (batchId) => {
        if (window.confirm('Are you sure you want to delete this production batch? This will also delete any associated quality checks.')) {
            // Remove associated quality checks first
            mockQualityChecks = mockQualityChecks.filter(qc => qc.batchId !== batchId);
            setQualityChecks([...mockQualityChecks]);

            // Then remove the production batch
            mockProductionBatches = mockProductionBatches.filter(batch => batch.id !== batchId);
            setProductionBatches([...mockProductionBatches]);

            // Close modal if the deleted batch was open
            if (selectedBatch && selectedBatch.id === batchId) {
                closeBatchModal();
            }
            alert('Production batch and associated quality checks deleted successfully!');
        }
    };

    const handleDeleteQualityCheck = (qcId, batchId) => {
        if (window.confirm('Are you sure you want to delete this quality check?')) {
            // Remove the quality check
            mockQualityChecks = mockQualityChecks.filter(qc => qc.id !== qcId);
            setQualityChecks([...mockQualityChecks]);

            // Unlink the quality check from the production batch
            const updatedBatches = mockProductionBatches.map(batch =>
                batch.id === batchId ? { ...batch, qualityCheckId: null, status: 'In Progress' } : batch // Revert status or set to 'In Progress' if QC is removed
            );
            mockProductionBatches = updatedBatches; // Update mock data reference
            setProductionBatches(updatedBatches);

            // Close modal if the deleted QC was open
            if (selectedQualityCheck && selectedQualityCheck.id === qcId) {
                closeQualityModal();
            }
            alert('Quality check deleted successfully!');
        }
    };

    // --- Editing Handlers ---
    const startEditingBatch = (batch) => {
        setEditingBatchData({ ...batch }); // Copy data to editing state
        setIsEditingBatch(true);
        setIsBatchModalOpen(true); // Open the modal in edit mode
    };

    const handleEditBatchFormChange = (e) => {
        const { name, value } = e.target;
        setEditingBatchData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateBatch = (e) => {
        e.preventDefault();
        if (!editingBatchData.productId || !editingBatchData.quantityProduced || !editingBatchData.productionDate) {
            alert('Please fill all required fields for production batch.');
            return;
        }

        const quantity = parseFloat(editingBatchData.quantityProduced);
        if (isNaN(quantity) || quantity <= 0) {
            alert('Quantity produced must be a positive number.');
            return;
        }

        const updatedBatches = mockProductionBatches.map(batch =>
            batch.id === editingBatchData.id ? { ...editingBatchData, quantityProduced: quantity } : batch
        );
        mockProductionBatches = updatedBatches;
        setProductionBatches(updatedBatches);
        setIsEditingBatch(false);
        setEditingBatchData(null);
        closeBatchModal(); // Close modal after update
        alert('Production batch updated successfully!');
    };

    const startEditingQualityCheck = (qc) => {
        setEditingQualityCheckData({ ...qc }); // Copy data to editing state
        setIsEditingQualityCheck(true);
        setIsQualityModalOpen(true); // Open the modal in edit mode
    };

    const handleEditQualityCheckFormChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('param_')) {
            const paramName = name.split('_')[1];
            setEditingQualityCheckData(prev => ({
                ...prev,
                parameters: {
                    ...prev.parameters,
                    [paramName]: value
                }
            }));
        } else {
            setEditingQualityCheckData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleUpdateQualityCheck = (e) => {
        e.preventDefault();
        if (!editingQualityCheckData.batchId || !editingQualityCheckData.checkedBy || !editingQualityCheckData.result) {
            alert('Please fill all required fields for quality check.');
            return;
        }

        const updatedQualityChecks = mockQualityChecks.map(qc =>
            qc.id === editingQualityCheckData.id ? { ...editingQualityCheckData } : qc
        );
        mockQualityChecks = updatedQualityChecks;
        setQualityChecks(updatedQualityChecks);

        // Also update the status of the linked batch if the QC result changed
        const updatedBatches = mockProductionBatches.map(batch =>
            batch.id === editingQualityCheckData.batchId
                ? { ...batch, status: editingQualityCheckData.result.includes('Passed') ? 'Completed' : 'Quality Issue' }
                : batch
        );
        mockProductionBatches = updatedBatches;
        setProductionBatches(updatedBatches);


        setIsEditingQualityCheck(false);
        setEditingQualityCheckData(null);
        closeQualityModal(); // Close modal after update
        alert('Quality check updated successfully!');
    };


    // --- Modals Handlers ---
    const openBatchModal = (batch) => {
        setSelectedBatch(batch);
        setIsBatchModalOpen(true);
        setIsEditingBatch(false); // Ensure not in edit mode when opening
    };

    const closeBatchModal = () => {
        setIsBatchModalOpen(false);
        setSelectedBatch(null);
        setIsEditingBatch(false);
        setEditingBatchData(null); // Clear editing data
    };

    const openQualityModal = (qc) => {
        setSelectedQualityCheck(qc);
        setIsQualityModalOpen(true);
        setIsEditingQualityCheck(false); // Ensure not in edit mode when opening
    };

    const closeQualityModal = () => {
        setIsQualityModalOpen(false);
        setSelectedQualityCheck(null);
        setIsEditingQualityCheck(false);
        setEditingQualityCheckData(null); // Clear editing data
    };

    // Get associated quality check for a batch
    const getQualityCheckForBatch = (batchId) => {
        return qualityChecks.find(qc => qc.batchId === batchId);
    };

    // Get specific quality parameters based on product type for the form
    const getQualityParametersForProductType = (productId) => {
        const productType = getProductType(productId);
        switch (productType) {
            case 'Milk':
                return ['Fat', 'SNF', 'Acidity', 'BacteriaCount']; // Use simplified keys for parameter object
            case 'Curd':
                return ['Texture', 'pH', 'ShelfLife'];
            case 'Ghee':
                return ['Appearance', 'Flavor', 'MoistureContent'];
            case 'Paneer':
                return ['Texture', 'MoistureContent', 'FatContent'];
            default:
                return [];
        }
    };

    // --- Advanced Filtering and Sorting Logic (using useMemo for optimization) ---
    const filteredAndSortedBatches = useMemo(() => {
        let tempBatches = [...productionBatches];

        // 1. Apply Search Term Filter
        if (searchTerm) {
            tempBatches = tempBatches.filter(batch =>
                getProductName(batch.productId).toLowerCase().includes(searchTerm.toLowerCase()) ||
                batch.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                batch.status.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // 2. Apply Status Filter
        if (filterStatus !== 'All') {
            tempBatches = tempBatches.filter(batch => batch.status === filterStatus);
        }

        // 3. Apply Product Type Filter
        if (filterProductType !== 'All') {
            tempBatches = tempBatches.filter(batch => getProductType(batch.productId) === filterProductType);
        }

        // 4. Apply Sorting
        tempBatches.sort((a, b) => {
            let valA, valB;

            switch (sortBy) {
                case 'productionDate':
                    valA = new Date(a.productionDate);
                    valB = new Date(b.productionDate);
                    break;
                case 'quantityProduced':
                    valA = a.quantityProduced;
                    valB = b.quantityProduced;
                    break;
                case 'batchNumber':
                    valA = a.batchNumber.toLowerCase();
                    valB = b.batchNumber.toLowerCase();
                    break;
                case 'productName':
                    valA = getProductName(a.productId).toLowerCase();
                    valB = getProductName(b.productId).toLowerCase();
                    break;
                default:
                    valA = new Date(a.productionDate); // Default to date
                    valB = new Date(b.productionDate);
                    break;
            }

            if (valA < valB) {
                return sortOrder === 'asc' ? -1 : 1;
            }
            if (valA > valB) {
                return sortOrder === 'asc' ? 1 : -1;
            }
            return 0;
        });

        return tempBatches;
    }, [productionBatches, searchTerm, filterStatus, filterProductType, sortBy, sortOrder, products]); // Add products to dependency array

    // Get unique product types for filter dropdown
    const uniqueProductTypes = useMemo(() => {
        const types = new Set(products.map(p => p.type));
        return ['All', ...Array.from(types).sort()];
    }, [products]);

    // Get unique statuses for filter dropdown
    const uniqueStatuses = useMemo(() => {
        const statuses = new Set(mockProductionBatches.map(b => b.status));
        return ['All', ...Array.from(statuses).sort()];
    }, []);


    return (
        <div className="production-dashboard">
            <h2>Production & Quality Management</h2>

            <div className="new-entry-forms">
                {/* Add New Production Batch Form */}
                <div className="form-section production-form-section">
                    <h3>Record New Production Batch</h3>
                    <form onSubmit={handleAddBatch} className="production-form">
                        <div className="form-group">
                            <label htmlFor="batch-product">Product:</label>
                            <select
                                id="batch-product"
                                name="productId"
                                value={newBatch.productId}
                                onChange={handleBatchFormChange}
                                required
                            >
                                <option value="">Select Product</option>
                                {products.map(product => (
                                    <option key={product.id} value={product.id}>{product.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="batch-quantity">Quantity Produced:</label>
                            <input
                                type="number"
                                id="batch-quantity"
                                name="quantityProduced"
                                value={newBatch.quantityProduced}
                                onChange={handleBatchFormChange}
                                min="0.1"
                                step="0.1"
                                required
                            />
                            <span>{getProductUnit(newBatch.productId)}</span>
                        </div>
                        <div className="form-group">
                            <label htmlFor="batch-date">Production Date:</label>
                            <input
                                type="date"
                                id="batch-date"
                                name="productionDate"
                                value={newBatch.productionDate}
                                onChange={handleBatchFormChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="batch-status">Status:</label>
                            <select
                                id="batch-status"
                                name="status"
                                value={newBatch.status}
                                onChange={handleBatchFormChange}
                            >
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="On Hold">On Hold</option>
                                <option value="Quality Issue">Quality Issue</option>
                            </select>
                        </div>
                        <div className="form-group full-width">
                            <label htmlFor="batch-notes">Notes:</label>
                            <textarea
                                id="batch-notes"
                                name="notes"
                                value={newBatch.notes}
                                onChange={handleBatchFormChange}
                                rows="2"
                            ></textarea>
                        </div>
                        <button type="submit" className="add-btn">Add Production Batch</button>
                    </form>
                </div>

                {/* Add New Quality Check Form */}
                <div className="form-section quality-form-section">
                    <h3>Record New Quality Check</h3>
                    <form onSubmit={handleAddQualityCheck} className="quality-check-form">
                        <div className="form-group">
                            <label htmlFor="qc-batch">Select Batch:</label>
                            <select
                                id="qc-batch"
                                name="batchId"
                                value={newQualityCheck.batchId}
                                onChange={handleQualityFormChange}
                                required
                            >
                                <option value="">Select Production Batch</option>
                                {productionBatches.filter(b => !b.qualityCheckId).map(batch => ( // Only show batches without QC
                                    <option key={batch.id} value={batch.id}>
                                        {batch.batchNumber} ({getProductName(batch.productId)})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="qc-checkedby">Checked By:</label>
                            <input
                                type="text"
                                id="qc-checkedby"
                                name="checkedBy"
                                value={newQualityCheck.checkedBy}
                                onChange={handleQualityFormChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="qc-date">Check Date:</label>
                            <input
                                type="date"
                                id="qc-date"
                                name="checkDate"
                                value={newQualityCheck.checkDate}
                                onChange={handleQualityFormChange}
                                required
                            />
                        </div>
                        {/* Dynamic Quality Parameters */}
                        {newQualityCheck.batchId && (
                            getQualityParametersForProductType(
                                productionBatches.find(b => b.id === newQualityCheck.batchId)?.productId
                            ).map(paramName => (
                                <div className="form-group" key={paramName}>
                                    <label htmlFor={`param_${paramName.toLowerCase().replace(/[^a-z0-9]/gi, '')}`}>{paramName.replace(/([A-Z])/g, ' $1').trim()}:</label> {/* Format for label */}
                                    <input
                                        type={paramName.includes('(') ? "text" : "number"} // Simple heuristic for number/text
                                        id={`param_${paramName.toLowerCase().replace(/[^a-z0-9]/gi, '')}`}
                                        name={`param_${paramName.toLowerCase().replace(/[^a-z0-9]/gi, '')}`}
                                        value={newQualityCheck.parameters[paramName] || ''} // Use full paramName for key
                                        onChange={handleQualityFormChange}
                                        step={paramName.includes('(') ? undefined : "0.01"}
                                        required
                                    />
                                </div>
                            ))
                        )}
                        <div className="form-group">
                            <label htmlFor="qc-result">Result:</label>
                            <select
                                id="qc-result"
                                name="result"
                                value={newQualityCheck.result}
                                onChange={handleQualityFormChange}
                                required
                            >
                                <option value="">Select Result</option>
                                <option value="Passed">Passed</option>
                                <option value="Passed with minor deviation">Passed with minor deviation</option>
                                <option value="Failed">Failed</option>
                                <option value="Under Review">Under Review</option>
                            </select>
                        </div>
                        <div className="form-group full-width">
                            <label htmlFor="qc-notes">Notes:</label>
                            <textarea
                                id="qc-notes"
                                name="notes"
                                value={newQualityCheck.notes}
                                onChange={handleQualityFormChange}
                                rows="2"
                            ></textarea>
                        </div>
                        <button type="submit" className="add-btn secondary">Add Quality Check</button>
                    </form>
                </div>
            </div>

            <div className="production-list-section">
                <h3>Production Batches & Quality Overview</h3>
                <div className="filters-sort-container">
                    <input
                        type="text"
                        placeholder="Search batches..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />

                    <div className="filter-group">
                        <label htmlFor="filter-status">Status:</label>
                        <select
                            id="filter-status"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            {uniqueStatuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="filter-product-type">Product Type:</label>
                        <select
                            id="filter-product-type"
                            value={filterProductType}
                            onChange={(e) => setFilterProductType(e.target.value)}
                        >
                            {uniqueProductTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="sort-by">Sort By:</label>
                        <select
                            id="sort-by"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="productionDate">Production Date</option>
                            <option value="quantityProduced">Quantity</option>
                            <option value="batchNumber">Batch Number</option>
                            <option value="productName">Product Name</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="sort-order">Order:</label>
                        <select
                            id="sort-order"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="desc">Descending</option>
                            <option value="asc">Ascending</option>
                        </select>
                    </div>
                </div>

                {filteredAndSortedBatches.length === 0 ? (
                    <p className="no-data">No production batches found matching your criteria.</p>
                ) : (
                    <div className="batch-cards-container">
                        {filteredAndSortedBatches.map(batch => {
                            const quality = getQualityCheckForBatch(batch.id);
                            return (
                                <div key={batch.id} className={`batch-card status-${batch.status.toLowerCase().replace(/\s/g, '-')}`}>
                                    <h4>{getProductName(batch.productId)}</h4>
                                    <p><strong>Batch No:</strong> {batch.batchNumber}</p>
                                    <p><strong>Date:</strong> {batch.productionDate}</p>
                                    <p><strong>Quantity:</strong> {batch.quantityProduced} {getProductUnit(batch.productId)}</p>
                                    <p><strong>Status:</strong> <span className={`status-tag status-${batch.status.toLowerCase().replace(/\s/g, '-')}`}>{batch.status}</span></p>

                                    {quality ? (
                                        <div className="quality-summary">
                                            <h5>Latest Quality Check</h5>
                                            <p>Result: <span className={`qc-result-tag ${quality.result.toLowerCase().replace(/\s/g, '-')}`}>{quality.result}</span></p>
                                            <p>By: {quality.checkedBy} on {quality.checkDate}</p>
                                            <button className="view-details-btn" onClick={(e) => { e.stopPropagation(); openQualityModal(quality); }}>View QC Details</button>
                                        </div>
                                    ) : (
                                        <p className="no-quality">No quality check recorded yet.</p>
                                    )}
                                    <div className="batch-actions">
                                        <button className="view-details-btn primary" onClick={(e) => { e.stopPropagation(); openBatchModal(batch); }}>View Details</button>
                                        <button className="edit-btn" onClick={(e) => { e.stopPropagation(); startEditingBatch(batch); }}>Edit Batch</button>
                                        <button className="delete-btn" onClick={(e) => { e.stopPropagation(); handleDeleteBatch(batch.id); }}>Delete Batch</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Batch Details / Edit Modal */}
            {isBatchModalOpen && (selectedBatch || isEditingBatch) && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="modal-close-btn" onClick={closeBatchModal}>&times;</button>
                        <h2>{isEditingBatch ? "Edit Production Batch" : "Production Batch Details"}</h2>
                        {isEditingBatch ? (
                            <form onSubmit={handleUpdateBatch} className="production-form">
                                <div className="form-group">
                                    <label htmlFor="edit-batch-product">Product:</label>
                                    <select
                                        id="edit-batch-product"
                                        name="productId"
                                        value={editingBatchData.productId}
                                        onChange={handleEditBatchFormChange}
                                        required
                                        disabled // Product ID is usually not editable after creation
                                    >
                                        {products.map(product => (
                                            <option key={product.id} value={product.id}>{product.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="edit-batch-quantity">Quantity Produced:</label>
                                    <input
                                        type="number"
                                        id="edit-batch-quantity"
                                        name="quantityProduced"
                                        value={editingBatchData.quantityProduced}
                                        onChange={handleEditBatchFormChange}
                                        min="0.1"
                                        step="0.1"
                                        required
                                    />
                                    <span>{getProductUnit(editingBatchData.productId)}</span>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="edit-batch-date">Production Date:</label>
                                    <input
                                        type="date"
                                        id="edit-batch-date"
                                        name="productionDate"
                                        value={editingBatchData.productionDate}
                                        onChange={handleEditBatchFormChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="edit-batch-status">Status:</label>
                                    <select
                                        id="edit-batch-status"
                                        name="status"
                                        value={editingBatchData.status}
                                        onChange={handleEditBatchFormChange}
                                    >
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                        <option value="On Hold">On Hold</option>
                                        <option value="Quality Issue">Quality Issue</option>
                                    </select>
                                </div>
                                <div className="form-group full-width">
                                    <label htmlFor="edit-batch-notes">Notes:</label>
                                    <textarea
                                        id="edit-batch-notes"
                                        name="notes"
                                        value={editingBatchData.notes}
                                        onChange={handleEditBatchFormChange}
                                        rows="2"
                                    ></textarea>
                                </div>
                                <div className="modal-action-buttons">
                                    <button type="submit" className="add-btn primary">Update Batch</button>
                                    <button type="button" className="secondary" onClick={closeBatchModal}>Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <div className="modal-details-grid">
                                    <p><strong>Batch ID:</strong> {selectedBatch.id}</p>
                                    <p><strong>Batch Number:</strong> {selectedBatch.batchNumber}</p>
                                    <p><strong>Product:</strong> {getProductName(selectedBatch.productId)}</p>
                                    <p><strong>Production Date:</strong> {selectedBatch.productionDate}</p>
                                    <p><strong>Quantity Produced:</strong> {selectedBatch.quantityProduced} {getProductUnit(selectedBatch.productId)}</p>
                                    <p><strong>Status:</strong> <span className={`status-tag status-${selectedBatch.status.toLowerCase().replace(/\s/g, '-')}`}>{selectedBatch.status}</span></p>
                                    <p className="full-span"><strong>Notes:</strong> {selectedBatch.notes || 'N/A'}</p>
                                </div>

                                {selectedBatch.qualityCheckId ? (
                                    <>
                                        <h3>Associated Quality Check</h3>
                                        {(() => {
                                            const associatedQC = getQualityCheckForBatch(selectedBatch.id);
                                            return associatedQC ? (
                                                <div className="associated-qc-info">
                                                    <p><strong>QC ID:</strong> {associatedQC.id}</p>
                                                    <p><strong>Check Date:</strong> {associatedQC.checkDate}</p>
                                                    <p><strong>Checked By:</strong> {associatedQC.checkedBy}</p>
                                                    <p><strong>Result:</strong> <span className={`qc-result-tag ${associatedQC.result.toLowerCase().replace(/\s/g, '-')}`}>{associatedQC.result}</span></p>
                                                    <div className="qc-modal-actions">
                                                        <button className="view-details-btn" onClick={(e) => { e.stopPropagation(); openQualityModal(associatedQC); }}>View Full QC Report</button>
                                                        <button className="edit-btn" onClick={(e) => { e.stopPropagation(); startEditingQualityCheck(associatedQC); }}>Edit QC</button>
                                                        <button className="delete-btn" onClick={(e) => { e.stopPropagation(); handleDeleteQualityCheck(associatedQC.id, selectedBatch.id); }}>Delete QC</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="no-data">Quality check details not found for this batch.</p>
                                            );
                                        })()}
                                    </>
                                ) : (
                                    <p className="no-data">No quality check associated with this batch yet.</p>
                                )}
                                <div className="modal-action-buttons">
                                    <button className="delete-btn" onClick={() => handleDeleteBatch(selectedBatch.id)}>Delete This Batch</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Quality Check Details / Edit Modal */}
            {isQualityModalOpen && (selectedQualityCheck || isEditingQualityCheck) && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="modal-close-btn" onClick={closeQualityModal}>&times;</button>
                        <h2>{isEditingQualityCheck ? "Edit Quality Check Report" : "Quality Check Report"}</h2>
                        {isEditingQualityCheck ? (
                            <form onSubmit={handleUpdateQualityCheck} className="quality-check-form">
                                <div className="form-group">
                                    <label htmlFor="edit-qc-batch">Batch Number:</label>
                                    <input
                                        type="text"
                                        id="edit-qc-batch"
                                        value={productionBatches.find(b => b.id === editingQualityCheckData.batchId)?.batchNumber || 'N/A'}
                                        disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="edit-qc-checkedby">Checked By:</label>
                                    <input
                                        type="text"
                                        id="edit-qc-checkedby"
                                        name="checkedBy"
                                        value={editingQualityCheckData.checkedBy}
                                        onChange={handleEditQualityCheckFormChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="edit-qc-date">Check Date:</label>
                                    <input
                                        type="date"
                                        id="edit-qc-date"
                                        name="checkDate"
                                        value={editingQualityCheckData.checkDate}
                                        onChange={handleEditQualityCheckFormChange}
                                        required
                                    />
                                </div>
                                <h3>Parameters:</h3>
                                {getQualityParametersForProductType(
                                    productionBatches.find(b => b.id === editingQualityCheckData.batchId)?.productId
                                ).map(paramName => (
                                    <div className="form-group" key={paramName}>
                                        <label htmlFor={`edit-param_${paramName.toLowerCase().replace(/[^a-z0-9]/gi, '')}`}>{paramName.replace(/([A-Z])/g, ' $1').trim()}:</label>
                                        <input
                                            type={paramName.includes('(') ? "text" : "number"}
                                            id={`edit-param_${paramName.toLowerCase().replace(/[^a-z0-9]/gi, '')}`}
                                            name={`param_${paramName}`} // Use original param name for consistency
                                            value={editingQualityCheckData.parameters[paramName] || ''}
                                            onChange={handleEditQualityCheckFormChange}
                                            step={paramName.includes('(') ? undefined : "0.01"}
                                            required
                                        />
                                    </div>
                                ))}
                                <div className="form-group">
                                    <label htmlFor="edit-qc-result">Result:</label>
                                    <select
                                        id="edit-qc-result"
                                        name="result"
                                        value={editingQualityCheckData.result}
                                        onChange={handleEditQualityCheckFormChange}
                                        required
                                    >
                                        <option value="">Select Result</option>
                                        <option value="Passed">Passed</option>
                                        <option value="Passed with minor deviation">Passed with minor deviation</option>
                                        <option value="Failed">Failed</option>
                                        <option value="Under Review">Under Review</option>
                                    </select>
                                </div>
                                <div className="form-group full-width">
                                    <label htmlFor="edit-qc-notes">Notes:</label>
                                    <textarea
                                        id="edit-qc-notes"
                                        name="notes"
                                        value={editingQualityCheckData.notes}
                                        onChange={handleEditQualityCheckFormChange}
                                        rows="2"
                                    ></textarea>
                                </div>
                                <div className="modal-action-buttons">
                                    <button type="submit" className="add-btn primary">Update Quality Check</button>
                                    <button type="button" className="secondary" onClick={closeQualityModal}>Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <div className="modal-details-grid">
                                    <p><strong>QC ID:</strong> {selectedQualityCheck.id}</p>
                                    <p><strong>Batch Number:</strong> {productionBatches.find(b => b.id === selectedQualityCheck.batchId)?.batchNumber || 'N/A'}</p>
                                    <p><strong>Product:</strong> {getProductName(productionBatches.find(b => b.id === selectedQualityCheck.batchId)?.productId)}</p>
                                    <p><strong>Check Date:</strong> {selectedQualityCheck.checkDate}</p>
                                    <p><strong>Checked By:</strong> {selectedQualityCheck.checkedBy}</p>
                                    <p><strong>Result:</strong> <span className={`qc-result-tag ${selectedQualityCheck.result.toLowerCase().replace(/\s/g, '-')}`}>{selectedQualityCheck.result}</span></p>
                                </div>
                                <h3>Parameters:</h3>
                                {Object.keys(selectedQualityCheck.parameters).length > 0 ? (
                                    <ul className="parameters-list">
                                        {Object.entries(selectedQualityCheck.parameters).map(([key, value]) => (
                                            <li key={key}><strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> {value}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="no-data">No specific parameters recorded.</p>
                                )}
                                <p className="full-span"><strong>Notes:</strong> {selectedQualityCheck.notes || 'N/A'}</p>
                                <div className="modal-action-buttons">
                                    <button className="delete-btn" onClick={() => handleDeleteQualityCheck(selectedQualityCheck.id, selectedQualityCheck.batchId)}>Delete This Quality Check</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Production;