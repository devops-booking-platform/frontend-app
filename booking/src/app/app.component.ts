import { Component } from '@angular/core';
import { NotificationListenerService } from './core/services/notification-listener.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'booking';

  constructor(private notificationListenerService: NotificationListenerService) { }
}

