import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const features = [
    { title: "Personalized SQL Prep", description: "Tailored SQL interview plans for your target companies.", icon: "🎯" },
    { title: "AI-Powered Recommendations", description: "AI analyzes your profile to generate a focused study plan.", icon: "🤖" },
    { title: "Progress Tracking", description: "Mark completed questions and track your preparation journey.", icon: "📊" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">InterviewTayari SQL Prep</h1>
        <div>
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Hi, {user?.name}</span>
              <button onClick={() => navigate('/sql-prep-kit')} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                My SQL Kit
              </button>
              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Logout
              </button>
            </div>
          ) : (
            <div className="space-x-4">
              <button onClick={() => navigate('/login')} className="text-blue-600 hover:text-blue-800">Login</button>
              <button onClick={() => navigate('/register')} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Sign Up
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">Master SQL Interviews with AI-Powered Prep</h2>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
          Get a personalized SQL interview kit designed for data engineering roles.
        </p>
        
        <button 
          onClick={() => navigate(isAuthenticated ? '/questionnaire' : '/login')} 
          className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition transform hover:scale-105">
          {isAuthenticated ? 'Continue Preparation' : 'Get Started'}
        </button>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="text-5xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-blue-600 text-white py-4 text-center mt-12">
        <p>© 2024 InterviewTayari SQL Prep. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;