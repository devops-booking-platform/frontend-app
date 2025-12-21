export enum PriceType {
    PerNight = 0,
    PerPerson = 1
}

export interface LocationRequest {
    country?: string | null;
    city?: string | null;
    address?: string | null;
    postalCode?: string | null;
}

export interface AccommodationRequest {
    name: string;
    location?: LocationRequest;
    minimumNumberOfGuests?: number;
    maximumNumberOfGuests?: number;
    description: string;
    isAutoConfirm?: boolean;
    priceType: PriceType;
    photos?: string[] | null;
    amenities?: string[] | null;
}

export interface AccommodationReservationInfoResponseDTO {
    hostId: string;
    name?: string | null;
    maxGuests: number;
    totalPrice: number;
    isAutoAcceptEnabled: boolean;
}

export interface AvailabilityRequest {
    id?: string | null;
    price: number;
    startDate: string; // ISO string
    endDate: string;   // ISO string
    accommodationId: string;
}