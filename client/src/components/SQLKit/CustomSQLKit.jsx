import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSQLPrep } from '../../context/SQLPrepContext';
import { useAuth } from '../../context/AuthContext';

const CustomSQLKit = () => {
  const { sqlPrepPlan, loading, error, fetchSavedPlan, updateQuestionProgress } = useSQLPrep();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  useEffect(() => {
    const loadPlan = async () => {
      // Only fetch if there's no plan or if the plan has no questions
      if (!sqlPrepPlan || !sqlPrepPlan.questions || sqlPrepPlan.questions.length === 0) {
        try {
          await fetchSavedPlan();
        } catch (error) {
          console.error("Failed to load SQL prep plan:", error);
        }
      }
    };
    
    loadPlan();
  }, [sqlPrepPlan, fetchSavedPlan]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProgressUpdate = async (questionId, completed) => {
    try {
      await updateQuestionProgress(questionId, completed);
    } catch (error) {
      console.error("Failed to update question progress:", error);
    }
  };

  const filterQuestions = () => {
    if (!sqlPrepPlan?.questions || !Array.isArray(sqlPrepPlan.questions)) return [];
    
    return sqlPrepPlan.questions.filter(q => 
      filter === 'all' ? true : filter === 'completed' ? q.completed : !q.completed
    );
  };

  const toggleExpand = (questionId) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const filteredQuestions = filterQuestions();
  const hasQuestions = filteredQuestions.length > 0;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      {/* Navigation bar with logout button */}
      <div className="w-full bg-white shadow-md p-4 mb-6 rounded-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">InterviewTayari SQL Prep</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/questionnaire')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Back to Questionnaire
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">
              SQL Prep Kit {hasQuestions && `(${filteredQuestions.length})`}
            </h2>
            
            <div className="flex items-center space-x-2">
              <label htmlFor="filter" className="text-sm font-medium text-gray-600">
                Show:
              </label>
              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border rounded-md px-3 py-1.5 text-sm bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Questions</option>
                <option value="incomplete">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {!hasQuestions ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg 
                className="w-16 h-16 text-gray-300 mb-4"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-500 text-lg mb-2">No questions available</p>
              <p className="text-gray-400 text-sm max-w-md">
                {error ? 
                  `Error loading questions: ${error}` : 
                  "Please return to the questionnaire to generate your customized SQL prep plan."}
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {filteredQuestions.map((question) => (
                <li 
                  key={question._id || `q-${question.title}`} 
                  className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200"
                >
                  <div 
                    className={`p-4 ${expandedQuestion === question._id ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'} 
                    cursor-pointer flex justify-between items-start transition-colors duration-150`}
                    onClick={() => toggleExpand(question._id)}
                  >
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full ${question.completed ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                        <h3 className="font-semibold text-gray-800">{question.title}</h3>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          question.difficulty?.toLowerCase() === 'easy' ? 'bg-green-100 text-green-800' :
                          question.difficulty?.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {question.difficulty}
                        </span>
                        
                        {question.concepts && question.concepts.length > 0 && 
                          question.concepts.map((concept, idx) => (
                            <span 
                              key={idx} 
                              className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                            >
                              {concept}
                            </span>
                          ))
                        }
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 ml-4">
                      <input
                        type="checkbox"
                        checked={question.completed}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleProgressUpdate(question._id, e.target.checked);
                        }}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <svg 
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${expandedQuestion === question._id ? 'transform rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                  
                  {expandedQuestion === question._id && (
                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                      <p className="text-sm text-gray-700 whitespace-pre-line">{question.description}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomSQLKit;