const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// POST /api/submit-experience
router.post('/submit-experience', (req, res) => {
  const newExperience = req.body;

  // Step 1: Append experience to raw_data.json
  const rawPath = path.join(__dirname, '..', 'data', 'raw_data.json');
  const scriptPath = path.join(__dirname, '..', 'scripts', 'process_gfg_nlp.py');
  const enhancedPath = path.join(__dirname, '..', 'data', 'enhanced_gfg_data.json');
  const publicPath = path.join(__dirname, '..', 'public', 'enhanced_gfg_data.json');

  try {
    let rawData = [];

    if (fs.existsSync(rawPath)) {
      const fileContent = fs.readFileSync(rawPath);
      rawData = JSON.parse(fileContent);
    }

    rawData.push(newExperience);
    fs.writeFileSync(rawPath, JSON.stringify(rawData, null, 2));
    console.log("📝 New experience appended to raw_data.json");
  } catch (error) {
    console.error("❌ Failed to write to raw_data.json:", error.message);
    return res.status(500).json({ error: "Failed to save experience" });
  }

  // Step 2: Run Python NLP script using full path to Python
  exec(`"C:\\Python312\\python.exe" "${scriptPath}"`, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Python script error:", stderr || err.message);
      return res.status(500).json({ error: "NLP processing failed" });
    }

    console.log("✅ Python script completed successfully");
  console.log("stdout:", stdout);
  console.log("stderr:", stderr);

    // Step 3: Copy updated enhanced data to public folder
    try {
      fs.copyFileSync(enhancedPath, publicPath);
      console.log("✅ Processed data copied to public/enhanced_gfg_data.json");
    } catch (copyError) {
      console.error("❌ Failed to copy enhanced file:", copyError.message);
      return res.status(500).json({ error: "File copy failed" });
    }

    console.log("✅ Experience processed successfully");
    //res.status(200).json({ message: "Experience submitted and processed successfully!" });
  });
  res.status(200).json({ message: "Experience submitted and processed successfully!" });

});

module.exports = router;
