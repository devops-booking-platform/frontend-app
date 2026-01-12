import { PagedRequest } from "./paged.model";

export interface CreateReservationRequest {
    accommodationId: string;
    startDate: string; // ISO date string
    endDate: string;   // ISO date string
    guestsCount: number;
}

export interface ReservationResponse {
    id: string;
    accommodationId: string;
    guestId: string;
    startDate: string;
    endDate: string;
    guestsCount: number;
    status: 'Pending' | 'Approved' | 'Declined' | 'Cancelled';
}

export interface GetReservationResponse {
    id: string;
    accommodationId: string;
    guestId: string;
    hostId: string;
    accommodationName: string;
    guestEmail: string;
    guestUsername: string;
    startDate: string;   // ISO date (maps from DateOnly)
    endDate: string;     // ISO date
    guestsCount: number;
    status: 'Pending' | 'Approved' | 'Declined' | 'Cancelled';
    createdAt: string;   // ISO datetime
    totalPrice: number;
}

export interface GetReservationRequest extends PagedRequest {
    reservationStatus?: 'Pending' | 'Approved' | 'Rejected' | 'CancelledByGuest';
}