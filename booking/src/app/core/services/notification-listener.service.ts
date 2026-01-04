import { Injectable } from '@angular/core';
import { NotificationSignalRService } from './notification-signalr.service';
import { SnackbarNotificationService } from '../../auth/services/snackbar-notification.service';

@Injectable({
    providedIn: 'root'
})
export class NotificationListenerService {

    constructor(
        private signalR: NotificationSignalRService,
        private snackbar: SnackbarNotificationService
    ) {
        this.listen();
    }

    private listen() {
        this.signalR.notification$
            .subscribe(n => {
                if (!n) return;

                this.snackbar.notification(n.message);
                console.log("GLOBAL notification:", n);
            });
    }
}
