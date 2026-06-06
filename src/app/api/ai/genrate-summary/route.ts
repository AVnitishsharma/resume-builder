import { gentrateAiContent } from "@/lib/gemini";
import { IGenerateSummaryBoby } from "@/types/ai.types";
import { APIResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
  try {

    const body:IGenerateSummaryBoby = await req.json();
    const { experienceLevel, skills, jobTitle } = body;

    if(!experienceLevel || !skills || !jobTitle) {
      return NextResponse.json<APIResponse>({
        message: "All fields are required",
        success: false,
      }, { status: 400 });
    }

    const prompt = `
      You are an expert ATS resume writer and career consultant.

      Generate a professional ATS-friendly resume summary using the information below.

      Job Title: ${jobTitle}
      Experience Level: ${experienceLevel}
      Skills: ${skills}

      STRICT RULES:
      - Return ONLY the resume summary.
      - Do NOT include headings, labels, bullet points, markdown, quotes, explanations, or extra text.
      - Summary length must be between 50 and 80 words.
      - Write in a professional, concise, and impactful tone.
      - Naturally include the Job Title and relevant Skills as ATS keywords.
      - Highlight expertise, strengths, and value to employers.
      - Use strong action-oriented language.
      - Avoid generic phrases like "hardworking", "team player", "seeking opportunities", "Results-oriented", "passionate individual", or "Driven professional".
      - Do NOT invent experience, certifications, degrees, achievements, or qualifications that were not provided.
      - For Freshers or Entry-Level candidates, focus on skills, projects, learning ability, and readiness to contribute.
      - For Mid-Level and Senior candidates, emphasize expertise, impact, leadership, and professional accomplishments when applicable.
      - Ensure the summary is optimized for both ATS systems and recruiter readability.
      - Output plain text only.

      Generate the resume summary now.
    `;

    const result = await gentrateAiContent(prompt);
    const summary = result!.trim();

    return NextResponse.json<APIResponse>({
      message: "Summary generated successfully",
      success: true,
      data: {summary},
    }, { status: 200 });
    
  } catch (error) {
    console.log("Error generating summary:-", error);
    return NextResponse.json<APIResponse>({
      message: "Error generating summary",
      success: false,
    }, { status: 500 });
  }
}