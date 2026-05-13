import React, { useState, useEffect } from 'react';
import Header from '../components/Header';

const SettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      app: true,
      marketing: false
    },
    privacy: {
      shareData: false,
      allowTracking: true
    },
    appearance: {
      theme: 'light',
      fontSize: 'medium',
      compactView: false
    },
    language: 'English',
    timezone: 'UTC-5 (Eastern Time)'
  });

  // Simulate loading settings from an API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // In a real app, this would be an API call to your backend
        console.log('Fetching user settings...');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // We're using the default state values for demo
        setLoading(false);
      } catch (error) {
        console.error('Error fetching settings:', error);
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleNotificationChange = (type) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }));
  };

  const handlePrivacyChange = (type) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [type]: !prev.privacy[type]
      }
    }));
  };

  const handleAppearanceChange = (type, value) => {
    setSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [type]: type === 'compactView' ? !prev.appearance.compactView : value
      }
    }));
  };

  const handleLanguageChange = (e) => {
    setSettings(prev => ({
      ...prev,
      language: e.target.value
    }));
  };

  const handleTimezoneChange = (e) => {
    setSettings(prev => ({
      ...prev,
      timezone: e.target.value
    }));
  };

  const handleSaveSettings = async () => {
    try {
      // In a real app, this would be an API call to update settings
      console.log('Saving user settings...', settings);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Customize your application experience and preferences.
          </p>
          
          {loading ? (
            <div className="mt-6 bg-white shadow sm:rounded-lg p-4">
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-6 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-4 bg-gray-200 rounded col-span-2"></div>
                      <div className="h-4 bg-gray-200 rounded col-span-1"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              {/* Notification Settings */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Notification Settings</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage how we contact you.</p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="email-notifications"
                          type="checkbox"
                          checked={settings.notifications.email}
                          onChange={() => handleNotificationChange('email')}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="email-notifications" className="font-medium text-gray-700">Email Notifications</label>
                        <p className="text-gray-500">Receive updates, alerts, and recommendations via email.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="sms-notifications"
                          type="checkbox"
                          checked={settings.notifications.sms}
                          onChange={() => handleNotificationChange('sms')}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="sms-notifications" className="font-medium text-gray-700">SMS Notifications</label>
                        <p className="text-gray-500">Receive time-sensitive alerts via text message.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="app-notifications"
                          type="checkbox"
                          checked={settings.notifications.app}
                          onChange={() => handleNotificationChange('app')}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="app-notifications" className="font-medium text-gray-700">In-App Notifications</label>
                        <p className="text-gray-500">Receive notifications within the application.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="marketing-notifications"
                          type="checkbox"
                          checked={settings.notifications.marketing}
                          onChange={() => handleNotificationChange('marketing')}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="marketing-notifications" className="font-medium text-gray-700">Marketing Communications</label>
                        <p className="text-gray-500">Receive product updates, offers, and newsletters.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Privacy Settings */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Privacy Settings</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage how your data is used.</p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="share-data"
                          type="checkbox"
                          checked={settings.privacy.shareData}
                          onChange={() => handlePrivacyChange('shareData')}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="share-data" className="font-medium text-gray-700">Share Usage Data</label>
                        <p className="text-gray-500">Allow us to share anonymized usage data to improve our services.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="allow-tracking"
                          type="checkbox"
                          checked={settings.privacy.allowTracking}
                          onChange={() => handlePrivacyChange('allowTracking')}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="allow-tracking" className="font-medium text-gray-700">Allow Analytics Tracking</label>
                        <p className="text-gray-500">Allow us to track your in-app activity to improve user experience.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Appearance Settings */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Appearance Settings</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Customize how the application looks.</p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="theme" className="block text-sm font-medium text-gray-700">Theme</label>
                      <select
                        id="theme"
                        name="theme"
                        value={settings.appearance.theme}
                        onChange={(e) => handleAppearanceChange('theme', e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">Use System Setting</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700">Font Size</label>
                      <select
                        id="fontSize"
                        name="fontSize"
                        value={settings.appearance.fontSize}
                        onChange={(e) => handleAppearanceChange('fontSize', e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="compact-view"
                          type="checkbox"
                          checked={settings.appearance.compactView}
                          onChange={() => handleAppearanceChange('compactView')}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="compact-view" className="font-medium text-gray-700">Compact View</label>
                        <p className="text-gray-500">Use a more compact layout to show more content on screen.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Regional Settings */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Regional Settings</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage language and time zone preferences.</p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="language" className="block text-sm font-medium text-gray-700">Language</label>
                      <select
                        id="language"
                        name="language"
                        value={settings.language}
                        onChange={handleLanguageChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                        <option value="Chinese">Chinese</option>
                        <option value="Japanese">Japanese</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">Time Zone</label>
                      <select
                        id="timezone"
                        name="timezone"
                        value={settings.timezone}
                        onChange={handleTimezoneChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="UTC-8 (Pacific Time)">UTC-8 (Pacific Time)</option>
                        <option value="UTC-7 (Mountain Time)">UTC-7 (Mountain Time)</option>
                        <option value="UTC-6 (Central Time)">UTC-6 (Central Time)</option>
                        <option value="UTC-5 (Eastern Time)">UTC-5 (Eastern Time)</option>
                        <option value="UTC+0 (GMT)">UTC+0 (GMT)</option>
                        <option value="UTC+1 (Central European Time)">UTC+1 (Central European Time)</option>
                        <option value="UTC+8 (China Standard Time)">UTC+8 (China Standard Time)</option>
                        <option value="UTC+9 (Japan Standard Time)">UTC+9 (Japan Standard Time)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 