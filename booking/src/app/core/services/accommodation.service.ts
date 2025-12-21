// src/app/core/services/accommodation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfig } from '../api.config';
import { AccommodationRequest, AccommodationReservationInfoResponseDTO, AvailabilityRequest } from '../../shared/models/accommodation.model';

@Injectable({ providedIn: 'root' })
export class AccommodationService {
    private readonly baseUrl = ApiConfig.accommodationService;

    constructor(private http: HttpClient) { }

    createAccommodation(request: AccommodationRequest): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/accommodations`, request);
    }

    getReservationInfo(
        id: string,
        start?: string,
        end?: string,
        guests?: number
    ): Observable<AccommodationReservationInfoResponseDTO> {
        let params = new HttpParams();
        if (start) params = params.set('start', start);
        if (end) params = params.set('end', end);
        if (guests != null) params = params.set('guests', guests.toString());

        return this.http.get<AccommodationReservationInfoResponseDTO>(
            `${this.baseUrl}/accommodations/${id}/reservation-info`,
            { params }
        );
    }

    getMyAccommodations(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/accommodations/my`);
    }

    checkAvailability(request: AvailabilityRequest): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/availability`, request);
    }

    healthCheck(): Observable<string> {
        return this.http.get(`${this.baseUrl}/health`, { responseType: 'text' });
    }
}
