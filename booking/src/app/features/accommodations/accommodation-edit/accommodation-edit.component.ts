import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AccommodationService } from '../../../core/services/accommodation.service';
import { PriceType, AccommodationRequest } from '../../../shared/models/accommodation.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-accommodation-edit',
  templateUrl: './accommodation-edit.component.html',
  styleUrl: './accommodation-edit.component.css'
})
export class AccommodationEditComponent implements OnInit {

  form: FormGroup;
  priceTypes = [
    { value: PriceType.PerNight, label: 'Per Night' },
    { value: PriceType.PerPerson, label: 'Per Person' }
  ];
  id = '';

  constructor(
    private fb: FormBuilder,
    private accommodationService: AccommodationService,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      minimumNumberOfGuests: [1, [Validators.required, Validators.min(1)]],
      maximumNumberOfGuests: [1, [Validators.required, Validators.min(1)]],
      priceType: [PriceType.PerNight, Validators.required],

      photos: [[]],
      amenities: [[]],

      location: this.fb.group({
        country: ['', Validators.required],
        city: ['', Validators.required],
        address: ['', Validators.required],
        postalCode: ['']
      }),

      isAutoConfirm: [false]
    });
  }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe(params => this.id = params.get('id') ?? '');
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request: AccommodationRequest = this.form.value;

    this.accommodationService.createAccommodation(request).subscribe({
      next: () => {
        this.form.reset({
          minimumNumberOfGuests: 1,
          maximumNumberOfGuests: 1,
          priceType: PriceType.PerNight,
          isAutoConfirm: false
        });
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
