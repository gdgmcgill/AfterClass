import { Place } from "../place"

export type Promotion = {
    id: string
    offerText?: string
    startDate?: Date
    endDate?: Date
    restrictions?: string[]
    place?: Place
}