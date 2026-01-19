import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RatingService } from '../../../core/services/rating.service';
import { RatingResponse } from '../../../shared/models/rating.model';
import { SnackbarNotificationService } from '../../../auth/services/snackbar-notification.service';
import { AuthService } from '../../../auth/services/auth.service';
import { AccommodationService } from '../../../core/services/accommodation.service';
import { GetAccommodationResponse } from '../../../shared/models/accommodation.model';

@Component({
  selector: 'app-rate-accommodation',
  templateUrl: './rate-accommodation.component.html',
  styleUrl: './rate-accommodation.component.css'
})
export class RateAccommodationComponent implements OnInit {

  accommodationId!: string;
  Math = Math;
  ratings: RatingResponse[] = [];
  totalCount = 0;
  page = 1;
  pageSize = 5;
  averageRating?: number;
  guestId = '';
  accommodation?: GetAccommodationResponse;
  form = new FormGroup({
    id: new FormControl<string | null>(null),
    rating: new FormControl<number | null>(null, [Validators.required]),
    comment: new FormControl<string | null>(null),
  });

  submitting = false;

  constructor(
    private route: ActivatedRoute,
    private ratingService: RatingService,
    private notificationService: SnackbarNotificationService,
    private accommodationService: AccommodationService,
    private router: Router,
    private authService: AuthService
  ) {
    this.guestId = this.authService.id;
  }

  ngOnInit(): void {
    this.accommodationId = this.route.snapshot.queryParamMap.get('accommodationId')!;
    this.loadRatings();

    this.accommodationService.getAccommodation(this.accommodationId).subscribe({
      next: (res) => {
        this.accommodation = res;
      },
      error: () => {
        this.notificationService.error('Accommodation not found.');
        this.router.navigate(['/reservations']);
      }
    });
  }

  loadRatings(): void {
    this.ratingService.getAccommodationRatings(this.accommodationId, 1, 1000)
      .subscribe(res => {
        const existingRating = res.items.find(r => r.guestId === this.guestId && r.accommodationId === this.accommodationId);
        if (existingRating) {
          this.form.patchValue({
            id: existingRating.id,
            rating: existingRating.rating,
            comment: existingRating.comment ?? null
          });
        }
      })
    this.ratingService.getAccommodationRatings(this.accommodationId, this.page, this.pageSize)
      .subscribe(res => {
        this.ratings = res.items;
        this.totalCount = res.totalCount;
        this.page = res.page;
        this.pageSize = res.pageSize;
        this.averageRating = (res as any).averageRating ?? undefined;
      });
  }

  changePage(newPage: number): void {
    if (newPage < 1) return;
    if (newPage > Math.ceil(this.totalCount / this.pageSize)) return;
    this.page = newPage;
    this.loadRatings();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;

    const req = {
      id: this.form.value.id,
      accommodationId: this.accommodationId,
      rating: this.form.value.rating!,
      comment: this.form.value.comment ?? null
    };

    this.ratingService.createAccommodationRating(req).subscribe({
      next: () => {
        this.notificationService.success('Rating submitted successfully.');
        this.router.navigate(['/reservations']);
      },
      error: (err) => {
        const errorMessage = err?.error?.detail || 'An error occurred while submitting the rating.';
        this.notificationService.error(errorMessage);
        this.submitting = false;
      }
    });
  }

  deleteRating(id: string): void {
    if (!confirm('Are you sure you want to delete this rating?')) {
      return;
    }
    this.ratingService.deleteAccommodationRating(id).subscribe({
      next: () => {
        this.notificationService.success('Rating deleted successfully.');
        this.loadRatings();
        this.form.reset();
      },
      error: (err) => {
        const errorMessage = err?.error?.detail || 'An error occurred while deleting the rating.';
        this.notificationService.error(errorMessage);
      }
    });
  }
}