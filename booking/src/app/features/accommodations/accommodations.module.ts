import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccommodationsRoutingModule } from './accommodations-routing.module';
import { AccommodationsListComponent } from './accommodations-list/accommodations-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MyAccommodationsComponent } from './my-accommodations/my-accommodations.component';
import { AccommodationEditComponent } from './accommodation-edit/accommodation-edit.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    AccommodationsListComponent,
    MyAccommodationsComponent,
    AccommodationEditComponent
  ],
  imports: [
    CommonModule,
    AccommodationsRoutingModule,
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
export class AccommodationsModule { }
