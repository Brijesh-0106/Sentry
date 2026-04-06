import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { metaData, fileChanges } = await req.json();
    const prompt = `
      You are an expert senior software engineer doing a thorough code review.
      
      Review the following GitHub Pull Request and return ONLY a valid JSON object.
      Do not include any markdown, explanation, or text outside the JSON.

      PR Title: ${metaData.title}
      Author: ${metaData.author}
      Files Changed: ${metaData.changedFiles}
      Additions: ${metaData.additions}
      Deletions: ${metaData.deletions}
      
      PR Description:
      ${metaData.body ?? "No description provided"}
      
      Code Diff:
      ${fileChanges}

      Return ONLY this JSON structure:
      {
        "score": <number 0-100>,
        "summary": "<2-3 sentence overall review>",
        "bugs": [
          {
            "title": "<bug title>",
            "description": "<detailed explanation>",
            "file": "<filename or null>"
          }
        ],
        "suggestions": [
          {
            "title": "<suggestion title>",
            "description": "<detailed explanation>"
          }
        ],
        "positives": [
          {
            "title": "<what is good>",
            "description": "<why it's good>"
          }
        ],
        "fileReviews": [
          {
            "file": "<filename>",
            "risk": "<high | medium | low>",
            "comment": "<specific feedback for this file>"
          }
        ]
      }
    `;
    // 2. Call Gemini
    const result = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // free + very capable
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" }, // returns clean JSON ✅
    });
    console.log(result);

    // 4. Return to frontend
    return NextResponse.json({
      success: true,
      result: result.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error parsing request body:", error);
  }
}
