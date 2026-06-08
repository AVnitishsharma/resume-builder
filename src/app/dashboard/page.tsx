"use client";

import React from 'react';
import Link from 'next/link';

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-background text-foreground dark">
            <nav className="border-b border-border p-4 glass sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">
                        Resume AI
                    </h1>
                    <div className="flex items-center space-x-4">
                        <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                            My Resumes
                        </button>
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
                    <Link
                        href="/dashboard/create"
                        className="px-6 py-3 bg-accent text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-accent/20"
                    >
                        Create New Resume
                    </Link>
                </div>

                {/* Empty State */}
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
                    <Link
                        href="/dashboard/create"
                        className="text-accent font-medium hover:underline"
                    >
                        Build your first resume →
                    </Link>
                </div>
            </main>
        </div>
    );
}
