const Recommendation = require('../models/Recommendation');
const Risk = require('../models/Risk');

// Helper: simple sanitizer
const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

// GET /api/recommendations
// (Legacy compat: return all stored recommendations)
const getRecommendations = async (req, res, next) => {
  try {
    const items = await Recommendation.find({ user: req.user?._id }).lean();
    res.json(items);
  } catch (err) {
    next(err);
  }
};

// GET /api/recommendations/:id
const getRecommendationById = async (req, res, next) => {
  try {
    const item = await Recommendation.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ message: 'Recommendation not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

// POST /api/recommendations/generate
// Expects optional body: { riskLevel, factors, businessName }.
// If not provided, it tries to use latest Risk record.
const generateRecommendations = async (req, res, next) => {
  try {
    const { riskLevel, factors, businessName } = req.body || {};

    // If riskLevel isn't passed, try to derive from latest risk prediction
    let derivedRiskLevel = riskLevel;
    if (!derivedRiskLevel) {
      const latest = await Risk.findOne({ user: req.user?._id }).sort({ createdAt: -1 }).lean();
      derivedRiskLevel = latest?.risk_level || latest?.riskLevel;
    }

    const level = (derivedRiskLevel || 'medium').toLowerCase();

    const recommendationsByLevel = {
      low: [
        'Maintain your current cash-flow discipline and keep monitoring key financial indicators monthly.',
        'Continue investing in customer retention and operational efficiency.'
      ],
      medium: [
        'Improve liquidity by tightening receivables and managing expenses more closely.',
        'Consider diversifying suppliers and strengthening inventory planning.'
      ],
      high: [
        'Prioritize debt restructuring/repayment planning and reduce high-cost expenditures.',
        'Create a short-term cash buffer (e.g., 2–3 months of operating costs) and renegotiate payment terms.'
      ]
    };

    const text = recommendationsByLevel[level] || recommendationsByLevel.medium;

    const doc = await Recommendation.create({
      user: req.user?._id,
      riskLevel: level,
      factors: Array.isArray(factors) ? factors : [],
      businessName: businessName || null,
      recommendations: text
    });

    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
};

// PUT /api/recommendations/:id/status
const updateRecommendationStatus = async (req, res, next) => {
  try {
    const { status } = req.body || {};
    const item = await Recommendation.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Recommendation not found' });

    // Only update allowed fields
    if (status) item.status = status;
    await item.save();

    res.json(item);
  } catch (err) {
    next(err);
  }
};

// GET /api/recommendations/filter/:priority
const filterRecommendationsByPriority = async (req, res, next) => {
  try {
    const priority = String(req.params.priority || '').toLowerCase();
    const valid = new Set(['low', 'medium', 'high']);
    const riskLevel = valid.has(priority) ? priority : 'medium';

    const items = await Recommendation.find({
      user: req.user?._id,
      riskLevel
    }).lean();

    res.json(items);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getRecommendations,
  getRecommendationById,
  generateRecommendations,
  updateRecommendationStatus,
  filterRecommendationsByPriority
};

