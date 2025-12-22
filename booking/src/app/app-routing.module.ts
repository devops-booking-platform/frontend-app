import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';

const routes: Routes = [
  {
    path: 'accommodations',
    loadChildren: () =>
      import('./features/accommodations/accommodations.module')
        .then(m => m.AccommodationsModule)
  },
  {
    path: 'reservations',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/reservations/reservations.module')
        .then(m => m.ReservationsModule)
  },
  {
    path: 'users',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/users/users.module')
        .then(m => m.UsersModule)
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/users/users.module')
        .then(m => m.UsersModule)
  },
  {
    path: 'notifications',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/notifications/notifications.module')
        .then(m => m.NotificationsModule)
  },
  { path: '', redirectTo: 'accommodations', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
