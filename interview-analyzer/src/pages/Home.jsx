// src/pages/Home.jsx

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Home() {
  const [quickTip, setQuickTip] = useState('');
  const [stats, setStats] = useState({ interviews: 0, users: 0, questions: 0 });

  useEffect(() => {
    // Simulated tips and dashboard stats
    const tips = [
      "Be concise but detailed when describing your project.",
      "Mention your approach, not just the solution.",
      "Showcase learning even if you failed a round.",
      "Tailor your resume for the role before applying."
    ];
    setQuickTip(tips[Math.floor(Math.random() * tips.length)]);

    // Simulated stats - replace with API call in production
    setStats({
      interviews: 127,
      users: 42,
      questions: 418
    });
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-900 to-white px-6 py-10">

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-white mb-2">Welcome to InsightPrep.ai</h1>
          <p className="text-sm text-gray-200">Your personalized companion for interview preparation</p>
        </div>

        {/* Quick Tip Section */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-md shadow-sm">
          <p className="text-sm text-yellow-800 font-medium">💡 Quick Tip:</p>
          <p className="text-sm text-gray-700 mt-1">{quickTip}</p>
        </div>

        {/* Dashboard Cards */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"> }
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow hover:shadow-md transition">
            <h3 className="text-xl font-bold text-indigo-600">{stats.interviews}+</h3>
            <p className="text-sm text-gray-500 mt-1">Interview Experiences</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow hover:shadow-md transition">
            <h3 className="text-xl font-bold text-green-600">{stats.users}+</h3>
            <p className="text-sm text-gray-500 mt-1">Active Contributors</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow hover:shadow-md transition">
            <h3 className="text-xl font-bold text-purple-600">{stats.questions}+</h3>
            <p className="text-sm text-gray-500 mt-1">Questions Shared</p>
          </div>
        </div>

        {/* Browse Questions Section */}
        <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-8 mb-10 flex flex-col sm:flex-row items-center justify-between">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-2xl font-bold text-blue-800 mb-2">Practice Interview Questions</h2>
            <p className="text-gray-600">Browse a curated list of real Java interview questions and answers to boost your prep.</p>
          </div>
          <Link to="/questions">
            <button className="mt-4 sm:mt-0 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition-all">Browse Questions</button>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          <div className="space-y-4">
            {/* First Row - Browse Experiences */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-8 flex flex-col sm:flex-row items-center justify-between">
                <div className="mb-4 sm:mb-0">
                  <h2 className="text-2xl font-bold text-blue-800 mb-2">Browse Interview Experiences</h2>
                  <p className="text-gray-600">Explore real interview stories shared by candidates to learn from their experiences.</p>
                </div>
                <Link to="/browse">
                  <button className="mt-4 sm:mt-0 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition-all">Browse Experiences</button>
                </Link>
              </div>
            </div>
            
            {/* Second Row - Submit, Analyze, About */}
            <div className="grid grid-cols-3 gap-4">
              <Link to="/submit">
                <div className="bg-blue-100 rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Submit Experience</h4>
                  <p className="text-sm text-gray-500">Share your interview story</p>
                </div>
              </Link>
              <Link to="/analytics">
                <div className="bg-blue-100 rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Analyze Interview</h4>
                  <p className="text-sm text-gray-500">Get AI insights</p>
                </div>
              </Link>
              <Link to="/contact">
                <div className="bg-blue-100 rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">About Us</h4>
                  <p className="text-sm text-gray-500">Get to Know Us</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Static Info Cards */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What InsightPrep.ai Offers</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Curated Interview Experiences</h4>
              <p className="text-sm text-gray-500">Get real stories from candidates to prepare smarter.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">AI-Powered Feedback</h4>
              <p className="text-sm text-gray-500">Analyze your interview with automated insights and suggestions.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Community Insights</h4>
              <p className="text-sm text-gray-500">Contribute and learn from the experiences of others.</p>
            </div>
          </div>
        </div>

        {/* Floating Button */}
        <div className="fixed bottom-20 right-6">
          <Link to="/submit">
            <button className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
