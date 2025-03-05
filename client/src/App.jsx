import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SQLPrepProvider } from './context/SQLPrepContext';

// Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import HomePage from './components/Home/HomePage';
import SQLPrepQuestionnaire from './components/Questionnaire/SQLPrepQuestionnaire';
import CustomSQLKit from './components/SQLKit/CustomSQLKit';
import PrivateRoute from './components/Common/PrivateRoute';

const App = () => {
  return (
    <AuthProvider>
      <SQLPrepProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 text-gray-900">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Private Routes */}
              <Route
                path="/questionnaire"
                element={
                  <PrivateRoute>
                    <SQLPrepQuestionnaire />
                  </PrivateRoute>
                }
              />
              <Route
                path="/sql-prep-kit"
                element={
                  <PrivateRoute>
                    <CustomSQLKit />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </SQLPrepProvider>
    </AuthProvider>
  );
};

export default App;
