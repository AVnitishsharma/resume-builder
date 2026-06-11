import { gentrateAiContent } from "@/lib/gemini";
import { IGenerateSummaryBoby } from "@/types/ai.types";
import { APIResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
  try {

    const body:IGenerateSummaryBoby = await req.json();
    const { experienceLevel, skills, jobTitle, yearsOfExperience } = body;

    if(!experienceLevel || !skills || !jobTitle || !yearsOfExperience) {
      return NextResponse.json<APIResponse>({
        message: "All fields are required",
        success: false,
      }, { status: 400 });
    }

    const prompt = `
      You are an expert ATS resume writer, technical recruiter, and career consultant.
        
      Generate a professional ATS-optimized resume summary using the information provided below.
        
      Job Title: ${jobTitle}
      Experience Level: ${experienceLevel}
      Total Years of Experience: ${yearsOfExperience}
      Skills: ${skills}
        
      STRICT RULES:
        
      * Return ONLY the resume summary.
      * Do NOT include headings, labels, bullet points, markdown, quotes, explanations, or extra text.
      * Write a single professional paragraph.
      * Summary length must be between 50 and 80 words.
      * Write in a professional, concise, and impactful tone.
      * Naturally include the Job Title and the most relevant Skills as ATS keywords.
      * Mention only the most relevant 3-6 skills naturally within the summary.
      * Do NOT list all provided skills.
      * Integrate ATS keywords naturally into complete sentences.
      * Avoid keyword stuffing.
      * Highlight technical expertise, core competencies, and value to employers.
      * Emphasize domain knowledge, technical capabilities, and business impact relevant to the role.
      * Use strong action-oriented language.
      * Avoid generic phrases such as "hardworking", "team player", "results-oriented", "passionate individual", "driven professional", "seeking opportunities", or similar clichés.
      * Do NOT invent certifications, degrees, achievements, awards, leadership experience, responsibilities, or qualifications that were not provided.
      * Use the provided Years of Experience as the primary indicator of experience.
      * Ensure the summary aligns with the specified Experience Level.
      * For Freshers or Entry-Level candidates, focus on technical skills, academic or personal projects, learning ability, and readiness to contribute.
      * For Mid-Level candidates, emphasize hands-on expertise, practical experience, ownership, and technical contributions.
      * For Senior candidates, emphasize architecture, scalability, mentoring, strategic decision-making, and technical leadership where appropriate.
      * Prioritize ATS-friendly keywords commonly found in job descriptions for the specified role.
      * Ensure the summary is optimized for both ATS systems and recruiter readability.
      * Output plain text only.
        
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