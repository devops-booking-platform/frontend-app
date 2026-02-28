import { NotificationType } from "../shared/models/notifications.model";

export interface NotificationSettingConfig {
    type: NotificationType;
    label: string;
    description: string;
    roles: ('Host' | 'Guest')[];
}

export const NOTIFICATION_SETTINGS: NotificationSettingConfig[] = [
    {
        type: NotificationType.ReservationCreated,
        label: 'Reservation request created',
        description: 'When someone creates a reservation request',
        roles: ['Host']
    },
    {
        type: NotificationType.ReservationCanceled,
        label: 'Reservation canceled',
        description: 'When a reservation is canceled',
        roles: ['Host']
    },
    {
        type: NotificationType.HostRated,
        label: 'Host rated',
        description: 'When someone rates you as a host',
        roles: ['Host']
    },
    {
        type: NotificationType.AccommodationRated,
        label: 'Accommodation rated',
        description: 'When someone rates your accommodation',
        roles: ['Host']
    },
    {
        type: NotificationType.ReservationResponded,
        label: 'Reservation responded',
        description: 'When host responds to your reservation request',
        roles: ['Guest']
    }
];
