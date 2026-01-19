import { Component } from '@angular/core';
import { UpdatePasswordRequestDTO } from '../../../shared/models/user-service.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { tap, catchError, of } from 'rxjs';
import { SnackbarNotificationService } from '../../../auth/services/snackbar-notification.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  form = new FormGroup({
    currentPassword: new FormControl('', Validators.required),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  showCurrent = false;
  showNew = false;

  constructor(
    private userService: UserService,
    private notification: SnackbarNotificationService
  ) { }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.userService.updatePassword(this.form.value as UpdatePasswordRequestDTO)
      .pipe(
        tap(() => {
          this.notification.success('Password changed successfully');
          this.form.reset();
        }),
        catchError(err => {
          this.notification.error(err.error?.detail ?? 'Password change failed');
          return of(null);
        })
      )
      .subscribe();
  }
}
