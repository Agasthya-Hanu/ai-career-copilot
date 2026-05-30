const express = require("express");
const multer = require("multer");

const analyzeResume = require("../utils/resumeAnalyzer");

const router = express.Router();


// STORAGE CONFIG
const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });


// UPLOAD ROUTE
router.post(
  "/upload",
  upload.single("resume"),

  async (req, res) => {

    try {

      if (!req.file) {

        return res.status(400).json({
          message: "No file uploaded",
        });
      }

      const analysis = await analyzeResume(
        req.file.path
      );

      res.json({
        message: "Resume analyzed successfully",
        analysis,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Resume analysis failed",
      });
    }
  }
);

module.exports = router;