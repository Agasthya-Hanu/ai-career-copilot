const calculateMatch = require("../utils/matchEngine");

exports.uploadResume = async (req, res) => {
  try {
    // 1. Get resume text (temporary approach)
    const resumeText = req.body.resumeText || "";

    // 2. Basic skill list (we will upgrade later with AI/PDF parser)
    const skillsDB = [
      "React",
      "Node.js",
      "MongoDB",
      "Express",
      "JavaScript",
      "Python",
      "SQL",
      "HTML",
      "CSS",
    ];

    // 3. Extract skills from resume text
    const resumeSkills = skillsDB.filter((skill) =>
      resumeText.toLowerCase().includes(skill.toLowerCase())
    );

    // 4. Run matching engine
    const jobMatches = calculateMatch(resumeSkills);

    // 5. Send response
    res.json({
      message: "Resume analyzed successfully",
      analysis: {
        skills: resumeSkills,
        jobMatches,
      },
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Resume analysis failed",
    });
  }
};