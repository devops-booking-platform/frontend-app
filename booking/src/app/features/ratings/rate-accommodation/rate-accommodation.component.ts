import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RatingService } from '../../../core/services/rating.service';

@Component({
  selector: 'app-rate-accommodation',
  templateUrl: './rate-accommodation.component.html',
  styleUrl: './rate-accommodation.component.css'
})
export class RateAccommodationComponent implements OnInit {

  reservationId!: string;
  accommodationId!: string;

  form = new FormGroup({
    rating: new FormControl<number | null>(null, [Validators.required]),
    comment: new FormControl<string | null>(null)
  });

  submitting = false;

  constructor(
    private route: ActivatedRoute,
    private ratingService: RatingService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.reservationId = this.route.snapshot.queryParamMap.get('reservationId')!;
    this.accommodationId = this.route.snapshot.queryParamMap.get('accommodationId')!;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;

    const req = {
      accommodationId: this.accommodationId,
      rating: this.form.value.rating!,
      comment: this.form.value.comment ?? null
    };

    this.ratingService.createAccommodationRating(req).subscribe({
      next: () => {
        alert('Thank you for rating the accommodation!');
        this.router.navigate(['/reservations']);
      },
      error: () => {
        alert('Failed to submit rating.');
        this.submitting = false;
      }
    });
  }
}