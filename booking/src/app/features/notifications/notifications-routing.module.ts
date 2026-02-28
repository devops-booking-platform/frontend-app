import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificationConfigurationComponent } from './notification-configuration/notification-configuration.component';
import { NotificationsViewComponent } from './notifications-view/notifications-view.component';

const routes: Routes = [
  { path: '', component: NotificationsViewComponent },
  { path: 'config', component: NotificationConfigurationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationsRoutingModule { }
