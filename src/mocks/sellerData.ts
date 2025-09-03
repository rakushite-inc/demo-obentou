export type ListingStatus = "active" | "ended" | "draft" | "cancelled";

export interface SellerListing {
  id: number;
  title: string;
  image: string;
  maker: string;
  model: string;
  year: number;
  currentBid: number;
  startingPrice: number;
  buyNowPrice?: number;
  bidCount: number;
  watchCount: number;
  timeLeft: string;
  status: ListingStatus;
  createdAt: string;
  endDate: string;
  category: string;
  location: string;
}

export const sellerListings: SellerListing[] = [
  {
    id: 1,
    title: "トヨタ プリウス 2019年 ハイブリッド 低走行車",
    image: "/sample/1.png",
    maker: "トヨタ",
    model: "プリウス",
    year: 2019,
    currentBid: 1450000,
    startingPrice: 1200000,
    buyNowPrice: 1800000,
    bidCount: 23,
    watchCount: 45,
    timeLeft: "2時間34分",
    status: "active",
    createdAt: "2024-01-15",
    endDate: "2024-01-22",
    category: "国産車",
    location: "東京都",
  },
  {
    id: 2,
    title: "BMW 3シリーズ 320i 2020年式 ワンオーナー",
    image: "/sample/1.png",
    maker: "BMW",
    model: "3シリーズ",
    year: 2020,
    currentBid: 3350000,
    startingPrice: 3000000,
    buyNowPrice: 4200000,
    bidCount: 18,
    watchCount: 67,
    timeLeft: "1日12時間",
    status: "active",
    createdAt: "2024-01-10",
    endDate: "2024-01-25",
    category: "輸入車",
    location: "大阪府",
  },
  {
    id: 3,
    title: "ホンダ フィット 2018年 コンパクト 燃費良好",
    image: "/sample/1.png",
    maker: "ホンダ",
    model: "フィット",
    year: 2018,
    currentBid: 850000,
    startingPrice: 600000,
    buyNowPrice: 1100000,
    bidCount: 12,
    watchCount: 28,
    timeLeft: "終了",
    status: "ended",
    createdAt: "2024-01-05",
    endDate: "2024-01-12",
    category: "国産車",
    location: "神奈川県",
  },
  {
    id: 4,
    title: "レクサス IS 350 2021年式 高級セダン",
    image: "/sample/1.png",
    maker: "レクサス",
    model: "IS",
    year: 2021,
    currentBid: 0,
    startingPrice: 4500000,
    buyNowPrice: 6000000,
    bidCount: 0,
    watchCount: 12,
    timeLeft: "下書き",
    status: "draft",
    createdAt: "2024-01-20",
    endDate: "",
    category: "高級車",
    location: "愛知県",
  },
  {
    id: 5,
    title: "日産 セレナ 2019年 ファミリーカー 7人乗り",
    image: "/sample/1.png",
    maker: "日産",
    model: "セレナ",
    year: 2019,
    currentBid: 1200000,
    startingPrice: 1000000,
    bidCount: 8,
    watchCount: 19,
    timeLeft: "キャンセル済み",
    status: "cancelled",
    createdAt: "2024-01-08",
    endDate: "2024-01-15",
    category: "国産車",
    location: "千葉県",
  },
];

export function getSellerListings(): SellerListing[] {
  return sellerListings;
}

export function getSellerListingsByStatus(status?: ListingStatus): SellerListing[] {
  if (!status) return sellerListings;
  return sellerListings.filter((listing) => listing.status === status);
}

export function getSellerListing(id: number): SellerListing | undefined {
  return sellerListings.find((listing) => listing.id === id);
}

export function getSellerStats() {
  const total = sellerListings.length;
  const active = sellerListings.filter((l) => l.status === "active").length;
  const ended = sellerListings.filter((l) => l.status === "ended").length;
  const draft = sellerListings.filter((l) => l.status === "draft").length;
  const cancelled = sellerListings.filter((l) => l.status === "cancelled").length;

  const totalViews = sellerListings.reduce((sum, l) => sum + l.watchCount, 0);
  const totalBids = sellerListings.reduce((sum, l) => sum + l.bidCount, 0);
  const totalRevenue = sellerListings
    .filter((l) => l.status === "ended")
    .reduce((sum, l) => sum + l.currentBid, 0);

  return {
    total,
    active,
    ended,
    draft,
    cancelled,
    totalViews,
    totalBids,
    totalRevenue,
  };
}
