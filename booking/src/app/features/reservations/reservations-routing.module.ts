import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateReservationComponent } from './create-reservation/create-reservation.component';
import { ReservationsViewComponent } from './reservations-view/reservations-view.component';

const routes: Routes = [
  { path: '', component: ReservationsViewComponent },
  { path: ':accommodationId/reserve', component: CreateReservationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationsRoutingModule { }
