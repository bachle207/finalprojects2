import mongoose from "mongoose";

const JobsSchema = new mongoose.Schema({
  title: String,
  company: String,
  city: String,
  salary: String,
  type: String,
  level: String,
  industry: String,
  experienceYears: Number,
  description: String,
  requirements: String,
  status: String,
  postedBy: String, // Email người đăng
  postedDate: { type: Date, default: Date.now },
});

const Job = mongoose.model("Job", JobsSchema); 
export default Job;