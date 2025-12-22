import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { tap, catchError, of } from 'rxjs';
import { SnackbarNotificationService } from '../../../auth/services/snackbar-notification.service';
import { UserService } from '../../../core/services/user.service';
import { UpdateProfileRequestDTO } from '../../../shared/models/user-service.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  form = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required)
  });

  constructor(
    private userService: UserService,
    private notification: SnackbarNotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userService.getProfile()
      .subscribe(profile => this.form.patchValue(profile));
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.userService.updateProfile(this.form.value as UpdateProfileRequestDTO)
      .pipe(
        tap(() => this.notification.success('Profile updated successfully')),
        catchError(err => {
          this.notification.error(err.error?.detail ?? 'Update failed');
          return of(null);
        }))
      .subscribe();
  }

  goToChangePassword(): void {
    this.router.navigate(['/users/password']);
  }
}
