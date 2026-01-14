// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { borideKnowledge } from "@/lib/knowledge";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { message } = await req.json();

  if (!message) {
    return NextResponse.json(
      { error: "Message is required" },
      { status: 400 }
    );
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
You are Boride's official customer support assistant.
Only answer questions related to Boride services.
If the question is not related to Boride, politely say you don’t have that information.
Be friendly and concise.
`
      },
      {
        role: "system",
        content: borideKnowledge
      },
      {
        role: "user",
        content: message
      }
    ],
  });

  return NextResponse.json({
    reply: completion.choices[0].message.content,
  });
}
