import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { tap, catchError, of } from 'rxjs';
import { SnackbarNotificationService } from '../../services/snackbar-notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  showPassword = false;

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

    this.authService.login(this.form.value.username!, this.form.value.password!)
      .pipe(
        tap(() => {
          this.notificationService.success('Login successful!');
          this.router.navigate(['/accommodations']);
        }),
        catchError((error) => {
          const message = error?.error?.detail || 'Invalid username or password';
          this.notificationService.error(message);
          return of(null);
        }))
      .subscribe();
  }
}

