import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccommodationsListComponent } from './accommodations-list/accommodations-list.component';
import { MyAccommodationsComponent } from './my-accommodations/my-accommodations.component';
import { AccommodationEditComponent } from './accommodation-edit/accommodation-edit.component';

const routes: Routes = [
  { path: '', component: AccommodationsListComponent },
  { path: 'my', component: MyAccommodationsComponent },
  { path: 'new', component: AccommodationEditComponent },
  { path: 'edit/:id', component: AccommodationEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccommodationsRoutingModule { }
