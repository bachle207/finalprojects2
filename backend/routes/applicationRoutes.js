import express from "express";
const router = express.Router();
import Applications from '../models/Applications.js';
import Notification from "../models/Notification.js";
import Job from '../models/Jobs.js';

router.get("/", async (req, res) => {
  try {
    const { email, role } = req.query;
    let query = {};

    if (role === 'candidate') {
      query = { candidateEmail: email };
    } else if (role === 'employer') {
      const myJobs = await Job.find({ postedBy: email });
      if (!myJobs || myJobs.length === 0) return res.json([]);
      const myJobIds = myJobs.map(job => job._id);
      query = { jobId: { $in: myJobIds } };
    }

    const applications = await Applications.find(query)
      .populate('jobId') 
      .sort({ appliedDate: -1 });
    
    return res.json(applications); // Trả về kết quả và kết thúc hàm
  } catch (error) {
    console.error("LỖI 500 TẠI ROUTE GET APPLICATIONS:", error);
    return res.status(500).json({ message: error.message });
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

    return res.status(201).json(savedApp);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.put("/mark-all-read/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const result = await Notification.updateMany(
      { recipientEmail: email, isRead: false },
      { $set: { isRead: true } }
    );
    // Trả về kết quả thành công
    return res.json({ 
      message: "Đã đánh dấu tất cả là đã đọc", 
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const application = await Applications.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, // Chỉ cập nhật status để tránh ghi đè nhầm
      { new: true }
    ).populate('jobId');
    
    if (!application) {
      return res.status(404).json({ message: "Không tìm thấy đơn ứng tuyển này" });
    }

    if (req.body.status) {
      const statusText = req.body.status === 'accepted' ? 'được chấp nhận' : 'bị từ chối';
      const updateNoti = await Notification.create({
        recipientEmail: application.candidateEmail,
        title: "Kết quả ứng tuyển",
        message: `Đơn ứng tuyển vào ${application.jobId?.title || 'công việc'} đã ${statusText}.`,
        isRead: false
      });

      const targetCandidate = req.onlineUsers?.find(u => u.email === application.candidateEmail);
      if (targetCandidate) {
        req.io.to(targetCandidate.socketId).emit("getNotification", updateNoti);
      }
    }
    
    return res.json(application); 
  } catch (error) {
    console.error("Lỗi duyệt đơn:", error);
    return res.status(400).json({ message: error.message });
  }
});

export default router;