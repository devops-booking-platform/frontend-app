export interface PagedRequest {
    page?: number;
    pageSize?: number;
}

export interface PagedResult<T> {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
}

export interface AccommodationPagedResult<T> extends PagedResult<T> {
    averageRating?: number;
}