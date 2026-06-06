import { Types } from "mongoose";

export interface IPersonalInfo {
  fullName: string;
  email: string;
  address: string;
  mobile: string;
  github: string;
  linkedin: string;
  portfolio: string;
}

export interface IWorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  responsibilities?: string[];
  achievements?: string[];
}

export interface IProject {
  title: string;
  description: string;
  liveLink: string;
  github: string;
  techStack: string[];
}

export interface IEducation {
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
}

export interface IResume {
  _id?: string;
  user_id: Types.ObjectId;
  title: string;
  summary: string;
  personalInfo: IPersonalInfo;
  workExperience: IWorkExperience[];
  projects: IProject[];
  skills: string[];
  education: IEducation[];
  certificates?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}