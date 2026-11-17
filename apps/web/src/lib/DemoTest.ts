import { Event } from "./event/Event";
import { Promotion } from "./promotion/Promotion";

const referenceDate = Date.UTC;

const fakeEvents: Event[] = [
	{
		id: "event-1",
		title: "Community Meetup",
		startTime: new Date("2027-02-01T10:30:00.000Z"),
		endTime: new Date("2027-02-01T11:30:00.000Z"),
	},
	{
		id: "event-2",
		title: "Past Workshop",
		startTime: new Date("2024-05-01T10:00:00.000Z"),
		endTime: new Date("2024-05-01T11:00:00.000Z"),
	},
	{
		id: "event-3",
		title: "Open House",
		startTime: new Date("2028-03-15T10:00:00.000Z"),
		endTime: new Date("2028-03-15T12:00:00.000Z"),
	},
	{ id: "event-4" },
];

export const fakePromotions: Promotion[] = [
	{
		id: "promotion-1",
		offerText: "Spring Offer",
		startDate: new Date("2025-02-01T00:00:00.000Z"),
		endDate: new Date("2025-04-01T00:00:00.000Z"),
	},
	{
		id: "promotion-2",
		offerText: "Expired Discount",
		startDate: new Date("2024-08-01T00:00:00.000Z"),
		endDate: new Date("2024-10-01T00:00:00.000Z"),
	},
	{
		id: "promotion-3",
		offerText: "Member Benefit",
		startDate: new Date("2025-01-01T00:00:00.000Z"),
		endDate: new Date("2025-12-31T00:00:00.000Z"),
	},
	{ id: "promotion-4" },
];

// function isExpired(date?: Date): boolean {
// 	return date !== undefined && date < referenceDate;
// }

// export function runDemoTests(): void {
// 	if (fakeEvents.length !== 4 || fakePromotions.length !== 4) {
// 		throw new Error("Expected four events and four promotions");
// 	}
// 	if (!fakeEvents.some((event) => isExpired(event.endTime)) || !fakePromotions.some((promotion) => isExpired(promotion.endDate))) {
// 		throw new Error("Expected an expired event and an expired promotion");
// 	}
// 	if (!fakeEvents.some((event) => !event.title || !event.endTime) || !fakePromotions.some((promotion) => !promotion.offerText || !promotion.endDate)) {
// 		throw new Error("Expected an event and promotion with missing optional fields");
// 	}
// }
