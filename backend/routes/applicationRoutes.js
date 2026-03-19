import express from "express";
const router = express.Router();
import Applications from '../models/Applications.js';
import Notification from "../models/Notification.js";
import Job from '../models/Jobs.js';

// 1. Lấy danh sách đơn ứng tuyển (Lọc theo vai trò)
router.get("/", async (req, res) => {
  try {
    const { email, role } = req.query;
    let query = {};

    if (role === 'candidate') {
      query = { candidateEmail: email };
    } else if (role === 'employer') {
      const myJobs = await Job.find({ postedBy: email });

      if (!myJobs || myJobs.length === 0) {
        return res.json([]);
      }

      const myJobIds = myJobs.map(job => job._id);
      query = { jobId: { $in: myJobIds } };
    }

    const applications = await Applications.find(query)
      .populate('jobId') 
      .sort({ appliedDate: -1 });
    
    res.json(applications);
  } catch (error) {
    console.error("LỖI 500 TẠI ROUTE GET APPLICATIONS:", error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const application = new Applications(req.body);
    const savedApp = await application.save();

    const jobInfo = await Job.findById(req.body.jobId);
    
    if (jobInfo && jobInfo.postedBy) {
      const employerNoti = await Notification.create({
        recipientEmail: jobInfo.postedBy,
        title: "Ứng viên mới",
        message: `Ứng viên ${application.candidateName} đã ứng tuyển vào vị trí ${jobInfo.title}`,
        isRead: false
      });

      const targetEmployer = req.onlineUsers?.find(u => u.email === jobInfo.postedBy);
      if (targetEmployer) {
        req.io.to(targetEmployer.socketId).emit("getNotification", employerNoti);
      }
    }

    res.status(201).json(savedApp);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const application = await Applications.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('jobId');
    
    if (req.body.status) {
      const statusText = req.body.status === 'accepted' ? 'được chấp nhận' : 'bị từ chối';
      const updateNoti = await Notification.create({
        recipientEmail: application.candidateEmail,
        title: "Kết quả ứng tuyển",
        message: `Đơn ứng tuyển vào ${application.jobId?.title} đã ${statusText}.`,
        isRead: false
      });

      const targetCandidate = req.onlineUsers?.find(u => u.email === application.candidateEmail);
      if (targetCandidate) {
        req.io.to(targetCandidate.socketId).emit("getNotification", updateNoti);
      }
    }
    res.json(application);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;