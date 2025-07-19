// src/pages/Home.jsx

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        console.log('Fetching questions from /java_questions.json...');
        const response = await fetch('/java_questions.json');
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch questions: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Loaded questions:', data.length);
        setQuestions(data);
      } catch (err) {
        console.error('Error loading questions:', err);
        setError(`Failed to load questions: ${err.message}. Using sample questions instead.`);
        // Fallback to sample questions
        setQuestions([
          {
            question: "Why is Java called the 'Platform Independent Programming Language'?",
            answer: "Because Java source code compiles into platform-neutral bytecode, which can run on any OS with a compatible JVM. 'Write Once, Run Anywhere.'",
            source: "GeeksforGeeks",
            difficulty: "Easy",
            company: "Various",
            role: "Software Engineer"
          },
          {
            question: "Explain the final keyword in Java.",
            answer: "final on variables makes them constants, on methods prevents overriding, and on classes prevents inheritance.",
            source: "GeeksforGeeks",
            difficulty: "Medium",
            company: "Various",
            role: "Software Engineer"
          },
          {
            question: "What is the difference between String and StringBuffer?",
            answer: "String is immutable; StringBuffer is mutable and synchronized, making it efficient for frequent modifications.",
            source: "GeeksforGeeks",
            difficulty: "Medium",
            company: "Various",
            role: "Software Engineer"
          },
          {
            question: "What is the difference between throw and throws?",
            answer: "\"throw\" actually raises an exception. \"throws\" declares exceptions a method may pass to its caller.",
            source: "GeeksforGeeks",
            difficulty: "Medium",
            company: "Various",
            role: "Backend Developer"
          },
          {
            question: "What is finalize() in Java and when is it called?",
            answer: "Called by the garbage collector before object reclamation. It's unpredictable and deprecated in Java 9+.",
            source: "GeeksforGeeks",
            difficulty: "Medium",
            company: "Various",
            role: "Software Engineer"
          },
          {
            question: "Difference between Set and List interfaces.",
            answer: "List allows duplicates and preserves insertion order. Set disallows duplicates and doesn't guarantee order.",
            source: "GeeksforGeeks",
            difficulty: "Easy",
            company: "Various",
            role: "Software Engineer"
          },
          {
            question: "Will finally block execute after System.exit(0)?",
            answer: "No. System.exit terminates the JVM before finally executes. If it throws SecurityException, finally runs.",
            source: "GeeksforGeeks",
            difficulty: "Medium",
            company: "Various",
            role: "Software Engineer"
          },
          {
            question: "Explain JDK, JRE, and JVM.",
            answer: "JVM runs bytecode. JRE bundles JVM and libraries. JDK includes JRE plus development tools like javac.",
            source: "Codefinity",
            difficulty: "Medium",
            company: "Various",
            role: "Software Engineer"
          },
          {
            question: "What is polymorphism in Java?",
            answer: "Ability to treat objects of different types through a common interface. Achieved via method overloading (compile‑time) and overriding (run‑time).",
            source: "Java Code Geeks",
            difficulty: "Medium",
            company: "Various",
            role: "Software Engineer"
          },
          {
            question: "Is Java 100% object-oriented? Why or why not?",
            answer: "No—because it has primitive types (int, char, etc.) that aren't objects.",
            source: "Java Code Geeks",
            difficulty: "Easy",
            company: "Various",
            role: "Software Engineer"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
      case 'software engineer': return 'bg-blue-100 text-blue-800';
      case 'backend developer': return 'bg-purple-100 text-purple-800';
      case 'sde': return 'bg-indigo-100 text-indigo-800';
      case 'senior software engineer': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredQuestions = questions.filter(q => {
    // Difficulty filter
    if (filter !== 'all' && q.difficulty.toLowerCase() !== filter.toLowerCase()) {
      return false;
    }
    
    // Company filter
    if (companyFilter !== 'all' && q.company !== companyFilter) {
      return false;
    }
    
    // Role filter
    if (roleFilter !== 'all' && q.role !== roleFilter) {
      return false;
    }
    
    return true;
  });

  // Get unique companies and roles for filter options
  const companies = ['all', ...Array.from(new Set(questions.map(q => q.company)))];
  const roles = ['all', ...Array.from(new Set(questions.map(q => q.role)))];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* App Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">IA</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">InsightPrep.ai</h1>
              <p className="text-sm text-gray-500">Interview Assistant</p>
            </div>
          </div>
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">Welcome back!</h2>
              <p className="text-blue-100">Ready to ace your next interview?</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="flex space-x-3">
            <div className="flex-1 bg-white/20 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">12</div>
              <div className="text-xs text-blue-100">Experiences</div>
            </div>
            <div className="flex-1 bg-white/20 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">85%</div>
              <div className="text-xs text-blue-100">Success Rate</div>
            </div>
            <div className="flex-1 bg-white/20 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">3</div>
              <div className="text-xs text-blue-100">Companies</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/submit">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
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
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Analyze Interview</h4>
                <p className="text-sm text-gray-500">Get AI insights</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <button className="text-blue-600 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-3">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Google Interview</h4>
                  <p className="text-sm text-gray-500">Analysis completed</p>
                </div>
                <div className="text-xs text-gray-400">2h ago</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Microsoft Experience</h4>
                  <p className="text-sm text-gray-500">Experience submitted</p>
                </div>
                <div className="text-xs text-gray-400">1d ago</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips & Insights */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Today's Tip</h3>
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">System Design Tips</h4>
                <p className="text-sm text-gray-600">Always start with clarifying requirements and constraints before diving into the solution. Ask questions about scale, performance, and user expectations.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Java Interview Questions</h3>
              <p className="text-sm text-gray-600">Practice with real interview questions</p>
            </div>
            <div className="text-sm text-gray-500">
              {filteredQuestions.length} questions
            </div>
          </div>

          {/* Filter Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>Filters</span>
                <svg className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Active filters count */}
              {(filter !== 'all' || companyFilter !== 'all' || roleFilter !== 'all') && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  {[filter, companyFilter, roleFilter].filter(f => f !== 'all').length} active
                </span>
              )}
            </div>
            
            {/* Clear all filters */}
            {(filter !== 'all' || companyFilter !== 'all' || roleFilter !== 'all') && (
              <button
                onClick={() => {
                  setFilter('all');
                  setCompanyFilter('all');
                  setRoleFilter('all');
                }}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Expandable Filter Options */}
          {showFilters && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
              {/* Difficulty Filter */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Difficulty</h4>
                <div className="flex flex-wrap gap-2">
                  {['all', 'easy', 'medium', 'hard'].map((difficulty) => (
                    <button
                      key={difficulty}
                      onClick={() => setFilter(difficulty)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filter === difficulty
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Company Filter */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Company</h4>
                <div className="flex flex-wrap gap-2">
                  {companies.map((company) => (
                    <button
                      key={company}
                      onClick={() => setCompanyFilter(company)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        companyFilter === company
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {company.charAt(0).toUpperCase() + company.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Role Filter */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Role</h4>
                <div className="flex flex-wrap gap-2">
                  {roles.map((role) => (
                    <button
                      key={role}
                      onClick={() => setRoleFilter(role)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        roleFilter === role
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="flex space-x-2">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Questions Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuestions.map((question, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col"
                >
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-3">
                        {index + 1}. {question.question}
                      </h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                          {question.difficulty}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(question.role)}`}>
                          {question.role}
                        </span>
                        {question.company && question.company !== 'Various' && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {question.company}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Answer - Always visible */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-l-4 border-blue-500 flex-1 flex flex-col">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-blue-900 mb-2">Answer:</h5>
                          <p className="text-gray-700 leading-relaxed text-sm line-clamp-4">{question.answer}</p>
                          {question.source && (
                            <div className="mt-3 text-xs text-gray-500">
                              Source: {question.source}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}



          {/* Empty State */}
          {!loading && !error && filteredQuestions.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No questions found</h4>
              <p className="text-gray-600">Try adjusting your filter criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
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
  );
}

