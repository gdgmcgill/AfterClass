"use client"

import { createElement } from "react";
import { EventCardGrid } from "@/components/EventCard";
import { Promotion } from "./Promotion";

const referenceDate = Date.UTC;

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