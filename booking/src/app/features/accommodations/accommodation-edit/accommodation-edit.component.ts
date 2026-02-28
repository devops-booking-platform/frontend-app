import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccommodationService } from '../../../core/services/accommodation.service';
import { PriceType, AccommodationRequest, GetAmenitiesResponse, AvailabilityRequest } from '../../../shared/models/accommodation.model';
import { ActivatedRoute, Router } from '@angular/router';
import { map, filter, switchMap } from 'rxjs';
import { ApiConfig } from '../../../core/api.config';
import { SnackbarNotificationService } from '../../../auth/services/snackbar-notification.service';

@Component({
  selector: 'app-accommodation-edit',
  templateUrl: './accommodation-edit.component.html',
  styleUrl: './accommodation-edit.component.css'
})
export class AccommodationEditComponent implements OnInit {

  form: FormGroup;
  availabilityForm: FormGroup;
  amenities: GetAmenitiesResponse[] = [];
  availabilities: AvailabilityRequest[] = [];
  editingAvailabilityId?: string;
  id = '';

  priceTypes = [
    { value: PriceType.PerGuest, label: 'Per Guest' },
    { value: PriceType.PerUnit, label: 'Per Unit' }
  ];

  constructor(
    private fb: FormBuilder,
    private accommodationService: AccommodationService,
    private route: ActivatedRoute,
    private notificationService: SnackbarNotificationService,
    private router: Router
  ) {

    this.form = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],

      minimumNumberOfGuests: [1, [Validators.required, Validators.min(1)]],
      maximumNumberOfGuests: [1, [Validators.required, Validators.min(1)]],

      priceType: [PriceType.PerGuest, Validators.required],

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

    this.availabilityForm = this.fb.group({
      price: [0, [Validators.required, Validators.min(0)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
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
      this.availabilities = accommodation.availabilities.map(a => ({
        id: a.id,
        price: a.price,
        startDate: a.startDate,
        endDate: a.endDate,
        accommodationId: accommodation.id
      }));
      // Convert backend fields to patch value shape
      this.form.patchValue({
        id: accommodation.id,
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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request: AccommodationRequest = this.form.value;

    if (!this.id) {
      this.accommodationService.createAccommodation(request)
        .subscribe(() => this.router.navigate(['/accommodations/my']));
    } else {
      this.accommodationService.updateAccommodation(request)
        .subscribe(() => this.router.navigate(['/accommodations/my']));
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const files = Array.from(input.files);

    const uploadPromises = files.map(file => this.uploadToCloudinary(file));

    Promise.all(uploadPromises)
      .then(urls => {
        // Append new URLs without deleting existing ones
        const currentPhotos: string[] = this.form.controls['photos'].value || [];
        this.form.controls['photos'].setValue([...currentPhotos, ...urls]);
      })
      .catch(err => console.error('Upload failed', err));
  }

  removePhoto(index: number) {
    const currentPhotos: string[] = this.form.controls['photos'].value || [];
    currentPhotos.splice(index, 1);
    this.form.controls['photos'].setValue([...currentPhotos]);
  }

  private uploadToCloudinary(file: File): Promise<string> {
    const url = `https://api.cloudinary.com/v1_1/${ApiConfig.cloudinaryCloudName}/image/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', ApiConfig.cloudinaryUploadPresetName);
    formData.append('folder', 'accommodations');

    return fetch(url, {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => data.secure_url as string);
  }

  addAvailability() {
    if (this.availabilityForm.invalid) {
      this.availabilityForm.markAllAsTouched();
      return;
    }

    const availability: AvailabilityRequest = {
      ...this.availabilityForm.value,
      accommodationId: this.id
    };
    if (this.editingAvailabilityId) {
      availability.id = this.editingAvailabilityId;
    }

    this.accommodationService.createOrUpdateAvailability(availability)
      .subscribe({
        next: () => {
          this.accommodationService.getAccommodation(this.id)
            .subscribe(accommodation => {
              this.availabilities = accommodation.availabilities.map(a => ({
                id: a.id,
                price: a.price,
                startDate: a.startDate,
                endDate: a.endDate,
                accommodationId: accommodation.id
              }));
              // Reset form
              this.availabilityForm.reset({ price: 0, startDate: '', endDate: '' });
              this.editingAvailabilityId = null;
            });
        },
        error: (err) => {
          const message = err?.error?.detail || 'Something went wrong while saving availability';
          this.notificationService.error(message);
        }
      });
  }

  editAvailability(a: AvailabilityRequest) {
    this.editingAvailabilityId = a.id!;
    this.availabilityForm.patchValue({
      price: a.price,
      startDate: a.startDate,
      endDate: a.endDate
    });
  }
}
