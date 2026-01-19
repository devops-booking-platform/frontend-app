import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RatingService } from '../../../core/services/rating.service';
import { AuthService } from '../../../auth/services/auth.service';
import { SnackbarNotificationService } from '../../../auth/services/snackbar-notification.service';
import { RatingResponse } from '../../../shared/models/rating.model';

@Component({
  selector: 'app-rate-host',
  templateUrl: './rate-host.component.html',
  styleUrl: './rate-host.component.css'
})
export class RateHostComponent implements OnInit {

  hostId!: string;
  Math = Math;
  ratings: RatingResponse[] = [];
  totalCount = 0;
  page = 1;
  pageSize = 5;
  averageRating?: number;
  guestId = '';

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
    private router: Router,
    private authService: AuthService
  ) {
    this.guestId = this.authService.id;
  }

  ngOnInit(): void {
    this.hostId = this.route.snapshot.queryParamMap.get('hostId')!;
    this.loadRatings();
  }

  loadRatings(): void {
    this.ratingService.getHostRatings(this.hostId, 1, 1000)
      .subscribe(res => {
        const existingRating = res.items.find(r => r.guestId === this.guestId && r.hostId === this.hostId);
        if (existingRating) {
          this.form.patchValue({
            id: existingRating.id,
            rating: existingRating.rating,
            comment: existingRating.comment ?? null
          });
        }
      })
    this.ratingService.getHostRatings(this.hostId, this.page, this.pageSize)
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
      hostId: this.hostId,
      rating: this.form.value.rating!,
      comment: this.form.value.comment ?? null
    };

    this.ratingService.createHostRating(req).subscribe({
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
    this.ratingService.deleteHostRating(id).subscribe({
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