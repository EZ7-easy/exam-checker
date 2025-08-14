import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
    try {
        const { essay } = await req.json();

        if (!essay || essay.trim().length === 0) {
            return NextResponse.json(
                { error: "Essay text is required" },
                { status: 400 }
            );
        }

        const prompt = `
You are an IELTS examiner. Analyze the following essay and respond ONLY with valid JSON in this exact format:
{
  "coherence": "...",
  "cohesion": "...",
  "lexicalResource": "...",
  "grammar": "..."
}

Essay:
${essay}
`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are an expert IELTS writing examiner." },
                { role: "user", content: prompt },
            ],
            temperature: 0.4,
        });

        const raw = response.choices[0].message?.content || "{}";
        const analysis = JSON.parse(raw);

        return NextResponse.json(analysis);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
