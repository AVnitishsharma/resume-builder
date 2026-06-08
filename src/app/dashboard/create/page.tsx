"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import { IEducation, IWorkExperience, IPersonalInfo } from '@/types/resume.types';

interface ResumeFormData {
    title: string;
    summary: string;
    personalInfo: IPersonalInfo;
    education: IEducation[];
    workExperience: IWorkExperience[];
    skills: string[];
    projects: any[]; // Temporary until project step is added
    certificates: string[];
}

const STEPS = [
    { id: 1, title: 'Personal Info' },
    { id: 2, title: 'Education' },
    { id: 3, title: 'Experience' },
    { id: 4, title: 'Skills' },
    { id: 5, title: 'Finish' }
];

export default function CreateResumePage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
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
        certificates: []
    });

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            personalInfo: { ...formData.personalInfo, [e.target.name]: e.target.value }
        });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await apiRequest('/api/resume/create', {
                method: 'POST',
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
                                <div key={index} className="space-y-4 p-6 border border-white/5 rounded-2xl relative bg-white/5">
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
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-gray-500">Responsibilities</label>
                                        <textarea
                                            placeholder="Bullet points (one per line)"
                                            onBlur={(e) => {
                                                const newExp = [...formData.workExperience];
                                                newExp[index].responsibilities = e.target.value.split('\n').filter(r => r.trim());
                                                setFormData({ ...formData, workExperience: newExp });
                                            }}
                                            className="w-full bg-transparent p-0 text-sm outline-none border-b border-white/10 focus:border-accent pb-1 h-20 resize-none"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="border-b border-white/5 pb-4">
                                <h2 className="text-2xl font-bold">Skills</h2>
                                <p className="text-gray-400 text-sm mt-1">Add your technical and soft skills.</p>
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

                    {currentStep === 5 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 text-center py-10">
                            <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6 text-accent shadow-2xl shadow-accent/20 animate-bounce">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-4xl font-bold">Ready to Save?</h2>
                            <p className="text-gray-400 max-w-sm mx-auto text-lg leading-relaxed">
                                You've completed all the steps. Click "Finish & Save" to generate your professional resume.
                            </p>
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
