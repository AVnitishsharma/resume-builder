import { gentrateAiContent } from "@/lib/gemini";
import { IGenrateExperienceDescriptionBody } from "@/types/ai.types";
import { APIResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
  try {

    const body:IGenrateExperienceDescriptionBody = await req.json();
    const { experienceLevel, yearOfExperience, techStack, jobRole } = body;

    if(!experienceLevel || !yearOfExperience || !techStack || !jobRole) {
      return NextResponse.json<APIResponse>({
        message: "All fields are required",
        success: false,
      }, { status: 400 });
    }

    const prompt = `
      You are an expert resume writer, career coach, and ATS optimization specialist.

      Generate a professional work experience description based on the provided details.

      Input:
      - Job Role: ${jobRole}
      - Experience Level: ${experienceLevel}
      - Years of Experience: ${yearOfExperience}
      - Tech Stack: ${techStack.join(", ")}

      STRICT RULES:
      - Return ONLY a single professional experience description paragraph.
      - Do NOT include headings, bullet points, labels, markdown, or explanations.
      - Length must be between 20 and 40 words.
      - Write in past tense as real job experience.
      - Make it realistic, industry-appropriate, and ATS-friendly.
      - Naturally integrate the provided job role and tech stack.
      - Focus on responsibilities, technical contributions, and impact based on the job role.
      - Adjust depth based on years of experience:
        - 0–1 years: learning, assisting, basic implementation.
        - 1–3 years: feature development, API creation, debugging, optimization.
        - 3–5+ years: ownership, system design, scalability, architecture decisions.
      - Use strong action verbs like Developed, Designed, Implemented, Built, Optimized, Integrated, Maintained.
      - Do NOT exaggerate beyond realistic experience level.
      - Ensure ATS-friendly keywords are included naturally.
      - Output plain text only.

      Generate the experience description now.
    `;

    const result = await gentrateAiContent(prompt);
    const experienceDescription = result!.trim();

    return NextResponse.json<APIResponse>({
      message: "Experience description generated successfully",
      success: true,
      data: { experienceDescription },
    }, { status: 200 });
    
  } catch (error) {
    console.log("Error generating Experience description:-", error);
    return NextResponse.json<APIResponse>({
      message: "Error generating Experience description",
      success: false,
    }, { status: 500 });
  }
}