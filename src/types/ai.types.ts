export interface IGenerateSummaryBoby {
  experienceLevel: string;
  skills: string[];
  jobTitle: string;
}

export interface IGenrateSkillsBody {
  experienceLevel: string;
  jobTitle: string;
}

export interface IGenrateProjectDescriptionBody {
  experienceLevel: string;
  jobTitle: string;
  techStack: string[];
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