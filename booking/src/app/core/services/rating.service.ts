// src/app/core/services/rating.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResult } from '../../shared/models/paged.model';
import { AccommodationRatingRequest, RatingResponse, HostRatingRequest } from '../../shared/models/rating.model';
import { ApiConfig } from '../api.config';

@Injectable({ providedIn: 'root' })
export class RatingService {
    private readonly baseUrl = ApiConfig.ratingService;

    constructor(private http: HttpClient) { }

    // Accommodation Ratings
    createAccommodationRating(request: AccommodationRatingRequest): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/accommodation-ratings`, request);
    }

    getAccommodationRatings(accommodationId: string, page?: number, pageSize?: number): Observable<PagedResult<RatingResponse>> {
        let params = new HttpParams()
            .set('AccommodationId', accommodationId);
        if (page != null) params = params.set('Page', page.toString());
        if (pageSize != null) params = params.set('PageSize', pageSize.toString());

        return this.http.get<PagedResult<RatingResponse>>(`${this.baseUrl}/accommodation-ratings`, { params });
    }

    getAccommodationRating(id: string): Observable<RatingResponse> {
        return this.http.get<RatingResponse>(`${this.baseUrl}/accommodation-ratings/${id}`);
    }

    deleteAccommodationRating(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/accommodation-ratings/${id}`);
    }

    // Host Ratings
    createHostRating(request: HostRatingRequest): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/host-ratings`, request);
    }

    getHostRatings(hostId: string, page?: number, pageSize?: number): Observable<PagedResult<RatingResponse>> {
        let params = new HttpParams()
            .set('HostId', hostId);
        if (page != null) params = params.set('Page', page.toString());
        if (pageSize != null) params = params.set('PageSize', pageSize.toString());

        return this.http.get<PagedResult<RatingResponse>>(`${this.baseUrl}/host-ratings`, { params });
    }

    getHostRating(id: string): Observable<RatingResponse> {
        return this.http.get<RatingResponse>(`${this.baseUrl}/host-ratings/${id}`);
    }

    deleteHostRating(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/host-ratings/${id}`);
    }

    // Health check
    healthCheck(): Observable<string> {
        return this.http.get(`${this.baseUrl}/health`, { responseType: 'text' });
    }
}
