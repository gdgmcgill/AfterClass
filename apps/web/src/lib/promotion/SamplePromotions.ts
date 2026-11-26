import { samplePlaces } from "../sample-places";
import { Promotion } from "./Promotion";

const referenceDate = Date.UTC;

export const fakePromotions: Promotion[] = [
	{
		id: "promotion-1",
		offerText: "Spring Offer",
		startDate: new Date("2026-12-01T01:00:00.000Z"),
		endDate: new Date("2026-12-01T02:00:00.000Z"),
		place: samplePlaces[0]
	},
	{
		id: "promotion-2",
		offerText: "Expired Discount",
		startDate: new Date("2025-08-01T00:00:00.000Z"),
		endDate: new Date("2025-10-01T00:00:00.000Z"),
		place: samplePlaces[1]
	},
	{
		id: "promotion-3",
		offerText: "Member Benefit",
		startDate: new Date("2026-11-27T00:00:00.000Z"),
		endDate: new Date("2026-11-27T00:00:00.000Z"),
	},
	{ id: "promotion-4" },
];