import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationConfigurationComponent } from './notification-configuration/notification-configuration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NotificationsViewComponent } from './notifications-view/notifications-view.component';


@NgModule({
  declarations: [
    NotificationConfigurationComponent,
    NotificationsViewComponent
  ],
  imports: [
    CommonModule,
    NotificationsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class NotificationsModule { }
