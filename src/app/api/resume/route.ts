import { currentUser } from "@/lib/currentUser";
import { connectDB } from "@/lib/mongobd";
import ResumeModel from "@/models/resume.models";
import { APIResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const userId = await currentUser();
        console.log("Fetching resumes for user:", userId);

        const resumes = await ResumeModel.find({ user_id: userId }).sort({ updatedAt: -1 });
        console.log("Found resumes:", resumes.length);

        return NextResponse.json<APIResponse>({
            message: "Resumes fetched successfully",
            success: true,
            data: resumes,
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching resumes:", error);
        return NextResponse.json<APIResponse>({
            message: "Error fetching resumes",
            success: false,
            error: String(error),
        }, { status: 500 });
    }
}
