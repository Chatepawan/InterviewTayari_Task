const SQLPrepPlan = require('../models/SQLPrepPlan');
const AIGenerator = require('../utils/aiGenerator');

exports.generateSQLPrepPlan = async (req, res) => {
  try {
    const { yearsOfExperience, currentCTC, targetCompanies, timeCommitment } = req.body;
    const userId = req.user.id;

    console.log('Received Generate Plan Request:', {
      yearsOfExperience,
      currentCTC,
      targetCompanies,
      timeCommitment
    });

    // Validate input
    if (!yearsOfExperience || !currentCTC || !targetCompanies || !timeCommitment) {
      return res.status(400).json({
        message: 'Missing required input parameters',
        details: {
          yearsOfExperience: !!yearsOfExperience,
          currentCTC: !!currentCTC,
          targetCompanies: !!targetCompanies,
          timeCommitment: !!timeCommitment
        }
      });
    }

    // Generate AI-powered SQL prep plan
    const questions = await AIGenerator.generateSQLPrepPlan(req.body);

    // Get raw AI response text (added functionality)
    const aiResponse = AIGenerator.lastGeneratedResponse || 'No AI response available';

    // Ensure questions are generated
    if (!questions || questions.length === 0) {
      console.error('No Questions Generated');
      return res.status(500).json({ message: 'Failed to generate SQL prep questions' });
    }

    // Validate each question
    const validatedQuestions = questions.map(q => ({
      title: q.title || 'Untitled Question',
      difficulty: q.difficulty || 'Medium',
      concepts: Array.isArray(q.concepts) ? q.concepts : ['SQL'],
      description: q.description || 'No description provided',
      completed: false,
      category: q.category || 'Problem Solving'
    }));

    console.log('Validated Questions Count:', validatedQuestions.length);

    // Check if a prep plan already exists for the user
    let sqlPrepPlan = await SQLPrepPlan.findOne({ user: userId });

    if (sqlPrepPlan) {
      // Update the existing plan
      sqlPrepPlan.yearsOfExperience = yearsOfExperience;
      sqlPrepPlan.currentCTC = currentCTC;
      sqlPrepPlan.targetCompanies = targetCompanies;
      sqlPrepPlan.timeCommitment = timeCommitment;
      sqlPrepPlan.questions = validatedQuestions;
      sqlPrepPlan.generatedAt = Date.now();
    } else {
      // Create a new plan
      sqlPrepPlan = new SQLPrepPlan({
        user: userId,
        yearsOfExperience,
        currentCTC,
        targetCompanies,
        timeCommitment,
        questions: validatedQuestions,
        generatedAt: Date.now()
      });
    }

    await sqlPrepPlan.save();
    console.log('SQL Prep Plan Saved:', sqlPrepPlan._id);

    // Update user's SQL Prep Plan reference
    req.user.sqlPrepPlan = sqlPrepPlan._id;
    await req.user.save();

    // Return the structured questions and the AI response
    res.status(201).json({
      questions: validatedQuestions,
      metadata: {
        yearsOfExperience,
        currentCTC,
        targetCompanies,
        timeCommitment,
        generatedAt: sqlPrepPlan.generatedAt
      },
      aiResponse
    });

  } catch (error) {
    console.error('Detailed SQL Prep Plan Generation Error:', {
      message: error.message,
      stack: error.stack,
      input: req.body
    });
    res.status(500).json({ message: 'Error generating SQL prep plan', error: error.message });
  }
};

exports.getSavedSQLPrepPlan = async (req, res) => {
  try {
    const sqlPrepPlan = await SQLPrepPlan.findOne({ user: req.user._id })
      .sort({ generatedAt: -1 }) // Get the most recent plan
      .limit(1);

    console.log('Fetched SQL Prep Plan:', sqlPrepPlan ? 'Found' : 'Not Found');

    if (!sqlPrepPlan) {
      return res.status(404).json({ message: 'No SQL prep plan found' });
    }

    res.json(sqlPrepPlan);
  } catch (error) {
    console.error('Fetching SQL Prep Plan Error:', error);
    res.status(500).json({ message: 'Error retrieving SQL prep plan' });
  }
};

exports.updateQuestionProgress = async (req, res) => {
  try {
    const { questionId, completed } = req.body;

    if (!questionId) {
      return res.status(400).json({ message: 'Question ID is required' });
    }

    const sqlPrepPlan = await SQLPrepPlan.findOne({ user: req.user._id });

    if (!sqlPrepPlan) {
      return res.status(404).json({ message: 'No SQL prep plan found' });
    }

    const questionIndex = sqlPrepPlan.questions.findIndex(q => q._id.toString() === questionId);

    if (questionIndex === -1) {
      return res.status(404).json({ message: 'Question not found' });
    }

    sqlPrepPlan.questions[questionIndex].completed = completed;
    await sqlPrepPlan.save();

    res.json(sqlPrepPlan);
  } catch (error) {
    console.error('Updating Question Progress Error:', error);
    res.status(500).json({ message: 'Error updating question progress' });
  }
};
