import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
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
You are an IELTS examiner.
Analyze the essay and give the scores out of 9 for each of the following:
1. Coherence
2. Cohesion
3. Lexical Resource
4. Grammatical Range and Accuracy

Return ONLY valid JSON with this structure:
{
  "scores": {
    "coherence": { "score": number },
    "cohesion": { "score": number},
    "lexicalResource": { "score": number,  },
    "grammar": { "score": number }
  },
  "overallScore": number,
}

Do not include any extra text or formatting outside of the JSON.

Essay:
${essay}
`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are an expert IELTS writing examiner. Output JSON only.",
                },
                { role: "user", content: prompt },
            ],
            temperature: 0.4,
            response_format: { type: "json_object" }, // Forces valid JSON
        });

        const analysis = JSON.parse(
            response.choices[0].message?.content || "{}"
        );

        return NextResponse.json(analysis);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
