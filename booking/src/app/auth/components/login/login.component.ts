import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
    private router: Router
  ) { }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.authService.login(
      this.form.value.username!,
      this.form.value.password!
    ).subscribe({
      next: () => this.router.navigate(['/accommodations']),
      error: () => alert('Invalid username or password')
    });
  }
}

