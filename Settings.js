// Settings.js
import React, { useState, useEffect } from 'react';
import './Settings.css';

// --- CollapsibleSection Component ---
// A reusable component for accordion-style sections
const CollapsibleSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <section className={`settings-section ${isOpen ? 'is-open' : ''}`}>
      <button className="section-header" onClick={toggleOpen} aria-expanded={isOpen} aria-controls={`section-content-${title.replace(/\s/g, '-')}`}>
        <h3>{title}</h3>
        <span className="toggle-icon">{isOpen ? '−' : '+'}</span>
      </button>
      <div id={`section-content-${title.replace(/\s/g, '-')}`} className={`section-content ${isOpen ? 'show' : ''}`} aria-hidden={!isOpen}>
        {children}
      </div>
    </section>
  );
};

// --- Settings Component ---
const Settings = () => {
  // Define a consistent set of default settings
  const defaultSettings = {
    general: {
      theme: 'light',
      notificationsEnabled: true,
      language: 'en',
    },
    privacyControls: {
      dataSharing: false,
      analyticsEnabled: true,
    },
    dataManagement: {
      autoBackup: true,
      backupFrequency: 'daily'
    }
  };

  const [settings, setSettings] = useState(() => {
    try {
      const savedSettings = localStorage.getItem('toolInteractiveSettings');
      return savedSettings ? { ...defaultSettings, ...JSON.parse(savedSettings) } : defaultSettings;
    } catch (error) {
      console.error("Error parsing interactive settings from localStorage or localStorage is empty:", error);
      return defaultSettings;
    }
  });

  const [selectedSection, setSelectedSection] = useState('interactive');

  useEffect(() => {
    try {
      localStorage.setItem('toolInteractiveSettings', JSON.stringify(settings));
    } catch (error) {
      console.error("Error saving interactive settings to localStorage:", error);
    }
  }, [settings]);

  const handleSettingChange = (category, settingName, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [category]: {
        ...prevSettings[category],
        [settingName]: value,
      },
    }));
  };

  // Helper function to render different input types
  const renderSettingInput = (category, settingName, type, currentValue, options = [], labelId) => {
    switch (type) {
      case 'text':
        return (
          <input
            type="text"
            value={currentValue}
            onChange={(e) => handleSettingChange(category, settingName, e.target.value)}
            aria-labelledby={labelId}
          />
        );
      case 'checkbox':
        return (
          <label className="switch" htmlFor={`${category}-${settingName}`}>
            <input
              type="checkbox"
              id={`${category}-${settingName}`}
              checked={currentValue}
              onChange={(e) => handleSettingChange(category, settingName, e.target.checked)}
              aria-labelledby={labelId}
            />
            <span className="slider round"></span>
          </label>
        );
      case 'select':
        return (
          <select
            value={currentValue}
            onChange={(e) => handleSettingChange(category, settingName, e.target.value)}
            aria-labelledby={labelId}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'range':
        return (
          <input
            type="range"
            min={options.min || 0}
            max={options.max || 100}
            step={options.step || 1}
            value={currentValue}
            onChange={(e) => handleSettingChange(category, settingName, Number(e.target.value))}
            aria-labelledby={labelId}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="settings-container">
      <h2>Tool Settings</h2>

      <nav className="settings-nav">
        <button
          className={selectedSection === 'interactive' ? 'active' : ''}
          onClick={() => setSelectedSection('interactive')}
        >
          Interactive Settings
        </button>
        <button
          className={selectedSection === 'privacyPolicy' ? 'active' : ''}
          onClick={() => setSelectedSection('privacyPolicy')}
        >
          Privacy Policy
        </button>
        <button
          className={selectedSection === 'termsAndConditions' ? 'active' : ''}
          onClick={() => setSelectedSection('termsAndConditions')}
        >
          Terms & Conditions
        </button>
        <button
          className={selectedSection === 'about' ? 'active' : ''}
          onClick={() => setSelectedSection('about')}
        >
          About This Tool
        </button>
      </nav>

      <div className="settings-content">
        {selectedSection === 'interactive' && (
          <>
            <CollapsibleSection title="General">
              <p className="section-description">Adjust basic application preferences.</p>
              <div className="setting-item">
                <label id="theme-label" htmlFor="general-theme">Theme:</label>
                {renderSettingInput(
                  'general',
                  'theme',
                  'select',
                  settings.general.theme,
                  [
                    { value: 'light', label: 'Light' },
                    { value: 'dark', label: 'Dark' },
                  ],
                  "theme-label"
                )}
              </div>
              <div className="setting-item">
                <label id="notifications-label" htmlFor="general-notificationsEnabled">Enable Notifications:</label>
                {renderSettingInput(
                  'general',
                  'notificationsEnabled',
                  'checkbox',
                  settings.general.notificationsEnabled,
                  [],
                  "notifications-label"
                )}
              </div>
              <div className="setting-item">
                <label id="language-label" htmlFor="general-language">Language:</label>
                {renderSettingInput(
                  'general',
                  'language',
                  'select',
                  settings.general.language,
                  [
                    { value: 'en', label: 'English' },
                    { value: 'es', label: 'Spanish' },
                    { value: 'fr', label: 'French' },
                  ],
                  "language-label"
                )}
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Privacy Controls" defaultOpen={true}>
              <p className="section-description">Manage how your data is used within the tool.</p>
              <div className="setting-item">
                <label id="data-sharing-label" htmlFor="privacyControls-dataSharing">Allow Anonymous Data Sharing:</label>
                {renderSettingInput(
                  'privacyControls',
                  'dataSharing',
                  'checkbox',
                  settings.privacyControls.dataSharing,
                  [],
                  "data-sharing-label"
                )}
              </div>
              <div className="setting-item">
                <label id="analytics-label" htmlFor="privacyControls-analyticsEnabled">Enable Usage Analytics:</label>
                {renderSettingInput(
                  'privacyControls',
                  'analyticsEnabled',
                  'checkbox',
                  settings.privacyControls.analyticsEnabled,
                  [],
                  "analytics-label"
                )}
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Data Management">
              <p className="section-description">Control how your data is backed up and managed.</p>
              <div className="setting-item">
                <label id="auto-backup-label" htmlFor="dataManagement-autoBackup">Enable Auto Backup:</label>
                {renderSettingInput(
                  'dataManagement',
                  'autoBackup',
                  'checkbox',
                  settings.dataManagement.autoBackup,
                  [],
                  "auto-backup-label"
                )}
              </div>
              {settings.dataManagement.autoBackup && (
                <div className="setting-item">
                  <label id="backup-frequency-label" htmlFor="dataManagement-backupFrequency">Backup Frequency:</label>
                  {renderSettingInput(
                    'dataManagement',
                    'backupFrequency',
                    'select',
                    settings.dataManagement.backupFrequency,
                    [
                      { value: 'daily', label: 'Daily' },
                      { value: 'weekly', label: 'Weekly' },
                      { value: 'monthly', label: 'Monthly' },
                    ],
                    "backup-frequency-label"
                  )}
                </div>
              )}
            </CollapsibleSection>
            {/* Add more interactive setting categories here */}
          </>
        )}

        {selectedSection === 'privacyPolicy' && (
          <section className="settings-section static-content">
            <h3>Privacy Policy</h3>
            <p className="section-description">Last updated: July 15, 2025</p>
            <p>
              This Privacy Policy describes Our policies and procedures on the collection, use and disclosure
              of Your information when You use the Service and tells You about Your privacy rights and
              how the law protects You.
            </p>
            <h4>1. Information Collection and Use</h4>
            <p>
              We collect several different types of information for various purposes to provide and improve
              Our Service to You.
            </p>
            <h5>Types of Data Collected</h5>
            <h6>Personal Data</h6>
            <p>
              While using Our Service, We may ask You to provide Us with certain personally identifiable
              information that can be used to contact or identify You. Personally identifiable information
              may include, but is not limited to:
            </p>
            <ul>
              <li>Email address</li>
              <li>First name and last name</li>
              <li>Usage Data</li>
            </ul>
            <h6>Usage Data</h6>
            <p>
              Usage Data is collected automatically when using the Service. Usage Data may include information
              such as Your Device's Internet Protocol address (e.g. IP address), browser type, browser version,
              the pages of our Service that You visit, the time and date of Your visit, the time spent on those
              pages, unique device identifiers and other diagnostic data.
            </p>
            <h4>2. Use of Your Personal Data</h4>
            <p>The Company may use Personal Data for the following purposes:</p>
            <ul>
              <li>To provide and maintain our Service, including to monitor the usage of our Service.</li>
              <li>To manage Your Account: to manage Your registration as a user of the Service.</li>
              <li>For the performance of a contract: the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased or of any other contract with Us through the Service.</li>
              <li>To contact You: To contact You by email or other equivalent forms of electronic communication.</li>
            </ul>
            <p>
              For more details, please refer to our full Privacy Policy document available on our website.
            </p>
          </section>
        )}

        {selectedSection === 'termsAndConditions' && (
          <section className="settings-section static-content">
            <h3>Terms and Conditions</h3>
            <p className="section-description">Last updated: July 15, 2025</p>
            <p>
              Please read these terms and conditions carefully before using Our Service.
            </p>
            <h4>1. Introduction</h4>
            <p>
              These are the Terms and Conditions governing the use of this Service and the agreement that operates
              between You and the Company. These Terms and Conditions set out the rights and obligations of all
              users regarding the use of the Service.
            </p>
            <h4>2. Acceptance of Terms</h4>
            <p>
              Your access to and use of the Service is conditioned on Your acceptance of and compliance with these
              Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access
              or use the Service.
            </p>
            <h4>3. User Accounts</h4>
            <p>
              When You create an account with Us, You must provide Us information that is accurate, complete, and
              current at all times. Failure to do so constitutes a breach of the Terms, which may result in
              immediate termination of Your account on Our Service.
            </p>
            <p>
              For a complete understanding, please review the full Terms and Conditions document.
            </p>
          </section>
        )}

        {selectedSection === 'about' && (
          <section className="settings-section static-content">
            <h3>About This Tool</h3>
            <p className="section-description">Information about your application.</p>
            <p>
              **Dodla Dairy Tool** is a powerful and intuitive tool designed to help you **manage and streamline dairy farm operations, from milk production tracking to herd management and sales reporting**.
              Our mission is to **empower dairy farmers with data-driven insights and efficient tools to enhance productivity and profitability**.
            </p>
            <p>
              **Version:** 1.2.0 (Dairy Edition)<br />
              **Developed by:** Dodla Dairy Tech Team<br />
              **Release Date:** June 1, 2025<br />
              **Website:** <a href="https://www.dodladairy.com" target="_blank" rel="noopener noreferrer">www.dodladairy.com</a><br />
              **Contact:** <a href="mailto:support@dodladairy.com">support@dodladairy.com</a>
            </p>
            <h4>Key Features:</h4>
            <ul>
              <li>**Milk Production Tracking:** Record and analyze daily milk yield per animal or herd.</li>
              <li>**Herd Management:** Maintain detailed records of individual animals, including health, breeding, and lactation cycles.</li>
              <li>**Feed Management:** Optimize feed consumption and cost with intelligent tracking.</li>
              <li>**Sales & Distribution:** Streamline milk collection, processing, and sales tracking.</li>
              <li>**Financial Reporting:** Generate comprehensive reports on expenses, revenue, and profitability.</li>
              <li>**Customizable Alerts:** Set up notifications for breeding cycles, health check-ups, and low stock.</li>
              <li>**User-Friendly Interface:** Intuitive design for easy navigation and data entry.</li>
              <li>**Secure Data Storage:** Your farm data is protected with robust security measures.</li>
            </ul>
            <p>
              Thank you for choosing **Dodla Dairy Tool**! We are committed to continuous innovation to support your dairy business.
            </p>
          </section>
        )}
      </div>
    </div>
  );
};

export default Settings;