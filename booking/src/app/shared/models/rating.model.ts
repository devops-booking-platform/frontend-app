export interface AccommodationRatingRequest {
    id?: string | null;
    accommodationId: string;
    rating: number; // 1-5
    comment?: string | null;
}

export interface HostRatingRequest {
    id?: string | null;
    hostId: string;
    rating: number; // 1-5
    comment?: string | null;
}

export interface PagedRequest {
    page?: number;
    pageSize?: number;
}

export interface PagedResult<T> {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    averageRating?: number | null;
}