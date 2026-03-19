import Job from "../models/Job.js";
import CV from "../models/CV.js";

export const matchCVWithJobs = async (req, res) => {
  try {
    const { skills } = req.body;

    const jobs = await Job.find({
      requirements: { $regex: skills.join("|"), $options: "i" }
    });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const matchJobWithCVs = async (req, res) => {
  try {
    const { requirements } = req.body;

    const cvs = await CV.find({
      skills: { $in: requirements }
    });

    res.json(cvs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};