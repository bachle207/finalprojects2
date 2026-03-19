import CV from "../models/CV.js";

export const getCVs = async (req, res) => {
  try {
    const cvs = await CV.find().sort({ createdAt: -1 });

    res.json(cvs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCV = async (req, res) => {
  try {
    const cv = new CV(req.body);

    const savedCV = await cv.save();

    res.status(201).json(savedCV);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCVById = async (req, res) => {
  try {
    const cv = await CV.findById(req.params.id);

    if (!cv) {
      return res.status(404).json({ message: "CV not found" });
    }

    res.json(cv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};