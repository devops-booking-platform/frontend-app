import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccommodationService } from '../../../core/services/accommodation.service';
import { AvailabilityResponseDto, GetAccommodationResponse } from '../../../shared/models/accommodation.model';
import { ReservationService } from '../../../core/services/reservation.service';
import { CreateReservationRequest } from '../../../shared/models/reservations.model';
import { SnackbarNotificationService } from '../../../auth/services/snackbar-notification.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-create-reservation',
  templateUrl: './create-reservation.component.html',
  styleUrl: './create-reservation.component.css'
})
export class CreateReservationComponent implements OnInit {

  accommodationId = '';
  accommodation: GetAccommodationResponse = null!;
  availabilities: AvailabilityResponseDto[] = [];

  reservationForm = this.fb.group({
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    guests: [1, [Validators.required, Validators.min(1)]]
  });

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private accommodationService: AccommodationService,
    private reservationService: ReservationService,
    private notificationService: SnackbarNotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.accommodationId = this.route.snapshot.params['accommodationId'];

    // Call API to load accommodation
    this.accommodationService.getAccommodation(this.accommodationId)
      .subscribe(ac => {
        this.accommodation = ac;
        this.availabilities = ac.availabilities.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      });
  }

  submit() {
    if (this.reservationForm.invalid) return;

    const req: CreateReservationRequest = {
      accommodationId: this.accommodationId,
      startDate: this.reservationForm.value.startDate,
      endDate: this.reservationForm.value.endDate,
      guestsCount: this.reservationForm.value.guests
    };

    this.reservationService.createReservation(req, uuidv4())
      .subscribe({
        next: () => {
          this.notificationService.success('Reservation created successfully.');
          this.router.navigate(['accommodations/view', this.accommodationId]);
        },
        error: (err) => {
          const message = err?.error?.detail || 'Something went wrong while creating the reservation.';
          this.notificationService.error(message);
        }
      });
  }
}