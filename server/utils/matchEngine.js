const jobs = require("./jobsData");

function calculateMatch(resumeSkills = []) {
  const results = [];

  jobs.forEach((job) => {
    const matchedSkills = job.skills.filter((skill) =>
      resumeSkills.includes(skill)
    );

    const missingSkills = job.skills.filter(
      (skill) => !resumeSkills.includes(skill)
    );

    const score = Math.round(
      (matchedSkills.length / job.skills.length) * 100
    );

    results.push({
      role: job.title,
      score,
      matchedSkills,
      missingSkills,
    });
  });

  // sort highest match first
  return results.sort((a, b) => b.score - a.score);
}

module.exports = calculateMatch;
