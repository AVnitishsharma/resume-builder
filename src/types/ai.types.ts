export interface IGenerateSummaryBoby {
  experienceLevel: string;
  skills: string[];
  jobTitle: string;
  yearsOfExperience: string;
}

export interface IGenrateSkillsBody {
  experienceLevel: string;
  jobTitle: string;
}

export interface IGenrateProjectDescriptionBody {
  projectTitle:string;
  techStack: string[];
  keyFeature:string;
}

export interface IGenrateExperienceDescriptionBody {
  jobRole: string;
  experienceLevel: string;
  techStack: string[];
  yearOfExperience: number;
}

export interface IGenrateImproveContentBody {
  content: string;
}

export interface IGenrateAtsScoreBody {
  resumeText: string;
}