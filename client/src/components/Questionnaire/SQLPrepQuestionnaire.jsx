import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSQLPrep } from '../../context/SQLPrepContext';
import { useAuth } from '../../context/AuthContext';

const SQLPrepQuestionnaire = () => {
  const [formData, setFormData] = useState({
    yearsOfExperience: '',
    currentCTC: '',
    targetCompanies: [],
    timeCommitment: ''
  });
  const [showResults, setShowResults] = useState(false);

  const navigate = useNavigate();
  const { generatePlan, sqlPrepPlan, loading, error, clearPlan } = useSQLPrep();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'targetCompanies' 
        ? value.split(',').map(company => company.trim())
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setShowResults(false);
      console.log('Submitting form data:', formData);
      await generatePlan(formData);
      setShowResults(true);
    } catch (err) {
      console.error('Plan generation failed', err);
    }
  };

  const handleContinue = () => {
    navigate('/sql-prep-kit');
  };

  const handleReset = () => {
    clearPlan();
    setShowResults(false);
    setFormData({
      yearsOfExperience: '',
      currentCTC: '',
      targetCompanies: [],
      timeCommitment: ''
    });
  };

  // Function to format and display the AI-generated plan
  const formatAIResponse = () => {
    if (!sqlPrepPlan) return null;
    
    // Try to get the raw AI response
    const rawPlan = sqlPrepPlan.rawPlan;
    
    if (!rawPlan) {
      // If no raw response is available, display the structured questions
      return (
        <div>
          <h3 className="text-lg font-bold mb-3">Generated Questions</h3>
          <div className="space-y-3">
            {sqlPrepPlan.questions && sqlPrepPlan.questions.length > 0 ? (
              sqlPrepPlan.questions.map((q, idx) => (
                <div key={idx} className="p-3 bg-gray-100 rounded-md">
                  <p className="font-semibold">{q.title}</p>
                  <div className="flex gap-2 text-sm mt-1">
                    <span className={`px-2 py-0.5 rounded ${
                      q.difficulty === 'Easy' ? 'bg-green-200' :
                      q.difficulty === 'Medium' ? 'bg-yellow-200' :
                      'bg-red-200'
                    }`}>
                      {q.difficulty}
                    </span>
                    <span className="px-2 py-0.5 bg-blue-200 rounded">
                      {q.concepts?.join(', ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{q.description}</p>
                </div>
              ))
            ) : (
              <p>No questions generated. Please try again.</p>
            )}
          </div>
        </div>
      );
    }
    
    // If it's a string, format it for display
    if (typeof rawPlan === 'string') {
      // Split by lines for better formatting
      return rawPlan.split('\n').map((line, index) => {
        // Format headings
        if (line.trim().startsWith('#')) {
          return <h3 key={index} className="text-lg font-bold mt-4 mb-2">{line.replace(/#/g, '').trim()}</h3>;
        }
        
        // Bold question titles
        if (line.includes('Title:')) {
          return <p key={index} className="font-semibold mt-3">{line}</p>;
        }
        
        // Format difficulty tags
        if (line.includes('Difficulty:')) {
          const difficultyMatch = line.match(/Difficulty:\s*(\w+)/);
          const difficulty = difficultyMatch ? difficultyMatch[1] : null;
          
          if (difficulty) {
            const badgeClass = difficulty.toLowerCase() === 'easy' ? 'bg-green-200' :
                               difficulty.toLowerCase() === 'medium' ? 'bg-yellow-200' :
                               'bg-red-200';
            
            return (
              <p key={index} className="text-sm mt-1">
                {line.split('Difficulty:')[0]}
                <span className={`px-2 py-0.5 rounded ${badgeClass}`}>
                  Difficulty: {difficulty}
                </span>
                {line.split(difficulty)[1] || ''}
              </p>
            );
          }
        }
        
        // Regular lines
        return <p key={index} className="text-sm my-1">{line}</p>;
      });
    }
    
    // If it's an object, display as JSON
    return <pre className="text-xs whitespace-pre-wrap overflow-auto bg-gray-100 p-3 rounded">{JSON.stringify(rawPlan, null, 2)}</pre>;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-200 p-4">
      {/* Navigation bar with logout button */}
      <div className="w-full bg-white shadow-md p-4 mb-6 rounded-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">InterviewTayari SQL Prep</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
      
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-8 sm:p-10">
          {!showResults ? (
            <>
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
                SQL Prep Questionnaire
              </h2>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    className="mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Current CTC Range</label>
                  <select
                    name="currentCTC"
                    value={formData.currentCTC}
                    onChange={handleChange}
                    className="mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select CTC Range</option>
                    <option value="0-5L">0-5 Lakhs</option>
                    <option value="5-10L">5-10 Lakhs</option>
                    <option value="10-15L">10-15 Lakhs</option>
                    <option value="15-20L">15-20 Lakhs</option>
                    <option value="20L+">20 Lakhs+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Target Companies (comma-separated)</label>
                  <input
                    type="text"
                    name="targetCompanies"
                    value={formData.targetCompanies.join(', ')}
                    onChange={handleChange}
                    placeholder="Google, Amazon, Microsoft"
                    className="mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Weekly Study Time</label>
                  <select
                    name="timeCommitment"
                    value={formData.timeCommitment}
                    onChange={handleChange}
                    className="mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Study Time</option>
                    <option value="2-5 hours">2-5 hours</option>
                    <option value="5-10 hours">5-10 hours</option>
                    <option value="10-15 hours">10-15 hours</option>
                    <option value="15+ hours">15+ hours</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 px-4 rounded-md text-white font-semibold 
                  ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-2'}`}
                >
                  {loading ? 'Generating Plan...' : 'Generate SQL Prep Plan'}
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
                Your SQL Prep Plan
              </h2>
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-inner border border-gray-200 max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <div className="prose max-w-none">
                    {formatAIResponse()}
                  </div>
                )}
              </div>
              
              <div className="text-sm text-gray-500 mb-4">
                <p>Note: Your plan includes {sqlPrepPlan?.questions?.length || 0} SQL interview questions.</p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleReset}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 font-semibold hover:bg-gray-50 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  Reset
                </button>
                <button
                  onClick={handleContinue}
                  className="flex-1 py-2 px-4 rounded-md text-white font-semibold bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Continue to Prep Kit
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SQLPrepQuestionnaire;