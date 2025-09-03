"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GenerationConditionsView } from "@/components/generation-conditions-view";
import type { BentoMenu } from "@/types/bento";
import { Filter, Heart, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ManagePage() {
  const [savedMenus, setSavedMenus] = useState<BentoMenu[]>([]);
  const [filteredMenus, setFilteredMenus] = useState<BentoMenu[]>([]);
  const [genreFilter, setGenreFilter] = useState<string>("全て");
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // LocalStorageから保存されたメニューを読み込み
    const saved = JSON.parse(localStorage.getItem("bentoMenus") || "[]");
    setSavedMenus(saved);
    setFilteredMenus(saved);
  }, []);

  useEffect(() => {
    // フィルタリング処理
    let filtered = savedMenus;

    if (genreFilter !== "全て") {
      filtered = filtered.filter((menu) => menu.genre === genreFilter);
    }

    if (favoriteOnly) {
      filtered = filtered.filter((menu) => menu.isFavorite);
    }

    setFilteredMenus(filtered);
  }, [savedMenus, genreFilter, favoriteOnly]);

  const handleDeleteMenu = (menuId: string) => {
    const updatedMenus = savedMenus.filter((menu) => menu.id !== menuId);
    setSavedMenus(updatedMenus);
    localStorage.setItem("bentoMenus", JSON.stringify(updatedMenus));
  };

  const handleToggleFavorite = (menuId: string) => {
    const updatedMenus = savedMenus.map((menu) => {
      if (menu.id === menuId) {
        const updatedMenu = { ...menu, isFavorite: !menu.isFavorite };
        
        // お気に入りの状態に応じてfavoriteBentoMenusも更新
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
    });
    
    setSavedMenus(updatedMenus);
    localStorage.setItem("bentoMenus", JSON.stringify(updatedMenus));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">📋 メニュー管理</h1>
            <p className="text-slate-600">保存したお弁当メニューを管理・活用できます</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/favorites")}
              className="flex items-center gap-2"
            >
              ⭐ お気に入り
            </Button>
            <Button onClick={() => router.push("/")} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              新しいメニューを生成
            </Button>
          </div>
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-md border-0 bg-white/90 backdrop-blur">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-indigo-600">{savedMenus.length}</div>
              <div className="text-sm text-slate-600">保存メニュー数</div>
            </CardContent>
          </Card>
          <Card className="shadow-md border-0 bg-white/90 backdrop-blur">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-rose-600">
                {savedMenus.filter((m) => m.isFavorite).length}
              </div>
              <div className="text-sm text-slate-600">お気に入り</div>
            </CardContent>
          </Card>
          <Card className="shadow-md border-0 bg-white/90 backdrop-blur">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-emerald-600">
                {savedMenus.length > 0
                  ? Math.round(
                      savedMenus.reduce((sum, m) => sum + m.estimatedPrice, 0) / savedMenus.length
                    )
                  : 0}
                円
              </div>
              <div className="text-sm text-slate-600">平均価格</div>
            </CardContent>
          </Card>
          <Card className="shadow-md border-0 bg-white/90 backdrop-blur">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-amber-600">
                {savedMenus.length > 0
                  ? Math.round(
                      savedMenus.reduce((sum, m) => sum + m.estimatedCalories, 0) /
                        savedMenus.length
                    )
                  : 0}
              </div>
              <div className="text-sm text-slate-600">平均カロリー</div>
            </CardContent>
          </Card>
        </div>

        {/* フィルタリング */}
        <Card className="shadow-md border-0 bg-white/90 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">フィルター:</span>
              </div>

              <Select value={genreFilter} onValueChange={setGenreFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="全て">全てのジャンル</SelectItem>
                  <SelectItem value="和食">和食</SelectItem>
                  <SelectItem value="洋食">洋食</SelectItem>
                  <SelectItem value="中華">中華</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant={favoriteOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setFavoriteOnly(!favoriteOnly)}
                className="flex items-center gap-2"
              >
                <Heart className={`w-4 h-4 ${favoriteOnly ? "fill-current" : ""}`} />
                お気に入りのみ
              </Button>

              <div className="text-sm text-gray-500">{filteredMenus.length}件表示</div>
            </div>
          </CardContent>
        </Card>

        {/* メニュー一覧 */}
        {filteredMenus.length === 0 ? (
          <Card className="shadow-md border-0 bg-white/90 backdrop-blur">
            <CardContent className="p-8 text-center">
              <div className="text-slate-400 text-lg mb-4">📭</div>
              <h3 className="text-lg font-semibold text-slate-600 mb-2">
                {savedMenus.length === 0
                  ? "保存されたメニューがありません"
                  : "該当するメニューがありません"}
              </h3>
              <p className="text-slate-500 mb-4">
                {savedMenus.length === 0
                  ? "新しいメニューを生成して保存してください"
                  : "フィルター条件を変更してください"}
              </p>
              {savedMenus.length === 0 && (
                <Button onClick={() => router.push("/")}>メニューを生成する</Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredMenus.map((menu) => (
              <Card
                key={menu.id}
                className="hover:shadow-lg transition-all shadow-md border-0 bg-white/90 backdrop-blur"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {menu.name}
                        <Badge variant="outline">{menu.genre}</Badge>
                        {menu.isFavorite && <Heart className="w-4 h-4 text-red-500 fill-current" />}
                      </CardTitle>
                      <CardDescription className="mt-1">{menu.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleFavorite(menu.id)}
                        className={menu.isFavorite ? "text-red-500" : "text-gray-400"}
                      >
                        <Heart className={`w-4 h-4 ${menu.isFavorite ? "fill-current" : ""}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMenu(menu.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">メニュー構成</h4>
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
                      <h4 className="font-medium text-sm text-gray-700 mb-2">栄養・価格</h4>
                      <div className="text-sm space-y-1">
                        <div>{menu.estimatedCalories}kcal</div>
                        <div>{menu.estimatedPrice}円</div>
                        <div>
                          P:{menu.nutritionInfo.protein}g / F:{menu.nutritionInfo.fat}g / C:
                          {menu.nutritionInfo.carbohydrates}g
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">その他</h4>
                      <div className="text-sm space-y-1">
                        <div>ボリューム: {menu.volume}</div>
                        <div>作成日: {new Date(menu.createdAt).toLocaleDateString()}</div>
                        {menu.allergens.length > 0 && (
                          <div className="flex gap-1 flex-wrap">
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
        <div className="text-center text-sm text-gray-500">
          💡 メニューデータは事業の資産として活用できます
        </div>
      </div>
    </div>
  );
}
