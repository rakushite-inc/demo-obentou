import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { GenerationConditions } from "@/types/bento";

interface GenerationConditionsViewProps {
  conditions: GenerationConditions;
  compact?: boolean;
}

export function GenerationConditionsView({ 
  conditions, 
  compact = false 
}: GenerationConditionsViewProps) {
  const [isExpanded, setIsExpanded] = useState(!compact);

  if (compact) {
    return (
      <Card className="shadow-sm border-0 bg-slate-50/80">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              🔍 生成条件
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6 p-0"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
        {isExpanded && (
          <CardContent className="pt-0">
            <GenerationConditionsContent conditions={conditions} />
          </CardContent>
        )}
      </Card>
    );
  }

  return (
    <Card className="shadow-md border-0 bg-white/90 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          🔍 生成条件
        </CardTitle>
      </CardHeader>
      <CardContent>
        <GenerationConditionsContent conditions={conditions} />
      </CardContent>
    </Card>
  );
}

function GenerationConditionsContent({ conditions }: { conditions: GenerationConditions }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
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
  );
}