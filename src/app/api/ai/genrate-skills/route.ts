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

Generate a list of ATS-optimized technical skills strictly relevant to the specified role.

Job Title: ${jobTitle}
Experience Level: ${experienceLevel}

STRICT RULES:

* Return ONLY technical skills.
* Output as a comma-separated list.
* Generate between 15 and 25 skills.
* Remove duplicates.
* Do NOT include explanations, headings, numbering, bullet points, or categories.
* Do NOT include soft skills such as communication, teamwork, leadership, adaptability, collaboration, or problem-solving.
* Include only technologies, frameworks, libraries, tools, platforms, methodologies, and technical concepts directly relevant to the specified role.
* Prioritize ATS keywords commonly found in job descriptions for the given role and experience level.
* Do NOT include skills from unrelated domains.

ROLE FILTERING:

* If the role is Frontend Developer, include ONLY frontend technologies, UI development tools, frontend frameworks, styling technologies, testing tools, browser APIs, state management, performance optimization, accessibility, and frontend build tools.
* Exclude backend technologies such as Node.js, Express.js, NestJS, Spring Boot, Django, Laravel, .NET, MongoDB, PostgreSQL, MySQL, Redis, Kafka, RabbitMQ, Microservices, and Backend APIs unless explicitly part of frontend responsibilities.
* If the role is Backend Developer, include ONLY backend-related skills.
* If the role is Full Stack Developer, include both frontend and backend skills.
* Tailor skill selection according to the experience level.

Output plain text only.
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