import { PriceType } from "./accommodation.model";

export interface SearchRequest {
    city?: string | null;
    country?: string | null;
    guests: number;
    start: string; // ISO string
    end: string;   // ISO string
    page: number;
    pageSize: number;
}

export interface SearchResult {
    accommodationId: string;
    name: string;
    city: string;
    country: string;
    totalPrice: number;
    minGuests: number;
    maxGuests: number;
    imageUrl?: string;
    priceType: PriceType;
    price: number;
}
