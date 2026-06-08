import { currentUser } from "@/lib/currentUser";
import { connectDB } from "@/lib/mongobd";
import ResumeModel from "@/models/resume.models";
import { APIResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const userId = await currentUser();

    const body = await req.json();
    const { title, summary, personalInfo, workExperience, projects, skills, education, certificates } = body;

    const newResume = await ResumeModel.create({
      user_id: userId,
      title: title || "",
      summary: summary || "",
      personalInfo: personalInfo || {},
      workExperience: workExperience || [],
      projects: projects || [],
      skills: skills || [],
      education: education || [],
      certificates: certificates || [],
    });

    return NextResponse.json<APIResponse>({
      message: "Resume created successfully",
      success: true,
      data: newResume,
    }, { status: 201 });

  } catch (error) {

    console.log("Error creating resume:-", error);
    return NextResponse.json<APIResponse>({
      message: "Error creating resume",
      success: false,
      error: String(error),
    }, { status: 500 });

  }
}