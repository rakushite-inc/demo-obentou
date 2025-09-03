import type { Car } from "@/types/car";

// ウォッチリストのモックデータ（車両IDのリスト）
export const watchlistCarIds = [1, 3, 5];

// ユーザーのウォッチリスト取得関数
export function getWatchlistIds(): number[] {
  return watchlistCarIds;
}

// ウォッチリストに追加
export function addToWatchlist(carId: number): boolean {
  if (!watchlistCarIds.includes(carId)) {
    watchlistCarIds.push(carId);
    return true;
  }
  return false;
}

// ウォッチリストから削除
export function removeFromWatchlist(carId: number): boolean {
  const index = watchlistCarIds.indexOf(carId);
  if (index > -1) {
    watchlistCarIds.splice(index, 1);
    return true;
  }
  return false;
}

// ウォッチリストに含まれているかチェック
export function isInWatchlist(carId: number): boolean {
  return watchlistCarIds.includes(carId);
}
