import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RateHostComponent } from './rate-host/rate-host.component';
import { RateAccommodationComponent } from './rate-accommodation/rate-accommodation.component';

const routes: Routes = [
  { path: 'host', component: RateHostComponent },
  { path: 'accommodation', component: RateAccommodationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RatingsRoutingModule { }
