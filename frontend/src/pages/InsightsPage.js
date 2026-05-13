import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const InsightsPage = () => {
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [reportType, setReportType] = useState('sales');

  useEffect(() => {
    const fetchData = async () => {
      // In a real app, this would be an API call to fetch the data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data
      setSalesData([
        { name: 'Jan', value: 12000 },
        { name: 'Feb', value: 15000 },
        { name: 'Mar', value: 18000 },
        { name: 'Apr', value: 16000 },
        { name: 'May', value: 21000 },
        { name: 'Jun', value: 19000 }
      ]);
      
      setCustomerData([
        { name: 'Returning', value: 65 },
        { name: 'New', value: 35 }
      ]);
      
      setStockData([
        { name: 'Product A', value: 30 },
        { name: 'Product B', value: 25 },
        { name: 'Product C', value: 20 },
        { name: 'Product D', value: 15 },
        { name: 'Product E', value: 10 }
      ]);
      
      setLoading(false);
    };
    
    fetchData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const downloadReport = () => {
    alert(`Generating ${reportType} report for ${selectedTimeframe} timeframe...`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Header />
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <div className="relative w-24 h-24">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-t-4 border-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-xl font-medium text-gray-700">Loading your business insights...</p>
          <p className="mt-2 text-sm text-gray-500">We're analyzing your business data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn} className="mb-8">
            <h1 className="text-3xl font-bold gradient-heading">
              Business Insights Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Track your business performance and identify trends for strategic decisions
            </p>
          </motion.div>

          <motion.div variants={fadeIn} className="mb-6 flex flex-wrap gap-4">
            <motion.button 
              whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
              whileTap={{ y: 0 }}
              onClick={() => setSelectedTimeframe('week')}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                selectedTimeframe === 'week' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Weekly
            </motion.button>
            <motion.button
              whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
              whileTap={{ y: 0 }} 
              onClick={() => setSelectedTimeframe('month')}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                selectedTimeframe === 'month' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Monthly
            </motion.button>
            <motion.button
              whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
              whileTap={{ y: 0 }} 
              onClick={() => setSelectedTimeframe('quarter')}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                selectedTimeframe === 'quarter' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Quarterly
            </motion.button>
            <motion.button
              whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
              whileTap={{ y: 0 }} 
              onClick={() => setSelectedTimeframe('year')}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                selectedTimeframe === 'year' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Yearly
            </motion.button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sales Trend */}
            <motion.div 
              variants={fadeIn}
              className="card"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Sales Trend</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Customer Distribution */}
            <motion.div 
              variants={fadeIn}
              className="card"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Customer Distribution</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={customerData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      animationBegin={200}
                      animationDuration={800}
                    >
                      {customerData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Top Selling Products */}
            <motion.div 
              variants={fadeIn}
              className="card"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Top Selling Products</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stockData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#82ca9d" animationBegin={400} animationDuration={800} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Business Report Section */}
          <motion.div 
            variants={fadeIn}
            className="mt-10 card"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Business Reports</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                <select 
                  value={reportType} 
                  onChange={(e) => setReportType(e.target.value)}
                  className="input"
                >
                  <option value="sales">Sales Report</option>
                  <option value="inventory">Inventory Report</option>
                  <option value="customer">Customer Report</option>
                  <option value="financial">Financial Report</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Format</label>
                <select 
                  className="input"
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                </select>
              </div>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={downloadReport}
              className="btn btn-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Generate Report
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default InsightsPage; 