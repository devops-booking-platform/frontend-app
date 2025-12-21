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
