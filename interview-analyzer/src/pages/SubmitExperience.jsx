import React, { useState } from "react";

const SubmitExperience = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    experience: "",
    verdict: "",
    difficulty: "",
    tags: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const response = await fetch('/api/submit-experience', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    let result = {};
try {
  result = await response.json();
} catch (e) {
  throw new Error("Server did not return valid JSON");
}

if (!response.ok) {
  throw new Error(result?.message || "Submission failed");
}


    alert("Thank you! Your experience has been submitted and processed.");
    setFormData({
      name: "",
      email: "",
      company: "",
      role: "",
      experience: "",
      verdict: "",
      difficulty: "",
      tags: "",
    });
  } catch (err) {
    alert(err.message);
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Share Your Interview Experience</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Help others learn from your journey. Your experience could be the key to someone else's success.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input 
                name="name" 
                placeholder="Enter your name" 
                value={formData.name} 
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input 
                name="email" 
                placeholder="your.email@example.com" 
                type="email" 
                value={formData.email} 
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Company Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input 
                name="company" 
                placeholder="e.g., Google, Microsoft, Amazon" 
                required 
                value={formData.company} 
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role/Position <span className="text-red-500">*</span>
              </label>
              <input 
                name="role" 
                placeholder="e.g., Software Engineer, Data Scientist" 
                required 
                value={formData.role} 
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interview Experience <span className="text-red-500">*</span>
            </label>
            <textarea 
              name="experience" 
              placeholder="Share your complete interview experience including questions asked, your responses, and overall process..." 
              required 
              value={formData.experience} 
              onChange={handleChange}
              rows={8} 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
            />
          </div>

          {/* Additional Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interview Outcome
              </label>
              <select 
                name="verdict" 
                value={formData.verdict} 
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select outcome</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Pending">Pending</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select 
                name="difficulty" 
                value={formData.difficulty} 
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Very Hard">Very Hard</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input 
              name="tags" 
              placeholder="e.g., SDE, Internship, Frontend, Backend, System Design" 
              value={formData.tags} 
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <p className="text-sm text-gray-500 mt-2">
              Add relevant tags to help others find your experience
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-8 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </div>
              ) : (
                "Submit Experience"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitExperience;
