"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, RotateCcw, Save, ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import type { BentoMenu, GenerationConditions } from "@/types/bento";

// デモ用のサンプルデータ
const SAMPLE_MENUS: BentoMenu[] = [
  {
    id: "1",
    name: "三重県産食材の和風弁当",
    description: "地元の新鮮な食材を使用した栄養バランス抜群のお弁当",
    mainDish: "鶏の照り焼き",
    sideDishes: ["ひじきの煮物", "小松菜のおひたし", "卵焼き"],
    rice: "三重県産コシヒカリ",
    estimatedCalories: 650,
    estimatedPrice: 480,
    allergens: ["卵"],
    nutritionInfo: {
      protein: 28,
      fat: 18,
      carbohydrates: 85,
    },
    genre: "和食",
    volume: "中",
    createdAt: new Date(),
    isFavorite: false,
  },
  {
    id: "2",
    name: "ヘルシーサラダチキン弁当",
    description: "低カロリーでタンパク質豊富な健康志向のお弁当",
    mainDish: "蒸し鶏のハーブソルト",
    sideDishes: ["彩り野菜のマリネ", "ブロッコリーのガーリック炒め", "プチトマト"],
    rice: "玄米",
    estimatedCalories: 520,
    estimatedPrice: 450,
    allergens: [],
    nutritionInfo: {
      protein: 32,
      fat: 12,
      carbohydrates: 68,
    },
    genre: "洋食",
    volume: "中",
    createdAt: new Date(),
    isFavorite: false,
  },
  {
    id: "3",
    name: "ボリューム満点唐揚げ弁当",
    description: "ジューシーな唐揚げがメインの食べ応え抜群のお弁当",
    mainDish: "鶏の唐揚げ（5個）",
    sideDishes: ["コールスローサラダ", "きんぴらごぼう", "漬物"],
    rice: "白米",
    estimatedCalories: 780,
    estimatedPrice: 520,
    allergens: ["小麦"],
    nutritionInfo: {
      protein: 35,
      fat: 25,
      carbohydrates: 95,
    },
    genre: "和食",
    volume: "中",
    createdAt: new Date(),
    isFavorite: false,
  },
];

