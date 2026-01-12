import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';
import { Notification, NotificationType } from '../../../shared/models/notifications.model';
import { PagedResult } from '../../../shared/models/paged.model';

@Component({
  selector: 'app-notifications-view',
  templateUrl: './notifications-view.component.html',
  styleUrl: './notifications-view.component.css'
})
export class NotificationsViewComponent implements OnInit {

  notifications: Notification[] = [];
  page = 1;
  pageSize = 10;
  totalCount = 0;
  Math = Math;
  loading = false;

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(page: number = 1) {
    this.loading = true;
    this.page = page;

    this.notificationService.getNotifications(undefined, undefined, this.page, this.pageSize)
      .subscribe({
        next: (res: PagedResult<Notification>) => {
          this.notifications = res.items;
          this.totalCount = res.totalCount;
          this.loading = false;
        },
        error: () => {
          alert('Failed to load notifications.');
          this.loading = false;
        }
      });
  }

  markAsRead(id: string) {
    this.notificationService.markAsRead({ id }).subscribe({
      next: () => {
        const n = this.notifications.find(x => x.id === id);
        if (n) n.read = true;
      },
      error: () => alert('Failed to mark as read.')
    });
  }

  getTypeLabel(type: NotificationType): string {
    return NotificationType[type];
  }

  getBadgeClass(type: NotificationType): string {
    switch (type) {
      case NotificationType.ReservationCreated: return 'bg-primary';
      case NotificationType.ReservationCanceled: return 'bg-danger';
      case NotificationType.ReservationResponded: return 'bg-success';
      case NotificationType.HostRated: return 'bg-purple';
      case NotificationType.AccommodationRated: return 'bg-warning';
      default: return 'bg-secondary';
    }
  }

  onPageChange(page: number) {
    this.loadNotifications(page);
  }
}