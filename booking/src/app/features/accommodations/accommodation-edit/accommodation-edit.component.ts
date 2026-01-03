import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AccommodationService } from '../../../core/services/accommodation.service';
import { PriceType, AccommodationRequest, GetAmenitiesResponse } from '../../../shared/models/accommodation.model';
import { ActivatedRoute } from '@angular/router';
import { map, filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-accommodation-edit',
  templateUrl: './accommodation-edit.component.html',
  styleUrl: './accommodation-edit.component.css'
})
export class AccommodationEditComponent implements OnInit {

  form: FormGroup;
  amenities: GetAmenitiesResponse[] = [];

  id = '';

  priceTypes = [
    { value: PriceType.PerNight, label: 'Per Night' },
    { value: PriceType.PerPerson, label: 'Per Person' }
  ];

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

      photos: this.fb.control<string[]>([]),
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
    // Load amenities first
    this.accommodationService.getAmenities()
      .subscribe(amenities => this.amenities = amenities);

    // Load accommodation ONLY if id exists
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      filter((id): id is string => !!id),
      switchMap(id => this.accommodationService.getAccommodation(id))
    ).subscribe(accommodation => {

      this.id = accommodation.id;

      // Convert backend fields to patch value shape
      this.form.patchValue({
        name: accommodation.name,
        description: accommodation.description,
        minimumNumberOfGuests: accommodation.minimumNumberOfGuests,
        maximumNumberOfGuests: accommodation.maximumNumberOfGuests,
        priceType: accommodation.priceType,
        isAutoConfirm: accommodation.isAutoConfirm,
        location: accommodation.location,
        photos: accommodation.photos,
        amenities: accommodation.amenities.map(a => a.id) // extract IDs
      });
    });
  }

  submit() {
    console.log('aloo');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log('aloo');

    const request: AccommodationRequest = this.form.value;

    if (!this.id) {
      // CREATE
      this.accommodationService.createAccommodation(request)
        .subscribe(() => {
          this.form.reset({
            minimumNumberOfGuests: 1,
            maximumNumberOfGuests: 1,
            priceType: PriceType.PerNight,
            isAutoConfirm: false
          });
        });
    } else {
      console.warn("TODO: Update endpoint not implemented yet", request);
    }
  }

  onPhotosChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const photos = value
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    this.form.controls['photos'].setValue(photos);
  }
}
