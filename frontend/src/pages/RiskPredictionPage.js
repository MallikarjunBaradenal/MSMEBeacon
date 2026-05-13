import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';

const RiskPredictionPage = () => {
  const [loading, setLoading] = useState(true);
  const [riskData, setRiskData] = useState({
    riskScore: 65,
    riskLevel: 'Medium',
    factors: [
      { name: 'Cash Flow', impact: 'High', score: 75 },
      { name: 'Customer Retention', impact: 'Medium', score: 60 },
      { name: 'Market Competition', impact: 'High', score: 80 },
      { name: 'Inventory Management', impact: 'Medium', score: 55 },
      { name: 'Operating Costs', impact: 'Low', score: 40 }
    ],
    trends: {
      lastMonth: 70,
      last3Months: 68,
      last6Months: 58
    }
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

  // Simulate fetching risk data
  useEffect(() => {
    const fetchRiskData = async () => {
      try {
        // In a real app, this would be an API call to your backend
        console.log('Fetching risk data...');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // We're using the default state values for demo
        setLoading(false);
      } catch (error) {
        console.error('Error fetching risk data:', error);
        setLoading(false);
      }
    };

    fetchRiskData();
  }, []);

  // Function to determine risk level styling
  const getRiskLevelStyle = (score) => {
    if (score < 40) return 'text-green-600';
    if (score < 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Function to determine risk gradient styling
  const getRiskGradient = (score) => {
    if (score < 40) return 'from-green-500 to-emerald-500';
    if (score < 70) return 'from-yellow-500 to-amber-500';
    return 'from-red-500 to-rose-500';
  };

  // Function to determine risk level text
  const getRiskLevelText = (score) => {
    if (score < 40) return 'Low';
    if (score < 70) return 'Medium';
    return 'High';
  };

  // Function to get impact color
  const getImpactColor = (impact) => {
    if (impact === 'Low') return 'text-green-600';
    if (impact === 'Medium') return 'text-yellow-600';
    return 'text-red-600';
  };

  // Function to get impact badge style
  const getImpactBadgeStyle = (impact) => {
    if (impact === 'Low') return 'bg-green-100 text-green-800';
    if (impact === 'Medium') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Function to render factor bar
  const renderFactorBar = (score) => {
    let gradientClass = '';
    if (score < 40) gradientClass = 'bg-gradient-to-r from-green-500 to-emerald-500';
    else if (score < 70) gradientClass = 'bg-gradient-to-r from-yellow-500 to-amber-500';
    else gradientClass = 'bg-gradient-to-r from-red-500 to-rose-500';

    return (
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-3 rounded-full ${gradientClass}`}
        ></motion.div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center items-center">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-t-4 border-blue-600 rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-gray-700 font-medium">Analyzing business risk...</p>
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
            Risk Prediction
          </motion.h1>
          
          <motion.div variants={fadeIn} className="mt-6">
            <div className="card overflow-hidden">
              <div className="p-0">
                <div className={`px-6 py-5 bg-gradient-to-r ${getRiskGradient(riskData.riskScore)}`}>
                  <h2 className="text-xl font-bold text-white">Business Risk Assessment</h2>
                  <p className="text-sm text-white text-opacity-90">Based on your latest business data</p>
                </div>
                
                <div className="p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="relative mb-8 md:mb-0">
                      <div className="w-48 h-48 relative mx-auto">
                        {/* Risk score circle with gradient */}
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          {/* Background circle */}
                          <circle 
                            className="text-gray-200" 
                            strokeWidth="8" 
                            stroke="currentColor" 
                            fill="transparent" 
                            r="42" 
                            cx="50" 
                            cy="50" 
                          />
                          {/* Animated progress circle */}
                          <motion.circle 
                            initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                            animate={{ 
                              strokeDashoffset: 2 * Math.PI * 42 * (1 - riskData.riskScore / 100) 
                            }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className={riskData.riskScore < 40 ? 'text-green-500' : riskData.riskScore < 70 ? 'text-yellow-500' : 'text-red-500'} 
                            strokeWidth="8" 
                            strokeLinecap="round" 
                            stroke="currentColor" 
                            fill="transparent" 
                            r="42" 
                            cx="50" 
                            cy="50" 
                            strokeDasharray={`${2 * Math.PI * 42}`}
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                        {/* Center text */}
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                          <motion.p 
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="text-4xl font-bold"
                          >
                            {riskData.riskScore}%
                          </motion.p>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                              riskData.riskScore < 40 
                                ? 'bg-green-100 text-green-800' 
                                : riskData.riskScore < 70 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {getRiskLevelText(riskData.riskScore)} Risk
                          </motion.div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:w-1/2">
                      <h3 className="text-md font-bold text-gray-900 mb-3">Risk Analysis</h3>
                      <p className="text-sm text-gray-600">
                        This assessment evaluates your business's survival risk based on multiple factors including financial health, market conditions, and operational efficiency.
                      </p>
                      
                      <div className="mt-4 p-4 rounded-lg border border-l-4 
                        ${riskData.riskScore < 40 
                          ? 'border-green-400 bg-green-50' 
                          : riskData.riskScore < 70 
                            ? 'border-yellow-400 bg-yellow-50' 
                            : 'border-red-400 bg-red-50'
                        }"
                      >
                        {riskData.riskScore >= 70 ? (
                          <p className="text-red-800 font-medium">
                            Your business is at high risk. Immediate action is recommended to address critical areas.
                          </p>
                        ) : riskData.riskScore >= 40 ? (
                          <p className="text-yellow-800 font-medium">
                            Your business is at moderate risk. Consider addressing the key factors to improve stability.
                          </p>
                        ) : (
                          <p className="text-green-800 font-medium">
                            Your business is at low risk. Continue monitoring your metrics and making small improvements.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={fadeIn} className="mt-8">
            <div className="card overflow-hidden">
              <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-indigo-600">
                <h2 className="text-xl font-bold text-white">Key Risk Factors</h2>
                <p className="text-sm text-blue-100">
                  These factors are contributing to your overall risk score
                </p>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  {riskData.factors.map((factor, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <div className={`w-2 h-8 rounded-full mr-3 bg-gradient-to-b ${
                            factor.score < 40 
                              ? 'from-green-400 to-green-600' 
                              : factor.score < 70 
                                ? 'from-yellow-400 to-yellow-600' 
                                : 'from-red-400 to-red-600'
                          }`}></div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{factor.name}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getImpactBadgeStyle(factor.impact)}`}>
                              {factor.impact} Impact
                            </span>
                          </div>
                        </div>
                        <span className={`text-lg font-bold ${getRiskLevelStyle(factor.score)}`}>{factor.score}%</span>
                      </div>
                      <div className="mt-1">
                        {renderFactorBar(factor.score)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={fadeIn} className="mt-8">
            <div className="card overflow-hidden">
              <div className="px-6 py-5 bg-gradient-to-r from-indigo-600 to-purple-600">
                <h2 className="text-xl font-bold text-white">Risk Trends</h2>
                <p className="text-sm text-indigo-100">
                  How your risk score has changed over time
                </p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(riskData.trends).map(([period, score], index) => (
                    <motion.div 
                      key={period} 
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      className="bg-white bg-opacity-70 backdrop-filter backdrop-blur-sm rounded-xl shadow-sm p-4 border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-500">
                          {period === 'lastMonth' ? 'Last Month' : 
                           period === 'last3Months' ? 'Last 3 Months' : 
                           'Last 6 Months'}
                        </p>
                        <div className={`h-2 w-2 rounded-full ${score < 40 ? 'bg-green-500' : score < 70 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                      </div>
                      <div className="flex items-end justify-between">
                        <p className={`text-2xl font-bold ${getRiskLevelStyle(score)}`}>
                          {score}%
                        </p>
                        <div className="text-xs text-gray-500">
                          {score > riskData.riskScore ? (
                            <span className="flex items-center text-red-500">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                              </svg>
                              {Math.abs(score - riskData.riskScore)}%
                            </span>
                          ) : score < riskData.riskScore ? (
                            <span className="flex items-center text-green-500">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                              </svg>
                              {Math.abs(riskData.riskScore - score)}%
                            </span>
                          ) : (
                            <span className="flex items-center text-gray-500">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14" />
                              </svg>
                              0%
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Placeholder for chart */}
                <div className="mt-6 h-64 border border-gray-200 rounded-lg flex items-center justify-center bg-white bg-opacity-50">
                  <div className="text-center">
                    <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="mt-2 text-gray-500">Historical Risk Trends</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            variants={fadeIn} 
            className="mt-8 flex flex-col sm:flex-row justify-between gap-4"
          >
            <motion.div whileHover={{ scale: 1.03 }}>
              <Link
                to="/business-data"
                className="btn btn-secondary flex items-center w-full sm:w-auto justify-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Update Business Data
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.03 }}>
              <Link
                to="/recommendations"
                className="btn btn-primary flex items-center w-full sm:w-auto justify-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                View Recommendations
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default RiskPredictionPage; 