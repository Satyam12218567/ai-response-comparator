import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { responseA, responseB } = await req.json();

    if (!responseA || !responseB) {
      return NextResponse.json(
        { result: "Both responses must be provided." },
        { status: 400 }
      );
    }

    const prompt = `
Compare the following two AI-generated responses and explain which one is better and why. Be concise and specific.

Response A:
${responseA}

Response B:
${responseB}
`;

    const result = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    const data = await result.json();

    console.log("🧠 Gemini Raw Response:", JSON.stringify(data, null, 2));

    const message = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!message) {
      const errMsg = data?.error?.message ?? "Comparison failed with Gemini.";
      console.log("❌ Gemini Error:", errMsg);
      return NextResponse.json(
        { result: `Comparison failed with Gemini: ${errMsg}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ result: message });

  } catch (error) {
    console.log("🚨 Unexpected Error:", (error as Error).message);
    return NextResponse.json(
      { result: "Internal server error." },
      { status: 500 }
    );
  }
}
