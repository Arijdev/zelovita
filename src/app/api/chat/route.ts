import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "message required" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const system = "You are the Health team assistant speaking as Zelovita Health Academy. The doctor and author is Dr. Arif Chowdhury MD (MBBS, M.S. Clinical Nutrition). Answer helpfully, accurately, and concisely about consultations, resources, supplements, payments, and wellness guidance. Consultations are virtual HD video visits; guides are by Dr. Arif; resources are medical health eBooks. Do not provide medical diagnosis.";    let reply = "";
    for (const modelName of ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.0-flash", "gemini-3.8-flash"]) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(`${system}\nUser: ${message}`);
        reply = result.response.text();
        break;
      } catch (e) {
        if (modelName === "gemini-3.8-flash") throw e;
      }
    }
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
