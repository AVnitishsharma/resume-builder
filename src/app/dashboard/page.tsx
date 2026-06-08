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

    return (
        <div className="min-h-screen bg-background text-foreground dark">
            <nav className="border-b border-border p-4 glass sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">
                        Resume AI
                    </h1>
                    <div className="flex items-center space-x-4">
                        <Link href="/dashboard" className="text-sm font-medium text-white transition-colors">
                            My Resumes
                        </Link>
                        <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent text-xs font-bold">
                            NS
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
                        <p className="text-gray-400">Manage your resumes or create a new one to get started.</p>
                    </div>
                    <button
                        onClick={handleCreateResume}
                        disabled={isCreating}
                        className="px-6 py-3 bg-accent text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-accent/20 disabled:opacity-50"
                    >
                        {isCreating ? "Creating..." : "Create New Resume"}
                    </button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-white/5 rounded-3xl border border-white/10" />
                        ))}
                    </div>
                ) : resumes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {resumes.map((resume) => (
                            <div key={resume._id} className="group relative bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-accent/5">
                                <div className="h-40 bg-accent/10 rounded-2xl mb-6 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                                    <svg className="w-12 h-12 text-accent/50 group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-2 truncate">{resume.title || "Untitled Resume"}</h3>
                                <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                                    {resume.summary || "No summary available."}
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">
                                        Updated {new Date(resume.updatedAt!).toLocaleDateString()}
                                    </span>
                                    <div className="flex space-x-4">
                                        <Link
                                            href={`/dashboard/view/${resume._id}`}
                                            className="text-gray-400 text-sm font-bold hover:text-white transition-colors"
                                        >
                                            View
                                        </Link>
                                        <Link
                                            href={`/dashboard/create?id=${resume._id}`}
                                            className="text-accent text-sm font-bold hover:underline"
                                        >
                                            Edit Resume →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="border-2 border-dashed border-border rounded-3xl p-20 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                            <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No resumes yet</h3>
                        <p className="text-gray-400 max-w-xs mb-8">
                            Start by creating your first resume with our AI-powered builder.
                        </p>
                        <button
                            onClick={handleCreateResume}
                            className="text-accent font-medium hover:underline disabled:opacity-50"
                            disabled={isCreating}
                        >
                            {isCreating ? "Creating..." : "Build your first resume →"}
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
