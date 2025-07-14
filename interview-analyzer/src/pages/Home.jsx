// src/pages/Home.jsx

import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-600">InsightPrep.ai</h1>
        <p className="mt-4 text-xl text-gray-700">
          Learn from real interviews. Analyze, improve, and prepare smarter.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link to="/SubmitExperience">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700">
              Submit Experience
            </button>
          </Link>
          <Link to="/Analyze">
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700">
              Analyze Interview
            </button>
          </Link>
        </div>
      </header>

      <section className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-4">Why InsightPrep.ai?</h2>
        <p className="text-gray-600 mb-8">
          We use advanced NLP to extract patterns, detect improvement areas, and generate insights
          from your interview experiences.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          <FeatureCard icon="📝" label="Submit" />
          <FeatureCard icon="🧠" label="Analyze" />
          <FeatureCard icon="📊" label="Insights" />
          <FeatureCard icon="💬" label="Explore" />
        </div>
      </section>
    </div>
  );
}

const FeatureCard = ({ icon, label }) => (
  <div className="bg-white p-4 rounded-lg shadow text-center hover:scale-105 transition">
    <div className="text-4xl">{icon}</div>
    <div className="mt-2 font-semibold">{label}</div>
  </div>
);

