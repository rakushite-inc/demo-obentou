export interface BentoMenu {
  id: string;
  name: string;
  description: string;
  mainDish: string;
  sideDishes: string[];
  rice: string;
  estimatedCalories: number;
  estimatedPrice: number;
  allergens: string[];
  nutritionInfo: {
    protein: number;
    fat: number;
    carbohydrates: number;
  };
  genre: "和食" | "洋食" | "中華";
  volume: "小" | "中" | "大";
  createdAt: Date;
  isSelected?: boolean;
  generationConditions?: GenerationConditions;
}

export interface GenerationConditions {
  budget: {
    min: number;
    max: number;
  };
  calories: {
    min: number;
    max: number;
  };
  allergens: string[];
  volume: "小" | "中" | "大";
  genre: "和食" | "洋食" | "中華" | "指定なし";
  region: string;
  targetCustomer: "オフィスワーカー" | "工場作業員" | "高齢者" | "学生" | "ファミリー" | "指定なし";
  healthFocus: "通常" | "ヘルシー" | "高たんぱく" | "低糖質" | "減塩";
  cookingMethod: "指定なし" | "揚げ物なし" | "オーブンなし" | "簡単調理";
  seasonalFocus: "旬の食材" | "通常" | "冷凍食材中心";
  additionalRequests?: string;
  model?: "gpt-4o" | "o3";
}

export interface GenerationResult {
  conditions: GenerationConditions;
  menus: BentoMenu[];
  generatedAt: Date;
}