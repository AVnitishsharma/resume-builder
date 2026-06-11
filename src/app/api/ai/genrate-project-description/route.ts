import { gentrateAiContent } from "@/lib/gemini";
import { IGenrateProjectDescriptionBody } from "@/types/ai.types";
import { APIResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
  try {

    const body:IGenrateProjectDescriptionBody = await req.json();
    const { projectTitle, keyFeature, techStack } = body;

    if(!projectTitle || !keyFeature || !techStack) {
      return NextResponse.json<APIResponse>({
        message: "All fields are required",
        success: false,
      }, { status: 400 });
    }

      const prompt = `
        You are an expert resume writer, ATS optimization specialist, and senior software engineering mentor.

        Generate a professional, ATS-optimized resume project description using the provided project information.

        Project Name: ${projectTitle}
        Key Features: ${keyFeature}
        Tech Stack: ${techStack.join(", ")}

        STRICT REQUIREMENTS:

        * Return ONLY the project description.
        * Do NOT include the project title, headings, labels, bullet points, markdown, quotes, or explanations.
        * Write a single professional paragraph.
        * Length must be between 70 and 120 words.
        * Use the Project Name to understand the project domain and purpose.
        * Base the description primarily on the provided Key Features.
        * Naturally incorporate the provided technologies throughout the description.
        * Clearly describe the system's functionality, technical implementation, architecture, and user value.
        * Use strong action verbs such as Developed, Built, Designed, Implemented, Integrated, Optimized, Automated, Engineered, and Enhanced.
        * Highlight relevant software engineering concepts such as scalability, performance optimization, security, API integration, database design, responsive UI, state management, authentication, automation, monitoring, or cloud deployment when applicable to the project.
        * Ensure the description is ATS-friendly, recruiter-friendly, and written in a professional resume style.
        * Focus on measurable technical impact and problem-solving rather than generic statements.
        * Do not mention that the project is hypothetical, generated, assumed, or based on provided data.
        * Do not invent unrealistic features, technologies, or business outcomes.
        * Write in professional past tense.
        * Output plain text only.

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