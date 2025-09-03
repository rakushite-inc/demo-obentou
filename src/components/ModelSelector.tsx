"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export type AIModel = "gpt-4o" | "o3";

interface ModelSelectorProps {
  selectedModel: AIModel;
  onModelChange: (model: AIModel) => void;
}

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🤖 AIモデル選択
        </CardTitle>
        <CardDescription>メニュー生成に使用するAIモデルを選択してください</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedModel} onValueChange={(value) => onModelChange(value as AIModel)}>
          <div className="space-y-4">
            {/* GPT-4o */}
            <div className="flex items-start space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="gpt-4o" id="gpt-4o" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="gpt-4o" className="text-base font-medium cursor-pointer">
                  GPT-4o
                </Label>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    <strong className="text-green-600">✓ 安定性・実績</strong>：実用性の高いメニュー提案
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="text-green-600">✓ バランス重視</strong>：実現可能で現実的な内容
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="text-green-600">✓ 高速処理</strong>：素早いレスポンス
                  </p>
                </div>
              </div>
            </div>

            {/* o3 */}
            <div className="flex items-start space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="o3" id="o3" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="o3" className="text-base font-medium cursor-pointer">
                  o3 <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full ml-1">最新</span>
                </Label>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    <strong className="text-blue-600">✓ 高度な思考力</strong>：より創造的で詳細なメニュー
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="text-blue-600">✓ 複雑な条件対応</strong>：細かな要求を的確に反映
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="text-orange-600">※ 処理時間</strong>：より時間をかけて高品質な結果を生成
                  </p>
                </div>
              </div>
            </div>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}