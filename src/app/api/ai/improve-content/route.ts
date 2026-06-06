import { gentrateAiContent } from "@/lib/gemini";
import { IGenrateImproveContentBody } from "@/types/ai.types";
import { APIResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
  try {

    const body:IGenrateImproveContentBody = await req.json();
    const { content } = body;

    if(!content) {
      return NextResponse.json<APIResponse>({
        message: "All fields are required",
        success: false,
      }, { status: 400 });
    }

    const prompt = `
      You are an expert ATS optimization specialist and professional resume writer.

      Your task is to improve the given resume content to make it more ATS-friendly, impactful, and recruiter-ready.

      INPUT CONTENT:
      ${content}

      STRICT RULES:
      - Return ONLY the improved version of the content.
      - Do NOT add headings, explanations, or comments.
      - Do NOT change the original meaning or facts.
      - Do NOT invent new experience, skills, or achievements.
      - Improve grammar, clarity, and professionalism.
      - Increase ATS score by optimizing keywords and phrasing.
      - Use strong action verbs (Developed, Designed, Implemented, Optimized, Led, Built, Managed).
      - Make sentences concise, powerful, and result-oriented.
      - Ensure better keyword alignment with modern job descriptions.
      - Remove filler words and weak phrases.
      - Improve readability for both ATS systems and recruiters.
      - Keep original structure (paragraph or bullets) same as input format.
      - Output plain text only.

      Improve the content now.
    `;

    const result = await gentrateAiContent(prompt);
    const improveContent = result!.trim();

    return NextResponse.json<APIResponse>({
      message: "Improve content generated successfully",
      success: true,
      data: { improveContent },
    }, { status: 200 });
    
  } catch (error) {
    console.log("Error generating improve content:-", error);
    return NextResponse.json<APIResponse>({
      message: "Error generating improve content",
      success: false,
    }, { status: 500 });
  }
}