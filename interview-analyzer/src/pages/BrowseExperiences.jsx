// src/pages/BrowseExperiences.jsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function BrowseExperiences() {
  const [experiences, setExperiences] = useState([]);
  const [filteredExperiences, setFilteredExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});
  const [expandedHighlights, setExpandedHighlights] = useState({});
  const [selectedCompany, setSelectedCompany] = useState("All");
  const [selectedRole, setSelectedRole] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/enhanced_gfg_data.json');
        if (!response.ok) throw new Error('Failed to load data.');
        const data = await response.json();
        setExperiences(data);
        setFilteredExperiences(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = experiences;

    if (selectedCompany !== "All") {
      filtered = filtered.filter(exp => exp.company && exp.company.toLowerCase() === selectedCompany.toLowerCase());
    }

    if (selectedRole !== "All") {
      filtered = filtered.filter(exp => exp.role && exp.role.toLowerCase().includes(selectedRole.toLowerCase()));
    }

    setFilteredExperiences(filtered);
  }, [selectedCompany, selectedRole, experiences]);

  const toggleExpanded = (idx) => {
    setExpandedCards(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleHighlight = (idx) => {
    setExpandedHighlights(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const getSentimentColor = (sentiment) => {
    switch ((sentiment || '').toLowerCase()) {
      case 'positive': return 'text-green-600';
      case 'neutral': return 'text-yellow-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getVerdictColor = (verdict) => {
    if (!verdict) return 'text-gray-600';
    const v = verdict.toLowerCase();
    return v.includes('reject') ? 'text-red-600' : v.includes('select') || v.includes('offer') || v.includes('shortlisted') ? 'text-green-600' : 'text-gray-600';
  };

  const getDifficultyColor = (difficulty) => {
    if (!difficulty) return 'text-gray-600';
    const d = difficulty.toLowerCase();
    return d === 'easy' ? 'text-green-600' : d === 'medium' ? 'text-yellow-600' : d === 'hard' ? 'text-red-600' : 'text-gray-600';
  };

  const getSentimentIcon = (sentiment) => {
    switch ((sentiment || '').toLowerCase()) {
      case 'positive': return '✔️';
      case 'neutral': return '⚪';
      case 'negative': return '❌';
      default: return '❓';
    }
  };

  const truncateLines = (text, lines = 2) => {
    const sentences = text.split(/[.!?]/);
    return sentences.slice(0, lines).join('. ') + (sentences.length > lines ? '...' : '');
  };

  const getUniqueCompanies = () => {
    const companies = experiences.map(exp => exp.company || "");
    return ["All", ...new Set(companies.filter(c => c && c.trim() !== ""))];
  };

  const getUniqueRoles = () => {
    const roles = experiences.map(exp => exp.role || "");
    return ["All", ...new Set(roles.filter(r => r && r.trim() !== ""))];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-1">Browse Interview Experiences</h1>
          <p className="text-sm text-gray-600">Explore real candidate stories and questions</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 shadow-sm text-sm text-gray-700"
          >
            {getUniqueCompanies().map((company, idx) => (
              <option key={idx} value={company}>{company}</option>
            ))}
          </select>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 shadow-sm text-sm text-gray-700"
          >
            {getUniqueRoles().map((role, idx) => (
              <option key={idx} value={role}>{role}</option>
            ))}
          </select>
        </div>

        <div className="mt-10 text-center">
          <Link to="/" className="inline-block text-blue-600 hover:underline text-sm">← Back to Home</Link>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading experiences...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiences.map((exp, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-shadow space-y-2">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{exp.title}</h4>
                  <p className="text-base font-bold text-indigo-700 mb-1">{exp.role || '"Role not specified"'}</p>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 text-sm">
                  <span className={`${getVerdictColor(exp.verdict)}`}><strong>Verdict:</strong> {exp.verdict || 'N/A'}</span>
                  <span className={`flex items-center gap-1 ${getSentimentColor(exp.feedback_sentiment)}`}>
                    <span className="capitalize">Experience: {exp.feedback_sentiment || 'N/A'} {getSentimentIcon(exp.feedback_sentiment)}</span>
                  </span>
                  <span className={`${getDifficultyColor(exp.difficulty)}`}><strong>Difficulty:</strong> {exp.difficulty || 'N/A'}</span>
                </div>

                {exp.highlights && Array.isArray(exp.highlights) && exp.highlights.length > 0 && (
                  <div className="text-sm text-gray-700 border border-gray-200 p-3 rounded-md bg-gray-50">
                    <p className="font-semibold mb-1">Highlights:</p>
                    <ul className="ml-4 list-disc space-y-1">
                      {(expandedHighlights[idx] ? exp.highlights : exp.highlights.slice(0, 2)).map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                    {exp.highlights.length > 2 && (
                      <button
                        onClick={() => toggleHighlight(idx)}
                        className="mt-1 text-blue-600 hover:underline text-sm"
                      >
                        {expandedHighlights[idx] ? 'Show Less' : 'Show More'}
                      </button>
                    )}
                  </div>
                )}

                {exp.rounds?.length > 0 && (
                  <div className="text-sm text-gray-700">
                    <p><strong>Rounds:</strong> {exp.rounds.join(', ')}</p>
                  </div>
                )}

                {(exp.roundwise_questions || exp.raw_questions?.length > 0) && (
                  <div className="text-sm text-gray-700 border border-gray-200 p-3 rounded-md bg-gray-50">
                    <p className="font-semibold mb-1">Questions:</p>
                    {exp.roundwise_questions ? (
                      <ul className="space-y-2">
                        {Object.entries(exp.roundwise_questions).slice(0, expandedCards[idx] ? undefined : 2).map(([round, questions], qIdx) => (
                          <li key={qIdx}>
                            <p className="text-gray-800 font-medium">{round}</p>
                            <ul className="list-disc list-inside ml-4 text-gray-600 space-y-1">
                              {questions.map((q, i) => (
                                <li key={i}>{q.length > 120 ? q.slice(0, 120) + '...' : q}</li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        {(expandedCards[idx] ? exp.raw_questions : exp.raw_questions.slice(0, 3)).map((q, qIdx) => (
                          <li key={qIdx} className="text-gray-600">{q.length > 120 ? q.slice(0, 120) + '...' : q}</li>
                        ))}
                      </ul>
                    )}
                    {((exp.roundwise_questions && Object.keys(exp.roundwise_questions).length > 2) || (exp.raw_questions && exp.raw_questions.length > 3)) && (
                      <button
                        onClick={() => toggleExpanded(idx)}
                        className="mt-2 text-blue-600 hover:underline text-sm"
                      >
                        {expandedCards[idx] ? 'Show Less' : 'Show More'}
                      </button>
                    )}
                  </div>
                )}

                <div className="text-xs text-gray-500 pt-2">
                  <strong>Source:</strong> {exp.source || 'Unknown'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
