import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationType, MarkNotificationAsReadCommand, EnableDisableNotificationRequest } from '../../shared/models/notifications.model';
import { ApiConfig } from '../api.config';

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private readonly baseUrl = ApiConfig.notificationService;

    constructor(private http: HttpClient) { }

    // Get notifications with optional filters
    getNotifications(
        read?: boolean,
        notificationType?: NotificationType,
        page?: number,
        pageSize?: number
    ): Observable<Notification[]> {
        const params: any = {};
        if (read !== undefined) params.Read = read;
        if (notificationType !== undefined) params.NotificationType = notificationType;
        if (page !== undefined) params.Page = page;
        if (pageSize !== undefined) params.PageSize = pageSize;

        return this.http.get<Notification[]>(`${this.baseUrl}/notification`, { params });
    }

    // Get unread notifications only
    getUnreadNotifications(): Observable<Notification[]> {
        return this.http.get<Notification[]>(`${this.baseUrl}/notification/unread`);
    }

    // Get single notification by ID
    getNotificationById(id: string): Observable<Notification> {
        return this.http.get<Notification>(`${this.baseUrl}/notification/${id}`);
    }

    // Mark a notification as read
    markAsRead(command: MarkNotificationAsReadCommand): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/notification`, command);
    }

    // Enable notification type
    enableNotification(request: EnableDisableNotificationRequest): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/notification-disabled/enable`, request);
    }

    // Disable notification type
    disableNotification(request: EnableDisableNotificationRequest): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/notification-disabled/disable`, request);
    }

    // Get all disabled notifications
    getDisabledNotifications(): Observable<EnableDisableNotificationRequest[]> {
        return this.http.get<EnableDisableNotificationRequest[]>(`${this.baseUrl}/notification-disabled`);
    }

    // Health check
    healthCheck(): Observable<string> {
        return this.http.get(`${this.baseUrl}/health`, { responseType: 'text' });
    }
}
