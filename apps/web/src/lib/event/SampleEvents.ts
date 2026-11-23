import { Event } from "./Event";

const referenceDate = Date.UTC;

export const fakeEvents: Event[] = [
	{
		id: "event-1",
		title: "Community Meetup",
		startTime: new Date("2027-02-01T10:30:00.000Z"),
		endTime: new Date("2027-02-01T11:30:00.000Z"),
		price: 10.0,
		place: "test"
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
