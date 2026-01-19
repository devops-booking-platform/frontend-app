import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccommodationService } from '../../../core/services/accommodation.service';
import { map, filter, switchMap } from 'rxjs';
import { AvailabilityResponseDto, GetAccommodationResponse } from '../../../shared/models/accommodation.model';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-accommodation-search-view',
  templateUrl: './accommodation-search-view.component.html',
  styleUrl: './accommodation-search-view.component.css'
})
export class AccommodationSearchViewComponent implements OnInit {

  accommodation: GetAccommodationResponse = null!;
  availabilities: AvailabilityResponseDto[] = [];
  isLoggedIn = false;
  role = '';

  constructor(
    private accommodationService: AccommodationService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      filter((id): id is string => !!id),
      switchMap(id => this.accommodationService.getAccommodation(id)))
      .subscribe(accommodation => {
        this.accommodation = accommodation;
        this.availabilities = accommodation.availabilities.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      });

    this.authService.isLoggedIn$
      .subscribe(res => this.isLoggedIn = res);

    this.authService.currentRole$
      .subscribe(res => this.role = res);
  }

  makeReservation() {
    this.router.navigate(['reservations', this.accommodation.id, 'reserve']);
  }

}
