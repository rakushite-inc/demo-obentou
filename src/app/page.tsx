"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import type { GenerationConditions } from "@/types/bento";

const ALLERGENS = ["卵", "乳", "小麦", "そば", "落花生", "えび", "かに"];
const REGIONS = [
  // 日本
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
  "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
  "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
  // 海外
  "🌏 韓国", "🌏 中国", "🌏 台湾", "🌏 タイ", "🌏 ベトナム", "🌏 インド",
  "🌍 イタリア", "🌍 フランス", "🌍 ドイツ", "🌍 スペイン", "🌍 イギリス",
  "🌎 アメリカ", "🌎 メキシコ", "🌎 ブラジル", "🌎 ペルー",
  "🦘 オーストラリア"
];

export default function Home() {
  const [conditions, setConditions] = useState<GenerationConditions>({
    budget: { min: 300, max: 600 },
    calories: { min: 500, max: 800 },
    allergens: [],
    volume: "中",
    genre: "指定なし",
    region: "三重県",
    targetCustomer: "指定なし",
    healthFocus: "通常",
    cookingMethod: "指定なし",
    seasonalFocus: "旬の食材",
    additionalRequests: "",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [savedMenusCount, setSavedMenusCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // お気に入り数を取得
    const favorites = JSON.parse(localStorage.getItem("favoriteBentoMenus") || "[]");
    setFavoritesCount(favorites.length);
    
    // 保存メニュー数を取得
    const savedMenus = JSON.parse(localStorage.getItem("bentoMenus") || "[]");
    setSavedMenusCount(savedMenus.length);
  }, []);

  const handleAllergenToggle = (allergen: string) => {
    setConditions(prev => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter(a => a !== allergen)
        : [...prev.allergens, allergen]
    }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch("/api/generate-menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(conditions),
      });

      if (!response.ok) {
        throw new Error("メニュー生成に失敗しました");
      }

      const data = await response.json();
      
      // 生成結果をURLパラメータで渡すか、sessionStorageを使用
      sessionStorage.setItem("generatedMenus", JSON.stringify(data.menus));
      sessionStorage.setItem("generationConditions", JSON.stringify(conditions));
      
      // 結果ページに遷移
      window.location.href = "/results";
    } catch (error) {
      console.error("Generation failed:", error);
      alert("メニュー生成に失敗しました。もう一度お試しください。");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* ヘッダー */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-slate-800">
            🍱 AIお弁当メニュー生成システム
          </h1>
          <p className="text-slate-600">
            お客様のニーズに合わせたお弁当メニューをAIが自動生成します
          </p>
          
          {/* お気に入り・管理ページへのリンク */}
          {(favoritesCount > 0 || savedMenusCount > 0) && (
            <div className="flex justify-center gap-3 flex-wrap">
              {favoritesCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/favorites")}
                  className="flex items-center gap-2 bg-white/80 shadow-sm hover:shadow-md transition-shadow"
                >
                  ⭐ お気に入り ({favoritesCount})
                </Button>
              )}
              {savedMenusCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/manage")}
                  className="flex items-center gap-2 bg-white/80 shadow-sm hover:shadow-md transition-shadow"
                >
                  📋 管理画面 ({savedMenusCount})
                </Button>
              )}
            </div>
          )}
        </div>

        {/* メニュー生成フォーム */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle>メニュー生成条件</CardTitle>
            <CardDescription>
              お弁当の条件を設定してください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 予算設定 */}
            <div className="space-y-2">
              <Label>予算範囲</Label>
              <div className="flex items-center space-x-4">
                <Input
                  type="number"
                  value={conditions.budget.min}
                  onChange={(e) => setConditions(prev => ({
                    ...prev,
                    budget: { ...prev.budget, min: Number(e.target.value) }
                  }))}
                  className="w-24"
                  min={300}
                  max={800}
                />
                <span>円 〜</span>
                <Input
                  type="number"
                  value={conditions.budget.max}
                  onChange={(e) => setConditions(prev => ({
                    ...prev,
                    budget: { ...prev.budget, max: Number(e.target.value) }
                  }))}
                  className="w-24"
                  min={300}
                  max={800}
                />
                <span>円</span>
              </div>
            </div>

            {/* カロリー設定 */}
            <div className="space-y-2">
              <Label>カロリー範囲</Label>
              <div className="flex items-center space-x-4">
                <Input
                  type="number"
                  value={conditions.calories.min}
                  onChange={(e) => setConditions(prev => ({
                    ...prev,
                    calories: { ...prev.calories, min: Number(e.target.value) }
                  }))}
                  className="w-24"
                  min={400}
                  max={1000}
                />
                <span>kcal 〜</span>
                <Input
                  type="number"
                  value={conditions.calories.max}
                  onChange={(e) => setConditions(prev => ({
                    ...prev,
                    calories: { ...prev.calories, max: Number(e.target.value) }
                  }))}
                  className="w-24"
                  min={400}
                  max={1000}
                />
                <span>kcal</span>
              </div>
            </div>

            {/* ジャンル */}
            <div className="space-y-2">
              <Label>ジャンル</Label>
              <Select
                value={conditions.genre}
                onValueChange={(value: GenerationConditions["genre"]) => setConditions(prev => ({ ...prev, genre: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="指定なし">指定なし</SelectItem>
                  <SelectItem value="和食">和食</SelectItem>
                  <SelectItem value="洋食">洋食</SelectItem>
                  <SelectItem value="中華">中華</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ボリューム */}
            <div className="space-y-2">
              <Label>ボリューム</Label>
              <Select
                value={conditions.volume}
                onValueChange={(value: GenerationConditions["volume"]) => setConditions(prev => ({ ...prev, volume: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="小">小（少なめ）</SelectItem>
                  <SelectItem value="中">中（普通）</SelectItem>
                  <SelectItem value="大">大（多め）</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 地域 */}
            <div className="space-y-2">
              <Label>地域特性</Label>
              <Select
                value={conditions.region}
                onValueChange={(value) => setConditions(prev => ({ ...prev, region: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* アレルギー対応 */}
            <div className="space-y-3">
              <Label>アレルギー対応（使用しない食材）</Label>
              <div className="flex flex-wrap gap-2">
                {ALLERGENS.map((allergen) => (
                  <Badge
                    key={allergen}
                    variant={conditions.allergens.includes(allergen) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleAllergenToggle(allergen)}
                  >
                    {allergen}
                  </Badge>
                ))}
              </div>
              {conditions.allergens.length > 0 && (
                <p className="text-sm text-gray-600">
                  選択中: {conditions.allergens.join(", ")}
                </p>
              )}
            </div>

            {/* ターゲット顧客 */}
            <div className="space-y-2">
              <Label>ターゲット顧客</Label>
              <Select
                value={conditions.targetCustomer}
                onValueChange={(value: GenerationConditions["targetCustomer"]) => setConditions(prev => ({ ...prev, targetCustomer: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="指定なし">指定なし</SelectItem>
                  <SelectItem value="オフィスワーカー">オフィスワーカー</SelectItem>
                  <SelectItem value="工場作業員">工場作業員</SelectItem>
                  <SelectItem value="高齢者">高齢者</SelectItem>
                  <SelectItem value="学生">学生</SelectItem>
                  <SelectItem value="ファミリー">ファミリー</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 健康志向 */}
            <div className="space-y-2">
              <Label>健康・栄養志向</Label>
              <Select
                value={conditions.healthFocus}
                onValueChange={(value: GenerationConditions["healthFocus"]) => setConditions(prev => ({ ...prev, healthFocus: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="通常">通常</SelectItem>
                  <SelectItem value="ヘルシー">ヘルシー（低カロリー）</SelectItem>
                  <SelectItem value="高たんぱく">高たんぱく</SelectItem>
                  <SelectItem value="低糖質">低糖質</SelectItem>
                  <SelectItem value="減塩">減塩</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 調理制約 */}
            <div className="space-y-2">
              <Label>調理制約</Label>
              <Select
                value={conditions.cookingMethod}
                onValueChange={(value: GenerationConditions["cookingMethod"]) => setConditions(prev => ({ ...prev, cookingMethod: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="指定なし">指定なし</SelectItem>
                  <SelectItem value="揚げ物なし">揚げ物なし</SelectItem>
                  <SelectItem value="オーブンなし">オーブンなし</SelectItem>
                  <SelectItem value="簡単調理">簡単調理のみ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 食材傾向 */}
            <div className="space-y-2">
              <Label>食材傾向</Label>
              <Select
                value={conditions.seasonalFocus}
                onValueChange={(value: GenerationConditions["seasonalFocus"]) => setConditions(prev => ({ ...prev, seasonalFocus: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="旬の食材">旬の食材重視</SelectItem>
                  <SelectItem value="通常">通常</SelectItem>
                  <SelectItem value="冷凍食材中心">冷凍食材中心</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* その他リクエスト */}
            <div className="space-y-2">
              <Label>その他のリクエスト</Label>
              <Textarea
                placeholder="特別な要望や注意事項があればご記入ください（例：彩り豊かに、子供向け、辛いものは控えめに、など）"
                value={conditions.additionalRequests}
                onChange={(e) => setConditions(prev => ({ ...prev, additionalRequests: e.target.value }))}
                className="min-h-20"
              />
            </div>

            {/* 生成ボタン */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? "生成中..." : "🤖 メニューを生成する"}
            </Button>
          </CardContent>
        </Card>

        {/* フッター */}
        <div className="text-center text-sm text-gray-500">
          Demo Version - AI powered bento menu generation system
        </div>
      </div>
    </div>
  );
}
