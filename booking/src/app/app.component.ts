import { Component, OnInit } from '@angular/core';
import { NotificationSignalRService } from './core/services/notification-signalr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'booking';

  constructor(private notificationHub: NotificationSignalRService) { }

  ngOnInit(): void {
    this.notificationHub.notification$
      .subscribe(n => {
        if (!n) {
          return;
        }
        console.log(n);
      });
  }
}
