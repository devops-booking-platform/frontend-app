import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateReservationRequest, GetReservationRequest, GetReservationResponse, ReservationResponse } from '../../shared/models/reservations.model';
import { ApiConfig } from '../api.config';
import { PagedResult } from '../../shared/models/paged.model';

@Injectable({ providedIn: 'root' })
export class ReservationService {
    private readonly baseUrl = ApiConfig.reservationService;

    constructor(private http: HttpClient) { }

    // Create reservation with optional Idempotency key
    createReservation(request: CreateReservationRequest, idempotencyKey?: string): Observable<void> {
        let headers = new HttpHeaders();
        if (idempotencyKey) {
            headers = headers.set('Idempotency-Key', idempotencyKey);
        }
        return this.http.post<void>(`${this.baseUrl}/reservations`, request, { headers });
    }

    search(request: GetReservationRequest): Observable<PagedResult<GetReservationResponse>> {
        const query = `${request.reservationStatus ? `status=${request.reservationStatus}&` : ''
            }page=${request.page}&pageSize=${request.pageSize}`;
        return this.http.get<PagedResult<GetReservationResponse>>(`${this.baseUrl}/reservations?${query}`);
    }

    // Get approved reservations
    getApprovedReservations(): Observable<ReservationResponse[]> {
        return this.http.get<ReservationResponse[]>(`${this.baseUrl}/reservations/approved`);
    }

    // Get pending reservations
    getPendingReservations(): Observable<ReservationResponse[]> {
        return this.http.get<ReservationResponse[]>(`${this.baseUrl}/reservations/pending`);
    }

    // Cancel reservation
    cancelReservation(reservationId: string): Observable<void> {
        return this.http.patch<void>(`${this.baseUrl}/reservations/${reservationId}/cancel`, null);
    }

    // Approve reservation (host)
    approveReservation(reservationId: string): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/reservations/approve/${reservationId}`, null);
    }

    // Decline reservation (host)
    declineReservation(reservationId: string): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/reservations/decline/${reservationId}`, null);
    }

    // Internal deletion eligibility (host)
    getDeletionEligibilityForHost(hostId: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.baseUrl}/reservations/internal/deletion-eligibility/host/${hostId}`);
    }

    // Internal deletion eligibility (guest)
    getDeletionEligibilityForGuest(guestId: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.baseUrl}/reservations/internal/deletion-eligibility/guest/${guestId}`);
    }

    // Health check
    healthCheck(): Observable<string> {
        return this.http.get(`${this.baseUrl}/health`, { responseType: 'text' });
    }
}
