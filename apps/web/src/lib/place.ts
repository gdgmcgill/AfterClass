// 1 = cheapest ("$"), 4 = most expensive ("$$$$")
export type PriceLevel = 1 | 2 | 3 | 4;

// Fields that can be null are shown as "not available" in the UI
export type Place = {
    id: string;
    name: string;
    category: string;
    priceLevel: PriceLevel | null;
    address: string | null;
    distanceKm: number | null;
    openingHours: string[] | null;
    sourceUrl: string | null;
    lastConfirmedDate: string | null;
};

