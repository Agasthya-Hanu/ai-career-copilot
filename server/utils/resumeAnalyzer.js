const fs = require("fs");
const pdf = require("pdf-parse");
const analyzeAI = require("./aiAnalyzer");

const analyzeResume = async (filePath) => {

  try {

    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);

    const text = data.text || "";

    const skills = [];

    const skillKeywords = [
      "Java", "Python", "React",
      "Node.js", "MongoDB",
      "Express", "JavaScript",
      "HTML", "CSS", "SQL"
    ];

    skillKeywords.forEach(skill => {
      if (text.toLowerCase().includes(skill.toLowerCase())) {
        skills.push(skill);
      }
    });

    // AI ANALYSIS
    const aiResult = analyzeAI(text);

    return {
      skills,
      extractedText: text.substring(0, 300),
      aiResult
    };

  } catch (err) {

    console.log(err);

    return {
      skills: [],
      extractedText: "",
      aiResult: {
        score: 0,
        suggestions: ["Error analyzing resume"]
      }
    };
  }
};

module.exports = analyzeResume;