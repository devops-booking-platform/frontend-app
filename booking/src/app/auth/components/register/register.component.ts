import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserRole, RegisterRequest } from '../../../shared/models/register.model';
import { ValidationConstants } from '../../../shared/models/validation-constraints.model';
import { SnackbarNotificationService } from '../../services/snackbar-notification.service';
import { tap, catchError, of } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  roles = UserRole;
  minPassowrdLength = ValidationConstants.MinPasswordLength;
  showPassword = false;

  form = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(ValidationConstants.MinStringLength),
      Validators.maxLength(ValidationConstants.MaxStringLength)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.maxLength(ValidationConstants.MaxStringLength)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(ValidationConstants.MinPasswordLength),
      Validators.maxLength(ValidationConstants.MaxStringLength)
    ]),
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(ValidationConstants.MinStringLength),
      Validators.maxLength(ValidationConstants.MaxStringLength)
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(ValidationConstants.MinStringLength),
      Validators.maxLength(ValidationConstants.MaxStringLength)
    ]),
    address: new FormControl('', [
      Validators.required,
      Validators.minLength(ValidationConstants.MinStringLength),
      Validators.maxLength(ValidationConstants.MaxStringLength)
    ]),
    role: new FormControl(UserRole.Guest, Validators.required)
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: SnackbarNotificationService
  ) { }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request: RegisterRequest = {
      username: this.form.controls.username.value!,
      email: this.form.controls.email.value!,
      password: this.form.controls.password.value!,
      firstName: this.form.controls.firstName.value!,
      lastName: this.form.controls.lastName.value!,
      address: this.form.controls.address.value!,
      role: this.form.controls.role.value!
    };

    this.authService.register(request)
      .pipe(
        tap(() => {
          this.notificationService.success('Registration successful! Please log in.');
          this.router.navigate(['/login']);
        }),
        catchError(err => {
          const message = err.error?.detail || 'Registration failed';
          this.notificationService.error(message);
          return of(null);
        }))
      .subscribe();
  }
}
