import { Component } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isLoggedIn$ = this.authService.isLoggedIn$;

  constructor(private authService: AuthService) { }

  logout() {
    this.authService.logout();
  }
}
