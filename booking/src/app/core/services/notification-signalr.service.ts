import { Injectable, OnDestroy } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, distinctUntilChanged, map, Subscription } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
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
export class NotificationSignalRService implements OnDestroy {
    private hubConnection?: signalR.HubConnection;
    private retryTimer?: ReturnType<typeof setTimeout>;
    private readonly authSubscription: Subscription;

    private notificationSubject = new BehaviorSubject<NotificationDto | null>(null);
    notification$ = this.notificationSubject.asObservable();

    constructor(auth: AuthService) {
        this.authSubscription = auth.isLoggedIn$.pipe(
            map(loggedIn => loggedIn ? auth.token : null),
            distinctUntilChanged()
        ).subscribe(token => this.changeConnection(token));
    }

    private changeConnection(token: string | null): void {
        clearTimeout(this.retryTimer);
        this.retryTimer = undefined;
        const previous = this.hubConnection;
        this.hubConnection = undefined;
        this.notificationSubject.next(null);
        if (previous) {
            void previous.stop().catch(() => console.warn('SignalR connection could not be stopped.'));
        }
        if (!token) return;

        const connection = new signalR.HubConnectionBuilder()
            .withUrl(ApiConfig.notificationServiceHub, { accessTokenFactory: () => token })
            .withAutomaticReconnect()
            .build();
        this.hubConnection = connection;
        connection.on('ReceiveMessage', (data: NotificationDto) => {
            if (this.hubConnection === connection) this.notificationSubject.next(data);
        });
        connection.onclose(() => this.scheduleRetry(connection));
        this.startConnection(connection);
    }

    private startConnection(connection: signalR.HubConnection): void {
        if (this.hubConnection !== connection || connection.state !== signalR.HubConnectionState.Disconnected) return;
        void connection.start().catch(() => {
            // Automatic reconnect does not retry the initial start failure.
            if (this.hubConnection === connection) {
                console.warn('SignalR connection failed; retrying in 5 seconds.');
                this.scheduleRetry(connection);
            }
        });
    }

    private scheduleRetry(connection: signalR.HubConnection): void {
        if (this.hubConnection !== connection || this.retryTimer !== undefined) return;
        this.retryTimer = setTimeout(() => {
            this.retryTimer = undefined;
            this.startConnection(connection);
        }, 5000);
    }

    ngOnDestroy(): void {
        this.authSubscription.unsubscribe();
        this.changeConnection(null);
        this.notificationSubject.complete();
    }
}
