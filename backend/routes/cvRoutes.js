const express = require("express");
const router = express.Router();
const CV = require("../models/CV");

router.get("/", async (req, res) => {
  const cvs = await CV.find();
  res.json(cvs);
});

router.post("/", async (req, res) => {
  const cv = new CV(req.body);
  await cv.save();
  res.json(cv);
});

module.exports = router;