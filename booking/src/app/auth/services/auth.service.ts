import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { RegisterRequest } from '../../shared/models/register.model';
import { ApiConfig } from '../../core/api.config';
import { LoginRequest } from '../../shared/models/login.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly TOKEN_KEY = 'auth_token';
    private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
    private currentRole = new BehaviorSubject<string>(this.role);
    isLoggedIn$ = this.isLoggedInSubject.asObservable();
    currentRole$ = this.currentRole.asObservable();
    private readonly baseUrl = ApiConfig.userService;
    constructor(private http: HttpClient) { }

    login(username: string, password: string) {
        const request: LoginRequest = { username, password };
        return this.http
            .post<{ token: string }>(`${this.baseUrl}/auth/login`, request)
            .pipe(
                tap(res => {
                    localStorage.setItem(this.TOKEN_KEY, res.token);
                    const payload = JSON.parse(atob(res.token.split('.')[1]));
                    const newRole =
                        payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ?? null;

                    this.currentRole.next(newRole);
                    this.isLoggedInSubject.next(true);
                })
            );
    }

    register(request: RegisterRequest) {
        return this.http.post(`${this.baseUrl}/auth/register`, request);
    }

    logout() {
        localStorage.removeItem(this.TOKEN_KEY);
        this.isLoggedInSubject.next(false);
    }

    get token(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    private hasToken(): boolean {
        return !!localStorage.getItem(this.TOKEN_KEY);
    }

    get role(): 'Host' | 'Guest' | null {
        const token = this.token;
        if (!token) return null;

        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ?? null;
    }

    get id(): string | null {
        const token = this.token;
        if (!token) return null;
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ?? null;
    }

}
