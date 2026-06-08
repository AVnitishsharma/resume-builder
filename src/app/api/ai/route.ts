import { gentrateAiContent } from "@/lib/gemini";
import { APIResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json<APIResponse>({
                message: "Prompt is required",
                success: false,
            }, { status: 400 });
        }

        const aiOutput = await gentrateAiContent(prompt);

        return NextResponse.json<APIResponse>({
            message: "AI content generated successfully",
            success: true,
            data: aiOutput,
        }, { status: 200 });

    } catch (error) {
        console.error("Error generating AI content:", error);
        return NextResponse.json<APIResponse>({
            message: "Error generating AI content",
            success: false,
            error: String(error),
        }, { status: 500 });
    }
}
