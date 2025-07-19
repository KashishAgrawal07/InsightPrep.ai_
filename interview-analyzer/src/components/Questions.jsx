import React, { useState, useEffect } from 'react';

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [visibleAnswers, setVisibleAnswers] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const questionsPerPage = 5;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        // Try to fetch from public directory first
        let response = await fetch('/java_questions.json');
        
        if (!response.ok) {
          // Fallback to sample questions if fetch fails
          console.log('Using fallback questions');
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
            },
            {
              question: "Describe applet lifecycle methods.",
              answer: "init(), start(), stop(), destroy(): for setup, execute, pause, and teardown respectively.",
              source: "Java Code Geeks",
              difficulty: "Medium",
              company: "Various",
              role: "Software Engineer"
            },
            {
              question: "Explain MVC design pattern in Swing.",
              answer: "Swing uses Model–View–Controller: Model stores state, View renders it, Controller handles user input.",
              source: "Java Code Geeks",
              difficulty: "Medium",
              company: "Various",
              role: "Software Engineer"
            },
            {
              question: "What is RMI and its basic architecture?",
              answer: "Remote Method Invocation lets Java call methods on objects in different JVMs. It uses stubs/skeletons and registry.",
              source: "Java Code Geeks",
              difficulty: "Hard",
              company: "Various",
              role: "Senior Software Engineer"
            },
            {
              question: "Difference between heap and stack memory.",
              answer: "Stack stores primitives and references per thread. Heap holds objects and arrays, shared and garbage-collected.",
              source: "InterviewBit",
              difficulty: "Medium",
              company: "Oracle",
              role: "SDE"
            },
            {
              question: "Why use interfaces over abstract classes?",
              answer: "Interfaces support multiple inheritance of type and can define contracts without state, with default methods.",
              source: "DataCamp",
              difficulty: "Medium",
              company: "Various",
              role: "Software Engineer"
            },
            {
              question: "Explain volatile keyword.",
              answer: "Ensures memory visibility: reads/writes go directly to main memory; prevents caching on threads.",
              source: "DataCamp",
              difficulty: "Medium",
              company: "Various",
              role: "Backend Developer"
            },
            {
              question: "How does HashSet work internally?",
              answer: "Backed by HashMap: elements are keys; uses hashCode and equals to manage buckets.",
              source: "DataCamp",
              difficulty: "Medium",
              company: "Various",
              role: "Software Engineer"
            },
            {
              question: "Difference between Callable and Runnable.",
              answer: "Runnable returns void and can't throw checked exceptions. Callable returns a value and can throw exceptions.",
              source: "DataCamp",
              difficulty: "Medium",
              company: "Various",
              role: "Backend Developer"
            },
            {
              question: "Implement LRU cache in Java.",
              answer: "Use LinkedHashMap with accessOrder=true and override removeEldestEntry, or use a HashMap + doubly‑linked list.",
              source: "LeetCode",
              difficulty: "Hard",
              company: "Uber",
              role: "SDE"
            }
          ]);
        } else {
          const data = await response.json();
          setQuestions(data);
        }
      } catch (err) {
        console.error('Error loading questions:', err);
        setError('Failed to load questions. Using sample questions instead.');
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
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Set all answers to visible by default when questions load
  useEffect(() => {
    if (questions.length > 0) {
      const allVisible = {};
      questions.forEach((_, index) => {
        allVisible[index] = true;
      });
      setVisibleAnswers(allVisible);
    }
  }, [questions]);

  const toggleAnswer = (index) => {
    setVisibleAnswers(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

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
    if (filter === 'all') return true;
    return q.difficulty.toLowerCase() === filter.toLowerCase();
  });

  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const startIndex = currentPage * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = filteredQuestions.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Java Interview Questions</h3>
            <p className="text-sm text-gray-600">Loading questions...</p>
          </div>
        </div>
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Java Interview Questions</h3>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
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

      {/* Filter */}
      <div className="flex space-x-2">
        {['all', 'easy', 'medium', 'hard'].map((difficulty) => (
          <button
            key={difficulty}
            onClick={() => {
              setFilter(difficulty);
              setCurrentPage(0);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === difficulty
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </button>
        ))}
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {currentQuestions.map((question, index) => (
          <div
            key={startIndex + index}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* Question Header */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {startIndex + index + 1}. {question.question}
                  </h4>
                  <div className="flex flex-wrap gap-2">
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
                <div className="ml-4">
                  <button
                    onClick={() => toggleAnswer(startIndex + index)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      visibleAnswers[startIndex + index]
                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {visibleAnswers[startIndex + index] ? 'Hide Answer' : 'Show Answer'}
                  </button>
                </div>
              </div>

              {/* Answer - Always visible by default */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-l-4 border-blue-500">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-semibold text-blue-900 mb-2">Answer:</h5>
                    <p className="text-gray-700 leading-relaxed">{question.answer}</p>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === i
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage === totalPages - 1}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Empty State */}
      {filteredQuestions.length === 0 && (
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
  );
};

export default Questions; 