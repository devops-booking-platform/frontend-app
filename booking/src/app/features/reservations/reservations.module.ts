import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReservationsRoutingModule } from './reservations-routing.module';
import { CreateReservationComponent } from './create-reservation/create-reservation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '../../shared/shared.module';
import { ReservationsViewComponent } from './reservations-view/reservations-view.component';


@NgModule({
  declarations: [
    CreateReservationComponent,
    ReservationsViewComponent
  ],
  imports: [
    CommonModule,
    ReservationsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatOptionModule,
    MatTooltipModule
  ]
})
export class ReservationsModule { }
