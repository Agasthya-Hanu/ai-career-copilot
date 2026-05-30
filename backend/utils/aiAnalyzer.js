
const analyzeResume = (
  skills,
  domain
) => {

  let role =
    "General Professional";

  let score =
    Math.min(
      100,
      skills.length * 8 + 20
    );

  let strengths = [];

  let weaknesses = [];

  let improvements = [];

  // SOFTWARE

  if (
    domain === "software"
  ) {

    if (
      skills.includes("React") &&
      skills.includes("Node.js")
    ) {

      role =
        "Full Stack Developer";
    }

    else if (
      skills.includes("React")
    ) {

      role =
        "Frontend Developer";
    }

    else if (
      skills.includes(
        "Machine Learning"
      )
    ) {

      role =
        "AI/ML Engineer";
    }

    else {

      role =
        "Software Developer";
    }

    strengths.push(
      "Programming fundamentals"
    );

    improvements.push(
      "AWS",
      "Docker",
      "SQL"
    );
  }

  // ELECTRONICS

  else if (
    domain === "electronics"
  ) {

    // VLSI

    if (

      skills.includes("VLSI") ||

      skills.includes(
        "Verilog HDL"
      ) ||

      skills.includes(
        "SystemVerilog"
      ) ||

      skills.includes("FPGA")
    ) {

      role =
        "VLSI Engineer";
    }

    // EMBEDDED

    else if (

      skills.includes(
        "Embedded Systems"
      ) ||

      skills.includes("RTOS") ||

      skills.includes("QNX") ||

      skills.includes(
        "Embedded C"
      )
    ) {

      role =
        "Embedded Systems Engineer";
    }

    // IOT

    else if (
      skills.includes("IoT")
    ) {

      role =
        "IoT Engineer";
    }

    else {

      role =
        "Electronics Engineer";
    }

    strengths.push(
      "Electronics fundamentals"
    );

    strengths.push(
      "Embedded systems knowledge"
    );

    improvements.push(
      "Advanced FPGA",
      "Semiconductor Design",
      "PCB Design"
    );
  }

  // MECHANICAL

  else if (
    domain === "mechanical"
  ) {

    role =
      "Mechanical Design Engineer";

    strengths.push(
      "Mechanical engineering fundamentals"
    );

    improvements.push(
      "ANSYS",
      "CAD Optimization"
    );
  }

  // CIVIL

  else if (
    domain === "civil"
  ) {

    role =
      "Civil Engineer";

    strengths.push(
      "Construction fundamentals"
    );

    improvements.push(
      "STAAD Pro",
      "Project Planning"
    );
  }

  // MBA

  else if (
    domain === "mba"
  ) {

    role =
      "Business Analyst";

    strengths.push(
      "Business communication"
    );

    improvements.push(
      "Power BI",
      "Advanced Excel"
    );
  }

  // HEALTHCARE

  else if (
    domain === "healthcare"
  ) {

    role =
      "Healthcare Professional";

    strengths.push(
      "Healthcare domain knowledge"
    );

    improvements.push(
      "Clinical systems",
      "Medical analytics"
    );
  }

  // LOW SKILL WARNING

  if (
    skills.length < 4
  ) {

    weaknesses.push(
      "Low skill diversity"
    );
  }

  return {

    role,
    score,
    strengths,
    weaknesses,
    improvements,
  };
};

module.exports =
  analyzeResume;