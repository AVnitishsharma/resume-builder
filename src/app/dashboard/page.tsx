"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import { IResume } from '@/types/resume.types';

export default function DashboardPage() {
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(false);
    const [resumes, setResumes] = useState<IResume[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            console.log("Dashboard: Fetching resumes...");
            const response = await apiRequest('/api/resume');
            console.log("Dashboard: Fetch response:", response);
            if (response.success) {
                setResumes(response.data);
            }
        } catch (error) {
            console.error("Dashboard: Error fetching resumes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateResume = async () => {
        setIsCreating(true);
        try {
            const response = await apiRequest('/api/resume/create', {
                method: 'POST',
                body: JSON.stringify({ title: "Untitled Resume" }),
            });
            if (response.success && response.data?._id) {
                router.push(`/dashboard/create?id=${response.data._id}`);
            } else {
                alert("Failed to create resume");
            }
        } catch (error) {
            console.error("Error creating resume:", error);
            alert("Something went wrong");
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (!window.confirm("Are you sure you want to delete this resume?")) return;

        try {
            const response = await apiRequest(`/api/resume/${id}`, {
                method: 'DELETE',
            });
            if (response.success) {
                setResumes(resumes.filter(r => r._id !== id));
            } else {
                alert("Failed to delete resume");
            }
        } catch (error) {
            console.error("Error deleting resume:", error);
            alert("Something went wrong");
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-foreground dark flex flex-col">
            <nav className="border-b border-white/5 p-4 glass sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter text-white">
                            RESUME<span className="text-accent text-3xl">.</span>AI
                        </h1>
                    </div>
                    <div className="flex items-center space-x-6">
                        <Link href="/dashboard" className="text-sm font-bold text-white/70 hover:text-white transition-colors uppercase tracking-widest">
                            Dashboard
                        </Link>
                        <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent text-sm font-black shadow-inner">
                            NS
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-16 w-full">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-5xl font-black mb-4 tracking-tight leading-tight">
                            Build your <br />
                            <span className="text-accent underline underline-offset-8 decoration-accent/30 text-6xl">Next Career.</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-md font-medium">
                            Create professional, ATS-ready resumes in minutes with AI.
                        </p>
                    </div>
                    <button
                        onClick={handleCreateResume}
                        disabled={isCreating}
                        className="group relative px-8 py-4 bg-accent text-white rounded-2xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-accent/30 disabled:opacity-50 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <span className="relative z-10 flex items-center space-x-2">
                            <span>{isCreating ? "Creating..." : "Create New Resume"}</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                            </svg>
                        </span>
                    </button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-80 bg-white/5 rounded-[2rem] border border-white/10 animate-pulse" />
                        ))}
                    </div>
                ) : resumes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {resumes.map((resume) => (
                            <div key={resume._id} className="group relative bg-[#141414] border border-white/5 rounded-[2rem] p-1 shadow-2xl hover:border-accent/30 transition-all duration-500 hover:-translate-y-2">
                                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]" />
                                <div className="relative bg-[#0f0f0f] rounded-[1.8rem] p-8 h-full flex flex-col">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent ring-1 ring-accent/20 group-hover:bg-accent group-hover:text-white transition-all duration-500">
                                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <button
                                            onClick={(e) => handleDelete(e, resume._id!)}
                                            className="p-3 bg-white/5 text-gray-500 hover:bg-red-500/20 hover:text-red-500 rounded-2xl border border-white/10 transition-all duration-300"
                                            title="Delete Resume"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>

                                    <h3 className="text-2xl font-black mb-3 text-white group-hover:text-accent transition-colors duration-300 line-clamp-1">
                                        {resume.title || "Untitled Resume"}
                                    </h3>
                                    <p className="text-gray-500 text-sm font-medium mb-8 line-clamp-2 leading-relaxed">
                                        {resume.summary || "Start crafting your summary to highlight your expertise..."}
                                    </p>

                                    <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase tracking-tighter font-black text-gray-600 mb-1">Last Updated</span>
                                            <span className="text-xs font-bold text-white/40">
                                                {new Date(resume.updatedAt!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => router.push(`/dashboard/view/${resume._id}`)}
                                                className="p-3 bg-white/5 text-white/70 hover:bg-white/10 rounded-xl border border-white/10 transition-all"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => router.push(`/dashboard/create?id=${resume._id}`)}
                                                className="px-5 py-3 bg-accent/10 text-accent hover:bg-accent hover:text-white rounded-xl border border-accent/20 font-black text-sm transition-all shadow-lg shadow-accent/5"
                                            >
                                                EDIT
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="bg-[#0f0f0f] border border-white/5 rounded-[3rem] p-24 flex flex-col items-center justify-center text-center shadow-inner">
                        <div className="w-24 h-24 bg-accent/5 rounded-[2rem] flex items-center justify-center mb-8 border border-accent/10 ring-8 ring-accent/5 animate-pulse">
                            <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <h3 className="text-3xl font-black mb-4 tracking-tight">No resumes yet.</h3>
                        <p className="text-gray-500 max-w-sm mb-10 text-lg font-medium leading-relaxed">
                            A great career starts with a professional resume. Generate your first one now.
                        </p>
                        <button
                            onClick={handleCreateResume}
                            className="px-10 py-5 bg-accent text-white rounded-[1.5rem] font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-accent/40 disabled:opacity-50"
                            disabled={isCreating}
                        >
                            {isCreating ? "Creating..." : "Build First Resume →"}
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
