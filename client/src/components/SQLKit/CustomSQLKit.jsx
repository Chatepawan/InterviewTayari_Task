import React, { useEffect, useState } from 'react';
import { useSQLPrep } from '../../context/SQLPrepContext';

const CustomSQLKit = () => {
  const { sqlPrepPlan, loading, error, fetchSavedPlan, updateQuestionProgress } = useSQLPrep();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!sqlPrepPlan?.questions?.length) {
      fetchSavedPlan();
    }
  }, []);

  const handleProgressUpdate = async (questionId, completed) => {
    await updateQuestionProgress(questionId, completed);
  };

  const filterQuestions = () => {
    if (!sqlPrepPlan?.questions) return [];
    return sqlPrepPlan.questions.filter(q => 
      filter === 'all' ? true : filter === 'completed' ? q.completed : !q.completed
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  const filteredQuestions = filterQuestions();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">SQL Prep Kit ({filteredQuestions.length})</h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded px-3 py-1"
          >
            <option value="all">All</option>
            <option value="incomplete">Incomplete</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        {filteredQuestions.length === 0 ? (
          <p className="text-gray-500 text-center">No questions available.</p>
        ) : (
          <ul className="space-y-4">
            {filteredQuestions.map((q) => (
              <li key={q._id} className="p-4 bg-gray-100 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-medium">{q.title}</p>
                  <span className={`px-2 py-1 text-xs rounded ${
                    q.difficulty === 'Easy' ? 'bg-green-200' :
                    q.difficulty === 'Medium' ? 'bg-yellow-200' :
                    'bg-red-200'
                  }`}>
                    {q.difficulty}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={q.completed}
                  onChange={(e) => handleProgressUpdate(q._id, e.target.checked)}
                  className="h-5 w-5 text-blue-600"
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CustomSQLKit;
