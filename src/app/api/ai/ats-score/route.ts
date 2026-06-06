import { gentrateAiContent } from "@/lib/gemini";
import { IGenrateAtsScoreBody } from "@/types/ai.types";
import { APIResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
  try {

    const body:IGenrateAtsScoreBody = await req.json();
    const { resumeText } = body;

    if(!resumeText) {
      return NextResponse.json<APIResponse>({
        message: "All fields are required",
        success: false,
      }, { status: 400 });
    }

    const prompt = `
      You are an expert ATS (Applicant Tracking System) resume analyzer and recruiter.
        
      Your task is to evaluate the given resume and provide an ATS compatibility score along with a short analysis.
        
      INPUT RESUME:
      ${resumeText}
        
      STRICT RULES:
      - Return ONLY valid JSON.
      - Do NOT include explanations outside JSON.
      - Do NOT include markdown or extra text.
      - Base scoring purely on ATS optimization factors.
        
      Evaluate based on:
      1. Keyword relevance to modern job descriptions
      2. Technical skills presence and clarity
      3. Formatting simplicity (ATS readability)
      4. Action verbs usage
      5. Experience clarity and structure
      6. Role alignment and relevance
      7. Grammar and professionalism
        
      SCORING RULES:
      - Score must be between 0 to 100
      - Be strict and realistic (do not overrate)
        
      OUTPUT FORMAT:
      {
        "atsScore": number,
        "summary": "2-3 line feedback on resume quality",
        "strengths": [
          "strength 1",
          "strength 2",
          "strength 3"
        ],
        "improvements": [
          "improvement 1",
          "improvement 2",
          "improvement 3"
        ]
      }
        
      Generate ATS analysis now.
      Return ONLY a single number between 0 and 100.
      No JSON, no text, no explanation.
    `;

    const result = await gentrateAiContent(prompt);
    const atsScore = result!.trim();

    return NextResponse.json<APIResponse>({
      message: "ATS score generated successfully",
      success: true,
      data: { atsScore },
    }, { status: 200 });
    
  } catch (error) {
    console.log("Error generating ATS score:-", error);
    return NextResponse.json<APIResponse>({
      message: "Error generating ATS score",
      success: false,
    }, { status: 500 });
  }
}