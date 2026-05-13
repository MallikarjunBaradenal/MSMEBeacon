import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [businessData, setBusinessData] = useState({
    name: 'Your Business',
    riskScore: 65,
    monthlySales: 52000,
    customerCount: 230,
    stockValue: 75000
  });

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // This would normally fetch data from your backend
  useEffect(() => {
    // Fetch data from backend
    const fetchData = async () => {
      try {
        console.log('Fetching dashboard data...');
        const response = await fetch('http://localhost:5000/get-stats');
        const data = await response.json();
        
        if (data.error) {
          console.error('Error from API:', data.error);
          setLoading(false);
          return;
        }
        
        // Update business data with stats from backend
        setBusinessData(prevData => ({
          ...prevData,
          riskScore: data.avg_risk_score || 0,
          totalPredictions: data.total_predictions || 0,
          riskDistribution: data.risk_distribution || {
            "Low Risk": 0,
            "Medium Risk": 0,
            "High Risk": 0
          }
        }));
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to determine risk level styling
  const getRiskLevelStyle = (score) => {
    if (score < 40) return 'text-white bg-green-500';
    if (score < 70) return 'text-white bg-yellow-500';
    return 'text-white bg-red-500';
  };

  // Function to determine risk level text
  const getRiskLevelText = (score) => {
    if (score < 40) return 'Low';
    if (score < 70) return 'Medium';
    return 'High';
  };

  // Function to determine risk color for gradient
  const getRiskGradient = (score) => {
    if (score < 40) return 'from-green-500 to-emerald-600';
    if (score < 70) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-rose-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center items-center">
        <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8"
      >
        <div className="px-4 py-6 sm:px-0">
          <motion.h1 
            variants={fadeIn}
            className="text-3xl font-bold gradient-heading"
          >
            Dashboard
          </motion.h1>
          
          <motion.div 
            variants={fadeIn}
            className="mt-6"
          >
            <div className="card p-0 overflow-hidden">
              <div className="px-6 py-5 bg-gradient-to-r from-blue-500 to-indigo-600">
                <h2 className="text-xl leading-6 font-bold text-white">
                  {businessData.name} - Business Overview
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-blue-100">
                  Quick snapshot of your business health
                </p>
              </div>
              
              <div>
                <dl>
                  <div className="px-6 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Risk Score</dt>
                    <dd className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="flex items-center">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden mr-4 flex items-center justify-center bg-gray-100 shadow-inner">
                          <svg viewBox="0 0 36 36" className="w-24 h-24">
                            <path
                              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#eee"
                              strokeWidth="3"
                              strokeDasharray="100, 100"
                            />
                            <path
                              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke={`url(#gradient-${businessData.riskScore})`}
                              strokeWidth="3"
                              strokeDasharray={`${businessData.riskScore}, 100`}
                            />
                            <defs>
                              <linearGradient id={`gradient-${businessData.riskScore}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" className={`stop-color-start-${businessData.riskScore}`} />
                                <stop offset="100%" className={`stop-color-end-${businessData.riskScore}`} />
                              </linearGradient>
                            </defs>
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-lg font-bold">{businessData.riskScore}%</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-2xl font-bold">{businessData.riskScore}%</span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelStyle(businessData.riskScore)} font-semibold`}>
                            {getRiskLevelText(businessData.riskScore)} Risk
                          </span>
                        </div>
                      </div>
                    </dd>
                  </div>
                  
                  <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t border-gray-100">
                    <dt className="text-sm font-medium text-gray-500">Monthly Sales</dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900 sm:mt-0 sm:col-span-2">
                      ${businessData.monthlySales.toLocaleString()}
                    </dd>
                  </div>
                  
                  <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t border-gray-100">
                    <dt className="text-sm font-medium text-gray-500">Active Customers</dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900 sm:mt-0 sm:col-span-2">
                      {businessData.customerCount}
                    </dd>
                  </div>
                  
                  <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t border-gray-100">
                    <dt className="text-sm font-medium text-gray-500">Stock Value</dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900 sm:mt-0 sm:col-span-2">
                      ${businessData.stockValue.toLocaleString()}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            variants={fadeIn}
            className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2"
          >
            <motion.div 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="card overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
              <div className="px-6 py-5">
                <h3 className="text-lg leading-6 font-bold text-gray-900 mb-3">
                  Update Business Data
                </h3>
                <div className="text-sm text-gray-500">
                  <p>
                    Keep your business data up to date to get accurate risk predictions.
                  </p>
                </div>
                <div className="mt-5">
                  <Link
                    to="/business-data"
                    className="btn btn-primary inline-flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    Update Data
                  </Link>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="card overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-green-500"></div>
              <div className="px-6 py-5">
                <h3 className="text-lg leading-6 font-bold text-gray-900 mb-3">
                  View Recommendations
                </h3>
                <div className="text-sm text-gray-500">
                  <p>
                    Get personalized recommendations to improve your business health.
                  </p>
                </div>
                <div className="mt-5">
                  <Link
                    to="/recommendations"
                    className="btn inline-flex items-center bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:from-green-600 hover:to-emerald-700 hover:shadow-lg transform hover:scale-105"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                    </svg>
                    View Recommendations
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            variants={fadeIn}
            className="mt-8"
          >
            <div className="card p-0 overflow-hidden">
              <div className="px-6 py-5 bg-gradient-to-r from-indigo-500 to-purple-600">
                <h3 className="text-xl leading-6 font-bold text-white">
                  Recent Risk Trends
                </h3>
                <p className="mt-1 text-sm text-indigo-100">
                  Monitoring your business risk over time
                </p>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-5">
                  This is where charts and graphs would display risk trends over time.
                  In a real implementation, this would use a charting library like Chart.js or Recharts.
                </p>
                
                {/* Placeholder for charts */}
                <div className="h-64 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                    <span className="block mt-2 text-gray-500">
                      Risk Score Trends
                    </span>
                  </div>
                </div>
                <div className="mt-5">
                  <Link
                    to="/risk-prediction"
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                  >
                    View detailed risk analysis 
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage; 