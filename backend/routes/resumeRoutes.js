
const express = require("express");
const multer = require("multer");
const pdf = require("pdf-parse");
const mammoth = require("mammoth");

const router = express.Router();

const analyzeResume =
  require("../utils/aiAnalyzer");

// STORAGE
const storage =
  multer.memoryStorage();

const upload = multer({
  storage: storage,
});

// SKILL DATABASE

const domains = {

  software: {

    skills: {

      "React": [
        "react",
        "reactjs",
      ],

      "Angular": [
        "angular",
      ],

      "Vue": ["vue"],

      "HTML": ["html"],

      "CSS": ["css"],

      "JavaScript": [
        "javascript",
        "js",
      ],

      "TypeScript": [
        "typescript",
      ],

      "Node.js": [
        "node",
        "nodejs",
      ],

      "Express.js": [
        "express",
      ],

      "MongoDB": [
        "mongodb",
      ],

      "SQL": [
        "sql",
        "mysql",
      ],

      "Java": ["java"],

      "Python": [
        "python",
      ],

      "AWS": ["aws"],

      "Docker": [
        "docker",
      ],

      "Machine Learning": [
        "machine learning",
        "ml",
      ],
    },
  },

  mechanical: {

    skills: {

      "AutoCAD": [
        "autocad",
      ],

      "SolidWorks": [
        "solidworks",
      ],

      "CATIA": ["catia"],

      "ANSYS": ["ansys"],

      "Thermodynamics": [
        "thermodynamics",
      ],

      "Manufacturing": [
        "manufacturing",
      ],

      "CNC": ["cnc"],
    },
  },

  civil: {

    skills: {

      "STAAD Pro": [
        "staad pro",
      ],

      "Revit": ["revit"],

      "Surveying": [
        "surveying",
      ],

      "Construction": [
        "construction",
      ],

      "AutoCAD": [
        "autocad",
      ],
    },
  },

  electronics: {

    skills: {

      "Embedded Systems": [
        "embedded system",
        "embedded systems",
      ],

      "Electronics": [
        "electronics",
        "electronic",
      ],

      "Communication Systems": [
        "communication systems",
      ],

      "VLSI": ["vlsi"],

      "Verilog HDL": [
        "verilog",
        "verilog hdl",
      ],

      "SystemVerilog": [
        "systemverilog",
      ],

      "FPGA": [
        "fpga",
        "fpga prototyping",
      ],

      "RTOS": [
        "rtos",
        "qnx rtos",
      ],

      "QNX": [
        "qnx",
        "qnx momentics",
      ],

      "Embedded C": [
        "embedded c",
      ],

      "Microcontroller": [
        "microcontroller",
      ],

      "ESP32": [
        "esp32",
      ],

      "Digital Electronics": [
        "digital electronics",
      ],

      "Semiconductor": [
        "semiconductor",
      ],

      "MATLAB": [
        "matlab",
      ],

      "Arduino": [
        "arduino",
      ],

      "IoT": ["iot"],

      "PCB Design": [
        "pcb design",
      ],
    },
  },

  mba: {

    skills: {

      "Marketing": [
        "marketing",
      ],

      "Sales": ["sales"],

      "Finance": [
        "finance",
      ],

      "CRM": ["crm"],

      "Business Analysis": [
        "business analysis",
      ],

      "Leadership": [
        "leadership",
      ],

      "Excel": ["excel"],
    },
  },

  healthcare: {

    skills: {

      "Patient Care": [
        "patient care",
      ],

      "Clinical Research": [
        "clinical research",
      ],

      "Medical Coding": [
        "medical coding",
      ],

      "Healthcare Management": [
        "healthcare management",
      ],
    },
  },
};

// ROUTE

router.post(
  "/upload",
  upload.single("resume"),

  async (req, res) => {

    try {

      // CHECK FILE

      if (!req.file) {

        return res.status(400).json({
          message:
            "No file uploaded",
        });
      }

      let text = "";

      const fileName =
        req.file.originalname.toLowerCase();

      // PDF

      if (
        fileName.endsWith(".pdf")
      ) {

        const data =
          await pdf(
            req.file.buffer
          );

        text = data.text;
      }

      // DOCX

      else if (
        fileName.endsWith(
          ".docx"
        )
      ) {

        const data =
          await mammoth.extractRawText({
            buffer:
              req.file.buffer,
          });

        text = data.value;
      }

      // TXT

      else if (
        fileName.endsWith(
          ".txt"
        )
      ) {

        text =
          req.file.buffer.toString();
      }

      // INVALID FILE

      else {

        return res.status(400).json({
          message:
            "Only PDF, DOCX, and TXT files are allowed",
        });
      }

      const resumeText =
        text.toLowerCase();

      // DETECT SKILLS

      const detectedSkills = [];

      const domainScores = {};

      for (const domain in domains) {

        domainScores[domain] = 0;

        const domainSkills =
          domains[domain].skills;

        for (const skill in domainSkills) {

          const aliases =
            domainSkills[skill];

          const found =
            aliases.some(
              (keyword) =>
                resumeText.includes(
                  keyword.toLowerCase()
                )
            );

          if (found) {

            detectedSkills.push(
              skill
            );
            if (domain === "electronics") {
              domainScores[domain] += 3;
            }
            else {
               domainScores[domain]++;
              }
          }
        }
      }

      // DETECT DOMAIN

      let detectedDomain =
        "general";

      let maxScore = 0;

      for (const domain in domainScores) {

        if (
          domainScores[domain] >
          maxScore
        ) {

          maxScore =
            domainScores[domain];

          detectedDomain =
            domain;
        }
      }

      // AI ANALYSIS

      const aiResult =
        analyzeResume(
          detectedSkills,
          detectedDomain
        );

      // RESPONSE

      res.json({

        message:
          "Resume analyzed successfully",

        analysis: {

          domain:
            detectedDomain,

          skills:
            detectedSkills,

          aiResult,
        },
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Resume upload failed",
      });
    }
  }
);

module.exports = router;
