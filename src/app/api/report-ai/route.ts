import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
You are a reporting engine.
Respond ONLY with a Markdown table.
If impossible, respond exactly:
FAIL: Cannot generate a table for this request.
          `,
        },
        { role: "user", content: prompt },
      ],
      temperature: 0,
    }),
  });

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "";

  if (content.startsWith("FAIL")) {
    return NextResponse.json({
      status: "fail",
      message: content.replace("FAIL:", "").trim(),
    });
  }

  return NextResponse.json({
    status: "ok",
    table: content,
  });
}
