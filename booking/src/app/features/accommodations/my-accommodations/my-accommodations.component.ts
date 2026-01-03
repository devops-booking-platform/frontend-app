import { Component, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { AccommodationService } from '../../../core/services/accommodation.service';
import { GetAccommodationsRequest } from '../../../shared/models/accommodation.model';
import { SnackbarNotificationService } from '../../../auth/services/snackbar-notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-accommodations',
  templateUrl: './my-accommodations.component.html',
  styleUrl: './my-accommodations.component.css'
})
export class MyAccommodationsComponent implements OnInit {

  accommodations: GetAccommodationsRequest[] = [];

  constructor(
    private accommodationService: AccommodationService,
    private snackBar: SnackbarNotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.load();
  }

  load(): void {

    this.accommodationService.getMyAccommodations()
      .pipe(
        catchError(err => {
          this.snackBar.error(err.error?.detail || 'Failed to load accommodations.');
          return of([]);
        })
      )
      .subscribe(res => {
        this.accommodations = res;
      });
  }

  navigateToCreate(): void {
    this.router.navigate(['/accommodations/new']);
  }

  navigateToDetails(id: string): void {
    this.router.navigate([`/accommodations/edit/${id}`]);
  }
}
