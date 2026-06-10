import { currentUser } from "@/lib/currentUser";
import { connectDB } from "@/lib/mongobd";
import ResumeModel from "@/models/resume.models";
import { APIResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

// get resume by id
export async function GET(req: NextRequest, { params }: { params: Promise<{ resumeid: string }> }) {
  try {

    await connectDB();

    const userId = await currentUser();
    const resumeId = (await params).resumeid;

    const resume = await ResumeModel.findOne({ user_id: userId, _id: resumeId });

    if (!resume) {
      return NextResponse.json<APIResponse>({
        message: "Resume not found",
        success: false,
      }, { status: 404 });
    }

    return NextResponse.json<APIResponse>({
      message: "Resume fetched successfully",
      success: true,
      data: resume,
    }, { status: 200 });

  } catch (error) {
    console.log("Error getting resume:-", error);
    return NextResponse.json<APIResponse>({
      message: "Error getting resume",
      success: false,
    }, { status: 500 });
  }
}

// update resume by id
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ resumeid: string }> }) {
  try {

    await connectDB();

    const userId = await currentUser();
    const body = await req.json();
    const resumeId = (await params).resumeid;


    const updatedResume = await ResumeModel.findOneAndUpdate(
      {
        _id: resumeId,
        user_id: userId
      }, {
      $set: body
    }, {
      new: true
    }
    );

    if (!updatedResume) {
      return NextResponse.json<APIResponse>({
        message: "Resume not found",
        success: false,
      }, { status: 404 });
    }

    return NextResponse.json<APIResponse>({
      message: "Resume updated successfully",
      success: true,
      data: updatedResume,
    }, { status: 200 });


  } catch (error) {
    console.log("Error updating resume:-", error);
    return NextResponse.json<APIResponse>({
      message: "Error updating resume",
      success: false,
    }, { status: 500 });
  }
}

// delete resume by id
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ resumeid: string }> }) {
  try {
    await connectDB();
    const userId = await currentUser();
    const resumeId = (await params).resumeid;

    const deletedResume = await ResumeModel.findOneAndDelete({
      _id: resumeId,
      user_id: userId
    });

    if (!deletedResume) {
      return NextResponse.json<APIResponse>({
        message: "Resume not found",
        success: false,
      }, { status: 404 });
    }

    return NextResponse.json<APIResponse>({
      message: "Resume deleted successfully",
      success: true,
    }, { status: 200 });

  } catch (error) {
    console.log("Error deleting resume:-", error);
    return NextResponse.json<APIResponse>({
      message: "Error deleting resume",
      success: false,
    }, { status: 500 });
  }
}
