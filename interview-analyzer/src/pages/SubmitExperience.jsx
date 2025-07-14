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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Optional: Form validation
    if (!formData.company || !formData.role || !formData.experience) {
      alert("Please fill all required fields.");
      return;
    }

    // For now, just log the data
    console.log("Submitted Experience:", formData);

    // TODO: Send to backend via fetch/axios
    // await axios.post("/api/submit-experience", formData)

    alert("Thank you! Your experience has been submitted.");
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
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Submit Interview Experience</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <input name="name" placeholder="Your Name" value={formData.name} onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded" />

        <input name="email" placeholder="Your Email" type="email" value={formData.email} onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded" />

        <input name="company" placeholder="Company *" required value={formData.company} onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded" />

        <input name="role" placeholder="Role *" required value={formData.role} onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded" />

        <textarea name="experience" placeholder="Full Experience *" required value={formData.experience} onChange={handleChange}
          rows={6} className="w-full p-2 border border-gray-300 rounded" />

        <select name="verdict" value={formData.verdict} onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded">
          <option value="">Verdict (optional)</option>
          <option value="Selected">Selected</option>
          <option value="Rejected">Rejected</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Other">Other</option>
        </select>

        <select name="difficulty" value={formData.difficulty} onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded">
          <option value="">Difficulty (optional)</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <input name="tags" placeholder="Tags (e.g. SDE, Internship)" value={formData.tags} onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded" />

        <button type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
          Submit Experience
        </button>
      </form>
    </div>
  );
};

export default SubmitExperience;
