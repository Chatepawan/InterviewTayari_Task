
const SQLPrepPlan = require('../models/SQLPrepPlan');
const AIGenerator = require('../utils/aiGenerator');

exports.generateSQLPrepPlan = async (req, res) => {
  try {
    const { 
      yearsOfExperience, 
      currentCTC, 
      targetCompanies, 
      timeCommitment 
    } = req.body;

    console.log('Received Generate Plan Request:', {
      yearsOfExperience,
      currentCTC,
      targetCompanies,
      timeCommitment
    });

    // Input validation
    if (!yearsOfExperience || !currentCTC || !targetCompanies || !timeCommitment) {
      console.error('Missing Input Parameters');
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
    const questions = await AIGenerator.generateSQLPrepPlan({
      yearsOfExperience,
      currentCTC,
      targetCompanies,
      timeCommitment
    });

    console.log('Generated Questions:', questions);

    // Ensure questions are generated
    if (!questions || questions.length === 0) {
      console.error('No Questions Generated');
      return res.status(500).json({ 
        message: 'Failed to generate SQL prep questions' 
      });
    }

    // Create and save prep plan
    const sqlPrepPlan = new SQLPrepPlan({
      user: req.user._id,
      yearsOfExperience,
      currentCTC,
      targetCompanies,
      timeCommitment,
      questions: questions.map(q => ({
        title: q.title,
        difficulty: q.difficulty,
        concepts: q.concepts,
        description: q.description,
        completed: false,
        category: q.category || 'Problem Solving'
      }))
    });

    await sqlPrepPlan.save();
    console.log('SQL Prep Plan Saved:', sqlPrepPlan._id);

    // Update user's sqlPrepPlan reference
    req.user.sqlPrepPlan = sqlPrepPlan._id;
    await req.user.save();

    res.status(201).json(sqlPrepPlan);
  } catch (error) {
    console.error('Detailed SQL Prep Plan Generation Error:', {
      message: error.message,
      stack: error.stack,
      input: req.body
    });
    res.status(500).json({ 
      message: 'Error generating SQL prep plan',
      error: error.message 
    });
  }
};

exports.getSavedSQLPrepPlan = async (req, res) => {
  try {
    const sqlPrepPlan = await SQLPrepPlan.findOne({ user: req.user._id });
    
    console.log('Fetched SQL Prep Plan:', sqlPrepPlan);

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
    
    const sqlPrepPlan = await SQLPrepPlan.findOne({ user: req.user._id });
    
    if (!sqlPrepPlan) {
      return res.status(404).json({ message: 'No SQL prep plan found' });
    }

    const questionIndex = sqlPrepPlan.questions.findIndex(
      q => q._id.toString() === questionId
    );

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