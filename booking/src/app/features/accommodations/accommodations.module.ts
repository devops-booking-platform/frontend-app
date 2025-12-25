import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccommodationsRoutingModule } from './accommodations-routing.module';
import { AccommodationsListComponent } from './accommodations-list/accommodations-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    AccommodationsListComponent
  ],
  imports: [
    CommonModule,
    AccommodationsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class AccommodationsModule { }
