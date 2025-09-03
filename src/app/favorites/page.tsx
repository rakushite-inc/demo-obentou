"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GenerationConditionsView } from "@/components/generation-conditions-view";
import { Heart, Plus, Trash2, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import type { BentoMenu } from "@/types/bento";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<BentoMenu[]>([]);
  const router = useRouter();

  useEffect(() => {
    // LocalStorageからお気に入りメニューを読み込み
    const savedFavorites = JSON.parse(localStorage.getItem("favoriteBentoMenus") || "[]");
    setFavorites(savedFavorites);
  }, []);

  const handleRemoveFromFavorites = (menuId: string) => {
    const updatedFavorites = favorites.filter(menu => menu.id !== menuId);
    setFavorites(updatedFavorites);
    localStorage.setItem("favoriteBentoMenus", JSON.stringify(updatedFavorites));
    
    // 通常の保存メニューからもお気に入りフラグを削除
    const savedMenus = JSON.parse(localStorage.getItem("bentoMenus") || "[]");
    const updatedMenus = savedMenus.map((menu: BentoMenu) =>
      menu.id === menuId ? { ...menu, isFavorite: false } : menu
    );
    localStorage.setItem("bentoMenus", JSON.stringify(updatedMenus));
  };

  const handleAddToSavedMenus = (menu: BentoMenu) => {
    const savedMenus = JSON.parse(localStorage.getItem("bentoMenus") || "[]");
    const existingMenu = savedMenus.find((m: BentoMenu) => m.id === menu.id);
    
    if (!existingMenu) {
      const updatedMenus = [...savedMenus, { ...menu, isFavorite: true }];
      localStorage.setItem("bentoMenus", JSON.stringify(updatedMenus));
      alert("メニューが保存メニューに追加されました！");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
              ⭐ お気に入りメニュー
            </h1>
            <p className="text-slate-600">
              特に気に入ったお弁当メニューのコレクション
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/manage")}
              className="flex items-center gap-2"
            >
              📋 管理画面
            </Button>
            <Button
              onClick={() => router.push("/")}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              新しいメニューを生成
            </Button>
          </div>
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-md border-0 bg-white/90 backdrop-blur">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-rose-600">{favorites.length}</div>
              <div className="text-sm text-slate-600">お気に入りメニュー数</div>
            </CardContent>
          </Card>
          <Card className="shadow-md border-0 bg-white/90 backdrop-blur">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-amber-600">
                {favorites.length > 0 
                  ? Math.round(favorites.reduce((sum, m) => sum + m.estimatedPrice, 0) / favorites.length)
                  : 0}円
              </div>
              <div className="text-sm text-slate-600">平均価格</div>
            </CardContent>
          </Card>
          <Card className="shadow-md border-0 bg-white/90 backdrop-blur">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-emerald-600">
                {favorites.length > 0
                  ? Math.round(favorites.reduce((sum, m) => sum + m.estimatedCalories, 0) / favorites.length)
                  : 0}
              </div>
              <div className="text-sm text-slate-600">平均カロリー</div>
            </CardContent>
          </Card>
        </div>

        {/* お気に入りメニュー一覧 */}
        {favorites.length === 0 ? (
          <Card className="shadow-md border-0 bg-white/90 backdrop-blur">
            <CardContent className="p-8 text-center">
              <div className="text-slate-400 text-6xl mb-4">⭐</div>
              <h3 className="text-lg font-semibold text-slate-600 mb-2">
                お気に入りメニューがありません
              </h3>
              <p className="text-slate-500 mb-4">
                メニュー生成画面や結果画面でハートマークを押して、お気に入りを追加してください
              </p>
              <Button onClick={() => router.push("/")}>
                メニューを生成する
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {favorites.map((menu) => (
              <Card key={menu.id} className="hover:shadow-lg transition-all shadow-md border-0 bg-white/90 backdrop-blur ring-1 ring-rose-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-500 fill-current" />
                        {menu.name}
                        <Badge variant="outline">{menu.genre}</Badge>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {menu.description}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAddToSavedMenus(menu)}
                        className="text-emerald-600 hover:text-emerald-700"
                        title="保存メニューに追加"
                      >
                        📋
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFromFavorites(menu.id)}
                        className="text-rose-500 hover:text-rose-700"
                        title="お気に入りから削除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-sm text-slate-700 mb-2">メニュー構成</h4>
                      <div className="text-sm space-y-1">
                        <div>
                          <span className="font-medium">主菜:</span> {menu.mainDish}
                        </div>
                        <div>
                          <span className="font-medium">副菜:</span> {menu.sideDishes.join("、")}
                        </div>
                        <div>
                          <span className="font-medium">ご飯:</span> {menu.rice}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm text-slate-700 mb-2">栄養・価格</h4>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-rose-600 font-medium">{menu.estimatedCalories}kcal</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-600 font-medium">{menu.estimatedPrice}円</span>
                        </div>
                        <div className="text-xs text-slate-500">
                          P:{menu.nutritionInfo.protein}g / 
                          F:{menu.nutritionInfo.fat}g / 
                          C:{menu.nutritionInfo.carbohydrates}g
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm text-slate-700 mb-2">詳細情報</h4>
                      <div className="text-sm space-y-1">
                        <div>ボリューム: <Badge variant="outline" className="text-xs">{menu.volume}</Badge></div>
                        <div>
                          お気に入り登録: {new Date(menu.createdAt).toLocaleDateString()}
                        </div>
                        {menu.allergens.length > 0 && (
                          <div className="flex gap-1 flex-wrap mt-2">
                            {menu.allergens.map((allergen) => (
                              <Badge key={allergen} variant="destructive" className="text-xs">
                                {allergen}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* 生成条件表示 */}
                  {menu.generationConditions && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <GenerationConditionsView 
                        conditions={menu.generationConditions} 
                        compact={true}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* フッター */}
        <div className="text-center text-sm text-slate-500">
          ⭐ お気に入りメニューは永続的に保存されます
        </div>
      </div>
    </div>
  );
}