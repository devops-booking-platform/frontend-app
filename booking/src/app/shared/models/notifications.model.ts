export interface MarkNotificationAsReadCommand {
    id: string;
}

export interface EnableDisableNotificationRequest {
    id?: string;
    notificationType: NotificationType;
}

export enum NotificationType {
    ReservationCreated = 0,
    ReservationCanceled,
    ReservationResponded,
    HostRated,
    AccommodationRated
}

export interface Notification {
    id: string;
    type: NotificationType;
    content: string;
    read: boolean;
    createdAt: string; // ISO date string
}
