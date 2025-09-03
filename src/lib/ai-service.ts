import type { BentoMenu, GenerationConditions } from "@/types/bento";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const BentoMenuSchema = z.object({
  name: z.string(),
  description: z.string(),
  mainDish: z.string(),
  sideDishes: z.array(z.string()),
  rice: z.string(),
  estimatedCalories: z.number(),
  estimatedPrice: z.number(),
  allergens: z.array(z.string()),
  nutritionInfo: z.object({
    protein: z.number(),
    fat: z.number(),
    carbohydrates: z.number(),
  }),
});

const GenerationResponseSchema = z.object({
  menus: z.array(BentoMenuSchema),
});

export class BentoAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateMenus(conditions: GenerationConditions, model: "gpt-4o" | "o3" = "gpt-4o"): Promise<BentoMenu[]> {
    try {
      const prompt = this.buildPrompt(conditions);

      const baseOptions = {
        model,
        messages: [
          {
            role: "system" as const,
            content: `あなたはお弁当業界の専門家です。お弁当製造・販売事業者向けに、実用的で現実的なお弁当メニューを提案してください。
            
指示事項:
- 調理が現実的で、小規模事業所でも作れる内容
- 栄養バランスを考慮
- 指定された条件を厳密に守る
- 日本の一般的な食材を使用
- 季節感を取り入れる
- 3つのメニューを提案する`,
          },
          { role: "user" as const, content: prompt },
        ],
        response_format: { type: "json_object" as const },
      };

      // GPT-4oの場合のみtemperatureを設定（o3はサポートしていない）
      const requestOptions = model === "gpt-4o" 
        ? { ...baseOptions, temperature: 0.7 }
        : baseOptions;

      const completion = await this.openai.chat.completions.create(requestOptions);

      const content = completion.choices[0].message.content;
      if (!content) {
        throw new Error("メニューの生成に失敗しました");
      }

      const parsed = GenerationResponseSchema.parse(JSON.parse(content));

      // BentoMenu形式に変換
      const conditionsWithModel = { ...conditions, model };
      const menus: BentoMenu[] = parsed.menus.map((menu: z.infer<typeof BentoMenuSchema>) => ({
        id: crypto.randomUUID(),
        ...menu,
        genre: conditions.genre === "指定なし" ? "和食" : conditions.genre,
        volume: conditions.volume,
        createdAt: new Date(),
        isSelected: false,
        generationConditions: conditionsWithModel,
      }));

      return menus;
    } catch (error) {
      console.error("AI menu generation failed:", error);
      throw new Error("メニュー生成中にエラーが発生しました");
    }
  }

  private buildPrompt(conditions: GenerationConditions): string {
    const allergenText =
      conditions.allergens.length > 0
        ? `アレルギー対応: ${conditions.allergens.join("、")}を使用しない`
        : "アレルギー制約なし";

    const currentSeason = this.getCurrentSeason();
    const regionFeatures = this.getRegionFeatures(conditions.region);

    return `
あなたはお弁当業界の専門家です。以下の条件に基づいて、実用的で魅力的なお弁当メニューを3つ生成してください。

## 生成条件
- 予算: ${conditions.budget.min}円 〜 ${conditions.budget.max}円
- カロリー: ${conditions.calories.min}kcal 〜 ${conditions.calories.max}kcal
- ${allergenText}
- ボリューム: ${conditions.volume}
- ジャンル: ${conditions.genre}
- 地域: ${conditions.region} ${regionFeatures}
- 季節: ${currentSeason}
- ターゲット顧客: ${conditions.targetCustomer}
- 健康・栄養志向: ${conditions.healthFocus}
- 調理制約: ${conditions.cookingMethod}
- 食材傾向: ${conditions.seasonalFocus}
${conditions.additionalRequests ? `- その他のリクエスト: ${conditions.additionalRequests}` : ""}

## 重要な指針
1. 小規模なお弁当製造事業所でも作れる現実的な内容
2. 栄養バランスを考慮（野菜、たんぱく質、炭水化物）
3. 季節感と地域特色を活かした食材選択
4. 指定予算内での原価計算を考慮
5. 調理工程の効率化を意識した組み合わせ

## JSON出力形式
{
  "menus": [
    {
      "name": "商品名（魅力的で分かりやすい名前）",
      "description": "特徴や魅力を40-50文字で説明",
      "mainDish": "メインのおかず",
      "sideDishes": ["副菜1", "副菜2", "副菜3"],
      "rice": "ご飯の種類",
      "estimatedCalories": カロリー数値,
      "estimatedPrice": 価格数値,
      "allergens": ["含まれるアレルゲン"],
      "nutritionInfo": {
        "protein": たんぱく質グラム数,
        "fat": 脂質グラム数,
        "carbohydrates": 炭水化物グラム数
      }
    }
  ]
}

条件を満たす3つの異なるメニューを提案してください。
    `.trim();
  }

  private getCurrentSeason(): string {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return "春（3-5月）";
    if (month >= 6 && month <= 8) return "夏（6-8月）";
    if (month >= 9 && month <= 11) return "秋（9-11月）";
    return "冬（12-2月）";
  }

  private getRegionFeatures(region: string): string {
    const features: { [key: string]: string } = {
      // 日本の特色
      北海道: "（海産物、じゃがいも、とうもろこしが豊富）",
      東京都: "（多様な食材、洗練された味付け）",
      大阪府: "（だしの文化、粉もの文化）",
      愛知県: "（味噌文化、きしめんなど）",
      福岡県: "（醤油ベースの味付け、明太子など）",
      三重県: "（伊勢うどん、海産物、松阪牛など）",
      // 海外の特色
      "🌏 韓国": "（キムチ、コチュジャン、ナムル、焼肉文化）",
      "🌏 中国": "（八角、五香粉、炒め物、点心文化）",
      "🌏 台湾": "（魯肉飯、八角茶卵、夜市グルメ）",
      "🌏 タイ": "（ナンプラー、レモングラス、ココナッツミルク）",
      "🌏 ベトナム": "（フォー、春巻き、ハーブ類豊富）",
      "🌏 インド": "（スパイス、カレー、ナン、豆料理）",
      "🌍 イタリア": "（オリーブオイル、トマト、バジル、チーズ）",
      "🌍 フランス": "（バター、ハーブ、ワイン煮込み）",
      "🌍 ドイツ": "（ソーセージ、じゃがいも、ザワークラウト）",
      "🌍 スペイン": "（オリーブオイル、パプリカ、ガーリック）",
      "🌍 イギリス": "（ローストビーフ、フィッシュアンドチップス）",
      "🌎 アメリカ": "（ハンバーガー、BBQ、ボリューム重視）",
      "🌎 メキシコ": "（トウガラシ、アボカド、コーン、豆）",
      "🌎 ブラジル": "（豆料理、焼肉、フルーツ豊富）",
      "🌎 ペルー": "（キヌア、じゃがいも、セビーチェ）",
      "🦘 オーストラリア": "（BBQ、ミートパイ、シーフード）",
    };
    return features[region] || "";
  }
}
