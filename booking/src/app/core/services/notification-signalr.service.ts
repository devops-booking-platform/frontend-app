import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { ApiConfig } from '../api.config';

export interface NotificationDto {
    id: string;
    type: number;
    message: string;
    createdOn: string;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationSignalRService {
    private readonly baseUrl = ApiConfig.notificationServiceHub;
    private hubConnection!: signalR.HubConnection;

    private notificationSubject = new BehaviorSubject<NotificationDto | null>(null);
    notification$ = this.notificationSubject.asObservable();

    constructor() {
        this.startConnection();
    }

    private startConnection() {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${this.baseUrl}`, {
                accessTokenFactory: () => localStorage.getItem('auth_token') ?? ""
            })
            .withAutomaticReconnect()
            .build();

        this.hubConnection
            .start()
            .catch(err => console.error("SignalR Connection Error:", err));

        this.hubConnection.on("ReceiveMessage", (data: NotificationDto) => {
            console.log("🔔 Notification received:", data);
            this.notificationSubject.next(data);
        });
    }
}
