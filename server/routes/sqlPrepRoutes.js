// server/routes/sqlPrepRoutes.js

const express = require('express');
const {
  generateSQLPrepPlan,
  getSavedSQLPrepPlan,
  updateQuestionProgress
} = require('../controllers/sqlPrepController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   POST /api/sql-prep/generate
 * @desc    Generate a new SQL preparation plan
 * @access  Private (requires authentication)
 */
router.post('/generate', authMiddleware, generateSQLPrepPlan);

/**
 * @route   GET /api/sql-prep/saved-plan
 * @desc    Retrieve the saved SQL preparation plan of the authenticated user
 * @access  Private (requires authentication)
 */
router.get('/saved-plan', authMiddleware, getSavedSQLPrepPlan);

/**
 * @route   PATCH /api/sql-prep/update-progress
 * @desc    Update the completion status of a specific SQL prep question
 * @access  Private (requires authentication)
 */
router.patch('/update-progress', authMiddleware, updateQuestionProgress);

module.exports = router;
