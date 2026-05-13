import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';

const RecommendationsPage = () => {
  const [loading, setLoading] = useState(true);
  const [recommendations] = useState([
    {
      id: 1,
      category: 'Cash Flow',
      priority: 'High',
      title: 'Improve Cash Flow Management',
      description: 'Your business is experiencing cash flow issues that could lead to operational difficulties.',
      actions: [
        'Implement a stricter invoicing system with shorter payment terms',
        'Consider offering discounts for early payments',
        'Review and negotiate payment terms with suppliers',
        'Establish a cash reserve to cover at least 3 months of operating expenses'
      ]
    },
    {
      id: 2,
      category: 'Customer Retention',
      priority: 'Medium',
      title: 'Enhance Customer Retention Strategies',
      description: 'Your customer churn rate is higher than the industry average, which may impact long-term sustainability.',
      actions: [
        'Implement a customer loyalty program',
        'Conduct regular customer satisfaction surveys',
        'Personalize customer communications',
        'Provide special offers to long-standing customers'
      ]
    },
    {
      id: 3,
      category: 'Inventory',
      priority: 'Medium',
      title: 'Optimize Inventory Management',
      description: 'Your business has excess inventory that is tying up capital and increasing carrying costs.',
      actions: [
        'Implement a just-in-time inventory system',
        'Identify and liquidate slow-moving stock',
        'Use inventory management software to track stock levels',
        'Negotiate consignment arrangements with suppliers for new products'
      ]
    },
    {
      id: 4,
      category: 'Marketing',
      priority: 'Low',
      title: 'Improve Marketing ROI',
      description: 'Your marketing spend is not generating sufficient returns, suggesting inefficient marketing strategies.',
      actions: [
        'Track and analyze marketing campaign performance',
        'Focus spending on channels with proven ROI',
        'Develop targeted campaigns for specific customer segments',
        'Explore digital marketing strategies with lower upfront costs'
      ]
    },
    {
      id: 5,
      category: 'Operations',
      priority: 'High',
      title: 'Reduce Operating Costs',
      description: 'Your operational expenses are significantly higher than industry benchmarks, affecting profitability.',
      actions: [
        'Conduct an audit of all operational expenses',
        'Identify non-essential expenses that can be reduced or eliminated',
        'Negotiate better terms with service providers',
        'Consider automation for repetitive tasks to reduce labor costs'
      ]
    }
  ]);
  const [filteredRecommendations, setFilteredRecommendations] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');

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

  // Simulate fetching recommendations data
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // In a real app, this would be an API call to your backend
        console.log('Fetching recommendations...');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // We're using the default state values for demo
        setLoading(false);
        setFilteredRecommendations(recommendations);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [recommendations]);

  // Apply filter when activeFilter changes
  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredRecommendations(recommendations);
    } else {
      const filtered = recommendations.filter(rec => rec.priority === activeFilter);
      setFilteredRecommendations(filtered);
    }
  }, [activeFilter, recommendations]);

  // Apply filter function
  const handleFilterChange = (priority) => {
    setActiveFilter(priority);
  };

  // Function to get priority badge color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-800 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getPriorityGradient = (priority) => {
    switch (priority) {
      case 'High':
        return 'from-red-500 to-pink-500';
      case 'Medium':
        return 'from-yellow-500 to-amber-500';
      case 'Low':
        return 'from-green-500 to-emerald-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  // Function to render expandable recommendation card
  const RecommendationCard = ({ recommendation, index }) => {
    const [expanded, setExpanded] = useState(false);
    
    return (
      <motion.div 
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        transition={{ delay: index * 0.1 }}
        className="card overflow-hidden relative"
      >
        <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${getPriorityGradient(recommendation.priority)}`}></div>
        <div className="px-6 py-5">
          <div className="flex justify-between items-start">
            <div>
              <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${getPriorityColor(recommendation.priority)}`}>
                {recommendation.priority} Priority
              </span>
              <h3 className="mt-2 text-lg font-bold text-gray-900">{recommendation.title}</h3>
              <p className="mt-1 text-sm text-blue-600">{recommendation.category}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setExpanded(!expanded)}
              className="text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium flex items-center"
            >
              {expanded ? (
                <>
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                  </svg>
                  Collapse
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                  Expand
                </>
              )}
            </motion.button>
          </div>
          
          {expanded && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <p className="text-sm text-gray-600">{recommendation.description}</p>
              
              <h4 className="mt-4 text-sm font-medium text-gray-900">Recommended Actions:</h4>
              <ul className="mt-2 list-disc pl-5 text-sm text-gray-600 space-y-1">
                {recommendation.actions.map((action, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {action}
                  </motion.li>
                ))}
              </ul>
              
              <div className="mt-5 flex flex-wrap gap-3">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary inline-flex items-center py-1.5 px-4"
                  onClick={() => alert(`Implement action for "${recommendation.title}"`)}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Implement This
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-secondary inline-flex items-center py-1.5 px-4"
                  onClick={() => alert(`Marking "${recommendation.title}" as completed would be saved to your account`)}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                  </svg>
                  Mark as Completed
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center items-center">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-t-4 border-blue-600 rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-gray-700 font-medium">Loading recommendations...</p>
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
          <motion.div variants={fadeIn}>
            <h1 className="text-3xl font-bold gradient-heading">Recommendations</h1>
            <p className="mt-1 text-sm text-gray-700 font-medium">
              Personalized recommendations based on your business data to improve your risk score.
            </p>
          </motion.div>
          
          <motion.div variants={fadeIn} className="mt-6">
            <div className="card p-0 overflow-hidden mb-6">
              <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-indigo-600">
                <h2 className="text-lg font-bold text-white">Filter Recommendations</h2>
                <p className="text-sm text-blue-100">Select recommendations by priority level</p>
              </div>
              <div className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm font-medium text-gray-700">Filter by priority:</div>
                  <div className="mt-2 sm:mt-0 flex flex-wrap gap-2">
                    <motion.button 
                      whileHover={{ y: -2 }} 
                      className={`px-3 py-1 rounded-md ${activeFilter === 'High' ? 'bg-red-200 border-red-300' : 'bg-red-100 border-red-200'} text-red-800 text-sm font-medium border hover:bg-red-200 transition-colors duration-200`}
                      onClick={() => handleFilterChange('High')}
                    >
                      High
                    </motion.button>
                    <motion.button 
                      whileHover={{ y: -2 }} 
                      className={`px-3 py-1 rounded-md ${activeFilter === 'Medium' ? 'bg-yellow-200 border-yellow-300' : 'bg-yellow-100 border-yellow-200'} text-yellow-800 text-sm font-medium border hover:bg-yellow-200 transition-colors duration-200`}
                      onClick={() => handleFilterChange('Medium')}
                    >
                      Medium
                    </motion.button>
                    <motion.button 
                      whileHover={{ y: -2 }} 
                      className={`px-3 py-1 rounded-md ${activeFilter === 'Low' ? 'bg-green-200 border-green-300' : 'bg-green-100 border-green-200'} text-green-800 text-sm font-medium border hover:bg-green-200 transition-colors duration-200`}
                      onClick={() => handleFilterChange('Low')}
                    >
                      Low
                    </motion.button>
                    <motion.button 
                      whileHover={{ y: -2 }} 
                      className={`px-3 py-1 rounded-md ${activeFilter === 'All' ? 'bg-blue-200 border-blue-300' : 'bg-blue-100 border-blue-200'} text-blue-800 text-sm font-medium border hover:bg-blue-200 transition-colors duration-200`}
                      onClick={() => handleFilterChange('All')}
                    >
                      All
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
              
            {/* Recommendations list */}
            <div className="space-y-4">
              {filteredRecommendations.map((recommendation, index) => (
                <RecommendationCard 
                  key={recommendation.id} 
                  recommendation={recommendation} 
                  index={index}
                />
              ))}
            </div>
            
            {/* No recommendations placeholder */}
            {filteredRecommendations.length === 0 && (
              <motion.div 
                variants={fadeIn}
                className="card p-8 text-center"
              >
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No recommendations</h3>
                <p className="mt-1 text-sm text-gray-500">
                  We do not have any recommendations with the selected priority at this time.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => handleFilterChange('All')}
                    className="btn btn-primary inline-flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    Show All Recommendations
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
          
          <motion.div variants={fadeIn} className="mt-8">
            <div className="card overflow-hidden p-0">
              <div className="px-6 py-5 bg-gradient-to-r from-indigo-500 to-purple-600">
                <h2 className="text-lg font-bold text-white">Need Help?</h2>
                <p className="text-sm text-indigo-100">Contact our business advisors for personalized assistance</p>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-600 mb-5">
                  Our business advisors can help you implement these recommendations and provide additional guidance tailored to your specific business needs.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary inline-flex items-center"
                  onClick={() => alert('This would connect you with a business advisor')}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                  Schedule Consultation
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default RecommendationsPage; 