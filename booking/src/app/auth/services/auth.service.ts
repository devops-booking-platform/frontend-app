import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly TOKEN_KEY = 'auth_token';
    private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

    isLoggedIn$ = this.isLoggedInSubject.asObservable();

    constructor(private http: HttpClient) { }

    login(username: string, password: string) {
        return this.http
            .post<{ token: string }>('/api/auth/login', { username, password })
            .pipe(
                tap(res => {
                    localStorage.setItem(this.TOKEN_KEY, res.token);
                    this.isLoggedInSubject.next(true);
                })
            );
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
}
