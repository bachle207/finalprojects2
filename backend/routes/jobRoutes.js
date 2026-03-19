import express from "express";
const router = express.Router();
import Jobs from '../models/Jobs.js'

router.get("/", async (req, res) => {
  try {
    const jobs = await Jobs.find();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
  const jobs = new Jobs(req.body);
  await jobs.save();
  res.status(201).json(jobs);
  } catch (error) {
    res.status(400).json({ message: "Không thể tạo job mới", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const job = await Jobs.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Không tìm thấy công việc" });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const job = await Jobs.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ message: "Không tìm thấy công việc" });
    res.json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Jobs.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa công việc" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/bulk", async (req, res) => {
  try {
    const jobsArray = req.body;
    if (!Array.isArray(jobsArray)) {
      return res.status(400).json({ message: "Dữ liệu phải là một mảng" });
    }
    const jobs = await Jobs.insertMany(jobsArray);
    res.status(201).json({ message: `Đã thêm ${jobs.length} job thành công`, jobs });
  } catch (error) {
    res.status(400).json({ message: "Không thể thêm nhiều job", error: error.message });
  }
});
export default router