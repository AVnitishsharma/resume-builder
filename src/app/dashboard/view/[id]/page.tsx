"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import { IResume } from '@/types/resume.types';

export default function ViewResumePage() {
    const params = useParams();
    const router = useRouter();
    const resumeId = params.id;
    const [resume, setResume] = useState<IResume | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (resumeId) {
            fetchResume();
        }
    }, [resumeId]);

    const fetchResume = async () => {
        try {
            const response = await apiRequest(`/api/resume/${resumeId}`);
            if (response.success) {
                setResume(response.data);
            }
        } catch (error) {
            console.error("Error fetching resume:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
            </div>
        );
    }

    if (!resume) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center">
                <h2 className="text-2xl font-bold mb-4">Resume not found</h2>
                <button
                    onClick={() => router.push('/dashboard')}
                    className="px-6 py-2 bg-accent text-white rounded-xl"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f3f4f6] py-12 px-4 dark:bg-stone-900">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Actions */}
                <div className="flex justify-between items-center no-print">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center space-x-2 text-gray-500 hover:text-accent font-medium transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Dashboard</span>
                    </button>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => window.print()}
                            className="px-6 py-2 bg-white text-black border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm flex items-center space-x-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            <span>Print / PDF</span>
                        </button>
                        <button
                            onClick={() => router.push(`/dashboard/create?id=${resume._id}`)}
                            className="px-6 py-2 bg-accent text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-accent/20"
                        >
                            Edit Resume
                        </button>
                    </div>
                </div>

                {/* Resume Paper */}
                <div className="bg-white text-black shadow-2xl p-12 min-h-[1100px] font-serif transition-all" id="resume-content">
                    {/* Header */}
                    <div className="text-center border-b-2 border-black pb-8 mb-8">
                        <h1 className="text-4xl font-bold uppercase tracking-widest mb-4">
                            {resume.personalInfo.fullName}
                        </h1>
                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
                            {resume.personalInfo.email && (
                                <span className="flex items-center space-x-1">
                                    <span className="font-bold">E:</span> <span>{resume.personalInfo.email}</span>
                                </span>
                            )}
                            {resume.personalInfo.mobile && (
                                <span className="flex items-center space-x-1">
                                    <span className="font-bold">M:</span> <span>{resume.personalInfo.mobile}</span>
                                </span>
                            )}
                            {resume.personalInfo.linkedin && (
                                <span className="flex items-center space-x-1">
                                    <span className="font-bold">L:</span> <span>{resume.personalInfo.linkedin}</span>
                                </span>
                            )}
                            {resume.personalInfo.address && (
                                <span className="flex items-center space-x-1">
                                    <span className="font-bold">A:</span> <span>{resume.personalInfo.address}</span>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Summary */}
                    {resume.summary && (
                        <div className="mb-10">
                            <h2 className="text-lg font-bold border-b border-black mb-4 uppercase tracking-wider">Professional Summary</h2>
                            <p className="text-sm leading-relaxed text-justify">
                                {resume.summary}
                            </p>
                        </div>
                    )}

                    {/* Experience */}
                    {resume.workExperience && resume.workExperience.length > 0 && (
                        <div className="mb-10">
                            <h2 className="text-lg font-bold border-b border-black mb-4 uppercase tracking-wider">Experience</h2>
                            <div className="space-y-6">
                                {resume.workExperience.map((exp, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-base">{exp.company}</h3>
                                            <span className="text-xs italic">{exp.startDate} – {exp.endDate}</span>
                                        </div>
                                        <p className="italic text-sm mb-2">{exp.position}</p>
                                        <ul className="list-disc list-outside ml-4 space-y-1">
                                            {exp.responsibilities?.map((res, j) => (
                                                <li key={j} className="text-sm">{res}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Projects */}
                    {resume.projects && resume.projects.length > 0 && (
                        <div className="mb-10">
                            <h2 className="text-lg font-bold border-b border-black mb-4 uppercase tracking-wider">Projects</h2>
                            <div className="space-y-6">
                                {resume.projects.map((proj, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-base">{proj.title}</h3>
                                            <div className="flex space-x-2 text-xs italic">
                                                {proj.github && <a href={proj.github} className="hover:underline">GitHub</a>}
                                                {proj.liveLink && <a href={proj.liveLink} className="hover:underline">Live</a>}
                                            </div>
                                        </div>
                                        <p className="text-xs italic mb-2">{proj.techStack?.join(", ")}</p>
                                        <p className="text-sm leading-relaxed">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Education */}
                    {resume.education && resume.education.length > 0 && (
                        <div className="mb-10">
                            <h2 className="text-lg font-bold border-b border-black mb-4 uppercase tracking-wider">Education</h2>
                            <div className="space-y-4">
                                {resume.education.map((edu, i) => (
                                    <div key={i} className="flex justify-between items-baseline">
                                        <div>
                                            <h3 className="font-bold text-sm">{edu.institution}</h3>
                                            <p className="text-sm">{edu.degree}</p>
                                        </div>
                                        <span className="text-xs italic">{edu.startDate} – {edu.endDate}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Certificates */}
                    {resume.certificates && resume.certificates.length > 0 && (
                        <div className="mb-10">
                            <h2 className="text-lg font-bold border-b border-black mb-4 uppercase tracking-wider">Certifications</h2>
                            <ul className="list-disc list-outside ml-4 space-y-1">
                                {resume.certificates.map((cert, i) => (
                                    <li key={i} className="text-sm">{cert}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Skills */}
                    {resume.skills && resume.skills.length > 0 && (
                        <div className="mb-10">
                            <h2 className="text-lg font-bold border-b border-black mb-4 uppercase tracking-wider">Technical Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                <p className="text-sm">
                                    <span className="font-bold">Technologies: </span>
                                    {resume.skills.join(', ')}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    .no-print {
                        display: none !important;
                    }
                    body {
                        background: white !important;
                        padding: 0 !important;
                    }
                    .min-h-screen {
                        min-height: auto !important;
                    }
                    #resume-content {
                        box-shadow: none !important;
                        padding: 0 !important;
                    }
                    .shadow-2xl {
                        box-shadow: none !important;
                    }
                }
            `}</style>
        </div>
    );
}
