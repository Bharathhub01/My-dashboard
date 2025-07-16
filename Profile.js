import React, { useState, useEffect, useRef } from 'react';
import './Profile.css'; // Import the updated CSS file

const Profile = () => {
    // State to store the actual admin profile data
    const [adminProfileData, setAdminProfileData] = useState(null);
    // State to toggle between view and edit mode
    const [isEditing, setIsEditing] = useState(false);
    // State to hold form input values during editing
    const [formData, setFormData] = useState({
        name: '',// This will be the editable 'Name' field
        email: '',
        phone: '',
        department: 'Admin', // Default to 'Admin'
        age: '',
        gender: '',
        country: '',
        address: '',
        profile_picture: '/Profile.jpg' // Default placeholder image from public folder
    });
    // State for loading indicators for API operations
    const [isLoading, setIsLoading] = useState(true);
    // State for displaying form validation errors
    const [formErrors, setFormErrors] = useState({});
    // State for general API success/error messages
    const [apiMessage, setApiMessage] = useState({ type: '', text: '' });

    // Ref for the hidden file input
    const fileInputRef = useRef(null);

    // --- Utility: Form Validation (Client-Side) ---
    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!formData.name.trim()) {
            errors.name = 'Name is required.';
            isValid = false;
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required.';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Invalid email format.';
            isValid = false;
        }

        // Phone number validation: optional, but if present, must be exactly 10 digits
        if (formData.phone.trim() && !/^\d{10}$/.test(formData.phone.trim())) {
            errors.phone = 'Phone number must be exactly 10 digits.';
            isValid = false;
        }

        if (!formData.age) {
            errors.age = 'Age is required.';
            isValid = false;
        } else if (isNaN(formData.age) || parseInt(formData.age) < 18 || parseInt(formData.age) > 120) {
            errors.age = 'Age must be a number between 18 and 120.';
            isValid = false;
        }

        if (!formData.gender) {
            errors.gender = 'Gender is required.';
            isValid = false;
        }

        if (!formData.country.trim()) {
            errors.country = 'Country is required.';
            isValid = false;
        }

        if (!formData.address.trim()) {
            errors.address = 'Address is required.';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    // --- Simulated API Calls (Replace with actual backend calls) ---
    const simulateApiCall = (data, type) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const defaultProfilePicture = '/Profile.jpg'; // Default placeholder image
                if (type === 'fetch') {
                    resolve({
                        name: 'Bharath', // This will be the value for the editable 'Name' field
                        email: 'admin@dodladairy.com',
                        phone: '9876543210',
                        admin_role: 'Super Administrator', // This remains the role
                        department: 'Admin',
                        last_login: '2025-07-14T16:09:17Z',
                        age: 38,
                        gender: 'Male',
                        country: 'India',
                        address: '8-2-293/82/A, 270/Q, Road No 10-C, Jubilee Hills, Hyderabad – 500 033. Telangana, India.',
                        permissions: [
                            'manage_users', 'manage_roles', 'view_audit_logs',
                            'configure_system_settings', 'access_all_data',
                            'monitor_server_health', 'generate_advanced_reports'
                        ],
                        profile_picture: defaultProfilePicture
                    });
                } else if (type === 'update') {
                    resolve({
                        ...adminProfileData,
                        ...data,
                        updated_at: new Date().toISOString()
                    });
                }
            }, 800); // Simulate network latency
        });
    };

    // Effect hook to fetch admin profile data on component mount
    useEffect(() => {
        const fetchAdminProfile = async () => {
            setIsLoading(true);
            setApiMessage({ type: '', text: '' });
            try {
                const data = await simulateApiCall(null, 'fetch');
                setAdminProfileData(data);
                setFormData({
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    department: data.department,
                    age: data.age,
                    gender: data.gender,
                    country: data.country,
                    address: data.address,
                    profile_picture: data.profile_picture
                });
            } catch (err) {
                setApiMessage({ type: 'error', text: err.message || 'Failed to load admin profile.' });
                console.error('Fetch admin profile error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAdminProfile();
    }, []);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (!isEditing && adminProfileData) {
            setFormData({
                name: adminProfileData.name,
                email: adminProfileData.email,
                phone: adminProfileData.phone,
                department: adminProfileData.department,
                age: adminProfileData.age,
                gender: adminProfileData.gender,
                country: adminProfileData.country,
                address: adminProfileData.address,
                profile_picture: adminProfileData.profile_picture
            });
        }
        setFormErrors({});
        setApiMessage({ type: '', text: '' });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    // Handles image file selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, profile_picture: reader.result });
                setApiMessage({ type: 'info', text: 'Image selected. Click "Save Changes" to update.' });
            };
            reader.readAsDataURL(file);
        }
    };

    // Triggers hidden file input click
    const handleImageEditClick = () => {
        fileInputRef.current.click();
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setApiMessage({ type: '', text: '' });

        if (!validateForm()) {
            setApiMessage({ type: 'error', text: 'Please correct the errors in the form.' });
            return;
        }

        setIsLoading(true);
        try {
            const updatedData = await simulateApiCall(formData, 'update');
            setAdminProfileData(updatedData);
            setIsEditing(false);
            setApiMessage({ type: 'success', text: 'Admin profile updated successfully!' });
        } catch (err) {
            setApiMessage({ type: 'error', text: err.message || 'Failed to update admin profile.' });
            console.error('Update admin profile error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Conditional Rendering for Loading/Error states ---
    if (isLoading && !adminProfileData && apiMessage.type !== 'error') {
        return (
            <div className="profile-container loading-state">
                <div className="spinner"></div>
                <p>Loading admin profile data...</p>
            </div>
        );
    }

    if (apiMessage.type === 'error' && !adminProfileData) {
        return (
            <div className="profile-container profile-error">
                <h3>Error Loading Profile</h3>
                <p>{apiMessage.text}</p>
                <button className="button primary" onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    if (!adminProfileData && !isLoading) {
        return (
            <div className="profile-container profile-no-data">
                <h3>No Admin Profile Found</h3>
                <p>It seems there's no profile data for this administrator.</p>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <h2 className="profile-title">
                <i className="fas fa-user-cog"></i> Admin Profile
            </h2>

            {/* API Messages */}
            {apiMessage.text && (
                <div className={`api-message ${apiMessage.type}`}>
                    {apiMessage.text}
                </div>
            )}

            {isEditing ? (
                // --- Edit Mode: Admin Profile Form ---
                <form onSubmit={handleSave} className="profile-form">
                    <div className="profile-avatar-edit-container">
                        <img
                            src={formData.profile_picture}
                            alt="Profile Avatar"
                            className="profile-avatar-edit"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            style={{ display: 'none' }} // Hide the actual input
                        />
                        <button type="button" className="button small-button avatar-edit-button" onClick={handleImageEditClick}>
                            <i className="fas fa-camera"></i> Change Image
                        </button>
                    </div>

                    <div className="form-group">
                        <label htmlFor="name">Name:</label> {/* This is the editable 'Name' field */}
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={formErrors.name ? 'input-error' : ''}
                        />
                        {formErrors.name && <span className="error-message">{formErrors.name}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={formErrors.email ? 'input-error' : ''}
                        />
                        {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Phone (10 digits):</label>
                        <input
                            type="tel" // Use type="tel" for phone numbers
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={formErrors.phone ? 'input-error' : ''}
                            placeholder="e.g., 9876543210"
                            maxLength="10" // Enforce max length in HTML as well
                        />
                        {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="age">Age:</label>
                        <input
                            type="number"
                            id="age"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            className={formErrors.age ? 'input-error' : ''}
                        />
                        {formErrors.age && <span className="error-message">{formErrors.age}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="gender">Gender:</label>
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className={formErrors.gender ? 'input-error' : ''}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        {formErrors.gender && <span className="error-message">{formErrors.gender}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="country">Country:</label>
                        <input
                            type="text"
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className={formErrors.country ? 'input-error' : ''}
                        />
                        {formErrors.country && <span className="error-message">{formErrors.country}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Address:</label>
                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className={formErrors.address ? 'input-error' : ''}
                        ></textarea>
                        {formErrors.address && <span className="error-message">{formErrors.address}</span>}
                    </div>

                    {/* Read-only fields for context in edit mode */}
                    <div className="form-group read-only-field">
                        <label>Admin Role:</label>
                        <span className="profile-detail-value read-only">{adminProfileData.admin_role}</span>
                    </div>
                    <div className="form-group read-only-field">
                        <label>Department:</label>
                        <span className="profile-detail-value read-only">{adminProfileData.department}</span>
                    </div>
                    <div className="form-group read-only-field">
                        <label>Last Login:</label>
                        <span className="profile-detail-value read-only">{new Date(adminProfileData.last_login).toLocaleString()}</span>
                    </div>

                    <div className="profile-actions">
                        <button type="submit" className="button primary" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button type="button" className="button secondary" onClick={handleEditToggle} disabled={isLoading}>
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                // --- View Mode: Display Admin Profile Details ---
                <div className="profile-details">
                    <div className="profile-header">
                        <div className="profile-avatar-container">
                            <img
                                src={adminProfileData.profile_picture}
                                alt="Admin Avatar"
                                className="profile-avatar"
                            />
                        </div>
                        <div className="profile-header-info">
                            {/* Main Name/Title line - now static "Bharath" */}
                            <h3 className="admin-static-name">Bharath</h3>
                            {/* Display Admin Role as a badge */}
                            <p className="admin-role-badge">{adminProfileData.admin_role}</p>
                            <p className="last-login">Last Login: {new Date(adminProfileData.last_login).toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="profile-info-grid">
                        <div className="profile-info-item">
                            <span className="info-icon"><i className="fas fa-user"></i></span> {/* Added user icon for the Name field */}
                            <span className="info-label">Name:</span>
                            <span className="info-value">{adminProfileData.name}</span> {/* Display the editable name field value */}
                        </div>
                        <div className="profile-info-item">
                            <span className="info-icon"><i className="fas fa-envelope"></i></span>
                            <span className="info-label">Email:</span>
                            <span className="info-value">{adminProfileData.email}</span>
                        </div>
                        <div className="profile-info-item">
                            <span className="info-icon"><i className="fas fa-phone-alt"></i></span>
                            <span className="info-label">Phone:</span>
                            <span className="info-value">{adminProfileData.phone || 'N/A'}</span>
                        </div>
                        <div className="profile-info-item">
                            <span className="info-icon"><i className="fas fa-building"></i></span>
                            <span className="info-label">Department:</span>
                            <span className="info-value">{adminProfileData.department || 'N/A'}</span>
                        </div>
                        <div className="profile-info-item">
                            <span className="info-icon"><i className="fas fa-calendar-alt"></i></span>
                            <span className="info-label">Age:</span>
                            <span className="info-value">{adminProfileData.age || 'N/A'}</span>
                        </div>
                        <div className="profile-info-item">
                            <span className="info-icon"><i className="fas fa-venus-mars"></i></span>
                            <span className="info-label">Gender:</span>
                            <span className="info-value">{adminProfileData.gender || 'N/A'}</span>
                        </div>
                        <div className="profile-info-item">
                            <span className="info-icon"><i className="fas fa-globe-americas"></i></span>
                            <span className="info-label">Country:</span>
                            <span className="info-value">{adminProfileData.country || 'N/A'}</span>
                        </div>
                        <div className="profile-info-item full-width-item">
                            <span className="info-icon"><i className="fas fa-map-marker-alt"></i></span>
                            <span className="info-label">Address:</span>
                            <span className="info-value">{adminProfileData.address || 'N/A'}</span>
                        </div>
                    </div>

                    {adminProfileData.permissions && adminProfileData.permissions.length > 0 && (
                        <div className="profile-permissions">
                            <h4><i className="fas fa-shield-alt"></i> Assigned Permissions</h4>
                            <ul className="permission-list">
                                {adminProfileData.permissions.map((perm, index) => (
                                    <li key={index} className="permission-tag">
                                        {perm.replace(/_/g, ' ')}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="profile-actions">
                        <button className="button primary" onClick={handleEditToggle}>
                            <i className="fas fa-edit"></i> Edit Profile
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;