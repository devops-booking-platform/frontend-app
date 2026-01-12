import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RatingsRoutingModule } from './ratings-routing.module';
import { RateHostComponent } from './rate-host/rate-host.component';
import { RateAccommodationComponent } from './rate-accommodation/rate-accommodation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    RateHostComponent,
    RateAccommodationComponent
  ],
  imports: [
    CommonModule,
    RatingsRoutingModule,
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
export class RatingsModule { }
