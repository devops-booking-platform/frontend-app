import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RatingsRoutingModule } from './ratings-routing.module';
import { RateHostComponent } from './rate-host/rate-host.component';
import { RateAccommodationComponent } from './rate-accommodation/rate-accommodation.component';


@NgModule({
  declarations: [
    RateHostComponent,
    RateAccommodationComponent
  ],
  imports: [
    CommonModule,
    RatingsRoutingModule
  ]
})
export class RatingsModule { }
