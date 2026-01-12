import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RatingService } from '../../../core/services/rating.service';

@Component({
  selector: 'app-rate-host',
  templateUrl: './rate-host.component.html',
  styleUrl: './rate-host.component.css'
})
export class RateHostComponent implements OnInit {

  reservationId!: string;
  hostId!: string;

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
    this.hostId = this.route.snapshot.queryParamMap.get('hostId')!;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;

    const req = {
      hostId: this.hostId,
      rating: this.form.value.rating!,
      comment: this.form.value.comment ?? null
    };

    this.ratingService.createHostRating(req).subscribe({
      next: () => {
        alert('Thank you for rating the host!');
        this.router.navigate(['/reservations']);
      },
      error: () => {
        alert('Failed to submit rating.');
        this.submitting = false;
      }
    });
  }
}