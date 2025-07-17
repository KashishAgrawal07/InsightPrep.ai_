import React, { useState } from 'react';
import axios from 'axios';

const Analytics = () => {
  const [experience, setExperience] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!experience.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/analyze-experience', { content: experience });
      setResult(res.data);
    } catch (err) {
      alert('Error analyzing experience');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Interview Experience Analyzer</h1>
      <textarea
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
        rows={10}
        placeholder="Paste your interview experience here..."
        className="w-full p-4 border rounded resize-none focus:outline-none"
      ></textarea>
      <button
        onClick={analyze}
        disabled={loading}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : 'Analyze Experience'}
      </button>

      {result && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Summary</h2>
          <p className="mb-4">{result.summary}</p>

          <h2 className="text-xl font-semibold">Sentiment</h2>
          <p className="mb-4">
            {result.sentiment.label} ({(result.sentiment.score * 100).toFixed(2)}%)
          </p>

          <h2 className="text-xl font-semibold">Highlights</h2>
          <ul className="list-disc ml-6 mb-4">
            {result.highlights.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          <h2 className="text-xl font-semibold">What Went Wrong</h2>
          {result.what_went_wrong.length > 0 ? (
            <ul className="list-disc ml-6 text-red-600 mb-4">
              {result.what_went_wrong.map((issue, i) => (
                <li key={i}>{issue}</li>
              ))}
            </ul>
          ) : (
            <p className="text-green-600 mb-4">No major issues detected!</p>
          )}

          <h2 className="text-xl font-semibold">Questions by Round</h2>
          {Object.entries(result.questions_by_round).map(([round, questions]) => (
            <div key={round} className="mb-2">
              <h3 className="font-medium">{round}</h3>
              <ul className="list-disc ml-6">
                {questions.map((q, i) => (
                  <li key={i}>{q.question}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Analytics;

