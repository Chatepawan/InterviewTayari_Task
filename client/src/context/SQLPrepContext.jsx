import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const SQLPrepContext = createContext(null);

export const SQLPrepProvider = ({ children }) => {
  const [sqlPrepPlan, setSQLPrepPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const BASE_URL = 'http://localhost:5000/api/sql-prep';

  // Helper function to get auth token
  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Unauthorized: No token found');
    return token;
  };

  // Generate SQL Prep Plan
  const generatePlan = async (planDetails) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${BASE_URL}/generate`,
        planDetails,
        { headers: { Authorization: `Bearer ${getAuthToken()}`, 'Content-Type': 'application/json' } }
      );

      console.log('Generated Plan:', response.data);
      setSQLPrepPlan({
        questions: response.data.questions || [],
        metadata: response.data.metadata || {},
      });

      return response.data;
    } catch (err) {
      console.error('Error generating plan:', err);
      setError(err.response?.data?.message || 'Failed to generate plan');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch Saved Plan
  const fetchSavedPlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}/saved-plan`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });

      setSQLPrepPlan(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching saved plan:', err);
      setError(err.response?.data?.message || 'Failed to fetch saved plan');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update Question Progress
  const updateQuestionProgress = async (questionId, completed) => {
    setError(null);
    try {
      // Optimistically update state
      setSQLPrepPlan(prev => ({
        ...prev,
        questions: prev?.questions?.map(q =>
          q._id === questionId ? { ...q, completed } : q
        ) || [],
      }));

      const response = await axios.patch(
        `${BASE_URL}/update-progress`,
        { questionId, completed },
        { headers: { Authorization: `Bearer ${getAuthToken()}` } }
      );

      return response.data;
    } catch (err) {
      console.error('Error updating progress:', err);
      setError(err.response?.data?.message || 'Failed to update progress');
      throw err;
    }
  };

  return (
    <SQLPrepContext.Provider value={{ 
      sqlPrepPlan, 
      generatePlan, 
      fetchSavedPlan, 
      updateQuestionProgress, 
      loading, 
      error 
    }}>
      {children}
    </SQLPrepContext.Provider>
  );
};

export const useSQLPrep = () => {
  const context = useContext(SQLPrepContext);
  if (!context) {
    throw new Error('useSQLPrep must be used within a SQLPrepProvider');
  }
  return context;
};
