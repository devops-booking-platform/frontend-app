import { Component, OnInit } from '@angular/core';
import { EnableDisableNotificationRequest, NotificationType } from '../../../shared/models/notifications.model';
import { SnackbarNotificationService } from '../../../auth/services/snackbar-notification.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../auth/services/auth.service';
import { NOTIFICATION_SETTINGS } from '../../notification-settings.config';

interface NotificationSettingView {
  type: NotificationType;
  label: string;
  description: string;
  enabled: boolean;
}

@Component({
  selector: 'app-notification-configuration',
  templateUrl: './notification-configuration.component.html',
  styleUrl: './notification-configuration.component.css'
})
export class NotificationConfigurationComponent implements OnInit {

  notificationSettings: NotificationSettingView[] = [];
  disabled: EnableDisableNotificationRequest[] = [];

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private snackbar: SnackbarNotificationService
  ) { }

  ngOnInit(): void {
    this.loadNotificationSettings();
  }

  private loadNotificationSettings(): void {
    const role = this.authService.role;

    if (!role) return;

    this.notificationService.getDisabledNotifications()
      .subscribe(disabled => {
        const disabledTypes = disabled.map(d => d.notificationType);
        this.disabled = disabled ?? [];
        this.notificationSettings = NOTIFICATION_SETTINGS
          .filter(cfg => cfg.roles.includes(role))
          .map(cfg => ({
            type: cfg.type,
            label: cfg.label,
            description: cfg.description,
            enabled: !disabledTypes.includes(cfg.type)
          }));
      });
  }

  toggleNotification(setting: NotificationSettingView): void {
    console.log(this.disabled.find(d => d.notificationType === setting.type));
    console.log(this.disabled);
    console.log(setting);
    const request = {
      notificationType: setting.type,
      id: !setting.enabled
        ? this.disabled.find(d => d.notificationType === setting.type)?.id || ''
        : undefined
    };

    const action$ = setting.enabled
      ? this.notificationService.disableNotification(request)
      : this.notificationService.enableNotification(request);

    action$.subscribe({
      next: () => {
        setting.enabled = !setting.enabled;
        this.snackbar.success('Notification setting updated');
        this.loadNotificationSettings();
      },
      error: () => {
        this.snackbar.error('Failed to update notification setting');
      }
    });
  }
}
