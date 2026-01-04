export enum PriceType {
    PerGuest = 0,
    PerUnit = 1
}

export interface LocationRequest {
    country?: string | null;
    city?: string | null;
    address?: string | null;
    postalCode?: string | null;
}

export interface AccommodationRequest {
    id?: string;
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

export interface GetAccommodationsRequest {
    id: string;
    name: string;
    address: string;
    minGuests: number;
    maxGuests: number;
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

export interface GetAmenitiesResponse {
    id: string;
    name: string;
    description: string;
}

export interface GetAccommodationResponse {
    id: string;

    name: string;

    description?: string | null;

    isAutoConfirm: boolean;

    minimumNumberOfGuests: number;

    maximumNumberOfGuests: number;

    priceType: PriceType;

    location: LocationResponseDto;

    photos: string[];

    amenities: AmenityResponseDto[];

    availabilities: AvailabilityResponseDto[];
}

export interface LocationResponseDto {
    id: string;
    country?: string | null;
    city?: string | null;
    address?: string | null;
    postalCode?: string | null;
}

export interface AmenityResponseDto {
    id: string;
    name: string;
    description: string;
}

export interface AvailabilityResponseDto {
    id: string;
    price: number;
    startDate: string; // DateOnly → string in JSON
    endDate: string;   // DateOnly → string in JSON
}