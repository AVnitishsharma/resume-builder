"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import { IEducation, IWorkExperience, IPersonalInfo } from '@/types/resume.types';

interface ResumeFormData {
    title: string;
    summary: string;
    personalInfo: IPersonalInfo;
    education: IEducation[];
    workExperience: IWorkExperience[];
    skills: string[];
    projects: {
        title: string;
        description: string;
        liveLink?: string;
        github?: string;
        techStack: string[];
    }[];
    certificates: string[];
    experienceLevel: string;
}

const STEPS = [
    { id: 1, title: 'Personal Info' },
    { id: 2, title: 'Education' },
    { id: 3, title: 'Experience' },
    { id: 4, title: 'Projects' },
    { id: 5, title: 'Skills' },
    { id: 6, title: 'Certificates' },
    { id: 7, title: 'Summary & AI' },
    { id: 8, title: 'Finish' }
];

export default function CreateResumePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const resumeId = searchParams.get('id');

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [atsResult, setAtsResult] = useState<any>(null);
    const [improvingIndex, setImprovingIndex] = useState<{ exp: number, resp: number } | null>(null);
    const [formData, setFormData] = useState<ResumeFormData>({
        title: "",
        summary: "",
        personalInfo: {
            fullName: "",
            email: "",
            mobile: "",
            address: "",
            linkedin: "",
            github: "",
            portfolio: ""
        },
        education: [],
        workExperience: [],
        skills: [],
        projects: [],
        certificates: [],
        experienceLevel: "Entry Level"
    });

    useEffect(() => {
        if (resumeId) {
            const fetchResume = async () => {
                try {
                    const response = await apiRequest(`/api/resume/${resumeId}`);
                    if (response.success) {
                        setFormData(response.data);
                    }
                } catch (err) {
                    console.error("Error fetching resume:", err);
                }
            };
            fetchResume();
        }
    }, [resumeId]);

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            personalInfo: { ...formData.personalInfo, [e.target.name]: e.target.value }
        });
    };

    const handleAiGenerate = async () => {
        setAiLoading(true);
        try {
            const response = await apiRequest('/api/ai/genrate-summary', {
                method: 'POST',
                body: JSON.stringify({
                    experienceLevel: formData.experienceLevel,
                    skills: formData.skills,
                    jobTitle: formData.title
                }),
            });
            if (response.success) {
                setFormData({ ...formData, summary: response.data.summary || response.data });
            }
        } catch (err) {
            alert("AI generation failed");
        } finally {
            setAiLoading(false);
        }
    };

    const handleGenerateExperience = async (index: number) => {
        setAiLoading(true);
        try {
            const exp = formData.workExperience[index];
            const response = await apiRequest('/api/ai/genrate-exprience-description', {
                method: 'POST',
                body: JSON.stringify({
                    jobRole: exp.position,
                    experienceLevel: formData.experienceLevel,
                    techStack: formData.skills, // Using general skills as tech stack context
                    yearOfExperience: 2 // Defaulting or could prompt
                }),
            });
            if (response.success) {
                const newExp = [...formData.workExperience];
                newExp[index].responsibilities = [response.data.experienceDescription];
                setFormData({ ...formData, workExperience: newExp });
            }
        } catch (err) {
            alert("Experience generation failed");
        } finally {
            setAiLoading(false);
        }
    };

    const handleGenerateProject = async (index: number) => {
        setAiLoading(true);
        try {
            const proj = formData.projects[index];
            const response = await apiRequest('/api/ai/genrate-project-description', {
                method: 'POST',
                body: JSON.stringify({
                    jobTitle: formData.title,
                    experienceLevel: formData.experienceLevel,
                    techStack: proj.techStack
                }),
            });
            if (response.success) {
                const newProj = [...formData.projects];
                newProj[index].description = response.data.projectDescription;
                setFormData({ ...formData, projects: newProj });
            }
        } catch (err) {
            alert("Project generation failed");
        } finally {
            setAiLoading(false);
        }
    };

    const handleSuggestSkills = async () => {
        setAiLoading(true);
        try {
            const response = await apiRequest('/api/ai/genrate-skills', {
                method: 'POST',
                body: JSON.stringify({
                    jobTitle: formData.title,
                    experienceLevel: formData.experienceLevel
                }),
            });
            if (response.success) {
                // Assuming response.data.skills is an array
                const suggestedSkills = response.data.skills || [];
                setFormData({ ...formData, skills: Array.from(new Set([...formData.skills, ...suggestedSkills])) });
            }
        } catch (err) {
            alert("Skill suggestion failed");
        } finally {
            setAiLoading(false);
        }
    };

    const handleImproveContent = async (expIndex: number, respIndex: number, content: string) => {
        setImprovingIndex({ exp: expIndex, resp: respIndex });
        try {
            const response = await apiRequest('/api/ai/improve-content', {
                method: 'POST',
                body: JSON.stringify({ content }),
            });
            if (response.success) {
                const newExp = [...formData.workExperience];
                newExp[expIndex].responsibilities![respIndex] = response.data.improveContent;
                setFormData({ ...formData, workExperience: newExp });
            }
        } catch (err) {
            alert("Improvement failed");
        } finally {
            setImprovingIndex(null);
        }
    };

    const handleCheckAtsScore = async () => {
        setAiLoading(true);
        try {
            // Construct plain text resume for ATS analysis
            const resumeText = `
                TITLE: ${formData.title}
                SUMMARY: ${formData.summary}
                SKILLS: ${formData.skills.join(', ')}
                EXPERIENCE:
                ${formData.workExperience.map(exp => `${exp.position} at ${exp.company}\n${exp.responsibilities?.join('\n')}`).join('\n')}
                PROJECTS:
                ${formData.projects.map(p => `${p.title}: ${p.description}`).join('\n')}
                CERTIFICATES:
                ${formData.certificates.join(', ')}
                EDUCATION:
                ${formData.education.map(edu => `${edu.degree} from ${edu.institution}`).join('\n')}
            `;

            const response = await apiRequest('/api/ai/ats-score', {
                method: 'POST',
                body: JSON.stringify({ resumeText }),
            });

            if (response.success) {
                setAtsResult(response.data);
            }
        } catch (err) {
            alert("ATS check failed");
        } finally {
            setAiLoading(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const url = resumeId ? `/api/resume/${resumeId}` : '/api/resume/create';
            const method = resumeId ? 'PATCH' : 'POST';

            await apiRequest(url, {
                method,
                body: JSON.stringify(formData),
            });
            router.push('/dashboard');
        } catch (err) {
            alert("Failed to save resume");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground dark flex flex-col">
            {/* Progress Header */}
            <div className="border-b border-border glass py-6 px-6 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    {STEPS.map((step) => (
                        <div key={step.id} className="flex flex-col items-center flex-1 relative">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 mb-2 ${currentStep >= step.id ? 'bg-accent text-white' : 'bg-white/5 text-gray-500 border border-white/10'
                                }`}>
                                {step.id}
                            </div>
                            <span className={`text-[10px] uppercase tracking-widest font-bold ${currentStep >= step.id ? 'text-accent' : 'text-gray-500'
                                }`}>
                                {step.title}
                            </span>
                            {step.id !== STEPS.length && (
                                <div className={`absolute top-5 left-[calc(50%+20px)] w-[calc(100%-40px)] h-[2px] ${currentStep > step.id ? 'bg-accent' : 'bg-white/5'
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Content */}
            <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
                <div className="glass p-10 rounded-3xl shadow-xl">
                    {currentStep === 1 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="border-b border-white/5 pb-4">
                                <h2 className="text-2xl font-bold">Personal Information</h2>
                                <p className="text-gray-400 text-sm mt-1">Tell us about yourself to get started.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-gray-400">Resume Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g. Senior Frontend Developer"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-accent outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.personalInfo.fullName}
                                        onChange={handlePersonalInfoChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-accent outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.personalInfo.email}
                                        onChange={handlePersonalInfoChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-accent outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Mobile</label>
                                    <input
                                        type="text"
                                        name="mobile"
                                        value={formData.personalInfo.mobile}
                                        onChange={handlePersonalInfoChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-accent outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">LinkedIn</label>
                                    <input
                                        type="text"
                                        name="linkedin"
                                        value={formData.personalInfo.linkedin}
                                        onChange={handlePersonalInfoChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-accent outline-none"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-gray-400">Experience Level</label>
                                    <select
                                        value={formData.experienceLevel}
                                        onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-accent outline-none text-gray-200"
                                    >
                                        <option value="Entry Level" className="bg-[#1a1a1a]">Entry Level</option>
                                        <option value="Associate" className="bg-[#1a1a1a]">Associate</option>
                                        <option value="Mid-Senior Level" className="bg-[#1a1a1a]">Mid-Senior Level</option>
                                        <option value="Senior" className="bg-[#1a1a1a]">Senior</option>
                                        <option value="Lead/Director" className="bg-[#1a1a1a]">Lead/Director</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="border-b border-white/5 pb-4 flex justify-between items-end">
                                <div>
                                    <h2 className="text-2xl font-bold">Education</h2>
                                    <p className="text-gray-400 text-sm mt-1">Your academic background.</p>
                                </div>
                                <button
                                    onClick={() => setFormData({
                                        ...formData,
                                        education: [...formData.education, { institution: "", degree: "", startDate: "", endDate: "" }]
                                    })}
                                    className="text-xs font-bold text-accent uppercase tracking-wider hover:underline"
                                >
                                    + Add Education
                                </button>
                            </div>

                            {formData.education.map((edu: any, index: number) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 border border-white/5 rounded-2xl relative bg-white/5">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-gray-500">Institution</label>
                                        <input
                                            value={edu.institution}
                                            onChange={(e) => {
                                                const newEdu = [...formData.education];
                                                newEdu[index].institution = e.target.value;
                                                setFormData({ ...formData, education: newEdu });
                                            }}
                                            className="w-full bg-transparent p-0 text-sm outline-none border-b border-white/10 focus:border-accent pb-1"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-gray-500">Degree</label>
                                        <input
                                            value={edu.degree}
                                            onChange={(e) => {
                                                const newEdu = [...formData.education];
                                                newEdu[index].degree = e.target.value;
                                                setFormData({ ...formData, education: newEdu });
                                            }}
                                            className="w-full bg-transparent p-0 text-sm outline-none border-b border-white/10 focus:border-accent pb-1"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-gray-500">Start Date</label>
                                        <input
                                            placeholder="MM/YYYY"
                                            value={edu.startDate}
                                            onChange={(e) => {
                                                const newEdu = [...formData.education];
                                                newEdu[index].startDate = e.target.value;
                                                setFormData({ ...formData, education: newEdu });
                                            }}
                                            className="w-full bg-transparent p-0 text-sm outline-none border-b border-white/10 focus:border-accent pb-1"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-gray-500">End Date</label>
                                        <input
                                            placeholder="MM/YYYY"
                                            value={edu.endDate}
                                            onChange={(e) => {
                                                const newEdu = [...formData.education];
                                                newEdu[index].endDate = e.target.value;
                                                setFormData({ ...formData, education: newEdu });
                                            }}
                                            className="w-full bg-transparent p-0 text-sm outline-none border-b border-white/10 focus:border-accent pb-1"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="border-b border-white/5 pb-4 flex justify-between items-end">
                                <div>
                                    <h2 className="text-2xl font-bold">Work Experience</h2>
                                    <p className="text-gray-400 text-sm mt-1">Your professional journey.</p>
                                </div>
                                <button
                                    onClick={() => setFormData({
                                        ...formData,
                                        workExperience: [...formData.workExperience, { company: "", position: "", startDate: "", endDate: "", responsibilities: [] }]
                                    })}
                                    className="text-xs font-bold text-accent uppercase tracking-wider hover:underline"
                                >
                                    + Add Experience
                                </button>
                            </div>

                            {formData.workExperience.map((exp: any, index: number) => (
                                <div key={index} className="space-y-6 p-6 border border-white/5 rounded-2xl relative bg-white/5">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-sm font-bold text-accent">Experience #{index + 1}</h3>
                                        <button
                                            onClick={() => handleGenerateExperience(index)}
                                            disabled={aiLoading}
                                            className="text-[10px] font-bold text-accent/80 hover:text-accent bg-accent/5 px-3 py-1.5 rounded-lg border border-accent/10 transition-all flex items-center space-x-1"
                                        >
                                            {aiLoading ? (
                                                <div className="w-3 h-3 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                                            ) : (
                                                <span>✨ AI Generate Description</span>
                                            )}
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-gray-500">Company</label>
                                            <input
                                                value={exp.company}
                                                onChange={(e) => {
                                                    const newExp = [...formData.workExperience];
                                                    newExp[index].company = e.target.value;
                                                    setFormData({ ...formData, workExperience: newExp });
                                                }}
                                                className="w-full bg-transparent p-0 text-sm outline-none border-b border-white/10 focus:border-accent pb-1"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-gray-500">Position</label>
                                            <input
                                                value={exp.position}
                                                onChange={(e) => {
                                                    const newExp = [...formData.workExperience];
                                                    newExp[index].position = e.target.value;
                                                    setFormData({ ...formData, workExperience: newExp });
                                                }}
                                                className="w-full bg-transparent p-0 text-sm outline-none border-b border-white/10 focus:border-accent pb-1"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-gray-500">Start Date</label>
                                            <input
                                                placeholder="MM/YYYY"
                                                value={exp.startDate}
                                                onChange={(e) => {
                                                    const newExp = [...formData.workExperience];
                                                    newExp[index].startDate = e.target.value;
                                                    setFormData({ ...formData, workExperience: newExp });
                                                }}
                                                className="w-full bg-transparent p-0 text-sm outline-none border-b border-white/10 focus:border-accent pb-1"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-gray-500">End Date</label>
                                            <input
                                                placeholder="MM/YYYY"
                                                value={exp.endDate}
                                                onChange={(e) => {
                                                    const newExp = [...formData.workExperience];
                                                    newExp[index].endDate = e.target.value;
                                                    setFormData({ ...formData, workExperience: newExp });
                                                }}
                                                className="w-full bg-transparent p-0 text-sm outline-none border-b border-white/10 focus:border-accent pb-1"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] uppercase font-bold text-gray-500">Responsibilities</label>
                                            <button
                                                onClick={() => {
                                                    const newExp = [...formData.workExperience];
                                                    newExp[index].responsibilities = [...(newExp[index].responsibilities || []), ""];
                                                    setFormData({ ...formData, workExperience: newExp });
                                                }}
                                                className="text-[10px] font-bold text-accent uppercase tracking-wider hover:underline"
                                            >
                                                + Add Responsibility
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            {(exp.responsibilities || []).map((resp: string, rIndex: number) => (
                                                <div key={rIndex} className="flex space-x-2 group">
                                                    <input
                                                        value={resp}
                                                        onChange={(e) => {
                                                            const newExp = [...formData.workExperience];
                                                            newExp[index].responsibilities![rIndex] = e.target.value;
                                                            setFormData({ ...formData, workExperience: newExp });
                                                        }}
                                                        placeholder="Describe your impact..."
                                                        className="flex-1 bg-transparent text-sm outline-none border-b border-white/10 focus:border-accent pb-1"
                                                    />
                                                    <button
                                                        onClick={() => handleImproveContent(index, rIndex, resp)}
                                                        disabled={improvingIndex?.exp === index && improvingIndex?.resp === rIndex}
                                                        className="text-xs text-accent/50 hover:text-accent font-bold opacity-0 group-hover:opacity-100 transition-all flex items-center space-x-1"
                                                    >
                                                        {improvingIndex?.exp === index && improvingIndex?.resp === rIndex ? (
                                                            <div className="w-3 h-3 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                                                        ) : (
                                                            <span>✨ Improve</span>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            const newExp = [...formData.workExperience];
                                                            newExp[index].responsibilities = newExp[index].responsibilities!.filter((_, i) => i !== rIndex);
                                                            setFormData({ ...formData, workExperience: newExp });
                                                        }}
                                                        className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="border-b border-white/5 pb-4 flex justify-between items-end">
                                <div>
                                    <h2 className="text-2xl font-bold">Projects</h2>
                                    <p className="text-gray-400 text-sm mt-1">Showcase your best work.</p>
                                </div>
                                <button
                                    onClick={() => setFormData({
                                        ...formData,
                                        projects: [...formData.projects, { title: "", description: "", techStack: [], github: "", liveLink: "" }]
                                    })}
                                    className="text-xs font-bold text-accent uppercase tracking-wider hover:underline"
                                >
                                    + Add Project
                                </button>
                            </div>

                            {formData.projects.map((proj, index) => (
                                <div key={index} className="space-y-6 p-6 border border-white/5 rounded-2xl relative bg-white/5">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-sm font-bold text-accent">Project #{index + 1}</h3>
                                        <button
                                            onClick={() => handleGenerateProject(index)}
                                            disabled={aiLoading}
                                            className="text-[10px] font-bold text-accent/80 hover:text-accent bg-accent/5 px-3 py-1.5 rounded-lg border border-accent/10 transition-all flex items-center space-x-1"
                                        >
                                            {aiLoading ? (
                                                <div className="w-3 h-3 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                                            ) : (
                                                <span>✨ AI Generate Description</span>
                                            )}
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-gray-500">Project Title</label>
                                            <input
                                                value={proj.title}
                                                onChange={(e) => {
                                                    const newProj = [...formData.projects];
                                                    newProj[index].title = e.target.value;
                                                    setFormData({ ...formData, projects: newProj });
                                                }}
                                                className="w-full bg-transparent p-0 text-sm outline-none border-b border-white/10 focus:border-accent pb-1"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-gray-500">Tech Stack (comma separated)</label>
                                            <input
                                                value={proj.techStack?.join(', ')}
                                                onChange={(e) => {
                                                    const newProj = [...formData.projects];
                                                    newProj[index].techStack = e.target.value.split(',').map(s => s.trim());
                                                    setFormData({ ...formData, projects: newProj });
                                                }}
                                                className="w-full bg-transparent p-0 text-sm outline-none border-b border-white/10 focus:border-accent pb-1"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-gray-500">GitHub Link</label>
                                            <input
                                                value={proj.github}
                                                onChange={(e) => {
                                                    const newProj = [...formData.projects];
                                                    newProj[index].github = e.target.value;
                                                    setFormData({ ...formData, projects: newProj });
                                                }}
                                                className="w-full bg-transparent p-0 text-sm outline-none border-b border-white/10 focus:border-accent pb-1"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-gray-500">Live Link</label>
                                            <input
                                                value={proj.liveLink}
                                                onChange={(e) => {
                                                    const newProj = [...formData.projects];
                                                    newProj[index].liveLink = e.target.value;
                                                    setFormData({ ...formData, projects: newProj });
                                                }}
                                                className="w-full bg-transparent p-0 text-sm outline-none border-b border-white/10 focus:border-accent pb-1"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-gray-500">Description</label>
                                        <textarea
                                            value={proj.description}
                                            onChange={(e) => {
                                                const newProj = [...formData.projects];
                                                newProj[index].description = e.target.value;
                                                setFormData({ ...formData, projects: newProj });
                                            }}
                                            className="w-full bg-transparent p-0 text-sm outline-none border-b border-white/10 focus:border-accent pb-1 h-16 resize-none"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {currentStep === 5 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="border-b border-white/5 pb-4 flex justify-between items-end">
                                <div>
                                    <h2 className="text-2xl font-bold">Skills</h2>
                                    <p className="text-gray-400 text-sm mt-1">Add your technical and soft skills.</p>
                                </div>
                                <button
                                    onClick={handleSuggestSkills}
                                    disabled={aiLoading}
                                    className="text-[10px] font-bold text-accent/80 hover:text-accent bg-accent/5 px-3 py-1.5 rounded-lg border border-accent/10 transition-all flex items-center space-x-1"
                                >
                                    {aiLoading ? (
                                        <div className="w-3 h-3 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                                    ) : (
                                        <span>✨ Suggest Skills</span>
                                    )}
                                </button>
                            </div>
                            <div className="space-y-4">
                                <input
                                    placeholder="Press Enter to add a skill (e.g. React, Node.js)"
                                    onKeyDown={(e: any) => {
                                        if (e.key === 'Enter' && e.target.value) {
                                            e.preventDefault();
                                            setFormData({ ...formData, skills: [...formData.skills, e.target.value] });
                                            e.target.value = "";
                                        }
                                    }}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-accent outline-none"
                                />
                                <div className="flex flex-wrap gap-3">
                                    {formData.skills.map((skill: string, index: number) => (
                                        <div key={index} className="bg-accent/10 text-accent border border-accent/20 px-4 py-2 rounded-xl text-sm font-semibold flex items-center space-x-2 animate-in zoom-in-50 duration-300">
                                            <span>{skill}</span>
                                            <button
                                                onClick={() => setFormData({ ...formData, skills: formData.skills.filter((_, i) => i !== index) })}
                                                className="hover:text-white transition-colors"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 6 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="border-b border-white/5 pb-4 flex justify-between items-end">
                                <div>
                                    <h2 className="text-2xl font-bold">Certificates</h2>
                                    <p className="text-gray-400 text-sm mt-1">List your certifications.</p>
                                </div>
                                <button
                                    onClick={() => setFormData({ ...formData, certificates: [...formData.certificates, ""] })}
                                    className="text-xs font-bold text-accent uppercase tracking-wider hover:underline"
                                >
                                    + Add Certificate
                                </button>
                            </div>
                            <div className="space-y-4">
                                {formData.certificates.map((cert, index) => (
                                    <div key={index} className="flex space-x-2">
                                        <input
                                            value={cert}
                                            onChange={(e) => {
                                                const newCerts = [...formData.certificates];
                                                newCerts[index] = e.target.value;
                                                setFormData({ ...formData, certificates: newCerts });
                                            }}
                                            placeholder="e.g. AWS Certified Solutions Architect"
                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-accent outline-none"
                                        />
                                        <button
                                            onClick={() => setFormData({ ...formData, certificates: formData.certificates.filter((_, i) => i !== index) })}
                                            className="text-gray-600 hover:text-red-400"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentStep === 7 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="border-b border-white/5 pb-4 flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold">Resume Summary</h2>
                                    <p className="text-gray-400 text-sm mt-1">Write a brief summary or use AI.</p>
                                </div>
                                <button
                                    onClick={handleAiGenerate}
                                    disabled={aiLoading}
                                    className="px-4 py-2 bg-accent/20 text-accent border border-accent/30 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-accent/30 transition-all flex items-center space-x-2"
                                >
                                    {aiLoading ? (
                                        <div className="w-3 h-3 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                                    ) : (
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM14.243 14.243a1 1 0 101.414-1.414l-.707-.707a1 1 0 10-1.414 1.414l.707.707zM10 18a1 1 0 100-2v-1a1 1 0 10-2 0v1a1 1 0 102 0zM5.757 14.243a1 1 0 001.414 1.414l.707-.707a1 1 0 00-1.414-1.414l-.707.707zM6 10a1 1 0 01-1-1H4a1 1 0 110-2h1a1 1 0 011 1zM7.172 4.343a1 1 0 10-1.414 1.414l.707.707a1 1 0 101.414-1.414l-.707-.707z" />
                                        </svg>
                                    )}
                                    <span>AI Generate</span>
                                </button>
                            </div>
                            <textarea
                                value={formData.summary}
                                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                placeholder="A brief summary of your professional background..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 focus:ring-2 focus:ring-accent outline-none h-48 resize-none text-lg leading-relaxed shadow-inner"
                            />
                        </div>
                    )}

                    {currentStep === 8 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 text-center py-10">
                            <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6 text-accent shadow-2xl shadow-accent/20 animate-bounce">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-4xl font-bold">Ready to Save?</h2>
                            <p className="text-gray-400 max-w-sm mx-auto text-lg leading-relaxed mb-10">
                                You've completed all the steps. Click "Finish & Save" to update your professional resume.
                            </p>

                            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 max-w-lg mx-auto">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-xl">ATS Compatibility</h3>
                                    <button
                                        onClick={handleCheckAtsScore}
                                        disabled={aiLoading}
                                        className="px-4 py-2 bg-accent/20 text-accent border border-accent/30 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-accent/30 transition-all"
                                    >
                                        {aiLoading ? "Checking..." : "Check Score"}
                                    </button>
                                </div>
                                {atsResult ? (
                                    <div className="space-y-6 text-left animate-in fade-in zoom-in-95 duration-500">
                                        <div className="flex items-center space-x-6">
                                            <div className="w-24 h-24 rounded-full border-4 border-accent/20 flex items-center justify-center relative">
                                                <div className="absolute inset-0 rounded-full border-4 border-accent border-t-transparent animate-[spin_3s_linear_infinite]" />
                                                <span className="text-3xl font-black text-accent">{atsResult.atsScore}%</span>
                                            </div>
                                            <p className="flex-1 text-sm text-gray-400 italic">
                                                "{atsResult.summary}"
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <h4 className="text-[10px] uppercase font-bold text-accent tracking-tighter">Strengths</h4>
                                                <ul className="space-y-1">
                                                    {(atsResult.strengths || []).map((s: string, i: number) => (
                                                        <li key={i} className="text-xs text-gray-400 flex items-start space-x-2">
                                                            <span className="text-accent">✓</span>
                                                            <span>{s}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="text-[10px] uppercase font-bold text-yellow-500 tracking-tighter">Improvements</h4>
                                                <ul className="space-y-1">
                                                    {(atsResult.improvements || []).map((s: string, i: number) => (
                                                        <li key={i} className="text-xs text-gray-400 flex items-start space-x-2">
                                                            <span className="text-yellow-500">→</span>
                                                            <span>{s}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm">
                                        Check how well your resume performs with modern recruitment systems.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-12 pt-8 border-t border-white/5">
                        <button
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className={`px-8 py-3 rounded-xl font-semibold transition-all ${currentStep === 1 ? 'opacity-0' : 'bg-white/5 hover:bg-white/10 border border-white/10'
                                }`}
                        >
                            Back
                        </button>
                        <button
                            onClick={currentStep === STEPS.length ? handleSave : nextStep}
                            disabled={loading}
                            className="px-8 py-3 bg-accent text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-accent/20 flex items-center space-x-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <span>{currentStep === STEPS.length ? 'Finish & Save' : 'Next Step'}</span>
                            )}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
