import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSQLPrep } from '../../context/SQLPrepContext';

const SQLPrepQuestionnaire = () => {
  const [formData, setFormData] = useState({
    yearsOfExperience: '',
    currentCTC: '',
    targetCompanies: [],
    timeCommitment: ''
  });

  const navigate = useNavigate();
  const { generatePlan, loading, error } = useSQLPrep();

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
      console.log('Submitting form data:', formData);
      const response = await generatePlan(formData);
      console.log('Response from generatePlan:', response);
      navigate('/sql-prep-kit');
    } catch (err) {
      console.error('Plan generation failed', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 p-4">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-8 sm:p-10">
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
      </div>
    </div>
  );
};

export default SQLPrepQuestionnaire;
