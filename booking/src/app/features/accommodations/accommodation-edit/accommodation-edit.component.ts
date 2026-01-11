import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AccommodationService } from '../../../core/services/accommodation.service';
import { PriceType, AccommodationRequest, GetAmenitiesResponse } from '../../../shared/models/accommodation.model';
import { ActivatedRoute, Router } from '@angular/router';
import { map, filter, switchMap } from 'rxjs';
import { ApiConfig } from '../../../core/api.config';

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
    { value: PriceType.PerGuest, label: 'Per Guest' },
    { value: PriceType.PerUnit, label: 'Per Unit' }
  ];

  constructor(
    private fb: FormBuilder,
    private accommodationService: AccommodationService,
    private route: ActivatedRoute,
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
}
