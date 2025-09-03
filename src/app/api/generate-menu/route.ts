import { BentoAIService } from "@/lib/ai-service";
import type { GenerationConditions } from "@/types/bento";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const conditions: GenerationConditions = await request.json();

    // APIキーのチェック
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key is not configured" }, { status: 500 });
    }

    const aiService = new BentoAIService();
    const menus = await aiService.generateMenus(conditions);

    return NextResponse.json({ menus });
  } catch (error) {
    console.error("Menu generation error:", error);
    return NextResponse.json({ error: "メニュー生成に失敗しました" }, { status: 500 });
  }
}
