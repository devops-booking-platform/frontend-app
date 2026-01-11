import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateReservationComponent } from './create-reservation/create-reservation.component';

const routes: Routes = [
  { path: ':accommodationId/reserve', component: CreateReservationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationsRoutingModule { }
