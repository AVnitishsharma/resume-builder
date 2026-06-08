import { IResume } from "@/types/resume.types";
import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema<IResume>({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    default: ""
  },
  summary: {
    type: String,
    default: ""
  },
  personalInfo: {
    type: {
      fullName: String,
      email: String,
      address: String,
      mobile: String,
      github: String,
      linkedin: String,
      portfolio: String,
    },
    default: {}
  },
  workExperience: {
    type: [
      {
        company: String,
        position: String,
        startDate: String,
        endDate: String,
        responsibilities: [String],
        achievements: [String],
      }
    ],
    default: [],
  },
  projects: {
    type: [
      {
        title: String,
        description: String,
        liveLink: String,
        github: String,
        techStack: [String],
      }
    ],
    default: [],
  },
  skills: {
    type: [String],
    default: [],
  },
  education: {
    type: [
      {
        degree: String,
        institution: String,
        startDate: String,
        endDate: String,
      }
    ],
    default: [],
  },
  certificates: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,
});

export const ResumeModel = mongoose.models.resume || mongoose.model("resume", resumeSchema);
export default ResumeModel;