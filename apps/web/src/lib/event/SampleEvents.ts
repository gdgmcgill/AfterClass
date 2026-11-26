import { samplePlaces } from "../sample-places";
import { Event } from "./Event";

const referenceDate = Date.UTC;

export const fakeEvents: Event[] = [
	{
		id: "event-1",
		title: "Community Meetup",
		startTime: new Date("2027-02-01T10:30:00.000Z"),
		endTime: new Date("2027-02-01T23:30:00.000Z"),
		price: 10.0,
		place: samplePlaces[0]
	},
	{
		id: "event-2",
		title: "Past Workshop",
		startTime: new Date("2024-05-01T10:00:00.000Z"),
		endTime: new Date("2024-05-01T11:00:00.000Z"),
		place: samplePlaces[1]
	},
	{
		id: "event-3",
		title: "Open House",
		endTime: new Date("2026-11-26T23:00:00.000Z"),
	},
	{ id: "event-4" },
];