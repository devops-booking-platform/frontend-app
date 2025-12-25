export interface SearchRequest {
    city?: string | null;
    country?: string | null;
    guests: number;
    start: string; // ISO string
    end: string;   // ISO string
}

export interface SearchResult {
    id: string;
    name: string;
    city: string;
    country: string;
    totalPrice: number;
    maxGuests: number;
    imageUrl?: string;
}
