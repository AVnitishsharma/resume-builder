import React from 'react';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center relative overflow-hidden dark">
            {/* Dynamic Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-700" />

            <div className="relative z-10 w-full max-w-md px-6 py-12">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">
                        Resume AI
                    </h1>
                    <p className="text-muted-foreground mt-2 text-gray-400">
                        Build your professional future with ease
                    </p>
                </div>
                {children}
            </div>
        </div>
    );
}
