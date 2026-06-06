import { gentrateAiContent } from "@/lib/gemini";
import { IGenrateSkillsBody } from "@/types/ai.types";
import { APIResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
  try {

    const body:IGenrateSkillsBody = await req.json();
    const { experienceLevel, jobTitle } = body;

    if(!experienceLevel || !jobTitle) {
      return NextResponse.json<APIResponse>({
        message: "All fields are required",
        success: false,
      }, { status: 400 });
    }

      const prompt = `
        You are an expert technical recruiter and ATS resume specialist.

        Generate a list of relevant technical skills for the following role.

        Job Title: ${jobTitle}
        Experience Level: ${experienceLevel}

        STRICT RULES:
        - Return ONLY technical skills.
        - Do NOT include soft skills.
        - Do NOT include communication, teamwork, leadership, problem-solving, adaptability, or similar skills.
        - Do NOT include explanations, headings, categories, numbering, or bullet points.
        - Include only industry-relevant tools, technologies, frameworks, programming languages, databases, cloud platforms, methodologies, and technical concepts.
        - Prioritize ATS-friendly keywords commonly found in job descriptions.
        - Generate between 15 and 25 skills.
        - Remove duplicate skills.
        - Output as a comma-separated list only.
        - Output plain text only.

        Example Output:
        JavaScript, TypeScript, React, Next.js, Node.js, Express.js, MongoDB, PostgreSQL, REST APIs, GraphQL, Git, Docker, AWS, Tailwind CSS, Redux

        Generate the technical skills now.
      `;

    const result = await gentrateAiContent(prompt);
    const skills = result!.trim();

    return NextResponse.json<APIResponse>({
      message: "Skills generated successfully",
      success: true,
      data: { skills },
    }, { status: 200 });
    
  } catch (error) {
    console.log("Error generating Skills:-", error);
    return NextResponse.json<APIResponse>({
      message: "Error generating Skills",
      success: false,
    }, { status: 500 });
  }
}