const asyncHandler = require('express-async-handler');

// @desc    Get current risk score
// @route   GET /api/risk/current
// @access  Private
const getCurrentRisk = asyncHandler(async (req, res) => {
  // Mock data for frontend development
  res.status(200).json({
    score: 72,
    category: 'Moderate Risk',
    lastUpdated: new Date().toISOString(),
    trend: 'improving'
  });
});

// @desc    Get risk history
// @route   GET /api/risk/history
// @access  Private
const getRiskHistory = asyncHandler(async (req, res) => {
  // Mock data for frontend development
  res.status(200).json([
    { date: '2023-01-01', score: 65, category: 'High Risk' },
    { date: '2023-02-01', score: 68, category: 'Moderate Risk' },
    { date: '2023-03-01', score: 70, category: 'Moderate Risk' },
    { date: '2023-04-01', score: 72, category: 'Moderate Risk' },
    { date: '2023-05-01', score: 75, category: 'Moderate Risk' },
    { date: '2023-06-01', score: 78, category: 'Low Risk' }
  ]);
});

// @desc    Calculate new risk score
// @route   POST /api/risk/calculate
// @access  Private
const calculateRisk = asyncHandler(async (req, res) => {
  // In a real app, this would analyze business data and calculate a risk score
  const { businessData } = req.body;
  
  // Simulated calculation
  const newScore = Math.floor(Math.random() * 20) + 65; // Random score between 65-85
  const category = newScore < 70 ? 'High Risk' : newScore < 80 ? 'Moderate Risk' : 'Low Risk';
  
  res.status(200).json({
    score: newScore,
    category,
    lastUpdated: new Date().toISOString(),
    message: 'Risk score has been recalculated'
  });
});

// @desc    Get risk factors
// @route   GET /api/risk/factors
// @access  Private
const getRiskFactors = asyncHandler(async (req, res) => {
  // Mock data for frontend development
  res.status(200).json([
    { id: 1, name: 'Cash Flow', score: 65, impact: 'high', trend: 'declining' },
    { id: 2, name: 'Debt Management', score: 72, impact: 'high', trend: 'stable' },
    { id: 3, name: 'Industry Stability', score: 80, impact: 'medium', trend: 'improving' },
    { id: 4, name: 'Business Growth', score: 75, impact: 'medium', trend: 'improving' },
    { id: 5, name: 'Market Competition', score: 68, impact: 'medium', trend: 'stable' },
    { id: 6, name: 'Operational Efficiency', score: 70, impact: 'low', trend: 'stable' }
  ]);
});

// @desc    Get risk trends
// @route   GET /api/risk/trends
// @access  Private
const getRiskTrends = asyncHandler(async (req, res) => {
  // Mock data for frontend development
  res.status(200).json({
    overall: [70, 72, 74, 73, 75, 78],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    factors: {
      cashFlow: [65, 66, 68, 67, 69, 72],
      debtManagement: [70, 71, 72, 72, 73, 75],
      industryStability: [75, 76, 77, 78, 79, 80],
      businessGrowth: [68, 70, 72, 73, 74, 75],
      marketCompetition: [72, 71, 70, 69, 68, 68],
      operationalEfficiency: [62, 65, 68, 70, 70, 70]
    }
  });
});

module.exports = {
  getCurrentRisk,
  getRiskHistory,
  calculateRisk,
  getRiskFactors,
  getRiskTrends
}; 