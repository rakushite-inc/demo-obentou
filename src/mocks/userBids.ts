export type UserBid = {
  id: number;
  carId: number;
  carTitle: string;
  carImage: string;
  bidAmount: number;
  bidTime: string;
  status: "active" | "winning" | "outbid" | "won" | "lost";
  currentHighestBid: number;
  auctionEndTime: string;
  isWatching: boolean;
};

// ユーザーの入札履歴モックデータ
export const userBids: UserBid[] = [
  {
    id: 1,
    carId: 1,
    carTitle: "トヨタ プリウス 2019年 ハイブリッド 低走行車",
    carImage: "/sample/1.png",
    bidAmount: 1450000,
    bidTime: "2024-01-15 14:30",
    status: "winning",
    currentHighestBid: 1450000,
    auctionEndTime: "2時間34分",
    isWatching: true,
  },
  {
    id: 2,
    carId: 3,
    carTitle: "BMW 320i 2020年 ターボ スポーツパッケージ",
    carImage: "/sample/1.png",
    bidAmount: 3200000,
    bidTime: "2024-01-14 16:45",
    status: "outbid",
    currentHighestBid: 3350000,
    auctionEndTime: "1日12時間",
    isWatching: true,
  },
  {
    id: 3,
    carId: 2,
    carTitle: "ホンダ フィット 2021年 コンパクト 燃費良好",
    carImage: "/sample/1.png",
    bidAmount: 980000,
    bidTime: "2024-01-13 19:20",
    status: "won",
    currentHighestBid: 980000,
    auctionEndTime: "終了",
    isWatching: false,
  },
  {
    id: 4,
    carId: 4,
    carTitle: "メルセデス・ベンツ C-Class 2019年 AMGライン",
    carImage: "/sample/1.png",
    bidAmount: 4800000,
    bidTime: "2024-01-12 11:15",
    status: "lost",
    currentHighestBid: 5200000,
    auctionEndTime: "終了",
    isWatching: false,
  },
  {
    id: 5,
    carId: 5,
    carTitle: "日産 ノート e-POWER 2022年 オートパイロット",
    carImage: "/sample/1.png",
    bidAmount: 1650000,
    bidTime: "2024-01-11 09:30",
    status: "active",
    currentHighestBid: 1650000,
    auctionEndTime: "3日8時間",
    isWatching: true,
  },
];

// ユーザーの入札履歴を取得
export function getUserBids(): UserBid[] {
  return userBids;
}

// ステータス別の入札履歴を取得
export function getUserBidsByStatus(status?: UserBid["status"]): UserBid[] {
  if (!status) return userBids;
  return userBids.filter((bid) => bid.status === status);
}

// 進行中の入札を取得
export function getActiveBids(): UserBid[] {
  return userBids.filter(
    (bid) => bid.status === "active" || bid.status === "winning" || bid.status === "outbid"
  );
}

// 終了した入札を取得
export function getCompletedBids(): UserBid[] {
  return userBids.filter((bid) => bid.status === "won" || bid.status === "lost");
}
