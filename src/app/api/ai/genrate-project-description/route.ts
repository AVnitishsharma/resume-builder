import { gentrateAiContent } from "@/lib/gemini";
import { IGenrateProjectDescriptionBody } from "@/types/ai.types";
import { APIResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
  try {

    const body:IGenrateProjectDescriptionBody = await req.json();
    const { experienceLevel, jobTitle, techStack } = body;

    if(!experienceLevel || !jobTitle || !techStack) {
      return NextResponse.json<APIResponse>({
        message: "All fields are required",
        success: false,
      }, { status: 400 });
    }

      const prompt = `
        You are an expert resume writer, software engineering mentor, and ATS optimization specialist.

        Generate a professional project description suitable for a resume based on the information provided.

        Job Title: ${jobTitle}
        Experience Level: ${experienceLevel}
        Tech Stack: ${techStack.join(", ")}

        STRICT RULES:
        - Return ONLY the project description.
        - Do NOT include project title, headings, labels, bullet points, markdown, quotes, or explanations.
        - Write a single professional paragraph.
        - Length must be between 60 and 100 words.
        - Create a realistic project relevant to the provided job title.
        - Naturally incorporate the provided technologies throughout the description.
        - Focus on technical implementation, functionality, architecture, and business value.
        - Use strong action verbs such as Developed, Built, Implemented, Designed, Integrated, Optimized, and Automated.
        - Ensure the description is ATS-friendly and recruiter-friendly.
        - Do not mention that the project is hypothetical, generated, or assumed.
        - Avoid generic statements and filler content.
        - Tailor complexity according to the experience level.
        - Highlight problem-solving, performance, scalability, security, or user experience where appropriate.
        - Output plain text only.

        Generate the project description now.
      `;

    const result = await gentrateAiContent(prompt);
    const projectDescription = result!.trim();

    return NextResponse.json<APIResponse>({
      message: "Project description generated successfully",
      success: true,
      data: { projectDescription },
    }, { status: 200 });
    
  } catch (error) {
    console.log("Error generating project description:-", error);
    return NextResponse.json<APIResponse>({
      message: "Error generating project description",
      success: false,
    }, { status: 500 });
  }
}