export default function ResultsPage() {
  const [menus, setMenus] = useState<BentoMenu[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conditions, setConditions] = useState<GenerationConditions | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // sessionStorageからデータを読み込み
    const savedMenus = sessionStorage.getItem("generatedMenus");
    const savedConditions = sessionStorage.getItem("generationConditions");
    
    if (savedMenus) {
      setMenus(JSON.parse(savedMenus));
    } else {
      // フォールバック: デモ用サンプルデータを使用
      setMenus(SAMPLE_MENUS);
    }
    
    if (savedConditions) {
      setConditions(JSON.parse(savedConditions));
    }
  }, []);

  const handleFavoriteToggle = (menuId: string) => {
    setMenus(prev =>
      prev.map(menu => {
        if (menu.id === menuId) {
          const updatedMenu = { ...menu, isFavorite: !menu.isFavorite };
          
          // お気に入りの状態に応じてlocalStorageを更新
          const favorites = JSON.parse(localStorage.getItem("favoriteBentoMenus") || "[]");
          
          if (updatedMenu.isFavorite) {
            // お気に入りに追加
            const isAlreadyFavorite = favorites.find((fav: BentoMenu) => fav.id === menuId);
            if (!isAlreadyFavorite) {
              const newFavorites = [...favorites, updatedMenu];
              localStorage.setItem("favoriteBentoMenus", JSON.stringify(newFavorites));
            }
          } else {
            // お気に入りから削除
            const newFavorites = favorites.filter((fav: BentoMenu) => fav.id !== menuId);
            localStorage.setItem("favoriteBentoMenus", JSON.stringify(newFavorites));
          }
          
          return updatedMenu;
        }
        return menu;
      })
    );
  };

  const handleRegenerate = async () => {
    if (!conditions) {
      alert("生成条件が見つかりません。新しくメニューを生成してください。");
      router.push("/");
      return;
    }

    setIsLoading(true);
    
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
      setMenus(data.menus.map((menu: BentoMenu) => ({ ...menu, isFavorite: false })));
      
      // sessionStorageも更新
      sessionStorage.setItem("generatedMenus", JSON.stringify(data.menus));
    } catch (error) {
      console.error("Regeneration failed:", error);
      alert("再生成に失敗しました。もう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAndManage = () => {
    // LocalStorageに保存
    const savedMenus = JSON.parse(localStorage.getItem("bentoMenus") || "[]");
    const updatedMenus = [...savedMenus, ...menus.filter(m => m.isFavorite)];
    localStorage.setItem("bentoMenus", JSON.stringify(updatedMenus));
    
    router.push("/manage");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              🎯 生成結果
            </h1>
            <p className="text-slate-600">
              条件に合致するお弁当メニューを生成しました
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            条件を変更
          </Button>
        </div>

        {/* アクションボタン */}
        <div className="flex gap-4">
          <Button
            onClick={handleRegenerate}
            disabled={isLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            {isLoading ? "再生成中..." : "再生成"}
          </Button>
          <Button
            onClick={() => router.push("/favorites")}
            variant="outline"
            className="flex items-center gap-2"
          >
            ⭐ お気に入り一覧
          </Button>
          <Button
            onClick={handleSaveAndManage}
            className="flex items-center gap-2"
            disabled={!menus.some(m => m.isFavorite)}
          >
            <Save className="w-4 h-4" />
            選択したメニューを保存
          </Button>
        </div>

        {/* 生成条件表示 */}
        {conditions && (
          <Card className="shadow-md border-0 bg-white/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                🔍 生成条件
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-slate-700">予算:</span> {conditions.budget.min}円 〜 {conditions.budget.max}円
                </div>
                <div>
                  <span className="font-medium text-slate-700">カロリー:</span> {conditions.calories.min}kcal 〜 {conditions.calories.max}kcal
                </div>
                <div>
                  <span className="font-medium text-slate-700">ジャンル:</span> {conditions.genre}
                </div>
                <div>
                  <span className="font-medium text-slate-700">ボリューム:</span> {conditions.volume}
                </div>
                <div>
                  <span className="font-medium text-slate-700">地域:</span> {conditions.region}
                </div>
                <div>
                  <span className="font-medium text-slate-700">対象顧客:</span> {conditions.targetCustomer}
                </div>
                <div>
                  <span className="font-medium text-slate-700">健康志向:</span> {conditions.healthFocus}
                </div>
                <div>
                  <span className="font-medium text-slate-700">調理制約:</span> {conditions.cookingMethod}
                </div>
                <div>
                  <span className="font-medium text-slate-700">食材傾向:</span> {conditions.seasonalFocus}
                </div>
                {conditions.allergens.length > 0 && (
                  <div className="md:col-span-2 lg:col-span-3">
                    <span className="font-medium text-slate-700">アレルゲン除外:</span> {conditions.allergens.join("、")}
                  </div>
                )}
                {conditions.additionalRequests && (
                  <div className="md:col-span-2 lg:col-span-3">
                    <span className="font-medium text-slate-700">その他リクエスト:</span> {conditions.additionalRequests}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 生成されたメニュー一覧 */}
        <div className="grid gap-6">
          {menus.map((menu, index) => (
            <Card key={menu.id} className={`transition-all shadow-md border-0 bg-white/90 backdrop-blur ${menu.isFavorite ? "ring-2 ring-emerald-500 shadow-lg" : ""}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {menu.name}
                      <Badge variant="outline">{menu.genre}</Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {menu.description}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFavoriteToggle(menu.id)}
                    className={`${menu.isFavorite ? "text-red-500" : "text-gray-400"}`}
                  >
                    <Heart className={`w-5 h-5 ${menu.isFavorite ? "fill-current" : ""}`} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* メニュー詳細 */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">メニュー構成</h4>
                    <div className="space-y-1 text-sm">
                      <div><span className="font-medium">主菜:</span> {menu.mainDish}</div>
                      <div><span className="font-medium">副菜:</span> {menu.sideDishes.join("、")}</div>
                      <div><span className="font-medium">ご飯:</span> {menu.rice}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">栄養・価格情報</h4>
                    <div className="space-y-1 text-sm">
                      <div><span className="font-medium">カロリー:</span> {menu.estimatedCalories}kcal</div>
                      <div><span className="font-medium">価格:</span> {menu.estimatedPrice}円</div>
                      <div>
                        <span className="font-medium">栄養素:</span> 
                        タンパク質{menu.nutritionInfo.protein}g / 
                        脂質{menu.nutritionInfo.fat}g / 
                        炭水化物{menu.nutritionInfo.carbohydrates}g
                      </div>
                    </div>
                  </div>
                </div>

                {/* アレルゲン情報 */}
                {menu.allergens.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">アレルゲン</h4>
                    <div className="flex gap-1">
                      {menu.allergens.map((allergen) => (
                        <Badge key={allergen} variant="destructive" className="text-xs">
                          {allergen}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* フッター */}
        <div className="text-center text-sm text-gray-500">
          💡 気に入ったメニューにハートマークを付けて保存できます
        </div>
      </div>
    </div>
  );
}