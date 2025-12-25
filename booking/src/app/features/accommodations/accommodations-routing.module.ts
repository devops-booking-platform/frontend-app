import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccommodationsListComponent } from './accommodations-list/accommodations-list.component';
import { MyAccommodationsComponent } from './my-accommodations/my-accommodations.component';

const routes: Routes = [
  { path: '', component: AccommodationsListComponent },
  { path: 'my', component: MyAccommodationsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccommodationsRoutingModule { }
